import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createJob } from '../services/api';
import AlertMessage from '../components/AlertMessage';
import './PostJob.css';

const PostJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [createdJobId, setCreatedJobId] = useState(null);

  const validate = () => {
    const errs = {};

    if (!formData.title.trim()) {
      errs.title = 'Job title is required';
    }

    if (!formData.company.trim()) {
      errs.company = 'Company name is required';
    }

    if (!formData.location.trim()) {
      errs.location = 'Location is required (e.g. San Francisco, CA or Remote)';
    }

    if (!formData.salary.trim()) {
      errs.salary = 'Salary range is required (e.g. $80,000 - $100,000 / yr)';
    }

    if (!formData.experience.trim()) {
      errs.experience = 'Experience level is required';
    }

    if (!formData.description.trim()) {
      errs.description = 'Job description is required';
    } else if (formData.description.trim().length < 30) {
      errs.description = 'Job description should be at least 30 characters long';
    }

    if (!formData.skillsText.trim()) {
      errs.skillsText = 'At least one required skill is needed';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      // Split skillsText by comma and trim each skill
      const skillsArray = formData.skillsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        title: formData.title.trim(),
        company: formData.company.trim(),
        location: formData.location.trim(),
        salary: formData.salary.trim(),
        experience: formData.experience.trim(),
        jobType: formData.jobType,
        category: formData.category,
        description: formData.description.trim(),
        skills: skillsArray,
        postedDate: new Date().toISOString().split('T')[0],
        featured: false,
      };

      const newJob = await createJob(payload);
      setCreatedJobId(newJob.id);

      // Reset form
      setFormData({
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
    } catch (err) {
      setServerError(err.message || 'Failed to save job opening. Please check JSON Server connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="post-job-page">
      {/* Page Header */}
      <section className="post-job-header">
        <div className="container">
          <span className="page-tag">Employer & Recruiter Portal</span>
          <h1 className="page-title">Post a New Job Opening</h1>
          <p className="page-subtitle">
            Fill in the details below to publish your opening and connect with qualified candidates.
          </p>
        </div>
      </section>

      <div className="container post-job-container">
        {createdJobId ? (
          <div className="post-success-card">
            <div className="post-success-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2>Job Opening Published Successfully!</h2>
            <p>
              Your job listing is now live in the system and visible on the <strong>Find Jobs</strong> page.
            </p>
            <div className="post-success-actions">
              <Link to={`/jobs/${createdJobId}`} className="btn btn-primary">
                View Published Job
              </Link>
              <Link to="/jobs" className="btn btn-outline">
                Browse All Jobs
              </Link>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setCreatedJobId(null)}
              >
                Post Another Opening
              </button>
            </div>
          </div>
        ) : (
          <div className="post-form-card">
            {serverError && <AlertMessage type="error" message={serverError} />}

            <form onSubmit={handleSubmit} noValidate>
              {/* Basic Information */}
              <div className="form-section-title">
                <h3>1. Job Title & Organization</h3>
                <p>Define the role title and the hiring company name.</p>
              </div>

              <div className="post-form-grid">
                <div className="form-group">
                  <label htmlFor="title" className="form-label">
                    Job Title <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className={`form-input ${errors.title ? 'input-error' : ''}`}
                    placeholder="e.g. Senior Frontend React Developer"
                    value={formData.title}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                  {errors.title && <span className="field-error">{errors.title}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="company" className="form-label">
                    Company Name <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className={`form-input ${errors.company ? 'input-error' : ''}`}
                    placeholder="e.g. Acme Software Corp"
                    value={formData.company}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                  {errors.company && <span className="field-error">{errors.company}</span>}
                </div>
              </div>

              {/* Role Parameters */}
              <div className="form-section-title" style={{ marginTop: '32px' }}>
                <h3>2. Role Details & Compensation</h3>
                <p>Specify the work model, location, and remuneration.</p>
              </div>

              <div className="post-form-grid">
                <div className="form-group">
                  <label htmlFor="location" className="form-label">
                    Location <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className={`form-input ${errors.location ? 'input-error' : ''}`}
                    placeholder="e.g. New York, NY (Hybrid) or Remote"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                  {errors.location && <span className="field-error">{errors.location}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="salary" className="form-label">
                    Salary / Compensation <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="salary"
                    name="salary"
                    className={`form-input ${errors.salary ? 'input-error' : ''}`}
                    placeholder="e.g. $90,000 - $115,000 / year"
                    value={formData.salary}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                  {errors.salary && <span className="field-error">{errors.salary}</span>}
                </div>
              </div>

              <div className="post-form-grid-three">
                <div className="form-group">
                  <label htmlFor="experience" className="form-label">
                    Experience Level <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="experience"
                    name="experience"
                    className={`form-input ${errors.experience ? 'input-error' : ''}`}
                    placeholder="e.g. Mid Level (2-4 years)"
                    value={formData.experience}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                  {errors.experience && <span className="field-error">{errors.experience}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="jobType" className="form-label">
                    Job Type <span className="required-star">*</span>
                  </label>
                  <select
                    id="jobType"
                    name="jobType"
                    className="form-select"
                    value={formData.jobType}
                    onChange={handleChange}
                    disabled={submitting}
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="category" className="form-label">
                    Category <span className="required-star">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={submitting}
                  >
                    <option value="Software Development">Software Development</option>
                    <option value="Product Design">Product Design</option>
                    <option value="Data & Analytics">Data & Analytics</option>
                    <option value="Marketing">Marketing</option>
                    <option value="DevOps & Cloud">DevOps & Cloud</option>
                    <option value="Finance & Banking">Finance & Banking</option>
                    <option value="Customer Support">Customer Support</option>
                  </select>
                </div>
              </div>

              {/* Skills and Description */}
              <div className="form-section-title" style={{ marginTop: '32px' }}>
                <h3>3. Job Requirements & Overview</h3>
                <p>Provide a comprehensive overview and the key technical proficiencies required.</p>
              </div>

              <div className="form-group">
                <label htmlFor="skillsText" className="form-label">
                  Required Skills (comma separated) <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  id="skillsText"
                  name="skillsText"
                  className={`form-input ${errors.skillsText ? 'input-error' : ''}`}
                  placeholder="e.g. React, JavaScript, CSS3, REST APIs, Git"
                  value={formData.skillsText}
                  onChange={handleChange}
                  disabled={submitting}
                />
                <span className="form-helper-text">Separate individual skills with commas.</span>
                {errors.skillsText && <span className="field-error">{errors.skillsText}</span>}
              </div>

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label htmlFor="description" className="form-label">
                  Job Description <span className="required-star">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="6"
                  className={`form-textarea ${errors.description ? 'input-error' : ''}`}
                  placeholder="Detail the job responsibilities, project scope, qualifications, and benefits..."
                  value={formData.description}
                  onChange={handleChange}
                  disabled={submitting}
                ></textarea>
                {errors.description && <span className="field-error">{errors.description}</span>}
              </div>

              <div className="post-form-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => navigate('/jobs')}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={submitting}
                >
                  {submitting ? 'Publishing Opening...' : 'Publish Job Opening'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostJob;
