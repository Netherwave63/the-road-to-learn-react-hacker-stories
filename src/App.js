import React from 'react';

const list = [
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

const App = () => {
  const handleChange = event => {
    console.log(event);
  }

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <label htmlFor='search'>Search: </label>
      <input
        id='search'
        type='text'
        onChange={handleChange}
      />

      <hr />

      <List />
    </div>
  );
}

const List = () => {
  return (
    list.map(item =>
      <div key={item.objectID}>
        <span>
          <a href={item.url} target='_blank'>{item.title}</a>
        </span>
        <span>{item.author}</span>
        <span>{item.num_comments}</span>
        <span>{item.points}</span>
      </div>
    )
  );
}

export default App;
