import React from 'react';

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value]);

  return [value, setValue];
}

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

  const [stories, setStories] = React.useState([]);

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');

  const [isLoading, setIsLoading] = React.useState(false);

  const [isError, setIsError] = React.useState(null);

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  }

  const handleRemoveStories = item => {
    const newStories = stories.filter(story => story.objectID !== item.objectID);
    setStories(newStories);
  }

  const searchStories = stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const getAsyncStories = () =>
    new Promise(resolve =>
      setTimeout(() =>
        resolve({ data: { stories: initialStories }})
      , 2000)
    );

  React.useEffect(() => {
    setIsLoading(true);
    getAsyncStories().then(result => {
      setStories(result.data.stories);
      setIsLoading(false);
      setIsError(null);
    }).catch(() => {
      setIsError(true);
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

      {isError && <p>Something went wrong...</p>}

      {
        isLoading ?
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
