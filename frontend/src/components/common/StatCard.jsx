const StatCard = ({ title, value, accent = 'primary', subtitle = '', icon: Icon = null }) => {
  return (
    <div className={`card stat-card stat-card-${accent} h-100`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <div>
            <div className="stat-label">{title}</div>
            <div className="stat-value">{value ?? 0}</div>
          </div>
          {Icon && (
            <span
              className="d-inline-flex align-items-center justify-content-center rounded-3 p-2"
              style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-secondary)' }}
              aria-hidden="true"
            >
              <Icon size={18} />
            </span>
          )}
        </div>
        {subtitle && <div className="stat-subtitle">{subtitle}</div>}
      </div>
    </div>
  );
};

export default StatCard;
