const { api, withAuth, createTicketViaApi, TEST_PASSWORD } = require('../helpers');
const jwt = require('jsonwebtoken');

describe('Role-Based Authorization', () => {
  let adminToken;
  let agentToken;
  let viewerToken;
  let customer;

  beforeAll(() => {
    adminToken = global.getTestAdminToken();
    agentToken = global.getTestAgentToken();
    viewerToken = global.getTestCustomerToken();
    customer = global.getTestCustomer();
  });

  describe('Ticket APIs', () => {
    it('allows ADMIN to create tickets', async () => {
      const response = await withAuth(adminToken).post('/api/tickets').send({
        title: 'Admin created ticket',
        description: 'Created by admin user',
        category: 'GENERAL',
        createdById: customer.id,
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('allows SUPPORT_AGENT to create tickets', async () => {
      const response = await withAuth(agentToken).post('/api/tickets').send({
        title: 'Agent created ticket',
        description: 'Created by support agent',
        category: 'GENERAL',
        createdById: customer.id,
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('denies VIEWER ticket creation', async () => {
      const response = await withAuth(viewerToken).post('/api/tickets').send({
        title: 'Viewer created ticket',
        description: 'Should not be created',
        category: 'GENERAL',
        createdById: customer.id,
      });

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        success: false,
        message: 'You do not have permission to perform this action.',
      });
    });

    it('denies VIEWER ticket updates', async () => {
      const createResponse = await createTicketViaApi(customer.id);
      const ticketId = createResponse.body.data.id;

      const response = await withAuth(viewerToken).put(`/api/tickets/${ticketId}`).send({
        title: 'Updated by viewer',
        description: 'Should not update',
        category: 'GENERAL',
        priority: 'LOW',
      });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('You do not have permission to perform this action.');
    });

    it('denies VIEWER ticket status changes', async () => {
      const createResponse = await createTicketViaApi(customer.id);
      const ticketId = createResponse.body.data.id;

      const response = await withAuth(viewerToken)
        .patch(`/api/tickets/${ticketId}/status`)
        .send({ status: 'IN_PROGRESS' });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('denies VIEWER ticket assignment via update', async () => {
      const agent = global.getTestAgent();
      const createResponse = await createTicketViaApi(customer.id);
      const ticketId = createResponse.body.data.id;

      const response = await withAuth(viewerToken).put(`/api/tickets/${ticketId}`).send({
        title: createResponse.body.data.title,
        description: createResponse.body.data.description,
        category: createResponse.body.data.category,
        priority: createResponse.body.data.priority,
        assignedTo: agent.id,
      });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('allows VIEWER to add comments', async () => {
      const createResponse = await createTicketViaApi(customer.id);
      const ticketId = createResponse.body.data.id;

      const response = await withAuth(viewerToken)
        .post(`/api/tickets/${ticketId}/comments`)
        .send({ message: 'Viewer comment', userId: customer.id });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('allows ADMIN to delete tickets', async () => {
      const createResponse = await createTicketViaApi(customer.id);
      const ticketId = createResponse.body.data.id;

      const response = await withAuth(adminToken).delete(`/api/tickets/${ticketId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('denies SUPPORT_AGENT ticket deletion', async () => {
      const createResponse = await createTicketViaApi(customer.id);
      const ticketId = createResponse.body.data.id;

      const response = await withAuth(agentToken).delete(`/api/tickets/${ticketId}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('User APIs', () => {
    it('allows ADMIN to list users', async () => {
      const response = await withAuth(adminToken).get('/api/users');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('denies SUPPORT_AGENT user listing', async () => {
      const response = await withAuth(agentToken).get('/api/users');

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        success: false,
        message: 'You do not have permission to perform this action.',
      });
    });

    it('denies SUPPORT_AGENT user creation', async () => {
      const response = await withAuth(agentToken).post('/api/users').send({
        name: 'Blocked User',
        email: `blocked-${Date.now()}@example.com`,
        role: 'VIEWER',
        password: TEST_PASSWORD,
      });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('denies VIEWER user listing', async () => {
      const response = await withAuth(viewerToken).get('/api/users');

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Authentication requirements', () => {
    it('returns 401 when JWT is missing', async () => {
      const response = await api().post('/api/tickets').send({
        title: 'Unauthorized ticket',
        description: 'Missing token',
        category: 'GENERAL',
        createdById: customer.id,
      });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        success: false,
        message: 'Authentication required.',
      });
    });

    it('returns 403 for invalid role in token', async () => {
      const invalidRoleToken = jwt.sign(
        { id: customer.id, email: customer.email, role: 'INVALID_ROLE' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
      );

      const response = await withAuth(invalidRoleToken).post('/api/tickets').send({
        title: 'Invalid role ticket',
        description: 'Should be forbidden',
        category: 'GENERAL',
        createdById: customer.id,
      });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('You do not have permission to perform this action.');
    });
  });
});
