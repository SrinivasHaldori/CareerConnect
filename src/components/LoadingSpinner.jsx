import './LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Loading data...' }) => {
  return (
    <div className="spinner-container" role="status" aria-live="polite">
      <div className="spinner-ring"></div>
      <p className="spinner-text">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
