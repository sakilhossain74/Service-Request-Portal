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

export const getTodayDateInputValue = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const toDateInputValue = (dateValue) => {
  if (!dateValue) return '';
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
};

export const isOverdue = (request) => {
  if (!request?.dueDate || request.status === 'Resolved') {
    return false;
  }
  if (typeof request.isOverdue === 'boolean') {
    return request.isOverdue;
  }
  return new Date(request.dueDate) < new Date();
};

export const isDueSoon = (request) => {
  if (!request?.dueDate || request.status === 'Resolved' || isOverdue(request)) {
    return false;
  }
  const diffMs = new Date(request.dueDate).getTime() - Date.now();
  return diffMs >= 0 && diffMs <= 48 * 60 * 60 * 1000;
};

export const extractErrorMessage = (error, fallback = 'Something went wrong') => {
  return error?.response?.data?.message || error?.message || fallback;
};
