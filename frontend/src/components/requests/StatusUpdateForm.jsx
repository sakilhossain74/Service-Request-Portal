import { useEffect, useState } from 'react';
import { ALLOWED_STATUS_TRANSITIONS } from '../../utils/constants';

const StatusUpdateForm = ({
  currentStatus,
  hasAssignedStaff,
  submitting = false,
  onUpdateStatus
}) => {
  const allowedNext = ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];
  const [nextStatus, setNextStatus] = useState(allowedNext[0] || '');

  useEffect(() => {
    const nextOptions = ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];
    setNextStatus(nextOptions[0] || '');
  }, [currentStatus]);

  if (!hasAssignedStaff && currentStatus === 'Pending') {
    return (
      <div className="alert alert-light border small mb-0">
        Assign a staff member first to move this request to <strong>Assigned</strong>.
      </div>
    );
  }

  if (allowedNext.length === 0) {
    return (
      <div className="alert alert-success small mb-0">
        This request is <strong>{currentStatus}</strong>. No further status transitions are available.
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nextStatus) return;
    onUpdateStatus(nextStatus);
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
      <label htmlFor="status-update-select" className="form-label small fw-semibold mb-0">
        Advance Workflow Status
      </label>
      <div className="input-group">
        <select
          id="status-update-select"
          className="form-select"
          value={nextStatus}
          onChange={(e) => setNextStatus(e.target.value)}
          disabled={submitting}
        >
          {allowedNext.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-success" disabled={submitting || !nextStatus}>
          {submitting ? 'Updating...' : 'Update Status'}
        </button>
      </div>
    </form>
  );
};

export default StatusUpdateForm;
