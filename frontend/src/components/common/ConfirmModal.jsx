const ConfirmModal = ({
  show,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  confirmVariant = 'danger',
  loading = false,
  onConfirm,
  onCancel
}) => {
  if (!show) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content border-0 shadow">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                disabled={loading}
                onClick={onCancel}
              />
            </div>
            <div className="modal-body">
              <p className="mb-0 text-secondary">{message}</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                disabled={loading}
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`btn btn-${confirmVariant}`}
                disabled={loading}
                onClick={onConfirm}
              >
                {loading ? 'Please wait...' : confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
};

export default ConfirmModal;
