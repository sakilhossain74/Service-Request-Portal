const Pagination = ({ page, pages, total, onPageChange }) => {
  if (pages <= 1) return null;

  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 gap-2">
      <span className="text-muted small">
        Page {page} of {pages} ({total} total)
      </span>
      <nav aria-label="Request list pagination">
        <ul className="pagination pagination-sm mb-0">
          <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
            <button
              type="button"
              className="page-link"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              Previous
            </button>
          </li>
          {Array.from({ length: pages }, (_, idx) => idx + 1).map((pageNum) => (
            <li
              key={pageNum}
              className={`page-item ${pageNum === page ? 'active' : ''}`}
            >
              <button
                type="button"
                className="page-link"
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </button>
            </li>
          ))}
          <li className={`page-item ${page >= pages ? 'disabled' : ''}`}>
            <button
              type="button"
              className="page-link"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= pages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
