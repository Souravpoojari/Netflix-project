import React from 'react';
import { getImageUrl } from '../api/movieAPI';
import '../styles/MovieRow.css';

function MovieRow({ title, movies }) {
  const scrollRef = React.useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 300;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="movie-row">
      {title && <h2 className="row-title">{title}</h2>}
      <div className="movies-wrapper">
        <button className="scroll-btn scroll-btn-left" onClick={() => scroll('left')}>
          &#10094;
        </button>
        <div className="movies-container" ref={scrollRef}>
          {movies && movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <div className="movie-image-wrapper">
                {movie.poster_path && (
                  <img
                    src={getImageUrl(movie.poster_path, 'w200')}
                    alt={movie.title}
                    className="movie-image"
                  />
                )}
                <div className="movie-overlay">
                  <h3>{movie.title}</h3>
                  <p className="rating">⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</p>
                  <p className="release-date">{movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="scroll-btn scroll-btn-right" onClick={() => scroll('right')}>
          &#10095;
        </button>
      </div>
    </div>
  );
}

export default MovieRow;