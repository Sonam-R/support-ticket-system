const { api, createTicketViaApi } = require('../helpers');

describe('Ticket API Validation', () => {
  let customer;

  beforeEach(() => {
    customer = global.getTestCustomer();
  });

  describe('POST /api/tickets validation', () => {
    it('rejects missing title', async () => {
      const response = await api()
        .post('/api/tickets')
        .send({
          description: 'Issue',
          priority: 'HIGH',
          category: 'GENERAL',
          createdById: customer.id,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('rejects missing description', async () => {
      const response = await api()
        .post('/api/tickets')
        .send({
          title: 'Valid title',
          priority: 'HIGH',
          category: 'GENERAL',
          createdById: customer.id,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('rejects invalid priority', async () => {
      const response = await api()
        .post('/api/tickets')
        .send({
          title: 'Valid title',
          description: 'Issue description',
          priority: 'INVALID',
          category: 'GENERAL',
          createdById: customer.id,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('rejects empty title', async () => {
      const response = await api()
        .post('/api/tickets')
        .send({
          title: '',
          description: 'Issue description',
          category: 'GENERAL',
          createdById: customer.id,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('rejects invalid createdById', async () => {
      const response = await api()
        .post('/api/tickets')
        .send({
          title: 'Valid title',
          description: 'Issue description',
          category: 'GENERAL',
          createdById: 'not-a-uuid',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/tickets/:id validation', () => {
    it('rejects invalid assignee id format', async () => {
      const createResponse = await createTicketViaApi(customer.id);
      const ticketId = createResponse.body.data.id;

      const response = await api()
        .put(`/api/tickets/${ticketId}`)
        .send({ assignedToId: 'invalid-uuid' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/tickets/:id/status validation', () => {
    it('rejects invalid status value', async () => {
      const createResponse = await createTicketViaApi(customer.id);
      const ticketId = createResponse.body.data.id;

      const response = await api()
        .patch(`/api/tickets/${ticketId}/status`)
        .send({ status: 'UNKNOWN' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('rejects invalid ticket id format', async () => {
      const response = await api()
        .patch('/api/tickets/invalid-id/status')
        .send({ status: 'IN_PROGRESS' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
