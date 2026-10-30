import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  getApplications,
  updateApplication,
  deleteApplication,
  getCandidates,
  deleteCandidate,
} from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import './Applications.css';

const STATUS_OPTIONS = ['Pending', 'Shortlisted', 'Accepted', 'Rejected'];

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Active view tab: 'applications' or 'candidates'
  const [activeView, setActiveView] = useState('applications');

  // Filter & Search states
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPortalData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [appsData, candsData] = await Promise.all([
          getApplications(),
          getCandidates().catch(() => []),
        ]);
        if (isMounted) {
          setApplications(appsData);
          setCandidates(candsData);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Fetch portal error:', err);
          setError('Could not connect to JSON Server. Ensure JSON server is running on port 5000.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPortalData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Status Counts
  const counts = useMemo(() => {
    return {
      All: applications.length,
      Pending: applications.filter((a) => a.status === 'Pending').length,
      Shortlisted: applications.filter((a) => a.status === 'Shortlisted').length,
      Accepted: applications.filter((a) => a.status === 'Accepted').length,
      Rejected: applications.filter((a) => a.status === 'Rejected').length,
    };
  }, [applications]);

  // Filtered Applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Status filter
      if (statusFilter !== 'All' && app.status !== statusFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const nameMatch = app.candidateName?.toLowerCase().includes(query);
        const emailMatch = app.email?.toLowerCase().includes(query);
        const jobMatch = app.jobTitle?.toLowerCase().includes(query);
        const companyMatch = app.company?.toLowerCase().includes(query);
        if (!nameMatch && !emailMatch && !jobMatch && !companyMatch) {
          return false;
        }
      }

      return true;
    });
  }, [applications, statusFilter, searchQuery]);

  // Handle Status Update (PUT /applications/:id)
  const handleStatusChange = async (appId, newStatus) => {
    const targetApp = applications.find((a) => a.id === appId);
    if (!targetApp || targetApp.status === newStatus) return;

    setUpdatingId(appId);
    try {
      const updatedData = { ...targetApp, status: newStatus };
      const saved = await updateApplication(appId, updatedData);

      setApplications((prev) =>
        prev.map((item) => (item.id === appId ? saved : item))
      );

      setFeedback({
        type: 'success',
        text: `Application for "${targetApp.candidateName}" updated to ${newStatus}.`,
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        text: `Failed to update status: ${err.message}`,
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle Delete Application (DELETE /applications/:id)
  const handleDeleteApplication = async (appId, candidateName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the application record for ${candidateName}?`
    );
    if (!confirmDelete) return;

    try {
      await deleteApplication(appId);
      setApplications((prev) => prev.filter((a) => a.id !== appId));
      setFeedback({
        type: 'success',
        text: `Application record for ${candidateName} was deleted.`,
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        text: `Failed to delete application: ${err.message}`,
      });
    }
  };

  // Handle Delete Candidate (DELETE /candidates/:id)
  const handleDeleteCandidate = async (candId, fullName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to remove candidate ${fullName}?`
    );
    if (!confirmDelete) return;

    try {
      await deleteCandidate(candId);
      setCandidates((prev) => prev.filter((c) => c.id !== candId));
      setFeedback({
        type: 'success',
        text: `Candidate profile for ${fullName} was removed.`,
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        text: `Failed to delete candidate: ${err.message}`,
      });
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Shortlisted':
        return 'badge-shortlisted';
      case 'Accepted':
        return 'badge-accepted';
      case 'Rejected':
        return 'badge-rejected';
      case 'Pending':
      default:
        return 'badge-pending';
    }
  };

  return (
    <div className="applications-page">
      {/* Header */}
      <section className="applications-header">
        <div className="container">
          <span className="page-tag">Talent Management Portal</span>
          <h1 className="page-title">Candidate Applications</h1>
          <p className="page-subtitle">
            Review applicant submissions, track hiring stages, and update candidates from Pending to Shortlisted, Accepted, or Rejected.
          </p>
        </div>
      </section>

      <div className="container applications-container">
        {feedback && (
          <AlertMessage
            type={feedback.type}
            message={feedback.text}
            onDismiss={() => setFeedback(null)}
          />
        )}

        {error && <AlertMessage type="error" message={error} />}

        {/* Top Control Bar: View Switcher and Search */}
        <div className="control-bar-card">
          <div className="view-switcher-tabs">
            <button
              type="button"
              className={`view-tab ${activeView === 'applications' ? 'active' : ''}`}
              onClick={() => setActiveView('applications')}
            >
              Applications ({applications.length})
            </button>
            <button
              type="button"
              className={`view-tab ${activeView === 'candidates' ? 'active' : ''}`}
              onClick={() => setActiveView('candidates')}
            >
              Candidate Directory ({candidates.length})
            </button>
          </div>

          {activeView === 'applications' && (
            <div className="search-app-field">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search candidate name, email, or job title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-app-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                >
                  &times;
                </button>
              )}
            </div>
          )}
        </div>

        {/* View 1: Applications */}
        {activeView === 'applications' && (
          <>
            {/* Status Filter Tabs */}
            <div className="status-tabs-strip">
              {['All', 'Pending', 'Shortlisted', 'Accepted', 'Rejected'].map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`status-filter-tab ${statusFilter === status ? 'active' : ''}`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                  <span className="status-tab-count">{counts[status] ?? 0}</span>
                </button>
              ))}
            </div>

            {loading ? (
              <LoadingSpinner message="Fetching candidate applications from server..." />
            ) : filteredApplications.length === 0 ? (
              <div className="empty-applications-card">
                <div className="empty-app-icon">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <h3>No applications found</h3>
                <p>
                  {searchQuery || statusFilter !== 'All'
                    ? 'No candidates match your current search or filter criteria.'
                    : 'No job applications have been submitted yet. Apply for jobs to see them listed here!'}
                </p>
                <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '16px' }}>
                  Explore Open Jobs
                </Link>
              </div>
            ) : (
              <div className="applications-table-wrapper">
                <table className="applications-table">
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Applied Job</th>
                      <th>Applied Date</th>
                      <th>Qualifications</th>
                      <th>Resume</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map((app) => (
                      <tr key={app.id}>
                        {/* Candidate */}
                        <td>
                          <div className="cand-info-cell">
                            <span className="cand-name">{app.candidateName}</span>
                            <span className="cand-email">{app.email}</span>
                            {app.phone && <span className="cand-phone">{app.phone}</span>}
                          </div>
                        </td>

                        {/* Applied Job */}
                        <td>
                          <div className="job-info-cell">
                            <Link to={`/jobs/${app.jobId}`} className="app-job-title">
                              {app.jobTitle}
                            </Link>
                            <span className="app-company">{app.company}</span>
                          </div>
                        </td>

                        {/* Date */}
                        <td>
                          <span className="app-date-cell">
                            {app.appliedDate
                              ? new Date(app.appliedDate).toLocaleDateString()
                              : 'Recent'}
                          </span>
                        </td>

                        {/* Qualifications */}
                        <td>
                          <div className="app-qual-cell">
                            <span className="app-education" title={app.education}>
                              {app.education}
                            </span>
                            <span className="app-experience" title={app.experience}>
                              {app.experience}
                            </span>
                          </div>
                        </td>

                        {/* Resume */}
                        <td>
                          {app.resumeLink ? (
                            <a
                              href={app.resumeLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="resume-link-btn"
                              title={app.resumeLink}
                            >
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                              </svg>
                              View
                            </a>
                          ) : (
                            <span className="no-resume-text">N/A</span>
                          )}
                        </td>

                        {/* Status (with inline status update PUT API) */}
                        <td>
                          <div className="status-selector-cell">
                            <span className={`badge ${getStatusBadgeClass(app.status)}`}>
                              {app.status}
                            </span>
                            <select
                              className="status-dropdown-select"
                              value={app.status}
                              disabled={updatingId === app.id}
                              onChange={(e) => handleStatusChange(app.id, e.target.value)}
                              aria-label={`Change status for ${app.candidateName}`}
                            >
                              {STATUS_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>
                                  Change to {opt}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>

                        {/* Actions */}
                        <td>
                          <button
                            type="button"
                            className="delete-app-btn"
                            onClick={() => handleDeleteApplication(app.id, app.candidateName)}
                            title="Delete this application"
                            aria-label={`Delete application for ${app.candidateName}`}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* View 2: Candidate Directory (Candidates CRUD) */}
        {activeView === 'candidates' && (
          <div className="candidates-directory-view">
            {candidates.length === 0 ? (
              <div className="empty-applications-card">
                <h3>No candidates registered yet</h3>
                <p>When candidates apply for jobs, their profiles will appear in this directory.</p>
              </div>
            ) : (
              <div className="candidates-grid">
                {candidates.map((cand) => (
                  <div key={cand.id} className="candidate-card">
                    <div className="cand-header">
                      <div className="cand-avatar">
                        {cand.fullName ? cand.fullName.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <h3 className="cand-card-name">{cand.fullName}</h3>
                        <span className="cand-card-email">{cand.email}</span>
                      </div>
                    </div>

                    <div className="cand-body">
                      {cand.phone && (
                        <p className="cand-detail-line">
                          <strong>Phone:</strong> {cand.phone}
                        </p>
                      )}
                      <p className="cand-detail-line">
                        <strong>Education:</strong> {cand.education}
                      </p>
                      <p className="cand-detail-line">
                        <strong>Experience:</strong> {cand.experience}
                      </p>
                    </div>

                    <div className="cand-footer">
                      {cand.resumeLink && (
                        <a
                          href={cand.resumeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-sm"
                        >
                          Resume Link ↗
                        </a>
                      )}
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteCandidate(cand.id, cand.fullName)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
