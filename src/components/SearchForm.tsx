import InputWithLabel from './InputWithLabel';
import styles from '../App.module.css';

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
);

export default SearchForm;