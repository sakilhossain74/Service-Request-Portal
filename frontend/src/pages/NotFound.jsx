import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
      <div
        style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'var(--primary-soft)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '1.5rem'
        }}
      >
        <span style={{ fontSize: '2rem', color: 'var(--primary)' }}>404</span>
      </div>
      <h2 className="page-title mb-2">Page Not Found</h2>
      <p className="page-subtitle mb-4">The page you are looking for doesn&apos;t exist or has been moved.</p>
      <Link to="/dashboard" className="btn btn-primary">
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
