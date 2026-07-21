const { api, createTestUser, createTicketViaApi, VALID_UUID } = require('../helpers');

describe('Users API', () => {
  it('creates a user', async () => {
    const response = await api().post('/api/users').send({
      name: 'Emma Johnson',
      email: `emma-${Date.now()}@example.com`,
      role: 'SUPPORT_AGENT',
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      id: expect.any(String),
      name: 'Emma Johnson',
      email: expect.any(String),
      role: 'SUPPORT_AGENT',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('rejects duplicate email on create', async () => {
    const email = `duplicate-${Date.now()}@example.com`;
    await createTestUser({ email, name: 'First User' });

    const response = await api().post('/api/users').send({
      name: 'Second User',
      email,
      role: 'VIEWER',
    });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/email/i);
  });

  it('rejects invalid email on create', async () => {
    const response = await api().post('/api/users').send({
      name: 'Invalid Email User',
      email: 'not-an-email',
      role: 'VIEWER',
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('rejects invalid role on create', async () => {
    const response = await api().post('/api/users').send({
      name: 'Invalid Role User',
      email: `invalid-role-${Date.now()}@example.com`,
      role: 'INVALID',
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('returns paginated users', async () => {
    const response = await api().get('/api/users');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      users: expect.any(Array),
      pagination: expect.objectContaining({
        page: expect.any(Number),
        limit: expect.any(Number),
        total: expect.any(Number),
        totalPages: expect.any(Number),
      }),
    });
    expect(response.body.data.users.length).toBeGreaterThan(0);
    expect(response.body.data.users[0]).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      email: expect.any(String),
      role: expect.any(String),
    });
  });

  it('searches users by name or email', async () => {
    const uniqueName = `Searchable-${Date.now()}`;
    await createTestUser({ name: uniqueName, email: `search-${Date.now()}@example.com` });

    const response = await api().get(`/api/users?search=${encodeURIComponent(uniqueName)}`);

    expect(response.status).toBe(200);
    expect(response.body.data.users.some((user) => user.name === uniqueName)).toBe(true);
  });

  it('supports pagination and sorting', async () => {
    const response = await api().get('/api/users?page=1&limit=1&sortBy=name&order=asc');

    expect(response.status).toBe(200);
    expect(response.body.data.users).toHaveLength(1);
    expect(response.body.data.pagination.limit).toBe(1);
  });

  it('filters users by role', async () => {
    await createTestUser({
      role: 'SUPPORT_AGENT',
      name: 'Filter Agent',
      email: `filter-agent-${Date.now()}@example.com`,
    });

    const response = await api().get('/api/users?role=SUPPORT_AGENT');

    expect(response.status).toBe(200);
    expect(response.body.data.users.every((user) => user.role === 'SUPPORT_AGENT')).toBe(true);
  });

  it('rejects invalid role filter', async () => {
    const response = await api().get('/api/users?role=INVALID');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('returns user details with ticket stats', async () => {
    const user = await createTestUser({ role: 'SUPPORT_AGENT' });
    const customer = global.getTestCustomer();
    await createTicketViaApi(customer.id, { assignedTo: user.id });

    const response = await api().get(`/api/users/${user.id}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({
      id: user.id,
      name: user.name,
      email: user.email,
      role: 'SUPPORT_AGENT',
      stats: {
        assignedTickets: 1,
        createdTickets: 0,
      },
    });
  });

  it('updates a user', async () => {
    const user = await createTestUser({ role: 'VIEWER' });

    const response = await api().patch(`/api/users/${user.id}`).send({
      name: 'Updated Name',
      role: 'ADMIN',
    });

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({
      id: user.id,
      name: 'Updated Name',
      role: 'ADMIN',
    });
  });

  it('rejects duplicate email on update', async () => {
    const first = await createTestUser({ email: `first-${Date.now()}@example.com` });
    const second = await createTestUser({ email: `second-${Date.now()}@example.com` });

    const response = await api().patch(`/api/users/${second.id}`).send({
      email: first.email,
    });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });

  it('returns 404 for unknown user', async () => {
    const response = await api().get(`/api/users/${VALID_UUID}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('User not found');
  });

  it('soft deletes a user and unassigns tickets', async () => {
    const agent = await createTestUser({
      role: 'SUPPORT_AGENT',
      email: `delete-agent-${Date.now()}@example.com`,
    });
    const customer = global.getTestCustomer();
    const ticketResponse = await createTicketViaApi(customer.id, { assignedTo: agent.id });
    const ticketId = ticketResponse.body.data.id;

    const deleteResponse = await api().delete(`/api/users/${agent.id}`);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.data.message).toBe('User deleted successfully');

    const getResponse = await api().get(`/api/users/${agent.id}`);
    expect(getResponse.status).toBe(404);

    const listResponse = await api().get('/api/users');
    expect(listResponse.body.data.users.some((user) => user.id === agent.id)).toBe(false);

    const ticketDetails = await api().get(`/api/tickets/${ticketId}`);
    expect(ticketDetails.body.data.assignedTo).toBeNull();
  });
});
