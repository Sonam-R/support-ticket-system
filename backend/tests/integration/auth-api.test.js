const {
  api,
  withAuth,
  createTestUser,
  createTestAdmin,
  loginAs,
  TEST_PASSWORD,
  VALID_UUID,
} = require('../helpers');
const jwt = require('jsonwebtoken');

describe('Auth API', () => {
  let user;

  beforeEach(async () => {
    user = await createTestUser({
      name: 'Emma Johnson',
      email: `emma-${Date.now()}@example.com`,
    });
  });

  describe('POST /api/auth/login', () => {
    it('returns a token for valid credentials', async () => {
      const response = await api().post('/api/auth/login').send({
        email: user.email,
        password: TEST_PASSWORD,
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toEqual(expect.any(String));
      expect(response.body.user).toMatchObject({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
      expect(response.body.user.password).toBeUndefined();
    });

    it('rejects invalid password', async () => {
      const response = await api().post('/api/auth/login').send({
        email: user.email,
        password: 'WrongPassword123',
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/invalid email or password/i);
    });

    it('rejects invalid email', async () => {
      const response = await api().post('/api/auth/login').send({
        email: 'nonexistent@example.com',
        password: TEST_PASSWORD,
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('rejects inactive user', async () => {
      const inactiveUser = await createTestUser({
        email: `inactive-${Date.now()}@example.com`,
        isActive: false,
      });

      const response = await api().post('/api/auth/login').send({
        email: inactiveUser.email,
        password: TEST_PASSWORD,
      });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/inactive/i);
    });
  });

  describe('GET /api/auth/me', () => {
    it('returns the authenticated user profile', async () => {
      const token = await loginAs(user);
      const response = await withAuth(token).get('/api/auth/me');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
    });

    it('rejects missing token', async () => {
      const response = await api().get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('rejects invalid token', async () => {
      const response = await withAuth('invalid.token.value').get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/invalid token/i);
    });

    it('rejects expired token', async () => {
      const expiredToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '-1s' },
      );

      const response = await withAuth(expiredToken).get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/expired/i);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('logs out successfully with valid token', async () => {
      const token = await loginAs(user);
      const response = await withAuth(token).post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toMatch(/logged out/i);
    });
  });

  describe('Protected route access', () => {
    it('rejects ticket creation without token', async () => {
      const customer = global.getTestCustomer();
      const response = await api().post('/api/tickets').send({
        title: 'Unauthorized ticket',
        description: 'Should not be created',
        category: 'GENERAL',
        createdById: customer.id,
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('allows ticket creation with valid token', async () => {
      const customer = global.getTestCustomer();
      const token = global.getTestAgentToken();
      const response = await withAuth(token).post('/api/tickets').send({
        title: 'Authorized ticket',
        description: 'Created with valid token',
        category: 'GENERAL',
        createdById: customer.id,
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('rejects user creation without token', async () => {
      const response = await api().post('/api/users').send({
        name: 'New User',
        email: `new-${Date.now()}@example.com`,
        role: 'VIEWER',
        password: TEST_PASSWORD,
      });

      expect(response.status).toBe(401);
    });

    it('allows user creation with admin token', async () => {
      const token = global.getTestAdminToken();
      const response = await withAuth(token).post('/api/users').send({
        name: 'New User',
        email: `new-${Date.now()}@example.com`,
        role: 'VIEWER',
        password: TEST_PASSWORD,
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });
});
