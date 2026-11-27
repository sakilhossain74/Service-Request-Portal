const CHART_COLORS = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
  'var(--color-chart-5)',
  'var(--color-chart-6)'
];

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const CategoryDonutChart = ({ byCategory = {}, total = 0 }) => {
  const entries = Object.entries(byCategory);
  const categorySum = entries.reduce((sum, [, count]) => sum + count, 0);
  const effectiveTotal = categorySum > 0 ? categorySum : total;

  let cumulativeOffset = 0;

  return (
    <div className="srp-donut-wrap">
      <div className="srp-donut-chart">
        <svg
          viewBox="0 0 140 140"
          className="srp-donut-svg"
          role="img"
          aria-label={`Breakdown by category donut chart, ${total} total requests`}
        >
          <circle
            cx="70"
            cy="70"
            r={RADIUS}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="18"
          />
          {effectiveTotal > 0 &&
            entries.map(([category, count], idx) => {
              if (count <= 0) return null;
              const fraction = count / effectiveTotal;
              const dashLength = fraction * CIRCUMFERENCE;
              const dashOffset = -cumulativeOffset;
              cumulativeOffset += dashLength;
              const pct = Math.round(fraction * 100);
              const color = CHART_COLORS[idx % CHART_COLORS.length];

              return (
                <circle
                  key={category}
                  cx="70"
                  cy="70"
                  r={RADIUS}
                  fill="none"
                  stroke={color}
                  strokeWidth="18"
                  strokeDasharray={`${dashLength} ${CIRCUMFERENCE}`}
                  strokeDashoffset={dashOffset}
                  transform="rotate(-90 70 70)"
                >
                  <title>{`${category}: ${count} (${pct}%)`}</title>
                </circle>
              );
            })}
        </svg>
        <div className="srp-donut-center">
          <span className="srp-donut-total">{total}</span>
          <span className="srp-donut-label">Total</span>
        </div>
      </div>

      <ul className="srp-donut-legend">
        {entries.map(([category, count], idx) => {
          const color = CHART_COLORS[idx % CHART_COLORS.length];
          return (
            <li key={category} className="srp-donut-legend-item">
              <span className="srp-donut-legend-left">
                <span
                  className="srp-donut-dot"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
                <span className="srp-donut-legend-name">{category}</span>
              </span>
              <span className="srp-donut-legend-count">{count}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CategoryDonutChart;
