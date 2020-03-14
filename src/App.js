import React from 'react';

// Custom hook
const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value]);

  return [value, setValue];
}

// Stories reducer
const storiesReducer = (state, action) => {
  switch(action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: null
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        isError: null
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
        data: state.data.filter(story =>
          story.objectID !== action.payload.objectID
        )
      };
    default:
      throw new Error();
  }
};

// App
const App = () => {
  const initialStories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 3,
      points: 4,
      objectID: 1,
    }
  ];

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer, 
    { data: [], isLoading: false, isError: null }
  );

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  }

  const handleRemoveStories = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item
    });
  }

  const searchStories = stories.data.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const getAsyncStories = () =>
    new Promise(resolve =>
      setTimeout(() =>
        resolve({ data: { stories: initialStories }})
      , 2000)
    );

  React.useEffect(() => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    getAsyncStories().then(result => {
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.stories
      });
    }).catch(() => {
      dispatchStories({
        type: 'STORIES_FETCH_FAILURE'
      });
    })
  }, []);

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel
        id='search'
        isFocused
        value={searchTerm}
        onInputChange={handleSearch}
      >
        <strong>Search: </strong>
      </InputWithLabel>

      <hr />

      {stories.isError && <p>Something went wrong...</p>}

      {
        stories.isLoading ?
        <p>Loading..</p> :
        <List list={searchStories} onRemoveItem={handleRemoveStories} />
      }
    </div>
  );
}

const InputWithLabel = ({
  id,
  type = 'text',
  value,
  isFocused,
  onInputChange,
  children
}) => {
  const inputRef = React.useRef(); 

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      <input
        id={id}
        ref={inputRef}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </>
  )
}

const List = ({ list, onRemoveItem }) => {
  return (
    list.map(item =>
      <Item key={item.objectID} onRemoveItem={onRemoveItem} item={item} />
    )
  );
}

const Item = ({
  item,
  onRemoveItem
}) => {
  const {
    title,
    url,
    author,
    num_comments,
    points,
  } = item;

  function handleRemoveItem() {
    onRemoveItem(item);
  }

  return (
    <>
      <span>
        <a href={url} target='_blank' rel='noopener noreferrer'>{title}</a>
      </span>
      <span>{author}</span>
      <span>{num_comments}</span>
      <span>{points}</span>
      <button type="button" onClick={handleRemoveItem}>Dismiss</button>
    </>
  )
}
export default App;
