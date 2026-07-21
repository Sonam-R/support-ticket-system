const { api, createTestUser } = require('../helpers');

describe('Users API', () => {
  it('returns all users', async () => {
    const response = await api().get('/api/users');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data[0]).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      email: expect.any(String),
      role: expect.any(String),
    });
  });

  it('filters users by role', async () => {
    await createTestUser({ role: 'AGENT', name: 'Filter Agent' });

    const response = await api().get('/api/users?role=AGENT');

    expect(response.status).toBe(200);
    expect(response.body.data.every((user) => user.role === 'AGENT')).toBe(true);
  });

  it('rejects invalid role filter', async () => {
    const response = await api().get('/api/users?role=INVALID');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
