import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getJobs } from '../services/api';
import JobCard from '../components/JobCard';
import ApplicationModal from '../components/ApplicationModal';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import './FindJobs.css';

const FindJobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL query params
  const initialTitle = searchParams.get('title') || '';
  const initialLocation = searchParams.get('location') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [titleQuery, setTitleQuery] = useState(initialTitle);
  const [locationQuery, setLocationQuery] = useState(initialLocation);
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [selectedJobType, setSelectedJobType] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('newest');

  // Modal state
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchJobsList = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getJobs();
        if (isMounted) {
          setJobs(data);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Fetch jobs error:', err);
          setError('Could not connect to JSON Server. Ensure JSON server is running on port 5000.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchJobsList();

    return () => {
      isMounted = false;
    };
  }, []);



  // Filtered & Sorted Jobs
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        // Search by job title or skills
        if (titleQuery.trim()) {
          const query = titleQuery.toLowerCase().trim();
          const matchesTitle = job.title?.toLowerCase().includes(query);
          const matchesCompany = job.company?.toLowerCase().includes(query);
          const matchesSkills = job.skills?.some((s) => s.toLowerCase().includes(query));
          if (!matchesTitle && !matchesCompany && !matchesSkills) return false;
        }

        // Filter by location
        if (locationQuery.trim()) {
          const locQuery = locationQuery.toLowerCase().trim();
          if (!job.location?.toLowerCase().includes(locQuery)) return false;
        }

        // Filter by experience
        if (selectedExperience !== 'All') {
          const jobExp = (job.experience || '').toLowerCase();
          const filterExp = selectedExperience.toLowerCase();
          if (!jobExp.includes(filterExp)) return false;
        }

        // Filter by job type
        if (selectedJobType !== 'All') {
          if (job.jobType?.toLowerCase() !== selectedJobType.toLowerCase()) return false;
        }

        // Filter by category
        if (selectedCategory !== 'All') {
          if (job.category?.toLowerCase() !== selectedCategory.toLowerCase()) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.postedDate || 0) - new Date(a.postedDate || 0);
        }
        if (sortBy === 'title') {
          return (a.title || '').localeCompare(b.title || '');
        }
        if (sortBy === 'company') {
          return (a.company || '').localeCompare(b.company || '');
        }
        return 0;
      });
  }, [jobs, titleQuery, locationQuery, selectedExperience, selectedJobType, selectedCategory, sortBy]);

  const handleClearFilters = () => {
    setTitleQuery('');
    setLocationQuery('');
    setSelectedExperience('All');
    setSelectedJobType('All');
    setSelectedCategory('All');
    setSortBy('newest');
    setSearchParams({});
  };

  const hasActiveFilters =
    titleQuery.trim() !== '' ||
    locationQuery.trim() !== '' ||
    selectedExperience !== 'All' ||
    selectedJobType !== 'All' ||
    selectedCategory !== 'All';

  return (
    <div className="find-jobs-page">
      {/* Header Banner */}
      <section className="find-jobs-header">
        <div className="container">
          <span className="page-tag">Explore Careers</span>
          <h1 className="page-title">Find Job Openings</h1>
          <p className="page-subtitle">
            Search verified opportunities by title, location, experience level, and work mode.
          </p>
        </div>
      </section>

      <div className="container find-jobs-container">
        {/* Search & Filter Bar */}
        <div className="filters-card">
          <div className="filters-row-main">
            {/* Search Input */}
            <div className="filter-input-wrap">
              <label htmlFor="search-title" className="filter-label">Job Title or Keyword</label>
              <div className="input-with-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  id="search-title"
                  type="text"
                  placeholder="e.g. React Developer, UI Designer..."
                  value={titleQuery}
                  onChange={(e) => setTitleQuery(e.target.value)}
                  className="filter-text-input"
                />
              </div>
            </div>

            {/* Location Input */}
            <div className="filter-input-wrap">
              <label htmlFor="search-location" className="filter-label">Location</label>
              <div className="input-with-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <input
                  id="search-location"
                  type="text"
                  placeholder="City, State, or Remote..."
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="filter-text-input"
                />
              </div>
            </div>
          </div>

          {/* Secondary Dropdown Filters */}
          <div className="filters-row-secondary">
            {/* Experience */}
            <div className="filter-dropdown-wrap">
              <label htmlFor="filter-experience" className="filter-label">Experience</label>
              <select
                id="filter-experience"
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="filter-select"
              >
                <option value="All">All Experience Levels</option>
                <option value="Entry">Entry Level (0-2 years)</option>
                <option value="Mid">Mid Level (2-5 years)</option>
                <option value="Senior">Senior (5+ years)</option>
              </select>
            </div>

            {/* Job Type */}
            <div className="filter-dropdown-wrap">
              <label htmlFor="filter-jobtype" className="filter-label">Job Type</label>
              <select
                id="filter-jobtype"
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
                className="filter-select"
              >
                <option value="All">All Job Types</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            {/* Category */}
            <div className="filter-dropdown-wrap">
              <label htmlFor="filter-category" className="filter-label">Category</label>
              <select
                id="filter-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                <option value="All">All Categories</option>
                <option value="Software Development">Software Development</option>
                <option value="Product Design">Product Design</option>
                <option value="Data & Analytics">Data & Analytics</option>
                <option value="Marketing">Marketing</option>
                <option value="DevOps & Cloud">DevOps & Cloud</option>
              </select>
            </div>

            {/* Sort by */}
            <div className="filter-dropdown-wrap">
              <label htmlFor="filter-sort" className="filter-label">Sort By</label>
              <select
                id="filter-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="newest">Newest First</option>
                <option value="title">Job Title (A-Z)</option>
                <option value="company">Company (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Active filters bar */}
          {hasActiveFilters && (
            <div className="active-filters-bar">
              <span className="active-filters-label">Active Filters:</span>
              {titleQuery && (
                <span className="filter-tag">
                  Title: "{titleQuery}"
                  <button type="button" onClick={() => setTitleQuery('')}>&times;</button>
                </span>
              )}
              {locationQuery && (
                <span className="filter-tag">
                  Location: "{locationQuery}"
                  <button type="button" onClick={() => setLocationQuery('')}>&times;</button>
                </span>
              )}
              {selectedExperience !== 'All' && (
                <span className="filter-tag">
                  Exp: {selectedExperience}
                  <button type="button" onClick={() => setSelectedExperience('All')}>&times;</button>
                </span>
              )}
              {selectedJobType !== 'All' && (
                <span className="filter-tag">
                  Type: {selectedJobType}
                  <button type="button" onClick={() => setSelectedJobType('All')}>&times;</button>
                </span>
              )}
              {selectedCategory !== 'All' && (
                <span className="filter-tag">
                  Category: {selectedCategory}
                  <button type="button" onClick={() => setSelectedCategory('All')}>&times;</button>
                </span>
              )}

              <button
                type="button"
                className="clear-all-btn"
                onClick={handleClearFilters}
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Metadata */}
        <div className="results-header">
          <p className="results-count">
            Showing <strong>{filteredJobs.length}</strong> {filteredJobs.length === 1 ? 'job' : 'jobs'} available
          </p>
        </div>

        {/* Error Notification */}
        {error && <AlertMessage type="error" message={error} />}

        {/* Content Section */}
        {loading ? (
          <LoadingSpinner message="Loading job listings from server..." />
        ) : filteredJobs.length === 0 ? (
          <div className="no-jobs-found">
            <div className="no-jobs-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </div>
            <h3>No jobs found matching your criteria</h3>
            <p>Try modifying your search keywords or clearing some filters to explore more opportunities.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleClearFilters}
              style={{ marginTop: '16px' }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="find-jobs-grid">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApply={(j) => setSelectedJobForModal(j)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Application Modal */}
      {selectedJobForModal && (
        <ApplicationModal
          job={selectedJobForModal}
          isOpen={Boolean(selectedJobForModal)}
          onClose={() => setSelectedJobForModal(null)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
};

export default FindJobs;
