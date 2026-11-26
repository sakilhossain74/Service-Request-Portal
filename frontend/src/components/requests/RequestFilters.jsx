import { CATEGORIES, PRIORITIES, STATUSES } from '../../utils/constants';

const RequestFilters = ({ filters, onFilterChange, onClear }) => {
  const hasActiveFilters =
    filters.search || filters.status || filters.category || filters.priority;

  return (
    <div className="card portal-card mb-3">
      <div className="card-body">
        <div className="row g-2 align-items-end">
          <div className="col-12 col-md-4">
            <label htmlFor="filter-search" className="form-label small fw-semibold text-muted">
              Search by Title
            </label>
            <input
              id="filter-search"
              type="text"
              className="form-control"
              placeholder="Search request title..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
            />
          </div>

          <div className="col-6 col-md-2">
            <label htmlFor="filter-status" className="form-label small fw-semibold text-muted">
              Status
            </label>
            <select
              id="filter-status"
              className="form-select"
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
            >
              <option value="">All</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="col-6 col-md-2">
            <label htmlFor="filter-category" className="form-label small fw-semibold text-muted">
              Category
            </label>
            <select
              id="filter-category"
              className="form-select"
              value={filters.category}
              onChange={(e) => onFilterChange('category', e.target.value)}
            >
              <option value="">All</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="col-6 col-md-2">
            <label htmlFor="filter-priority" className="form-label small fw-semibold text-muted">
              Priority
            </label>
            <select
              id="filter-priority"
              className="form-select"
              value={filters.priority}
              onChange={(e) => onFilterChange('priority', e.target.value)}
            >
              <option value="">All</option>
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>

          <div className="col-6 col-md-2 d-grid">
            <button
              type="button"
              className="btn btn-outline-secondary"
              disabled={!hasActiveFilters}
              onClick={onClear}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestFilters;
