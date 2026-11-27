import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  UserCheck,
  Users,
  Palette,
  X,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { isAdmin } = useAuth();

  const linkClass = ({ isActive }) =>
    `srp-sidebar-link${isActive ? ' active' : ''}`;

  return (
    <>
      {isOpen && (
        <div
          className="srp-sidebar-backdrop d-lg-none"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`srp-sidebar${isOpen ? ' open' : ''}`}
        aria-label="Main navigation"
      >
        <div className="srp-sidebar-header">
          <div className="d-flex align-items-center gap-2">
            <span className="srp-brand-mark" aria-hidden="true">
              <ShieldCheck size={18} />
            </span>
            <div>
              <div className="srp-brand-title">Service Portal</div>
              <div className="srp-brand-sub">Resolution Suite</div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm srp-sidebar-close d-lg-none"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="srp-sidebar-nav">
          <div className="srp-nav-group">
            <div className="srp-nav-group-label">Workspace</div>
            <NavLink className={linkClass} to="/dashboard" onClick={onClose}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink className={linkClass} to="/requests" end onClick={onClose}>
              <ClipboardList size={18} />
              <span>Requests</span>
            </NavLink>
            <NavLink className={linkClass} to="/requests/new" onClick={onClose}>
              <PlusCircle size={18} />
              <span>New Request</span>
            </NavLink>
          </div>

          {isAdmin && (
            <div className="srp-nav-group">
              <div className="srp-nav-group-label">Administration</div>
              <NavLink className={linkClass} to="/admin/assignments" onClick={onClose}>
                <UserCheck size={18} />
                <span>Assignments</span>
              </NavLink>
              <NavLink className={linkClass} to="/admin/employees" onClick={onClose}>
                <Users size={18} />
                <span>Employees</span>
              </NavLink>
              <NavLink className={linkClass} to="/admin/theme-settings" onClick={onClose}>
                <Palette size={18} />
                <span>Theme Settings</span>
              </NavLink>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
