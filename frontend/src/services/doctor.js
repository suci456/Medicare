import api from './api';

export const fetchDoctors = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/doctors?${query}` : '/doctors';
  const { data } = await api.get(url);
  return data;
};

export const fetchDoctorById = async (id) => {
  const { data } = await api.get(`/doctors/${id}`);
  return data;
};

export const fetchDepartments = async () => {
  const { data } = await api.get('/doctors/departments');
  return data;
};

export const fetchMyDoctorProfile = async () => {
  const { data } = await api.get('/doctors/me/profile');
  return data;
};

export const updateMyDoctorProfile = async (profileData) => {
  const { data } = await api.put('/doctors/me/profile', profileData);
  return data;
};
