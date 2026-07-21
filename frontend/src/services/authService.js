import api from '../api/axios.js';

export async function login(email, password) {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get('/auth/me');
  return response.data.data;
}

export async function logout() {
  try {
    await api.post('/auth/logout');
  } catch {
    // Token may already be invalid; still clear local storage.
  }
}
