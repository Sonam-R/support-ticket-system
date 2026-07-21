const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/config/prisma');

const VALID_UUID = '00000000-0000-0000-0000-000000000001';

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
      role: overrides.role || 'VIEWER',
    },
  });
}

async function createTestAgent() {
  return createTestUser({
    name: 'Test Agent',
    role: 'SUPPORT_AGENT',
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
  VALID_UUID,
  api,
  prisma,
  cleanDatabase,
  createTestUser,
  createTestAgent,
  createTicketViaApi,
  changeTicketStatusViaApi,
};
