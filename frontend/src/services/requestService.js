import api from '../api/axios';

export const getRequests = async (params) => {
  const { data } = await api.get('/requests', { params });
  return data;
};

export const getRequestById = async (id) => {
  const { data } = await api.get(`/requests/${id}`);
  return data.data;
};

export const createRequest = async (payload) => {
  const { data } = await api.post('/requests', payload);
  return data.data;
};

export const updateRequest = async (id, payload) => {
  const { data } = await api.put(`/requests/${id}`, payload);
  return data.data;
};

export const deleteRequest = async (id) => {
  const { data } = await api.delete(`/requests/${id}`);
  return data;
};

export const assignStaff = async (id, staffId) => {
  const { data } = await api.patch(`/requests/${id}/assign`, { staffId });
  return data.data;
};

export const updateRequestStatus = async (id, status) => {
  const { data } = await api.patch(`/requests/${id}/status`, { status });
  return data.data;
};
