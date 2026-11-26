import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  assignStaff,
  getRequests,
  updateRequestStatus
} from '../services/requestService';
import { getStaffList } from '../services/staffService';
import useDebounce from '../hooks/useDebounce';
import { ALLOWED_STATUS_TRANSITIONS } from '../utils/constants';
import { extractErrorMessage, formatDate } from '../utils/formatters';
import RequestFilters from '../components/requests/RequestFilters';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import Pagination from '../components/common/Pagination';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

const INITIAL_FILTERS = {
  search: '',
  status: 'Pending',
  category: '',
  priority: ''
};

const AdminAssignment = () => {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const [requests, setRequests] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState({});
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const debouncedSearch = useDebounce(filters.search, 400);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
        ...(filters.status && { status: filters.status }),
        ...(filters.category && { category: filters.category }),
        ...(filters.priority && { priority: filters.priority })
      };

      const [reqRes, staffData] = await Promise.all([
        getRequests(params),
        getStaffList()
      ]);

      const rows = reqRes.data || [];
      setRequests(rows);
      setPagination(reqRes.pagination || { total: 0, page: 1, pages: 1, limit: 10 });
      setStaffList(staffData || []);

      const initialSelections = {};
      rows.forEach((r) => {
        initialSelections[r._id] = r.assignedTo?._id || '';
      });
      setSelectedStaff(initialSelections);
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Failed to load assignment queue'));
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filters.status, filters.category, filters.priority]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ search: '', status: '', category: '', priority: '' });
    setPage(1);
  };

  const handleAssign = async (requestId) => {
    const staffId = selectedStaff[requestId];
    if (!staffId) {
      toast.warning('Please select a staff member first');
      return;
    }

    setBusyId(requestId);
    try {
      await assignStaff(requestId, staffId);
      toast.success('Staff assigned successfully');
      loadData();
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Assignment failed'));
    } finally {
      setBusyId(null);
    }
  };

  const handleStatusChange = async (requestId, nextStatus) => {
    if (!nextStatus) return;
    setBusyId(requestId);
    try {
      await updateRequestStatus(requestId, nextStatus);
      toast.success(`Status updated to ${nextStatus}`);
      loadData();
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Status update failed'));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4 page-header-row">
        <div>
          <h2 className="page-title">Assignments &amp; Workflow</h2>
          <p className="page-subtitle">
            Assign staff members to service requests and advance workflow status
          </p>
        </div>
      </div>

      <RequestFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {loading ? (
        <Loader message="Loading assignment queue..." />
      ) : requests.length === 0 ? (
        <EmptyState
          title="No matching requests"
          message="Try clearing filters to view all requests."
          action={
            <button type="button" className="btn btn-outline-primary" onClick={handleClearFilters}>
              Show All Requests
            </button>
          }
        />
      ) : (
        <>
          <div className="card portal-card">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Request</th>
                    <th>Requester</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th style={{ minWidth: '260px' }}>Assign Staff</th>
                    <th style={{ minWidth: '180px' }}>Advance Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => {
                    const allowedNext = ALLOWED_STATUS_TRANSITIONS[req.status] || [];
                    const isBusy = busyId === req._id;

                    return (
                      <tr key={req._id}>
                        <td>
                          <Link
                            to={`/requests/${req._id}`}
                            className="fw-medium text-decoration-none d-block"
                            style={{ color: 'var(--text-heading)' }}
                          >
                            {req.title}
                          </Link>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                            {req.category} · {formatDate(req.createdAt)}
                          </span>
                        </td>
                        <td>{req.createdBy?.name || '—'}</td>
                        <td>
                          <PriorityBadge priority={req.priority} />
                        </td>
                        <td>
                          <StatusBadge status={req.status} />
                        </td>
                        <td>
                          <div className="input-group input-group-sm">
                            <select
                              className="form-select"
                              value={selectedStaff[req._id] || ''}
                              disabled={req.status === 'Resolved' || isBusy}
                              onChange={(e) =>
                                setSelectedStaff((prev) => ({
                                  ...prev,
                                  [req._id]: e.target.value
                                }))
                              }
                            >
                              <option value="">Select staff…</option>
                              {staffList.map((staff) => (
                                <option key={staff._id} value={staff._id}>
                                  {staff.name} ({staff.department})
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              className="btn btn-primary"
                              disabled={
                                req.status === 'Resolved' ||
                                isBusy ||
                                !selectedStaff[req._id]
                              }
                              onClick={() => handleAssign(req._id)}
                            >
                              {isBusy ? '…' : 'Assign'}
                            </button>
                          </div>
                        </td>
                        <td>
                          {allowedNext.length === 0 ? (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                              {req.status === 'Pending' ? 'Assign staff first' : 'Completed'}
                            </span>
                          ) : (
                            <select
                              className="form-select form-select-sm"
                              defaultValue=""
                              disabled={isBusy}
                              onChange={(e) => handleStatusChange(req._id, e.target.value)}
                            >
                              <option value="" disabled>Move to…</option>
                              {allowedNext.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            page={pagination.page}
            pages={pagination.pages}
            total={pagination.total}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export default AdminAssignment;
