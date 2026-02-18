import React from 'react';
import '../styles/Header.css';

function Header() {
  const handleNavClick = (section) => {
    console.log('Navigate to:', section);
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <div className="netflix-logo">
            <span className="logo-n">N</span>
          </div>
          <span className="logo-text">NETFLIX</span>
        </div>
        <nav className="nav-menu">
          <button onClick={() => handleNavClick('home')} className="nav-link">Home</button>
          <button onClick={() => handleNavClick('tvshows')} className="nav-link">TV Shows</button>
          <button onClick={() => handleNavClick('movies')} className="nav-link">Movies</button>
          <button onClick={() => handleNavClick('mylist')} className="nav-link">My List</button>
        </nav>
        <div className="header-actions">
          <button className="profile-btn">👤</button>
        </div>
      </div>
    </header>
  );
}

export default Header;