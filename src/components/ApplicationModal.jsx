import { useState } from 'react';
import { createApplication, createCandidate } from '../services/api';
import './ApplicationModal.css';

const getFormattedTodayDate = () => new Date().toISOString().split('T')[0];
const getCurrentIsoString = () => new Date().toISOString();

const ApplicationModal = ({ job, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    education: '',
    experience: '',
    resumeLink: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !job) return null;

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.trim().length < 7) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.education.trim()) {
      newErrors.education = 'Education details are required';
    }

    if (!formData.experience.trim()) {
      newErrors.experience = 'Experience summary is required';
    }

    if (!formData.resumeLink.trim()) {
      newErrors.resumeLink = 'Resume link is required';
    } else if (
      !formData.resumeLink.trim().startsWith('http://') &&
      !formData.resumeLink.trim().startsWith('https://')
    ) {
      newErrors.resumeLink = 'Resume link must start with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const todayDate = getFormattedTodayDate();

      // Prepare application record
      const applicationData = {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        candidateName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        education: formData.education.trim(),
        experience: formData.experience.trim(),
        resumeLink: formData.resumeLink.trim(),
        appliedDate: todayDate,
        status: 'Pending',
      };

      // Prepare candidate record
      const candidateData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        education: formData.education.trim(),
        experience: formData.experience.trim(),
        resumeLink: formData.resumeLink.trim(),
        createdAt: getCurrentIsoString(),
      };

      // Save via POST APIs
      await createApplication(applicationData);
      try {
        await createCandidate(candidateData);
      } catch (candErr) {
        // Log secondary candidate persistence error if candidate already exists
        console.warn('Candidate record note:', candErr);
      }

      setIsSuccess(true);
      if (onSuccess) {
        onSuccess(applicationData);
      }

      setTimeout(() => {
        handleModalClose();
      }, 2200);
    } catch (err) {
      setServerError(err.message || 'Failed to submit application. Please check JSON Server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setIsSuccess(false);
    setServerError('');
    setErrors({});
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      education: '',
      experience: '',
      resumeLink: '',
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleModalClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-job-title"
      >
        <button
          className="modal-close-button"
          onClick={handleModalClose}
          aria-label="Close dialog"
        >
          &times;
        </button>

        <div className="modal-header">
          <span className="modal-subtitle">Application for</span>
          <h2 id="modal-job-title" className="modal-title">
            {job.title}
          </h2>
          <p className="modal-company">
            <strong>{job.company}</strong> • {job.location}
          </p>
        </div>

        {isSuccess ? (
          <div className="modal-success-state">
            <div className="success-icon-box">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3>Application Submitted!</h3>
            <p>
              Thank you, <strong>{formData.fullName}</strong>. Your application has been recorded in
              the system with status <strong>Pending</strong>.
            </p>
            <p className="success-subtext">You can track this in the Applications page.</p>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit} noValidate>
            {serverError && (
              <div className="form-error-banner" role="alert">
                {serverError}
              </div>
            )}

            <div className="form-grid-two">
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">
                  Full Name <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className={`form-input ${errors.fullName ? 'input-error' : ''}`}
                  placeholder="e.g. Alexander Pierce"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.fullName && <span className="field-error">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address <span className="required-star">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  placeholder="e.g. alex@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
            </div>

            <div className="form-grid-two">
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone Number <span className="required-star">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={`form-input ${errors.phone ? 'input-error' : ''}`}
                  placeholder="e.g. +1 (555) 019-2834"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.phone && <span className="field-error">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="resumeLink" className="form-label">
                  Resume Link <span className="required-star">*</span>
                </label>
                <input
                  type="url"
                  id="resumeLink"
                  name="resumeLink"
                  className={`form-input ${errors.resumeLink ? 'input-error' : ''}`}
                  placeholder="https://drive.google.com/your-resume.pdf"
                  value={formData.resumeLink}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.resumeLink && <span className="field-error">{errors.resumeLink}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="education" className="form-label">
                Education Qualification <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="education"
                name="education"
                className={`form-input ${errors.education ? 'input-error' : ''}`}
                placeholder="e.g. Bachelor of Science in Computer Science, Tech University"
                value={formData.education}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.education && <span className="field-error">{errors.education}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="experience" className="form-label">
                Experience Details <span className="required-star">*</span>
              </label>
              <textarea
                id="experience"
                name="experience"
                rows="3"
                className={`form-textarea ${errors.experience ? 'input-error' : ''}`}
                placeholder="Summarize your relevant experience, technical skills, and key projects..."
                value={formData.experience}
                onChange={handleChange}
                disabled={isSubmitting}
              ></textarea>
              {errors.experience && <span className="field-error">{errors.experience}</span>}
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleModalClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ApplicationModal;
