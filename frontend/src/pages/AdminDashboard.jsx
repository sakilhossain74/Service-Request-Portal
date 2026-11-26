import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getDashboardStats } from '../services/dashboardService';
import { extractErrorMessage, formatDate } from '../utils/formatters';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        toast.error(extractErrorMessage(error, 'Failed to load admin dashboard'));
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <Loader message="Loading admin dashboard..." />;

  const total = stats?.total ?? 0;
  const byStatus = stats?.byStatus || {};
  const byPriority = stats?.byPriority || {};
  const byCategory = stats?.byCategory || {};

  const getPercentage = (count) => (total > 0 ? Math.round((count / total) * 100) : 0);

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4 page-header-row">
        <div>
          <h2 className="page-title">Admin Dashboard</h2>
          <p className="page-subtitle">System-wide service request metrics and recent activity</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/assignments" className="btn btn-primary">
            Manage Assignments
          </Link>
          <Link to="/requests" className="btn btn-outline-secondary">
            All Requests
          </Link>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-4 col-xl">
          <StatCard title="Total" value={total} accent="dark" />
        </div>
        <div className="col-6 col-md-4 col-xl">
          <StatCard title="Pending" value={byStatus.Pending ?? 0} accent="warning" />
        </div>
        <div className="col-6 col-md-4 col-xl">
          <StatCard title="Assigned" value={byStatus.Assigned ?? 0} accent="info" />
        </div>
        <div className="col-6 col-md-6 col-xl">
          <StatCard title="In Progress" value={byStatus['In Progress'] ?? 0} accent="primary" />
        </div>
        <div className="col-12 col-md-6 col-xl">
          <StatCard title="Resolved" value={byStatus.Resolved ?? 0} accent="success" />
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card portal-card h-100">
            <div className="card-body">
              <h6 className="section-title mb-3">Breakdown by Priority</h6>
              {Object.entries(byPriority).map(([priority, count]) => (
                <div key={priority} className="mb-3">
                  <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.8125rem' }}>
                    <span style={{ color: 'var(--text)' }}>{priority}</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-heading)' }}>{count}</span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div
                      className={`progress-bar ${
                        priority === 'High'
                          ? 'bg-danger'
                          : priority === 'Medium'
                          ? 'bg-warning'
                          : 'bg-secondary'
                      }`}
                      style={{ width: `${getPercentage(count)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card portal-card h-100">
            <div className="card-body">
              <h6 className="section-title mb-3">Breakdown by Category</h6>
              {Object.entries(byCategory).map(([category, count]) => (
                <div key={category} className="mb-2">
                  <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.8125rem' }}>
                    <span style={{ color: 'var(--text)' }}>{category}</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-heading)' }}>{count}</span>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div
                      className="progress-bar bg-primary"
                      style={{ width: `${getPercentage(count)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="section-title">Recent Requests</h5>
        <Link to="/requests" className="btn btn-sm btn-outline-primary">
          View All
        </Link>
      </div>

      {!stats?.recent?.length ? (
        <EmptyState title="No requests in the system yet" />
      ) : (
        <div className="card portal-card">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Requester</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((req) => (
                  <tr key={req._id}>
                    <td>
                      <Link to={`/requests/${req._id}`} className="text-decoration-none fw-medium">
                        {req.title}
                      </Link>
                    </td>
                    <td>{req.createdBy?.name || '—'}</td>
                    <td>
                      <PriorityBadge priority={req.priority} />
                    </td>
                    <td>
                      <StatusBadge status={req.status} />
                    </td>
                    <td>{req.assignedTo?.name || <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Unassigned</span>}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{formatDate(req.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
