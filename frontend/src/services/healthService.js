import apiClient from '../api/client.js';

export async function checkHealth() {
  const response = await apiClient.get('/health');
  return response.data;
}
