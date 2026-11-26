const PRIORITY_CLASS_MAP = {
  Low: 'bg-secondary text-white',
  Medium: 'bg-warning text-dark',
  High: 'bg-danger text-white'
};

const PriorityBadge = ({ priority }) => {
  const badgeClass = PRIORITY_CLASS_MAP[priority] || 'bg-secondary text-white';
  return <span className={`badge ${badgeClass}`}>{priority}</span>;
};

export default PriorityBadge;
