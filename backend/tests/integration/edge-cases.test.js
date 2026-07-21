const { api, createTicketViaApi, VALID_UUID } = require('../helpers');

describe('Edge Cases', () => {
  let customer;

  beforeEach(() => {
    customer = global.getTestCustomer();
  });

  describe('ticket creation edge cases', () => {
    it('rejects empty title', async () => {
      const response = await api()
        .post('/api/tickets')
        .send({
          title: '',
          description: 'Valid description',
          category: 'GENERAL',
          createdById: customer.id,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('rejects title shorter than 5 characters', async () => {
      const response = await api()
        .post('/api/tickets')
        .send({
          title: 'Hi',
          description: 'Valid description',
          category: 'GENERAL',
          createdById: customer.id,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('rejects empty description', async () => {
      const response = await api()
        .post('/api/tickets')
        .send({
          title: 'Valid title here',
          description: '',
          category: 'GENERAL',
          createdById: customer.id,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('rejects non-existent creator', async () => {
      const response = await api()
        .post('/api/tickets')
        .send({
          title: 'Valid title here',
          description: 'Valid description',
          category: 'GENERAL',
          createdById: VALID_UUID,
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: 'Creator user not found',
      });
    });
  });

  describe('ticket update edge cases', () => {
    it('rejects invalid assignee', async () => {
      const createResponse = await createTicketViaApi(customer.id);
      const ticketId = createResponse.body.data.id;

      const response = await api()
        .put(`/api/tickets/${ticketId}`)
        .send({ assignedToId: VALID_UUID });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: 'Assigned user not found',
      });
    });

    it('rejects empty update body', async () => {
      const createResponse = await createTicketViaApi(customer.id);
      const ticketId = createResponse.body.data.id;

      const response = await api().put(`/api/tickets/${ticketId}`).send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('invalid ticket id format', () => {
    it('returns 400 for malformed ticket id on GET', async () => {
      const response = await api().get('/api/tickets/not-a-uuid');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('returns 400 for malformed ticket id on PUT', async () => {
      const response = await api()
        .put('/api/tickets/not-a-uuid')
        .send({ title: 'Updated title value' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('returns 400 for malformed ticket id on status change', async () => {
      const response = await api()
        .patch('/api/tickets/not-a-uuid/status')
        .send({ status: 'IN_PROGRESS' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('returns 400 for malformed ticket id on DELETE', async () => {
      const response = await api().delete('/api/tickets/not-a-uuid');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('search edge cases', () => {
    it('handles special characters in search without error', async () => {
      await createTicketViaApi(customer.id, {
        title: 'Special chars ticket',
        description: 'Contains % and _ wildcard chars',
      });

      const response = await api().get('/api/tickets?search=%25');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('handles unicode characters in search', async () => {
      await createTicketViaApi(customer.id, {
        title: 'Unicode café ticket',
        description: 'Testing unicode search',
      });

      const response = await api().get('/api/tickets?search=café');

      expect(response.status).toBe(200);
      expect(
        response.body.data.tickets.some((ticket) =>
          ticket.title.toLowerCase().includes('café'),
        ),
      ).toBe(true);
    });
  });

  describe('pagination edge cases', () => {
    it('rejects limit exceeding maximum', async () => {
      const response = await api().get('/api/tickets?limit=101');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('rejects invalid assignedTo filter uuid', async () => {
      const response = await api().get('/api/tickets?assignedTo=not-a-uuid');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
