import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Layers, Clock, UserCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { getDashboardStats } from '../services/dashboardService';
import { extractErrorMessage, formatDate } from '../utils/formatters';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import OverdueBadge from '../components/common/OverdueBadge';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import useReveal from '../hooks/useReveal';
import useStaggerReveal from '../hooks/useStaggerReveal';

const UserDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const statRowRef    = useStaggerReveal({ direction: 'up', baseDelay: 60, stagger: 80 });
  const recentCardRef = useReveal({ direction: 'up', delay: 80 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        toast.error(extractErrorMessage(error, 'Failed to load dashboard'));
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <Loader message="Loading your dashboard..." />;

  const byStatus = stats?.byStatus || {};

  return (
    <div className="page-fade-in">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4 page-header-row">
        <div>
          <h2 className="page-title">My Dashboard</h2>
          <p className="page-subtitle">Overview of your submitted service requests</p>
        </div>
        <Link to="/requests/new" className="btn btn-primary">
          + Create Request
        </Link>
      </div>

      <div ref={statRowRef} className="row g-3 mb-4">
        <div className="col-6 col-md-4 col-xl">
          <StatCard title="Total" value={stats?.total ?? 0} accent="dark" icon={Layers} />
        </div>
        <div className="col-6 col-md-4 col-xl">
          <StatCard title="Pending" value={byStatus.Pending ?? 0} accent="warning" icon={Clock} />
        </div>
        <div className="col-6 col-md-4 col-xl">
          <StatCard title="Assigned" value={byStatus.Assigned ?? 0} accent="info" icon={UserCheck} />
        </div>
        <div className="col-6 col-md-6 col-xl">
          <StatCard title="In Progress" value={byStatus['In Progress'] ?? 0} accent="primary" icon={Loader2} />
        </div>
        <div className="col-12 col-md-6 col-xl">
          <StatCard title="Resolved" value={byStatus.Resolved ?? 0} accent="success" icon={CheckCircle2} />
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="section-title">Recent Requests</h5>
        <Link to="/requests" className="btn btn-sm btn-outline-primary">
          View All
        </Link>
      </div>

      {!stats?.recent?.length ? (
        <EmptyState
          title="No requests submitted yet"
          message="Create your first service request to get started."
          action={
            <Link to="/requests/new" className="btn btn-primary">
              Create Request
            </Link>
          }
        />
      ) : (
        <div ref={recentCardRef} className="card portal-card">
          <div className="table-responsive dashboard-table-scroll">
            <table className="table table-hover align-middle mb-0 dashboard-recent-table dashboard-recent-table-user">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
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
                    <td>{req.category}</td>
                    <td>
                      <PriorityBadge priority={req.priority} />
                    </td>
                    <td>
                      <div className="d-flex flex-wrap align-items-center gap-1">
                        <StatusBadge status={req.status} />
                        <OverdueBadge request={req} />
                      </div>
                    </td>
                    <td className="text-muted" style={{ fontSize: '0.8rem' }}>{formatDate(req.createdAt)}</td>
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

export default UserDashboard;
