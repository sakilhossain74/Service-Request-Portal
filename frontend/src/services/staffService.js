import api from '../api/axios';

export const getStaffList = async () => {
  const { data } = await api.get('/staff');
  return data.data;
};
