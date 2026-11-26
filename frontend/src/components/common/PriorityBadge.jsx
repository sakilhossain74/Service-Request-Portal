// Class map uses CSS classes from custom.css — no Bootstrap bg-* colors.
const PRIORITY_CLASS_MAP = {
  Low:    'badge-priority-low',
  Medium: 'badge-priority-medium',
  High:   'badge-priority-high',
};

const PriorityBadge = ({ priority }) => {
  const badgeClass = PRIORITY_CLASS_MAP[priority] || 'badge-priority-low';
  return <span className={`badge ${badgeClass}`}>{priority}</span>;
};

export default PriorityBadge;
