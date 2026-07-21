const VALID_UUID = '00000000-0000-0000-0000-000000000001';
const {
  createUserSchema,
  updateUserSchema,
  getUsersQuerySchema,
  userIdParamSchema,
} = require('../../src/validations/userValidation');

const validCreateBody = {
  name: 'Emma Johnson',
  email: 'emma@example.com',
  role: 'SUPPORT_AGENT',
  password: 'Password123',
};

describe('userValidation schemas', () => {
  describe('createUserSchema', () => {
    it('accepts a valid create payload', () => {
      const result = createUserSchema.safeParse({ body: validCreateBody });
      expect(result.success).toBe(true);
    });

    it('rejects missing name', () => {
      const { name, ...body } = validCreateBody;
      const result = createUserSchema.safeParse({ body });
      expect(result.success).toBe(false);
    });

    it('rejects empty name', () => {
      const result = createUserSchema.safeParse({
        body: { ...validCreateBody, name: '   ' },
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid email', () => {
      const result = createUserSchema.safeParse({
        body: { ...validCreateBody, email: 'not-an-email' },
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid role', () => {
      const result = createUserSchema.safeParse({
        body: { ...validCreateBody, role: 'INVALID' },
      });
      expect(result.success).toBe(false);
    });
  });

  describe('updateUserSchema', () => {
    it('accepts a valid update payload', () => {
      const result = updateUserSchema.safeParse({
        params: { id: VALID_UUID },
        body: { name: 'Updated Name' },
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid user id', () => {
      const result = updateUserSchema.safeParse({
        params: { id: 'invalid' },
        body: { name: 'Updated Name' },
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty update body', () => {
      const result = updateUserSchema.safeParse({
        params: { id: VALID_UUID },
        body: {},
      });
      expect(result.success).toBe(false);
    });
  });

  describe('getUsersQuerySchema', () => {
    it('applies pagination defaults', () => {
      const result = getUsersQuerySchema.safeParse({ query: {} });
      expect(result.success).toBe(true);
      expect(result.data.query.page).toBe(1);
      expect(result.data.query.limit).toBe(10);
      expect(result.data.query.sortBy).toBe('name');
      expect(result.data.query.order).toBe('asc');
    });

    it('accepts search and sorting params', () => {
      const result = getUsersQuerySchema.safeParse({
        query: { search: 'emma', sortBy: 'email', order: 'desc' },
      });
      expect(result.success).toBe(true);
      expect(result.data.query.search).toBe('emma');
      expect(result.data.query.sortBy).toBe('email');
      expect(result.data.query.order).toBe('desc');
    });

    it('rejects invalid role filter', () => {
      const result = getUsersQuerySchema.safeParse({
        query: { role: 'INVALID' },
      });
      expect(result.success).toBe(false);
    });
  });

  describe('userIdParamSchema', () => {
    it('accepts a valid uuid', () => {
      const result = userIdParamSchema.safeParse({ params: { id: VALID_UUID } });
      expect(result.success).toBe(true);
    });

    it('rejects an invalid uuid', () => {
      const result = userIdParamSchema.safeParse({ params: { id: 'bad-id' } });
      expect(result.success).toBe(false);
    });
  });
});
