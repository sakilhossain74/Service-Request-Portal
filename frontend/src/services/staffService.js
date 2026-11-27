
import api from '../api/axios';

// Get active employees
export const getStaffList = async () => {
  const { data } = await api.get('/staff');
  return data.data;
};

// Get all employees (active and inactive)
export const getAllStaff = async () => {
  const { data } = await api.get('/staff/all');
  return data.data;
};

// Add a new employee
export const createStaff = async (staffData) => {
  const { data } = await api.post('/staff', staffData);
  return data.data;
};

// Deactivate an employee
export const deactivateStaff = async (staffId) => {
  const { data } = await api.patch(`/staff/${staffId}/deactivate`);
  return data.data;
};

// Reactivate an employee
export const reactivateStaff = async (staffId) => {
  const { data } = await api.patch(`/staff/${staffId}/reactivate`);
  return data.data;
};
