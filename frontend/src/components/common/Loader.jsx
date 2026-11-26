const Loader = ({ message = 'Loading...', fullPage = false }) => {
  return (
    <div
      className={`d-flex flex-column align-items-center justify-content-center ${
        fullPage ? 'min-vh-100' : 'py-5'
      }`}
    >
      <div className="spinner-border text-primary mb-2" role="status">
        <span className="visually-hidden">{message}</span>
      </div>
      <span className="text-muted small">{message}</span>
    </div>
  );
};

export default Loader;
