import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

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

const isSearched = (searchTerm) => (item) => !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());

// es6 component digesting state
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    };

    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);

    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  setSearchTopstories(result) {
    this.setState({ result });
  }

  fetchSearchTopstories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result));
  }

  componentDidMount() {
    const {searchTerm} = this.state;
    this.fetchSearchTopstories(searchTerm);
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onDismiss(id) {
   const isNotId = item => item.objectID !== id;
   const updatedList = this.state.list.filter(isNotId);
   this.setState({ list: updatedList});
  }

  render() {
    const {searchTerm, result} = this.state;

    if (!result) {return null; }

    return (
      <div className="page">
        <div className="interactions">
        <Search
          value={searchTerm}
          onChange={this.onSearchChange}
        >
        Search
        </Search>
        </div>
        <Table
          list={result.hits}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
        />
      </div>
    );
  }
}

// functional stateless components v1
const Search = ({value, onChange, children}) =>  // I don't like the style of the implict return and absence of blocks 
    <form action="">
      {children} <input
        type="text"
        value={value}
        onChange={onChange}
      />
    </form>

// functional stateless component v2
function Table(props) {
  const { list, pattern, onDismiss } = props;
    return(
      <div className="table">
      {
        list.filter(isSearched(pattern)).map(item =>
          <div className="table-row" key={item.objectID}>
            <span style={{width:'40%'}}>
              <a href={item.url} target="_blank">{item.title}</a>
            </span>
            <span style={{width:'30%'}}>{item.author}</span>
            <span style={{width:'10%'}}>{item.num_comments}</span>
            <span style={{width:'10%'}}>{item.points}</span>
            <span style={{width:'10%'}}>
              <Button
                onClick={() => onDismiss(item.objectID)}
                className="button-inline"
              >
              Dismiss
              </Button>
            </span>
          </div>
        )}
      </div>
  );
}

// functional stateless compenent v3
const Button = ({onClick, className ='', children}) => {
  return (
    <button
      onClick={onClick}
      className={className}
      type="button"
    >
      {children}
    </button>
  )
}


export default App;
