import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import {
  assignStaff,
  deleteRequest,
  getRequestById,
  updateRequestStatus
} from '../services/requestService';
import { getStaffList } from '../services/staffService';
import { extractErrorMessage, formatDateTime } from '../utils/formatters';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import AssignStaffForm from '../components/requests/AssignStaffForm';
import StatusUpdateForm from '../components/requests/StatusUpdateForm';
import ConfirmModal from '../components/common/ConfirmModal';
import Loader from '../components/common/Loader';

const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [request, setRequest] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const reqData = await getRequestById(id);
      setRequest(reqData);

      if (isAdmin) {
        const staffData = await getStaffList();
        setStaffList(staffData);
      }
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Failed to load request details'));
      navigate('/requests');
    } finally {
      setLoading(false);
    }
  }, [id, isAdmin, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAssign = async (staffId) => {
    setActionLoading(true);
    try {
      const updated = await assignStaff(id, staffId);
      setRequest(updated);
      toast.success('Staff member assigned successfully');
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Failed to assign staff'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setActionLoading(true);
    try {
      const updated = await updateRequestStatus(id, newStatus);
      setRequest(updated);
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Failed to update status'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await deleteRequest(id);
      toast.success('Service request deleted');
      navigate('/requests');
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Failed to delete request'));
      setActionLoading(false);
    }
  };

  if (loading) return <Loader message="Loading request details..." />;
  if (!request) return null;

  const canModify = isAdmin || request.status === 'Pending';

  return (
    <div>
      {/* Top action bar */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <Link to="/requests" className="btn btn-outline-secondary btn-sm">
          ← Back to Requests
        </Link>
        {canModify && (
          <div className="d-flex gap-2">
            <Link to={`/requests/${request._id}/edit`} className="btn btn-outline-primary btn-sm">
              Edit Request
            </Link>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Request
            </button>
          </div>
        )}
      </div>

      <div className="row g-4">
        {/* Main detail card */}
        <div className="col-lg-8">
          <div className="card portal-card">
            <div className="card-body p-4">
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
                <h3 className="fw-bold mb-0" style={{ color: 'var(--text-heading)', fontSize: '1.25rem' }}>
                  {request.title}
                </h3>
                <div className="d-flex gap-2">
                  <PriorityBadge priority={request.priority} />
                  <StatusBadge status={request.status} />
                </div>
              </div>

              <div className="mb-4">
                <span className="detail-label">Description</span>
                <p className="mb-0" style={{ whiteSpace: 'pre-line', color: 'var(--text)', lineHeight: 1.6 }}>
                  {request.description}
                </p>
              </div>

              <hr style={{ borderColor: 'var(--border)', margin: '1.25rem 0' }} />

              <div className="row g-3">
                {[
                  { label: 'Category', value: request.category },
                  {
                    label: 'Submitted By',
                    value: `${request.createdBy?.name} (${request.createdBy?.email})`
                  },
                  {
                    label: 'Assigned Staff',
                    value: request.assignedTo
                      ? `${request.assignedTo.name} — ${request.assignedTo.department}`
                      : 'Unassigned'
                  },
                  { label: 'Created At',   value: formatDateTime(request.createdAt) },
                  { label: 'Assigned At',  value: formatDateTime(request.assignedAt) },
                  { label: 'Resolved At',  value: formatDateTime(request.resolvedAt) },
                ].map(({ label, value }) => (
                  <div className="col-sm-6" key={label}>
                    <span className="detail-label">{label}</span>
                    <span className="detail-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Admin controls panel */}
        {isAdmin && (
          <div className="col-lg-4">
            <div className="admin-panel">
              <div className="admin-panel-header">Admin Controls</div>
              <div className="admin-panel-body">
                <AssignStaffForm
                  staffList={staffList}
                  currentStaffId={request.assignedTo?._id || ''}
                  disabled={request.status === 'Resolved'}
                  submitting={actionLoading}
                  onAssign={handleAssign}
                />
                <hr style={{ borderColor: 'var(--border)', margin: '0' }} />
                <StatusUpdateForm
                  currentStatus={request.status}
                  hasAssignedStaff={Boolean(request.assignedTo)}
                  submitting={actionLoading}
                  onUpdateStatus={handleStatusUpdate}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        show={showDeleteModal}
        title="Delete Service Request"
        message={`Are you sure you want to delete "${request.title}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={actionLoading}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default RequestDetails;
