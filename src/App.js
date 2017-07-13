import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = 100;

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const isSearched = (searchTerm) => (item) => !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());

// es6 component digesting state
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
    };

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.resuls[searchTerm];
  }

  setSearchTopstories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;

    const oldHits = results && results[searchKey] ? results[searchKey].hits : [];

    const updatedHits = [
      ...oldHits,
      ...hits
    ];

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page}
      }
    });
  }

  fetchSearchTopstories(searchTerm, page) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result));
  }

  componentDidMount() {
    const {searchTerm} = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

   const isNotId = item => item.objectID !== id;
   const updatedHits = hits.filter(isNotId);
   this.setState({
    results: {
      ...results,
      [searchKey]: { hits:updatedHits, page }
    }
   });
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    if (this.needsToSearchTopStories(searchTerm)){
      this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
    }
    event.preventDefault();
  }

  render() {
    const {
      searchTerm,
      results,
      searchKey
    } = this.state;

    const page = (
      results &&
      results[searchKey] &&
      results[searchKey].page
    ) || 0;

    const list = (
      results &&
      results[searchKey] &&
      results[searchKey].hits
    ) || [];


    return (
      <div className="page">
        <div className="interactions">
        <Search
          value={searchTerm}
          onChange={this.onSearchChange}
          onSubmit={this.onSearchSubmit}
        >
        Search
        </Search>
        </div>
        { results
          ? <Table
                list={list}
                onDismiss={this.onDismiss}
              />
              : null
            }
            <div className="interactions">
              <Button onClick={() => this.fetchSearchTopstories(searchKey, page + 1 )}>
              More
              </Button>
            </div>
      </div>
    );
  }
}

// functional stateless components v1
const Search = ({
  value,
  onChange,
  onSubmit,
  children}) =>  // I don't like the style of the implict return and absence of blocks
    <form onSubmit={onSubmit} action="">
      {children} <input
        type="text"
        value={value}
        onChange={onChange}
      />
      <button type="submit">
        {children}
      </button>
    </form>

// functional stateless component v2
function Table(props) {
  const { list, onDismiss } = props;
    return(
      <div className="table">
      {
        list.map(item =>
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
