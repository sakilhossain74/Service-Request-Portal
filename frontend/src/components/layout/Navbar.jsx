import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('You have been logged out');
    navigate('/login');
  };

  return (
    <header className="srp-navbar">
      <div className="d-flex align-items-center gap-3">
        <button
          type="button"
          className="btn btn-sm srp-menu-toggle d-lg-none"
          onClick={onToggleSidebar}
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>
        <Link className="srp-navbar-title d-lg-none" to="/dashboard">
          Service Portal
        </Link>
        <span className="srp-navbar-env d-none d-lg-inline-block">
          Service Request &amp; Resolution Portal
        </span>
      </div>

      <div className="d-flex align-items-center gap-3">
        <div className="d-flex align-items-center gap-2">
          <span className="srp-avatar" aria-hidden="true">
            {getInitials(user?.name)}
          </span>
          <div className="d-none d-sm-flex flex-column lh-sm">
            <span className="nav-user-name">{user?.name}</span>
            <span className="nav-role-badge">{user?.role}</span>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-sm srp-logout-btn"
          onClick={handleLogout}
        >
          <LogOut size={15} />
          <span className="d-none d-sm-inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
