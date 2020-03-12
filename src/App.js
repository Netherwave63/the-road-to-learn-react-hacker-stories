import React from 'react';

const App = () => {
  const stories = [
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

  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  }

  const searchStories = stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <Search search={searchTerm} onSearch={handleSearch} />

      <hr />

      <List list={searchStories} />
    </div>
  );
}

const Search = ({ search, onSearch }) => {
  return (
    <div>
      <label htmlFor='search'>Search: </label>
      <input
        id='search'
        type='text'
        value={search}
        onChange={onSearch}
      />
    </div>
  )
}

const List = ({ list }) => {
  return (
    list.map(item =>
      <Item key={item.objectID} {...item} />
    )
  );
}

const Item = ({
  title,
  url,
  author,
  num_comments,
  points
}) => {
  return (
    <div>
      <span>
        <a href={url} target='_blank' rel='noopener noreferrer'>{title}</a>
      </span>
      <span>{author}</span>
      <span>{num_comments}</span>
      <span>{points}</span>
    </div>
  )
}
export default App;
