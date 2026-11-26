const EmptyState = ({ title = 'No records found', message = '', action = null }) => {
  return (
    <div className="card portal-card empty-state">
      <div className="empty-state-title">{title}</div>
      {message && <p className="empty-state-desc">{message}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
