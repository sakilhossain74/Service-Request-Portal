const Loader = ({ message = 'Loading...', fullPage = false }) => {
  return (
    <div
      className={`d-flex flex-column align-items-center justify-content-center ${
        fullPage ? 'min-vh-100' : 'py-5'
      }`}
    >
      <div className="spinner-border text-primary mb-2" role="status" style={{ width: '2rem', height: '2rem' }}>
        <span className="visually-hidden">{message}</span>
      </div>
      <span className="text-muted" style={{ fontSize: '0.875rem' }}>{message}</span>
    </div>
  );
};

export default Loader;
