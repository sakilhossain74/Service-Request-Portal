import { useState } from 'react';

const AssignStaffForm = ({
  staffList,
  currentStaffId = '',
  disabled = false,
  submitting = false,
  onAssign
}) => {
  const [selectedStaffId, setSelectedStaffId] = useState(currentStaffId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedStaffId) return;
    onAssign(selectedStaffId);
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
      <label htmlFor="assign-staff-select" className="form-label small fw-semibold mb-0">
        Assign Staff Member
      </label>
      <div className="input-group">
        <select
          id="assign-staff-select"
          className="form-select"
          value={selectedStaffId}
          onChange={(e) => setSelectedStaffId(e.target.value)}
          disabled={disabled || submitting}
        >
          <option value="">Select staff...</option>
          {staffList.map((staff) => (
            <option key={staff._id} value={staff._id}>
              {staff.name} ({staff.department})
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={disabled || submitting || !selectedStaffId}
        >
          {submitting ? 'Assigning...' : 'Assign'}
        </button>
      </div>
    </form>
  );
};

export default AssignStaffForm;
