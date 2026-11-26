const EmptyState = ({ title = 'No records found', message = '', action = null }) => {
  return (
    <div className="card portal-card p-5 text-center">
      <h5 className="fw-semibold text-dark mb-2">{title}</h5>
      {message && <p className="text-muted mb-3">{message}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
