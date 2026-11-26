// accent prop → custom CSS class (stat-card-{accent}) defined in custom.css
// replaces Bootstrap border-${accent} which used Bootstrap's default colors.
const StatCard = ({ title, value, accent = 'primary', subtitle = '' }) => {
  return (
    <div className={`card stat-card stat-card-${accent} h-100`}>
      <div className="card-body">
        <div className="stat-label">{title}</div>
        <div className="stat-value">{value ?? 0}</div>
        {subtitle && <div className="stat-subtitle">{subtitle}</div>}
      </div>
    </div>
  );
};

export default StatCard;
