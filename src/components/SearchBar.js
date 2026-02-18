import React, { useState } from 'react';
import '../styles/SearchBar.css';

function SearchBar({ onSearch, onClear }) {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  return (
    <div className="search-bar">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search movies, shows, genres, and more..."
          value={query}
          onChange={handleChange}
          className="search-input"
        />
        {query && (
          <button className="clear-btn" onClick={handleClear}>
            ✕
          </button>
        )}
        <span className="search-icon">🔍</span>
      </div>
    </div>
  );
}

export default SearchBar;