import { Link, NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('You have been logged out');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-portal shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/dashboard">
          Service Portal
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#portalNavbar"
          aria-controls="portalNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="portalNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/dashboard">
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/requests">
                Requests
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/requests/new">
                New Request
              </NavLink>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin/assignments">
                  Assignments
                </NavLink>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3 text-white">
            <span className="small">
              {user?.name}{' '}
              <span className="badge bg-light text-dark text-uppercase ms-1">
                {user?.role}
              </span>
            </span>
            <button
              type="button"
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
