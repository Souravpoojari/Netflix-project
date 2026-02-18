const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = process.env.REACT_APP_TMDB_BASE_URL;
const IMAGE_BASE_URL = process.env.REACT_APP_TMDB_IMAGE_BASE_URL;

const movieAPI = {
  getPopularMovies: (page = 1) =>
    fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`).then(r => r.json()),
  
  getTopRatedMovies: (page = 1) =>
    fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${page}`).then(r => r.json()),
  
  getUpcomingMovies: (page = 1) =>
    fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&page=${page}`).then(r => r.json()),
  
  getNowPlayingMovies: (page = 1) =>
    fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&page=${page}`).then(r => r.json()),
  
  searchMovies: (query, page = 1) =>
    fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`).then(r => r.json()),
  
  getMovieDetails: (movieId) =>
    fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`).then(r => r.json()),
};

export const getImageUrl = (path, size = 'w500') =>
  `${IMAGE_BASE_URL}/${size}${path}`;

export default movieAPI;