import api from '../api/axios.js';

function unwrap(response) {
  return response.data.data;
}

export async function getTickets(params = {}) {
  const response = await api.get('/tickets', { params });
  return unwrap(response);
}

export async function getTicketById(id) {
  const response = await api.get(`/tickets/${id}`);
  return unwrap(response);
}

export async function createTicket(data) {
  const response = await api.post('/tickets', data);
  return unwrap(response);
}

export async function updateTicket(id, data) {
  const response = await api.put(`/tickets/${id}`, data);
  return unwrap(response);
}

export async function changeTicketStatus(id, status) {
  const response = await api.patch(`/tickets/${id}/status`, { status });
  return unwrap(response);
}

export async function deleteTicket(id) {
  const response = await api.delete(`/tickets/${id}`);
  return unwrap(response);
}

export async function addComment(ticketId, data) {
  const response = await api.post(`/tickets/${ticketId}/comments`, data);
  return unwrap(response);
}

export async function getComments(ticketId) {
  const response = await api.get(`/tickets/${ticketId}/comments`);
  return unwrap(response);
}
