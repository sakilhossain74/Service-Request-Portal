import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { deleteRequest, getRequests } from '../services/requestService';
import useDebounce from '../hooks/useDebounce';
import { extractErrorMessage } from '../utils/formatters';
import RequestFilters from '../components/requests/RequestFilters';
import RequestTable from '../components/requests/RequestTable';
import Pagination from '../components/common/Pagination';
import ConfirmModal from '../components/common/ConfirmModal';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

const INITIAL_FILTERS = {
  search: '',
  status: '',
  category: '',
  priority: ''
};

const RequestList = () => {
  const { isAdmin } = useAuth();
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: 10 });
  const [loading, setLoading] = useState(true);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(filters.search, 400);

  const loadRequests = useCallback(async () => {
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
      const res = await getRequests(params);
      setRequests(res.data || []);
      setPagination(res.pagination || { total: 0, page: 1, pages: 1, limit: 10 });
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Failed to load requests'));
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filters.status, filters.category, filters.priority]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS);
    setPage(1);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteRequest(deleteTarget._id);
      toast.success('Service request deleted');
      setDeleteTarget(null);
      loadRequests();
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Failed to delete request'));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4 page-header-row">
        <div>
          <h2 className="page-title">
            {isAdmin ? 'All Service Requests' : 'My Service Requests'}
          </h2>
          <p className="page-subtitle">Search, filter, and manage service requests</p>
        </div>
        <Link to="/requests/new" className="btn btn-primary">
          + New Request
        </Link>
      </div>

      <RequestFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {loading ? (
        <Loader message="Loading requests..." />
      ) : requests.length === 0 ? (
        <EmptyState
          title="No requests found"
          message="Try adjusting your search or filter criteria, or create a new request."
          action={
            <Link to="/requests/new" className="btn btn-primary">
              Create Request
            </Link>
          }
        />
      ) : (
        <>
          <RequestTable
            requests={requests}
            isAdmin={isAdmin}
            onDeleteClick={setDeleteTarget}
          />
          <Pagination
            page={pagination.page}
            pages={pagination.pages}
            total={pagination.total}
            onPageChange={setPage}
          />
        </>
      )}

      <ConfirmModal
        show={Boolean(deleteTarget)}
        title="Delete Service Request"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default RequestList;
