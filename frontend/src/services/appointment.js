import api from './api';

export const bookAppointment = async ({
  doctorId,
  date,
  timeSlot,
  slot,
  reason,
  patientName,
  patientEmail,
  patientPhone,
}) => {
  const chosenSlot = (timeSlot || slot || '').trim();
  const { data } = await api.post('/appointments', {
    doctorId,
    date,
    timeSlot: chosenSlot,
    slot: chosenSlot,
    reason,
    patientName,
    patientEmail,
    patientPhone,
  });
  return data;
};

export const fetchMyAppointments = async () => {
  const { data } = await api.get('/appointments/my');
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.appointments)) return data.appointments;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
};

export const fetchDoctorAppointments = async () => {
  const { data } = await api.get('/appointments/doctor');
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.appointments)) return data.appointments;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
};

export const updateAppointmentStatus = async (id, status) => {
  const { data } = await api.put(`/appointments/${id}`, { status });
  return data;
};

export const cancelAppointment = async (id) => {
  const { data } = await api.delete(`/appointments/${id}`);
  return data;
};

export const fetchAllAppointments = async () => {
  const { data } = await api.get('/appointments');
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.appointments)) return data.appointments;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
};
