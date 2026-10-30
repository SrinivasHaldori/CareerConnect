import { Link } from 'react-router-dom';
import './Footer.css';

const CURRENT_YEAR = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="footer-root">
      <div className="container footer-container">
        <div className="footer-grid">
          {/* Column 1: Brand & About */}
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <span className="footer-logo-title">
                Career<span>Connect</span>
              </span>
            </div>
            <p className="footer-about-text">
              CareerConnect bridges the gap between ambitious job seekers and forward-thinking companies. Designed with modern web standards, providing a transparent and efficient hiring experience.
            </p>
            <div className="project-badge">
              <span className="badge-dot"></span> Academic Student Project
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="footer-col">
            <h4 className="footer-heading">Quick Navigation</h4>
            <ul className="footer-nav-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/jobs">Find Jobs</Link></li>
              <li><Link to="/post-job">Post a Job Opening</Link></li>
              <li><Link to="/applications">View Applications</Link></li>
            </ul>
          </div>

          {/* Column 3: Popular Roles */}
          <div className="footer-col">
            <h4 className="footer-heading">Job Roles</h4>
            <ul className="footer-nav-list">
              <li><Link to="/jobs?category=Software Development">Software Development</Link></li>
              <li><Link to="/jobs?category=Product Design">UI/UX & Product Design</Link></li>
              <li><Link to="/jobs?category=Data & Analytics">Data & Business Analytics</Link></li>
              <li><Link to="/jobs?category=DevOps & Cloud">DevOps & Cloud Engineering</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & System Info */}
          <div className="footer-col">
            <h4 className="footer-heading">Project Specs</h4>
            <p className="footer-info-item">
              <strong>Tech Stack:</strong> React JS, Vite, CSS3, React Router DOM, JSON Server, Fetch API.
            </p>
            <p className="footer-info-item">
              <strong>Architecture:</strong> Client-Side SPA with RESTful CRUD integration.
            </p>
            <p className="footer-info-item">
              <strong>Target Port:</strong> JSON Server on :5000 / Client on :5173.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {CURRENT_YEAR} CareerConnect Portal. Built for Academic Demonstration. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/jobs">Browse All Jobs</Link>
            <span className="separator">•</span>
            <Link to="/applications">Manage Applications</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
