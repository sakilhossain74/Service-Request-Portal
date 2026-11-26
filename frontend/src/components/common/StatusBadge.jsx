// Class map uses CSS classes from custom.css — no Bootstrap bg-* colors.
const STATUS_CLASS_MAP = {
  Pending:      'badge-status-pending',
  Assigned:     'badge-status-assigned',
  'In Progress':'badge-status-inprogress',
  Resolved:     'badge-status-resolved',
};

const StatusBadge = ({ status }) => {
  const badgeClass = STATUS_CLASS_MAP[status] || 'badge-status-default';
  return <span className={`badge ${badgeClass}`}>{status}</span>;
};

export default StatusBadge;
