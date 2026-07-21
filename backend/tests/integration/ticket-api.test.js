const { api, createTicketViaApi } = require('../helpers');

describe('Ticket API', () => {
  let customer;

  beforeEach(() => {
    customer = global.getTestCustomer();
  });

  describe('POST /api/tickets', () => {
    it('creates a ticket with valid payload', async () => {
      const response = await api()
        .post('/api/tickets')
        .send({
          title: 'Payment issue',
          description: 'Customer payment failed',
          priority: 'HIGH',
          category: 'BILLING',
          createdById: customer.id,
        });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          title: 'Payment issue',
        },
      });
    });
  });

  describe('GET /api/tickets', () => {
    it('returns tickets with correct response structure', async () => {
      await createTicketViaApi(customer.id, {
        title: 'List test ticket',
        description: 'Ticket for list endpoint test',
      });

      const response = await api().get('/api/tickets');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.tickets)).toBe(true);
      expect(response.body.data.pagination).toMatchObject({
        page: expect.any(Number),
        limit: expect.any(Number),
        total: expect.any(Number),
        totalPages: expect.any(Number),
      });
    });

    it('supports pagination', async () => {
      const response = await api().get('/api/tickets?page=1&limit=2');

      expect(response.status).toBe(200);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(2);
      expect(response.body.data.tickets.length).toBeLessThanOrEqual(2);
    });
  });

  describe('GET /api/tickets/:id', () => {
    it('returns ticket details with creator, assignee, and comments', async () => {
      const createResponse = await createTicketViaApi(customer.id, {
        title: 'Detail view ticket',
        description: 'Ticket for detail endpoint test',
      });
      const ticketId = createResponse.body.data.id;

      const response = await api().get(`/api/tickets/${ticketId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        id: ticketId,
        title: 'Detail view ticket',
      });
      expect(response.body.data.createdBy).toMatchObject({
        id: customer.id,
        name: expect.any(String),
        email: expect.any(String),
      });
      expect(response.body.data.assignedTo).toBeNull();
      expect(Array.isArray(response.body.data.comments)).toBe(true);
    });
  });

  describe('PUT /api/tickets/:id', () => {
    it('updates allowed ticket fields', async () => {
      const agent = global.getTestAgent();
      const createResponse = await createTicketViaApi(customer.id);
      const ticketId = createResponse.body.data.id;

      const response = await api()
        .put(`/api/tickets/${ticketId}`)
        .send({
          title: 'Updated payment issue',
          description: 'Updated description for payment failure',
          priority: 'URGENT',
          assignedToId: agent.id,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        title: 'Updated payment issue',
        description: 'Updated description for payment failure',
        priority: 'URGENT',
        assignedTo: {
          id: agent.id,
        },
      });
    });
  });

  describe('GET /api/tickets with filters', () => {
    it('filters tickets by status', async () => {
      await createTicketViaApi(customer.id, {
        title: 'Open status filter ticket',
        description: 'Should appear in OPEN filter',
      });

      const response = await api().get('/api/tickets?status=OPEN');

      expect(response.status).toBe(200);
      expect(response.body.data.tickets.every((ticket) => ticket.status === 'OPEN')).toBe(
        true,
      );
    });

    it('searches tickets by title (case-insensitive, partial match)', async () => {
      await createTicketViaApi(customer.id, {
        title: 'Unique payment keyword ticket',
        description: 'No match in description field',
      });

      const response = await api().get('/api/tickets?search=payment');

      expect(response.status).toBe(200);
      expect(response.body.data.tickets.length).toBeGreaterThan(0);
      expect(
        response.body.data.tickets.every((ticket) =>
          ticket.title.toLowerCase().includes('payment'),
        ),
      ).toBe(true);
    });

    it('does not match search keyword in description only', async () => {
      const created = await createTicketViaApi(customer.id, {
        title: 'Generic support request',
        description: 'xyzonlydesc keyword hidden here',
      });

      const response = await api().get('/api/tickets?search=xyzonlydesc');

      expect(response.status).toBe(200);
      expect(
        response.body.data.tickets.some((ticket) => ticket.id === created.body.data.id),
      ).toBe(false);
    });

    it('combines title search with status filter', async () => {
      await createTicketViaApi(customer.id, {
        title: 'Open billing search ticket',
        description: 'unrelated body text',
      });

      const response = await api().get('/api/tickets?status=OPEN&search=billing');

      expect(response.status).toBe(200);
      expect(
        response.body.data.tickets.every(
          (ticket) =>
            ticket.status === 'OPEN' &&
            ticket.title.toLowerCase().includes('billing'),
        ),
      ).toBe(true);
    });

    it('returns all tickets when search is empty', async () => {
      const allResponse = await api().get('/api/tickets?limit=100');
      const searchResponse = await api().get('/api/tickets?limit=100&search=');

      expect(searchResponse.status).toBe(200);
      expect(searchResponse.body.data.pagination.total).toBe(
        allResponse.body.data.pagination.total,
      );
    });
  });

  describe('Error handling', () => {
    it('returns 404 when ticket is not found', async () => {
      const response = await api().get(
        '/api/tickets/00000000-0000-0000-0000-000000000001',
      );

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: 'Ticket not found',
      });
    });
  });
});
