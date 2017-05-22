import React, { Component } from 'react';
import './App.css';
// git test
const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

class App extends Component {
  render() {
    const helloWorld = 'Welcome to React';
    let name = {
      'firstName' : 'Space',
      'lastName' : 'Monkey'
    }
    return (
      <div className="App">
        { list.map(item =>
            <div key={item.objectID}>
              <span>
                <a href={item.url} target="_blank">{item.title}</a>
              </span>
              <span>{item.author}</span>
              <span>{item.num_comments}</span>
              <span>{item.points}</span>
            </div>
        )}
      </div>
    );
  }
}

export default App;
