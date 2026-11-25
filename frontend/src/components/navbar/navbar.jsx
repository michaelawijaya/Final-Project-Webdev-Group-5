import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        {/* Logo / Brand */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="brand-icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </span>
          <span className="brand-name">Lost &amp; Found</span>
        </Link>

        {/* Tombol Hamburger Mobile */}
        <button
          type="button"
          className="navbar-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className={`bar ${menuOpen ? 'open' : ''}`} />
          <span className={`bar ${menuOpen ? 'open' : ''}`} />
          <span className={`bar ${menuOpen ? 'open' : ''}`} />
        </button>

        {/* Links Router */}
        <nav className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <NavLink
            to="/"
            end
            onClick={closeMenu}
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            Home
          </NavLink>

          <NavLink
            to="/views"
            onClick={closeMenu}
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            Browse Reports
          </NavLink>

          <NavLink
            to="/report-submission"
            onClick={closeMenu}
            className={({ isActive }) => (isActive ? 'nav-cta active' : 'nav-cta')}
          >
            + Submit Report
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;