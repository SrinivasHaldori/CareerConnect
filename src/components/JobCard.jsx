import { Link } from 'react-router-dom';
import './JobCard.css';

const JobCard = ({ job, onApply }) => {
  if (!job) return null;

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div>
          <span className="job-company">{job.company}</span>
          <h3 className="job-title">
            <Link to={`/jobs/${job.id}`}>{job.title}</Link>
          </h3>
        </div>
        <span className="badge badge-navy job-type-badge">{job.jobType}</span>
      </div>

      <div className="job-card-meta">
        <div className="meta-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{job.location}</span>
        </div>
        <div className="meta-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <span className="salary-text">{job.salary}</span>
        </div>
        <div className="meta-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          <span>{job.experience}</span>
        </div>
      </div>

      <p className="job-card-description">
        {job.description ? (
          job.description.length > 130
            ? `${job.description.substring(0, 130)}...`
            : job.description
        ) : 'No description provided.'}
      </p>

      {job.skills && job.skills.length > 0 && (
        <div className="job-skills-list">
          {job.skills.slice(0, 4).map((skill, idx) => (
            <span key={idx} className="skill-chip">
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="skill-chip-more">+{job.skills.length - 4} more</span>
          )}
        </div>
      )}

      <div className="job-card-actions">
        <Link to={`/jobs/${job.id}`} className="btn btn-outline btn-sm">
          View Details
        </Link>
        <button
          type="button"
          onClick={() => onApply && onApply(job)}
          className="btn btn-primary btn-sm"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobCard;
