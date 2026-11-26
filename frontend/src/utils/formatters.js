export const formatDate = (dateValue) => {
  if (!dateValue) return '—';
  return new Date(dateValue).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (dateValue) => {
  if (!dateValue) return '—';
  return new Date(dateValue).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const extractErrorMessage = (error, fallback = 'Something went wrong') => {
  return error?.response?.data?.message || error?.message || fallback;
};
