import { isDueSoon, isOverdue } from '../../utils/formatters';

const OverdueBadge = ({ request, showDueSoon = true }) => {
  if (isOverdue(request)) {
    return (
      <span className="badge badge-priority-high" title="Deadline has passed">
        OVERDUE
      </span>
    );
  }

  if (showDueSoon && isDueSoon(request)) {
    return (
      <span className="badge badge-status-pending" title="Due within 48 hours">
        Due soon
      </span>
    );
  }

  return null;
};

export default OverdueBadge;
