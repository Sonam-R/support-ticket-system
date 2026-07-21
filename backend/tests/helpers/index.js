const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../../src/app');
const prisma = require('../../src/config/prisma');

const VALID_UUID = '00000000-0000-0000-0000-000000000001';
const TEST_PASSWORD = 'Password123';

async function cleanDatabase() {
  await prisma.comment.deleteMany();
  await prisma.ticketHistory.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();
}

async function createTestUser(overrides = {}) {
  const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const password = overrides.password || TEST_PASSWORD;
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      name: overrides.name || 'Test User',
      email: overrides.email || `test-${uniqueId}@example.com`,
      role: overrides.role || 'VIEWER',
      password: hashedPassword,
      isActive: overrides.isActive !== undefined ? overrides.isActive : true,
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

async function createTestAdmin() {
  return createTestUser({
    name: 'Test Admin',
    role: 'ADMIN',
    email: `admin-${Date.now()}@example.com`,
  });
}

function api() {
  return request(app);
}

function withAuth(token) {
  const agent = request(app);
  return {
    get: (url) => agent.get(url).set('Authorization', `Bearer ${token}`),
    post: (url) => agent.post(url).set('Authorization', `Bearer ${token}`),
    put: (url) => agent.put(url).set('Authorization', `Bearer ${token}`),
    patch: (url) => agent.patch(url).set('Authorization', `Bearer ${token}`),
    delete: (url) => agent.delete(url).set('Authorization', `Bearer ${token}`),
  };
}

async function loginAs(user, password = TEST_PASSWORD) {
  const response = await api().post('/api/auth/login').send({
    email: user.email,
    password,
  });

  return response.body.token;
}

async function createTicketViaApi(createdById, overrides = {}, token) {
  const payload = {
    title: 'Payment issue report',
    description: 'Customer payment failed during checkout',
    priority: 'HIGH',
    category: 'BILLING',
    createdById,
    ...overrides,
  };

  const authToken = token ?? global.getTestCustomerToken();
  const response = await withAuth(authToken).post('/api/tickets').send(payload);
  return response;
}

async function changeTicketStatusViaApi(ticketId, status, token) {
  const authToken = token ?? global.getTestAgentToken();
  return withAuth(authToken).patch(`/api/tickets/${ticketId}/status`).send({ status });
}

module.exports = {
  VALID_UUID,
  TEST_PASSWORD,
  api,
  withAuth,
  prisma,
  cleanDatabase,
  createTestUser,
  createTestAgent,
  createTestAdmin,
  loginAs,
  createTicketViaApi,
  changeTicketStatusViaApi,
};
