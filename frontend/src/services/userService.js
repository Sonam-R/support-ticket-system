import api from '../api/axios.js';

function unwrap(response) {
  return response.data.data;
}

export async function getUsers(params = {}) {
  const response = await api.get('/users', { params });
  return unwrap(response);
}

export async function getUserById(id) {
  const response = await api.get(`/users/${id}`);
  return unwrap(response);
}

export async function createUser(data) {
  const response = await api.post('/users', data);
  return unwrap(response);
}

export async function updateUser(id, data) {
  const response = await api.patch(`/users/${id}`, data);
  return unwrap(response);
}

export async function deleteUser(id) {
  const response = await api.delete(`/users/${id}`);
  return unwrap(response);
}
