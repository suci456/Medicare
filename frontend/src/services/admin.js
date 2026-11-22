import api from './api';

export const fetchAdminStats = async () => {
  const { data } = await api.get('/admin/stats');
  return data;
};

export const fetchAllUsers = async () => {
  const { data } = await api.get('/admin/users');
  return data;
};

export const deleteUser = async (userId) => {
  const { data } = await api.delete(`/admin/users/${userId}`);
  return data;
};

export const fetchAdminDoctors = async () => {
  const { data } = await api.get('/doctors?includeAll=true');
  return data;
};

export const createDoctor = async (doctorData) => {
  const { data } = await api.post('/doctors', doctorData);
  return data;
};

export const updateDoctor = async (id, doctorData) => {
  const { data } = await api.put(`/doctors/${id}`, doctorData);
  return data;
};

export const updateDoctorStatus = async (id, status) => {
  const { data } = await api.put(`/doctors/${id}/status`, { status });
  return data;
};

export const deleteDoctor = async (id) => {
  const { data } = await api.delete(`/doctors/${id}`);
  return data;
};
