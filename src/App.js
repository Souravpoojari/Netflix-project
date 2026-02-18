import React, { useEffect, useState } from 'react';
import './App.css';
import movieAPI, { getImageUrl } from './api/movieAPI';
import Header from './components/Header';
import Hero from './components/Hero';
import MovieRow from './components/MovieRow';
import SearchBar from './components/SearchBar';

function App() {
  const [movies, setMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllMovies();
  }, []);

  const fetchAllMovies = async () => {
    try {
      setLoading(true);
      const [popular, topRated, upcoming, nowPlaying] = await Promise.all([
        movieAPI.getPopularMovies(),
        movieAPI.getTopRatedMovies(),
        movieAPI.getUpcomingMovies(),
        movieAPI.getNowPlayingMovies(),
      ]);

      setMovies(popular.results);
      setTopRatedMovies(topRated.results);
      setUpcomingMovies(upcoming.results);
      setNowPlayingMovies(nowPlaying.results);

      if (popular.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * Math.min(5, popular.results.length));
        setFeaturedMovie(popular.results[randomIndex]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const response = await movieAPI.searchMovies(query);
      setSearchResults(response.results);
    } catch (error) {
      console.error("Error searching movies:", error);
    }
  };

  const handleClearSearch = () => {
    setSearchResults([]);
    setIsSearching(false);
  };

  if (loading) {
    return (
      <div className="app loading">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />

      {isSearching && searchResults.length > 0 && (
        <div className="search-results">
          <h2>Search Results</h2>
          <MovieRow movies={searchResults} />
        </div>
      )}

      {!isSearching && (
        <>
          {featuredMovie && <Hero movie={featuredMovie} />}
          <main className="main-content">
            <MovieRow title="Now Playing" movies={nowPlayingMovies} />
            <MovieRow title="Popular on Netflix" movies={movies} />
            <MovieRow title="Top Rated" movies={topRatedMovies} />
            <MovieRow title="Upcoming Releases" movies={upcomingMovies} />
          </main>
        </>
      )}
    </div>
  );
}

export default App;
