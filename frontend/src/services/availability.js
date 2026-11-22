import api from './api';

export const fetchAvailabilityByDoctor = async (doctorId) => {
  const { data } = await api.get(`/availability/doctor/${doctorId}`);
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.availability)) return data.availability;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
};

export const fetchMyAvailability = async () => {
  const { data } = await api.get('/availability/me');
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.availability)) return data.availability;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
};

export const addAvailability = async ({ date, slots, doctorId }) => {
  const { data } = await api.post('/availability', { date, slots, doctorId });
  return data;
};

export const removeAvailabilitySlot = async (param1, param2) => {
  let body = {};
  if (typeof param1 === 'object' && param1 !== null) {
    body = {
      id: param1.id || param1._id,
      date: param1.date,
      slot: param1.slot,
      doctorId: param1.doctorId,
    };
  } else {
    // Called as removeAvailabilitySlot(availId, slot)
    body = { id: param1, slot: param2 };
  }
  const { data } = await api.delete('/availability', { data: body });
  return data;
};
