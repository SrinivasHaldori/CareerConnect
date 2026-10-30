import './AlertMessage.css';

const AlertMessage = ({ type = 'info', message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className={`alert-banner alert-${type}`} role="alert">
      <div className="alert-content">
        {type === 'error' && (
          <svg className="alert-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        )}
        {type === 'success' && (
          <svg className="alert-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        )}
        {type === 'info' && (
          <svg className="alert-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        )}
        <span className="alert-text">{message}</span>
      </div>
      {onDismiss && (
        <button className="alert-close" onClick={onDismiss} aria-label="Dismiss alert">
          &times;
        </button>
      )}
    </div>
  );
};

export default AlertMessage;
