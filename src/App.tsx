import * as React from 'react';
import axios from 'axios';
import styles from './App.module.css';
import check from './check.png';

// Variable declarations
const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

type Story = {
  objectID: string;
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
}

type Stories = Story[];

type StoriesState = {
  data: Stories;
  isLoading: boolean;
  isError: boolean;
}

type StoriesFetchInitAction = {
  type: 'STORIES_FETCH_INIT';
}

type StoriesFetchSuccessAction = {
  type: 'STORIES_FETCH_SUCCESS';
  payload: Stories;
}

type StoriesFetchFailureAction = {
  type: 'STORIES_FETCH_FAILURE';
}

type RemoveStoryAction = {
  type: 'REMOVE_STORY';
  payload: Story;
}

type StoriesAction = 
  | StoriesFetchInitAction
  | StoriesFetchSuccessAction
  | StoriesFetchFailureAction
  | RemoveStoryAction;

const storiesReducer = (
  state: StoriesState, 
  action: StoriesAction
): StoriesState => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

const useStorageState = (
  key: string, 
  initialState: string
): [string, (newValue: string) => void] => {
  const isMounted = React.useRef(false);

  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    }
    else {
      localStorage.setItem(key, value);
    }
  }, [value, key]);

  return [value, setValue];
};

const getSumComments = (stories: StoriesState): number => {
  return stories.data.reduce(
    (sum, story) => sum + story.num_comments,
    0
  );
}

// App 
const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState('search', 'React');
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { 
      data: [], 
      isLoading: false, 
      isError: false,
    } satisfies StoriesState
  );

  const [url, setUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  );

  const handleSearchInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  };

  const handleRemoveStory = React.useCallback((item: Story) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  }, []);

  const handleFetchedStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    try {
      const result = await axios.get(url);

      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits,
      });
    } catch {
      dispatchStories( {type: 'STORIES_FETCH_FAILURE'});
    }
  }, [url]);

  React.useEffect(() => {
    handleFetchedStories();
  }, [handleFetchedStories]);

  const sumComments = React.useMemo(
    () => getSumComments(stories),
    [stories]
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.headlinePrimary}>My Hacker Stories with {sumComments} comments.</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
        buttonSize={`${styles.button} ${styles.buttonLarge}`}
      />

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  )
};

type ListProps = {
  list: Stories;
  onRemoveItem: (item: Story) => void;
}

const List: React.FC<ListProps> = React.memo(
  ({ list, onRemoveItem }) => (
    <ul>
      {list.map((item) => (
        <Item 
          key={item.objectID} 
          item={item}
          onRemoveItem={onRemoveItem} 
        />
      ))}
    </ul>
  )
);

type ItemProps = {
  item: Story,
  onRemoveItem: (item: Story) => void;
}

const Item = ({ item, onRemoveItem}: ItemProps) => (
  <li className={styles.item}>
    <span style={{ width: '40%' }}>
      <a href={item.url}>{item.title}</a> 
    </span>
    <span style={{ width: '30%' }}>{item.author} </span>
    <span style={{ width: '10%' }}>{item.num_comments} </span>
    <span style={{ width: '10%' }}>{item.points}</span>
    <span style={{ width: '10%' }}>
      <button 
        type="button" 
        onClick={() => onRemoveItem(item)}
        className={`${styles.button} ${styles.buttonSmall}`}
      >
        <img src={check} alt="Remove" width={18} height={18} />
      </button>
    </span>
  </li>
);

type InputWithLabelProps = {
  id: string,
  value: string,
  type?: string,
  isFocused?: boolean,
  onInputChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  children: React.ReactNode;
}

const InputWithLabel: React.FC<InputWithLabelProps> = ({ 
  id, 
  value, 
  type = 'text', 
  onInputChange, 
  isFocused, 
  children 
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id} className={styles.label}>{children}</label>
        &nbsp;
        <input 
        ref={inputRef}
        id={id} 
        type={type}
        value={value} 
        onChange={onInputChange} 
        className={styles.input}
      /> 
    </>
  );
};

type SearchFormProps = {
  searchTerm: string;
  onSearchInput: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onSearchSubmit: (
    event: React.FormEvent<HTMLFormElement>
  ) => void;
  buttonSize: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ 
  searchTerm,
  onSearchInput,
  onSearchSubmit,
  buttonSize
}) => (
  <form onSubmit={onSearchSubmit} className={styles.searchForm}>
      <InputWithLabel 
        id="search"
        value={searchTerm} 
        type="text"
        isFocused={true}
        onInputChange={onSearchInput} 
      >
        <strong>Search: </strong>
      </InputWithLabel>

      <button 
        type="submit" 
        disabled={!searchTerm}
        className={buttonSize} 
      >
        Submit
      </button>
    </form>
)

export default App
