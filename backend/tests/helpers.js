const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/config/prisma');

async function cleanDatabase() {
  await prisma.comment.deleteMany();
  await prisma.ticketHistory.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();
}

async function createTestUser(overrides = {}) {
  const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return prisma.user.create({
    data: {
      name: overrides.name || 'Test User',
      email: overrides.email || `test-${uniqueId}@example.com`,
      role: overrides.role || 'CUSTOMER',
    },
  });
}

async function createTestAgent() {
  return createTestUser({
    name: 'Test Agent',
    role: 'AGENT',
    email: `agent-${Date.now()}@example.com`,
  });
}

function api() {
  return request(app);
}

async function createTicketViaApi(createdById, overrides = {}) {
  const payload = {
    title: 'Payment issue report',
    description: 'Customer payment failed during checkout',
    priority: 'HIGH',
    category: 'BILLING',
    createdById,
    ...overrides,
  };

  const response = await api().post('/api/tickets').send(payload);
  return response;
}

async function changeTicketStatusViaApi(ticketId, status) {
  return api().patch(`/api/tickets/${ticketId}/status`).send({ status });
}

module.exports = {
  api,
  prisma,
  cleanDatabase,
  createTestUser,
  createTestAgent,
  createTicketViaApi,
  changeTicketStatusViaApi,
};
