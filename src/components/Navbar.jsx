import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <div className="logo-icon-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <span className="logo-text">
            Career<span className="logo-text-accent">Connect</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-links desktop-nav" aria-label="Main Navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            Home
          </NavLink>
          <NavLink
            to="/jobs"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            Find Jobs
          </NavLink>
          <NavLink
            to="/post-job"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            Post a Job
          </NavLink>
          <NavLink
            to="/applications"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            Applications
          </NavLink>
        </nav>

        {/* Action Button */}
        <div className="navbar-cta desktop-nav">
          <Link to="/post-job" className="btn btn-primary btn-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Post a Job
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-dropdown">
          <NavLink
            to="/"
            end
            onClick={closeMobileMenu}
            className={({ isActive }) => (isActive ? 'mobile-nav-item active' : 'mobile-nav-item')}
          >
            Home
          </NavLink>
          <NavLink
            to="/jobs"
            onClick={closeMobileMenu}
            className={({ isActive }) => (isActive ? 'mobile-nav-item active' : 'mobile-nav-item')}
          >
            Find Jobs
          </NavLink>
          <NavLink
            to="/post-job"
            onClick={closeMobileMenu}
            className={({ isActive }) => (isActive ? 'mobile-nav-item active' : 'mobile-nav-item')}
          >
            Post a Job
          </NavLink>
          <NavLink
            to="/applications"
            onClick={closeMobileMenu}
            className={({ isActive }) => (isActive ? 'mobile-nav-item active' : 'mobile-nav-item')}
          >
            Applications
          </NavLink>
          <div className="mobile-cta-wrapper">
            <Link to="/post-job" onClick={closeMobileMenu} className="btn btn-primary" style={{ width: '100%' }}>
              Post a Job Opening
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
