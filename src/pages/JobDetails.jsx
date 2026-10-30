import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getJobById, updateJob, deleteJob } from '../services/api';
import ApplicationModal from '../components/ApplicationModal';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import './JobDetails.css';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  // Application Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Edit Job Modal state (PUT /jobs/:id)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    experience: '',
    jobType: 'Full-Time',
    category: 'Software Development',
    description: '',
    skillsText: '',
  });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');

  // Delete Job state (DELETE /jobs/:id)
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getJobById(id);
        if (!isMounted) return;
        setJob(data);
        // Pre-fill edit form
        setEditFormData({
          title: data.title || '',
          company: data.company || '',
          location: data.location || '',
          salary: data.salary || '',
          experience: data.experience || '',
          jobType: data.jobType || 'Full-Time',
          category: data.category || 'Software Development',
          description: data.description || '',
          skillsText: Array.isArray(data.skills) ? data.skills.join(', ') : (data.skills || ''),
        });
      } catch (err) {
        if (!isMounted) return;
        console.error('Fetch job error:', err);
        setError('Job details could not be found or loaded.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchJob();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleApplySuccess = () => {
    setActionMessage({
      type: 'success',
      text: 'Your application was successfully submitted!',
    });
  };

  // Handle Edit Submit (PUT /jobs/:id)
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');

    if (!editFormData.title.trim() || !editFormData.company.trim() || !editFormData.location.trim()) {
      setEditError('Title, Company, and Location are mandatory fields.');
      return;
    }

    setEditSaving(true);
    try {
      const skillsArray = editFormData.skillsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const updatedPayload = {
        ...job,
        title: editFormData.title.trim(),
        company: editFormData.company.trim(),
        location: editFormData.location.trim(),
        salary: editFormData.salary.trim(),
        experience: editFormData.experience.trim(),
        jobType: editFormData.jobType,
        category: editFormData.category,
        description: editFormData.description.trim(),
        skills: skillsArray,
      };

      const result = await updateJob(id, updatedPayload);
      setJob(result);
      setIsEditModalOpen(false);
      setActionMessage({
        type: 'success',
        text: 'Job posting details have been successfully updated.',
      });
    } catch (err) {
      setEditError(err.message || 'Failed to update job.');
    } finally {
      setEditSaving(false);
    }
  };

  // Handle Delete (DELETE /jobs/:id)
  const handleDeleteJob = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete the job posting "${job.title}"?`
    );
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await deleteJob(id);
      alert('Job posting has been successfully deleted.');
      navigate('/jobs');
    } catch (err) {
      console.error('Delete job error:', err);
      setActionMessage({
        type: 'error',
        text: 'Failed to delete job posting. Please try again.',
      });
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0' }}>
        <LoadingSpinner message="Retrieving job position details..." />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container" style={{ padding: '60px 0' }}>
        <div className="error-card">
          <h2>Job Not Found</h2>
          <p>{error || 'The requested job posting is no longer available or was removed.'}</p>
          <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '16px' }}>
            &larr; Back to Job Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="job-details-page">
      {/* Top Banner Header */}
      <section className="job-details-header">
        <div className="container">
          <div className="back-link-wrapper">
            <Link to="/jobs" className="back-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to all jobs
            </Link>
          </div>

          <div className="job-header-main">
            <div className="job-header-info">
              <span className="job-header-company">{job.company}</span>
              <h1 className="job-header-title">{job.title}</h1>
              <div className="job-header-tags">
                <span className="badge badge-navy">{job.jobType}</span>
                {job.category && <span className="badge badge-navy">{job.category}</span>}
                {job.postedDate && (
                  <span className="posted-date-text">
                    Posted on {new Date(job.postedDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            <div className="job-header-actions">
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() => setIsApplyModalOpen(true)}
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Details Body */}
      <div className="container job-details-container">
        {actionMessage && (
          <AlertMessage
            type={actionMessage.type}
            message={actionMessage.text}
            onDismiss={() => setActionMessage(null)}
          />
        )}

        <div className="details-layout-grid">
          {/* Main Column */}
          <main className="details-main-col">
            {/* Quick Metrics Strip */}
            <div className="quick-metrics-strip">
              <div className="metric-box">
                <span className="metric-label">Offered Salary</span>
                <span className="metric-value salary-highlight">{job.salary}</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Experience Required</span>
                <span className="metric-value">{job.experience}</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Job Type</span>
                <span className="metric-value">{job.jobType}</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Location</span>
                <span className="metric-value">{job.location}</span>
              </div>
            </div>

            {/* Description Card */}
            <div className="content-card">
              <h2 className="card-section-title">Job Description</h2>
              <div className="job-description-text">
                <p>{job.description}</p>
              </div>

              {/* Responsibilities list if applicable */}
              <h3 className="card-subsection-title">Core Responsibilities</h3>
              <ul className="bullet-list">
                <li>Collaborate with cross-functional team members to execute high-impact initiatives.</li>
                <li>Write clean, modular, and maintainable code/assets adhering to industry standards.</li>
                <li>Participate in technical design discussions and peer review sessions.</li>
                <li>Ensure accessibility, performance, and responsive behavior across devices.</li>
              </ul>

              {/* Skills section */}
              <h2 className="card-section-title" style={{ marginTop: '32px' }}>
                Required Skills & Qualifications
              </h2>
              {job.skills && job.skills.length > 0 ? (
                <div className="details-skills-pills">
                  {job.skills.map((skill, idx) => (
                    <span key={idx} className="details-skill-badge">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="no-skills-text">No specific skills listed.</p>
              )}

              <div className="apply-bottom-cta">
                <div>
                  <h4>Ready to take the next step in your career?</h4>
                  <p>Submit your candidate profile directly to {job.company}.</p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setIsApplyModalOpen(true)}
                >
                  Apply Now
                </button>
              </div>
            </div>
          </main>

          {/* Sidebar Column */}
          <aside className="details-sidebar-col">
            {/* Company Overview Card */}
            <div className="content-card sidebar-card">
              <h3 className="sidebar-card-title">About the Company</h3>
              <div className="company-info-block">
                <div className="company-avatar">
                  {job.company ? job.company.charAt(0).toUpperCase() : 'C'}
                </div>
                <div>
                  <h4 className="company-name-bold">{job.company}</h4>
                  <span className="company-location-sub">{job.location}</span>
                </div>
              </div>
              <p className="company-mini-desc">
                An innovative enterprise committed to professional excellence, inclusive growth, and cutting-edge digital experiences.
              </p>
            </div>

            {/* Recruiter / Admin Tools (Demonstrates PUT and DELETE CRUD) */}
            <div className="content-card sidebar-card admin-tools-card">
              <h3 className="sidebar-card-title">Manage Job Listing</h3>
              <p className="admin-tools-desc">
                Authorized recruiter options to update this posting or remove it from the portal.
              </p>
              <div className="admin-tools-buttons">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setIsEditModalOpen(true)}
                  style={{ width: '100%' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit Job Details
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={handleDeleteJob}
                  disabled={isDeleting}
                  style={{ width: '100%' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  {isDeleting ? 'Deleting...' : 'Delete Job'}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Apply Modal */}
      {isApplyModalOpen && (
        <ApplicationModal
          job={job}
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          onSuccess={handleApplySuccess}
        />
      )}

      {/* Edit Job Modal (PUT /jobs/:id) */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              className="modal-close-button"
              onClick={() => setIsEditModalOpen(false)}
              aria-label="Close dialog"
            >
              &times;
            </button>

            <div className="modal-header">
              <span className="modal-subtitle">Update Posting</span>
              <h2 className="modal-title">Edit Job Listing</h2>
            </div>

            <form onSubmit={handleEditSubmit} className="modal-form">
              {editError && <div className="form-error-banner">{editError}</div>}

              <div className="form-grid-two">
                <div className="form-group">
                  <label className="form-label">Job Title *</label>
                  <input
                    type="text"
                    name="title"
                    className="form-input"
                    value={editFormData.title}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <input
                    type="text"
                    name="company"
                    className="form-input"
                    value={editFormData.company}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-two">
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input
                    type="text"
                    name="location"
                    className="form-input"
                    value={editFormData.location}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Salary *</label>
                  <input
                    type="text"
                    name="salary"
                    className="form-input"
                    value={editFormData.salary}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-two">
                <div className="form-group">
                  <label className="form-label">Experience *</label>
                  <input
                    type="text"
                    name="experience"
                    className="form-input"
                    value={editFormData.experience}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Job Type *</label>
                  <select
                    name="jobType"
                    className="form-select"
                    value={editFormData.jobType}
                    onChange={handleEditChange}
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Required Skills (Comma separated) *</label>
                <input
                  type="text"
                  name="skillsText"
                  className="form-input"
                  placeholder="e.g. React, Node.js, SQL"
                  value={editFormData.skillsText}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Job Description *</label>
                <textarea
                  name="description"
                  rows="4"
                  className="form-textarea"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  required
                ></textarea>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={editSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={editSaving}
                >
                  {editSaving ? 'Saving Changes...' : 'Save Updates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
