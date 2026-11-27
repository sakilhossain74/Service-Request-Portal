export const ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

export const ROLE_LIST = Object.values(ROLES);

export const STATUSES = ['Pending', 'Assigned', 'In Progress', 'Resolved'];

export const PRIORITIES = ['Low', 'Medium', 'High'];

export const CATEGORIES = [
  'Electrical',
  'Plumbing',
  'IT Support',
  'Housekeeping',
  'Furniture',
  'Other'
];

export const STAFF_DEPARTMENTS = [
  'Electrical',
  'Plumbing',
  'IT Support',
  'Housekeeping',
  'General'
];


export const ALLOWED_STATUS_TRANSITIONS = {
  Pending: [],
  Assigned: ['In Progress', 'Resolved'],
  'In Progress': ['Resolved'],
  Resolved: []
};
