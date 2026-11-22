import api from './api';

export const fetchDoctors = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/doctors?${query}` : '/doctors';
  const { data } = await api.get(url);
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.doctors)) return data.doctors;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
};

export const fetchDoctorById = async (id) => {
  const { data } = await api.get(`/doctors/${id}`);
  return data && typeof data === 'object' ? data : null;
};

export const fetchDepartments = async () => {
  const { data } = await api.get('/doctors/departments');
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.departments)) return data.departments;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
};

export const fetchMyDoctorProfile = async () => {
  const { data } = await api.get('/doctors/me/profile');
  return data && typeof data === 'object' ? data : null;
};

export const updateMyDoctorProfile = async (profileData) => {
  const { data } = await api.put('/doctors/me/profile', profileData);
  return data;
};
