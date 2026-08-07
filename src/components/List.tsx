import check from '../check.png';
import styles from '../App.module.css';
import { Story, Stories } from '../types/story.js';
import * as React from 'react';
import { sortBy } from 'lodash';

type SortFunction = (list: Stories) => Stories;

const SORTS = {
  NONE: (list: Stories) => list,
  TITLE: (list: Stories) => sortBy(list, 'title'),
  AUTHOR: (list: Stories) => sortBy(list, 'author'),
  COMMENTS: (list: Stories) => sortBy(list, 'num_comments').reverse(),
  POINTS: (list: Stories) => sortBy(list, 'points').reverse(),
};

type SortKey = keyof typeof SORTS;

type ItemProps = {
  item: Story,
  onRemoveItem: (item: Story) => void;
}

const Item = ({ item, onRemoveItem}: ItemProps) => (
  <li style={{ display: 'flex' }}>
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

type ListProps = {
  list: Stories;
  onRemoveItem: (item: Story) => void;
}

const List: React.FC<ListProps> = React.memo(
  ({ list, onRemoveItem }) => {
    const [sort, setSort] = React.useState({
      sortKey: 'NONE',
      isReverse: false,
    });

    const handleSort = (sortKey: SortKey) => {
      const isReverse = sort.sortKey === sortKey && !sort.isReverse;
      setSort({ sortKey, isReverse });
    }

    const sortFunction = SORTS[sort.sortKey];
    const sortedList = sort.isReverse
      ? sortFunction(list).reverse()
      : sortFunction(list);
    
    return (
      <ul>
        <li style={{ display: 'flex' }}>
          <span style={{ width: '40%'}}>
            <button type="button" onClick={() => handleSort('TITLE')}>
              Title
            </button>
          </span>
          <span style={{ width: '30%'}}>
            <button type="button" onClick={() => handleSort('AUTHOR')}>
              Author
            </button>
          </span>
          <span style={{ width: '10%'}}>
            <button type="button" onClick={() => handleSort('COMMENTS')}>
              Comments
            </button>
          </span>
          <span style={{ width: '10%'}}>
            <button type="button" onClick={() => handleSort('POINTS')}>
              Points
            </button>
          </span>
          <span style={{ width: '10%'}}>Actions</span>
        </li>
        {sortedList.map((item: Story) => (
          <Item 
            key={item.objectID} 
            item={item}
            onRemoveItem={onRemoveItem} 
          />
        ))}
      </ul>
    )
  }
);

export { List, Item };