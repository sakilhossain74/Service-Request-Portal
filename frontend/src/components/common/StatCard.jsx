const StatCard = ({ title, value, accent = 'primary', subtitle = '' }) => {
  return (
    <div className={`card stat-card border-start border-4 border-${accent} h-100`}>
      <div className="card-body">
        <div className="text-muted small text-uppercase fw-semibold mb-1">{title}</div>
        <div className="fs-2 fw-bold text-dark">{value ?? 0}</div>
        {subtitle && <div className="small text-muted mt-1">{subtitle}</div>}
      </div>
    </div>
  );
};

export default StatCard;
