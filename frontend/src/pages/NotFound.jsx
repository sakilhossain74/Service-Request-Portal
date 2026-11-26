import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="text-center py-5">
      <h1 className="display-4 fw-bold text-muted">404</h1>
      <p className="lead mb-4">The page you are looking for does not exist.</p>
      <Link to="/dashboard" className="btn btn-primary">
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
