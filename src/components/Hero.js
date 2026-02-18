import React from 'react';
import { getImageUrl } from '../api/movieAPI';
import '../styles/Hero.css';

function Hero({ movie }) {
  if (!movie) return null;

  const handlePlay = () => {
    console.log('Playing:', movie.title);
  };

  const handleMoreInfo = () => {
    console.log('More info about:', movie.title);
  };

  return (
    <div
      className="hero"
      style={{
        backgroundImage: `url(${getImageUrl(movie.backdrop_path, 'original')})`,
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">{movie.title}</h1>
        <p className="hero-description">{movie.overview}</p>
        <div className="hero-info">
          <span className="rating">⭐ {movie.vote_average.toFixed(1)}</span>
          <span className="year">{new Date(movie.release_date).getFullYear()}</span>
        </div>
        <div className="hero-buttons">
          <button className="btn btn-play" onClick={handlePlay}>
            ▶ Play
          </button>
          <button className="btn btn-more" onClick={handleMoreInfo}>
            ℹ More Info
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;