const STATUS_CLASS_MAP = {
  Pending: 'bg-warning text-dark',
  Assigned: 'bg-info text-dark',
  'In Progress': 'bg-primary text-white',
  Resolved: 'bg-success text-white'
};

const StatusBadge = ({ status }) => {
  const badgeClass = STATUS_CLASS_MAP[status] || 'bg-secondary text-white';
  return <span className={`badge ${badgeClass}`}>{status}</span>;
};

export default StatusBadge;
