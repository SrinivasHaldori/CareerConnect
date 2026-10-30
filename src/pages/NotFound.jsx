import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        <span style={{ fontSize: '4.5rem', fontWeight: 800, color: 'var(--navy-primary)', display: 'block', lineHeight: 1 }}>
          404
        </span>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--navy-primary)', margin: '16px 0 10px 0' }}>
          Page Not Found
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
