import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createRequest } from '../services/requestService';
import { extractErrorMessage } from '../utils/formatters';
import RequestForm from '../components/requests/RequestForm';

const CreateRequest = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      const created = await createRequest(payload);
      toast.success('Service request submitted successfully');
      navigate(`/requests/${created._id}`);
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Failed to create request'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="page-title mb-0">Create Service Request</h2>
          </div>
          <Link to="/requests" className="btn btn-outline-secondary btn-sm">
            ← Back to List
          </Link>
        </div>

        <div className="card portal-card">
          <div className="card-body p-4">
            <RequestForm
              onSubmit={handleSubmit}
              submitting={submitting}
              submitLabel="Submit Request"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRequest;
