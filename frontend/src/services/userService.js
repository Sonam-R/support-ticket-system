import api from '../api/axios.js';

function unwrap(response) {
  return response.data.data;
}

export async function getUsers(params = {}) {
  const response = await api.get('/users', { params });
  return unwrap(response);
}
