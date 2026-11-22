import api from './api';

// Register does NOT automatically store authentication tokens.
// Users must log in manually using their newly created credentials.
export const register = async (userData) => {
  const { data } = await api.post('/auth/register', userData);
  return data;
};

export const login = async ({ email, password }) => {
  const { data } = await api.post('/auth/login', { email, password });
  if (data.token) {
    localStorage.setItem('medicare_token', data.token);
    localStorage.setItem('medicare_user', JSON.stringify({
      _id: data._id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      doctorStatus: data.doctorStatus,
      doctorId: data.doctorId,
    }));
  }
  return data;
};

export const logout = () => {
  localStorage.removeItem('medicare_token');
  localStorage.removeItem('medicare_user');
  localStorage.removeItem('token');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('medicare_user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      // fallback
    }
  }

  const token = localStorage.getItem('medicare_token') || localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (e) {
    return null;
  }
};
