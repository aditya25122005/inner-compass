import API from './api';

export const signup = (payload) => API.post('/auth/signup', payload);
export const login = (payload) => API.post('/auth/login', payload);
export const getMe = () => API.get('/auth/me');
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

