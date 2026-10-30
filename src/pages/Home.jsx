import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getJobs } from '../services/api';
import JobCard from '../components/JobCard';
import ApplicationModal from '../components/ApplicationModal';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import './Home.css';

const POPULAR_CATEGORIES = [
  {
    name: 'Software Development',
    count: '240+ Open Roles',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    name: 'Product Design',
    count: '95+ Open Roles',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 10 10 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    ),
  },
  {
    name: 'Data & Analytics',
    count: '130+ Open Roles',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    name: 'Marketing',
    count: '80+ Open Roles',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l18-5v12L3 14v-3z" />
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
      </svg>
    ),
  },
  {
    name: 'DevOps & Cloud',
    count: '110+ Open Roles',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      </svg>
    ),
  },
  {
    name: 'Finance & Banking',
    count: '75+ Open Roles',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
];

const WHY_CHOOSE_ITEMS = [
  {
    title: 'Verified Job Opportunities',
    description: 'Every job posting is vetted to ensure genuine openings from authentic organizations across industry sectors.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: 'Direct Application Process',
    description: 'No complicated hurdles or external redirect loops. Submit candidate details and resume with a single click.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
  },
  {
    title: 'Transparent Application Tracking',
    description: 'Track the status of your applications in real-time whether they are Pending, Shortlisted, Accepted, or Rejected.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 14 14" />
      </svg>
    ),
  },
  {
    title: 'Empowering Recruiters & Talent',
    description: 'Hiring managers can list requirements swiftly, manage applications, and shortlist suitable talent without friction.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedJobForModal, setSelectedJobForModal] = useState(null);

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const jobs = await getJobs();
        // Pick jobs that are marked featured or slice first 4
        const featured = jobs.filter((j) => j.featured).slice(0, 4);
        setFeaturedJobs(featured.length > 0 ? featured : jobs.slice(0, 4));
      } catch (err) {
        console.error('Featured jobs error:', err);
        setError('Unable to load featured jobs. Make sure JSON Server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchTitle.trim()) queryParams.set('title', searchTitle.trim());
    if (searchLocation.trim()) queryParams.set('location', searchLocation.trim());

    navigate(`/jobs?${queryParams.toString()}`);
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/jobs?category=${encodeURIComponent(categoryName)}`);
  };

  const handleOpenApplyModal = (job) => {
    setSelectedJobForModal(job);
  };

  const handleCloseApplyModal = () => {
    setSelectedJobForModal(null);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="hero-tag">Empowering Careers & Connections</span>
            <h1 className="hero-heading">Find Your Dream Job Today</h1>
            <p className="hero-description">
              Connect with leading companies across tech, design, marketing, and business.
              Discover opportunities that align with your career ambitions and apply with ease.
            </p>

            {/* Search Input Box */}
            <form className="hero-search-form" onSubmit={handleSearchSubmit}>
              <div className="search-field">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Job title, keywords, or skills..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  className="search-input"
                  aria-label="Job title search input"
                />
              </div>

              <div className="search-divider"></div>

              <div className="search-field">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <input
                  type="text"
                  placeholder="City, state, or Remote..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="search-input"
                  aria-label="Location search input"
                />
              </div>

              <button type="submit" className="btn btn-primary search-submit-btn">
                Search Jobs
              </button>
            </form>

            <div className="hero-popular-keywords">
              <span>Popular Searches:</span>
              <button type="button" onClick={() => navigate('/jobs?title=React')}>React</button>
              <button type="button" onClick={() => navigate('/jobs?title=Node')}>Node.js</button>
              <button type="button" onClick={() => navigate('/jobs?title=Figma')}>Figma</button>
              <button type="button" onClick={() => navigate('/jobs?location=Remote')}>Remote</button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Job Categories */}
      <section className="section-padding categories-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Explore Opportunities</span>
            <h2 className="section-title">Popular Job Categories</h2>
            <p className="section-subtitle">
              Browse positions across highest-demand industries and functional disciplines.
            </p>
          </div>

          <div className="categories-grid">
            {POPULAR_CATEGORIES.map((cat, idx) => (
              <div
                key={idx}
                className="category-card"
                onClick={() => handleCategoryClick(cat.name)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleCategoryClick(cat.name)}
              >
                <div className="category-icon-box">{cat.icon}</div>
                <h3 className="category-title">{cat.name}</h3>
                <span className="category-count">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Job Listings */}
      <section className="section-padding featured-jobs-section">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <span className="section-tag">Curated Openings</span>
              <h2 className="section-title">Featured Job Listings</h2>
              <p className="section-subtitle">
                Hand-picked high-growth opportunities actively seeking candidates.
              </p>
            </div>
            <Link to="/jobs" className="btn btn-outline desktop-only-btn">
              View All Jobs &rarr;
            </Link>
          </div>

          {error && <AlertMessage type="error" message={error} />}

          {loading ? (
            <LoadingSpinner message="Fetching featured job openings..." />
          ) : featuredJobs.length === 0 ? (
            <div className="empty-featured">
              <p>No featured jobs currently available. Explore our full listings catalog.</p>
              <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '12px' }}>
                Browse All Openings
              </Link>
            </div>
          ) : (
            <div className="jobs-grid">
              {featuredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApply={handleOpenApplyModal}
                />
              ))}
            </div>
          )}

          <div className="mobile-view-all-wrapper">
            <Link to="/jobs" className="btn btn-outline" style={{ width: '100%' }}>
              View All Jobs &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose CareerConnect Section */}
      <section className="section-padding why-choose-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Platform Advantages</span>
            <h2 className="section-title">Why Choose CareerConnect</h2>
            <p className="section-subtitle">
              A reliable recruitment ecosystem designed for clarity, speed, and real career advancement.
            </p>
          </div>

          <div className="why-choose-grid">
            {WHY_CHOOSE_ITEMS.map((item, idx) => (
              <div key={idx} className="why-card">
                <div className="why-icon-box">{item.icon}</div>
                <h3 className="why-card-title">{item.title}</h3>
                <p className="why-card-description">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Employer CTA Banner */}
      <section className="cta-banner-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <span className="cta-tag">For Recruiters & Hiring Managers</span>
              <h2 className="cta-title">Hiring Top Talent For Your Team?</h2>
              <p className="cta-text">
                Publish your job openings with transparent role criteria and reach skilled professionals immediately.
              </p>
            </div>
            <div className="cta-action">
              <Link to="/post-job" className="btn btn-accent btn-lg">
                Post a Job Opening
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Modal */}
      {selectedJobForModal && (
        <ApplicationModal
          job={selectedJobForModal}
          isOpen={Boolean(selectedJobForModal)}
          onClose={handleCloseApplyModal}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
};

export default Home;
