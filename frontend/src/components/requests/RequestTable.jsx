import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';
import OverdueBadge from '../common/OverdueBadge';
import { formatDate } from '../../utils/formatters';

const RequestTable = ({ requests, isAdmin, onDeleteClick }) => {
  const canModify = (request) => isAdmin || request.status === 'Pending';

  return (
    <>
      {/* Desktop table view */}
      <div className="card portal-card d-none d-md-block">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned To</th>
                {isAdmin && <th>Created By</th>}
                <th>Due Date</th>
                <th>Created</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id}>
                  <td className="fw-medium">
                    <Link to={`/requests/${req._id}`} className="text-decoration-none">
                      {req.title}
                    </Link>
                  </td>
                  <td>{req.category}</td>
                  <td>
                    <PriorityBadge priority={req.priority} />
                  </td>
                  <td>
                    <div className="d-flex flex-wrap align-items-center gap-1">
                      <StatusBadge status={req.status} />
                      <OverdueBadge request={req} />
                    </div>
                  </td>
                  <td>
                    {req.assignedTo ? (
                      <span>{req.assignedTo.name}</span>
                    ) : (
                      <span className="text-muted small">Unassigned</span>
                    )}
                  </td>
                  {isAdmin && (
                    <td>
                      <div>{req.createdBy?.name || '—'}</div>
                      <small className="text-muted">
                        {req.createdBy?.email || '—'}
                      </small>
                    </td>
                  )}
                  <td className="text-muted small">
                    {req.dueDate ? formatDate(req.dueDate) : '—'}
                  </td>
                  <td className="text-muted small">{formatDate(req.createdAt)}</td>
                  <td className="text-end">
                    <div className="btn-group btn-group-sm">
                      <Link
                        to={`/requests/${req._id}`}
                        className="btn btn-outline-primary"
                      >
                        View
                      </Link>
                      {canModify(req) && (
                        <>
                          <Link
                            to={`/requests/${req._id}/edit`}
                            className="btn btn-outline-secondary"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => onDeleteClick(req)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile card view */}
      <div className="d-md-none d-flex flex-column gap-3">
        {requests.map((req) => (
          <div key={req._id} className="card portal-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                <Link
                  to={`/requests/${req._id}`}
                  className="fw-semibold text-decoration-none text-dark"
                >
                  {req.title}
                </Link>
                <div className="d-flex flex-wrap align-items-center gap-1">
                  <StatusBadge status={req.status} />
                  <OverdueBadge request={req} />
                </div>
              </div>
              <div className="d-flex flex-wrap gap-2 mb-2 small text-muted">
                <span>{req.category}</span>
                <span>•</span>
                <PriorityBadge priority={req.priority} />
                <span>•</span>
                <span>{formatDate(req.createdAt)}</span>
              </div>
              <div className="small text-muted mb-3">
                Assigned: {req.assignedTo ? req.assignedTo.name : 'Unassigned'}
                {req.dueDate && (
                  <>
                    <br />
                    Due: {formatDate(req.dueDate)}
                  </>
                )}
                {isAdmin && (
                  <div>
                    Customer: {req.createdBy?.name || '—'}
                    <br />
                    Email: {req.createdBy?.email || '—'}
                  </div>
                )}
              </div>
              <div className="d-flex gap-2">
                <Link to={`/requests/${req._id}`} className="btn btn-sm btn-outline-primary">
                  View
                </Link>
                {canModify(req) && (
                  <>
                    <Link
                      to={`/requests/${req._id}/edit`}
                      className="btn btn-sm btn-outline-secondary"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDeleteClick(req)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default RequestTable;
