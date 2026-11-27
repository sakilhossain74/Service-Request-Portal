import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getRequestById, updateRequest } from '../services/requestService';
import { extractErrorMessage } from '../utils/formatters';
import RequestForm from '../components/requests/RequestForm';
import Loader from '../components/common/Loader';
import useReveal from '../hooks/useReveal';

const EditRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const cardRef = useReveal({ direction: 'up', delay: 60 });

  useEffect(() => {
    const loadRequest = async () => {
      try {
        const data = await getRequestById(id);
        setRequest(data);
      } catch (error) {
        toast.error(extractErrorMessage(error, 'Failed to load request'));
        navigate('/requests');
      } finally {
        setLoading(false);
      }
    };
    loadRequest();
  }, [id, navigate]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      await updateRequest(id, payload);
      toast.success('Service request updated successfully');
      navigate(`/requests/${id}`);
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Failed to update request'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader message="Loading request..." />;

  const canEdit = isAdmin || request?.status === 'Pending';

  return (
    <div className="row justify-content-center page-fade-in">
      <div className="col-lg-8">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="page-title mb-0">Edit Service Request</h2>
          <Link to={`/requests/${id}`} className="btn btn-outline-secondary btn-sm">
            ← Back to Details
          </Link>
        </div>

        {!canEdit ? (
          <div className="alert-warning-custom">
            This request is currently <strong>{request?.status}</strong>. Only{' '}
            <strong>Pending</strong> requests can be edited by the requester.
          </div>
        ) : (
          <div ref={cardRef} className="card portal-card">
            <div className="card-body p-4">
              <RequestForm
                initialValues={{
                  title: request.title,
                  description: request.description,
                  category: request.category,
                  priority: request.priority
                }}
                onSubmit={handleSubmit}
                submitting={submitting}
                submitLabel="Save Changes"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditRequest;
