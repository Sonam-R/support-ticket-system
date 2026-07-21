const VALID_UUID = '00000000-0000-0000-0000-000000000001';
const {
  createTicketSchema,
  updateTicketSchema,
  changeTicketStatusSchema,
  getTicketsQuerySchema,
  ticketIdParamSchema,
} = require('../../src/validations/ticketValidation');

const validCreateBody = {
  title: 'Valid ticket title',
  description: 'Valid description',
  priority: 'HIGH',
  category: 'GENERAL',
  createdById: VALID_UUID,
};

describe('ticketValidation schemas', () => {
  describe('createTicketSchema', () => {
    it('accepts a valid create payload', () => {
      const result = createTicketSchema.safeParse({ body: validCreateBody });
      expect(result.success).toBe(true);
    });

    it('rejects missing title', () => {
      const { title, ...body } = validCreateBody;
      const result = createTicketSchema.safeParse({ body });
      expect(result.success).toBe(false);
    });

    it('rejects empty title', () => {
      const result = createTicketSchema.safeParse({
        body: { ...validCreateBody, title: '' },
      });
      expect(result.success).toBe(false);
    });

    it('rejects title shorter than 5 characters', () => {
      const result = createTicketSchema.safeParse({
        body: { ...validCreateBody, title: 'Hi' },
      });
      expect(result.success).toBe(false);
      expect(result.error.errors[0].message).toContain('at least 5');
    });

    it('rejects missing description', () => {
      const { description, ...body } = validCreateBody;
      const result = createTicketSchema.safeParse({ body });
      expect(result.success).toBe(false);
    });

    it('rejects empty description', () => {
      const result = createTicketSchema.safeParse({
        body: { ...validCreateBody, description: '' },
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid priority', () => {
      const result = createTicketSchema.safeParse({
        body: { ...validCreateBody, priority: 'CRITICAL' },
      });
      expect(result.success).toBe(false);
      expect(result.error.errors[0].message).toContain('Invalid priority');
    });

    it('rejects invalid category', () => {
      const result = createTicketSchema.safeParse({
        body: { ...validCreateBody, category: 'UNKNOWN' },
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid createdById', () => {
      const result = createTicketSchema.safeParse({
        body: { ...validCreateBody, createdById: 'not-a-uuid' },
      });
      expect(result.success).toBe(false);
      expect(result.error.errors[0].message).toContain('Invalid createdById');
    });

    it('accepts optional assignedTo', () => {
      const result = createTicketSchema.safeParse({
        body: { ...validCreateBody, assignedTo: VALID_UUID },
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid assignedTo', () => {
      const result = createTicketSchema.safeParse({
        body: { ...validCreateBody, assignedTo: 'bad-id' },
      });
      expect(result.success).toBe(false);
      expect(result.error.errors[0].message).toContain('Invalid assignedTo');
    });

    it('accepts null assignedTo for unassigned tickets', () => {
      const result = createTicketSchema.safeParse({
        body: { ...validCreateBody, assignedTo: null },
      });
      expect(result.success).toBe(true);
    });
  });

  describe('updateTicketSchema', () => {
    const validParams = { id: VALID_UUID };

    it('accepts valid update fields', () => {
      const result = updateTicketSchema.safeParse({
        params: validParams,
        body: { title: 'Updated title value' },
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty update body', () => {
      const result = updateTicketSchema.safeParse({
        params: validParams,
        body: {},
      });
      expect(result.success).toBe(false);
      expect(result.error.errors[0].message).toContain('At least one field');
    });

    it('rejects invalid assignedToId', () => {
      const result = updateTicketSchema.safeParse({
        params: validParams,
        body: { assignedToId: 'bad-id' },
      });
      expect(result.success).toBe(false);
      expect(result.error.errors[0].message).toContain('Invalid assignedToId');
    });

    it('accepts null assignedToId to unassign', () => {
      const result = updateTicketSchema.safeParse({
        params: validParams,
        body: { assignedToId: null },
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid ticket id in params', () => {
      const result = updateTicketSchema.safeParse({
        params: { id: 'invalid' },
        body: { title: 'Updated title value' },
      });
      expect(result.success).toBe(false);
    });
  });

  describe('changeTicketStatusSchema', () => {
    it('accepts valid status change', () => {
      const result = changeTicketStatusSchema.safeParse({
        params: { id: VALID_UUID },
        body: { status: 'IN_PROGRESS' },
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid status', () => {
      const result = changeTicketStatusSchema.safeParse({
        params: { id: VALID_UUID },
        body: { status: 'UNKNOWN' },
      });
      expect(result.success).toBe(false);
      expect(result.error.errors[0].message).toContain('Invalid status');
    });

    it('rejects invalid ticket id', () => {
      const result = changeTicketStatusSchema.safeParse({
        params: { id: 'not-uuid' },
        body: { status: 'OPEN' },
      });
      expect(result.success).toBe(false);
    });
  });

  describe('getTicketsQuerySchema', () => {
    it('applies default pagination and sorting', () => {
      const result = getTicketsQuerySchema.safeParse({ query: {} });
      expect(result.success).toBe(true);
      expect(result.data.query).toMatchObject({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        order: 'desc',
      });
    });

    it('accepts valid filter and sort parameters', () => {
      const result = getTicketsQuerySchema.safeParse({
        query: {
          page: '2',
          limit: '25',
          status: 'OPEN',
          priority: 'HIGH',
          assignedTo: VALID_UUID,
          search: 'payment',
          sortBy: 'title',
          order: 'asc',
        },
      });
      expect(result.success).toBe(true);
      expect(result.data.query).toMatchObject({
        page: 2,
        limit: 25,
        status: 'OPEN',
        priority: 'HIGH',
        assignedTo: VALID_UUID,
        search: 'payment',
        sortBy: 'title',
        order: 'asc',
      });
    });

    it('trims search and converts empty string to undefined', () => {
      const result = getTicketsQuerySchema.safeParse({
        query: { search: '   ' },
      });
      expect(result.success).toBe(true);
      expect(result.data.query.search).toBeUndefined();
    });

    it.each([
      [{ page: '0' }, 'page'],
      [{ page: '-1' }, 'page'],
      [{ limit: '0' }, 'limit'],
      [{ limit: '101' }, 'limit'],
      [{ status: 'INVALID' }, 'status'],
      [{ priority: 'URGENT' }, 'priority'],
      [{ assignedTo: 'bad-uuid' }, 'assignedTo'],
      [{ sortBy: 'random' }, 'sortBy'],
      [{ order: 'sideways' }, 'order'],
    ])('rejects invalid query %j', (query, _field) => {
      const result = getTicketsQuerySchema.safeParse({ query });
      expect(result.success).toBe(false);
    });
  });

  describe('ticketIdParamSchema', () => {
    it('accepts valid uuid', () => {
      const result = ticketIdParamSchema.safeParse({ params: { id: VALID_UUID } });
      expect(result.success).toBe(true);
    });

    it('rejects invalid uuid', () => {
      const result = ticketIdParamSchema.safeParse({ params: { id: '123' } });
      expect(result.success).toBe(false);
      expect(result.error.errors[0].message).toContain('Invalid ticket id');
    });
  });
});
