const {
  api,
  createTicketViaApi,
  changeTicketStatusViaApi,
  VALID_UUID,
} = require('../helpers');

describe('Error Handling', () => {
  let customer;

  beforeEach(() => {
    customer = global.getTestCustomer();
  });

  describe('validation errors return consistent 400 responses', () => {
    it('returns success false with message for invalid create payload', async () => {
      const response = await api()
        .post('/api/tickets')
        .send({
          title: 'Bad',
          description: 'Missing fields',
          category: 'GENERAL',
          createdById: customer.id,
        });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        message: expect.any(String),
      });
    });

    it('returns success false with message for invalid query parameters', async () => {
      const response = await api().get('/api/tickets?status=INVALID');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        message: expect.any(String),
      });
    });
  });

  describe('missing resources return 404', () => {
    it('returns 404 for non-existent ticket on GET', async () => {
      const response = await api().get(`/api/tickets/${VALID_UUID}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: 'Ticket not found',
      });
    });

    it('returns 404 for non-existent ticket on PUT', async () => {
      const response = await api()
        .put(`/api/tickets/${VALID_UUID}`)
        .send({ title: 'Updated title value' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: 'Ticket not found',
      });
    });

    it('returns 404 for non-existent ticket on status change', async () => {
      const response = await changeTicketStatusViaApi(VALID_UUID, 'IN_PROGRESS');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: 'Ticket not found',
      });
    });

    it('returns 404 for non-existent ticket on DELETE', async () => {
      const response = await api().delete(`/api/tickets/${VALID_UUID}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: 'Ticket not found',
      });
    });

    it('returns 404 when adding comment to non-existent ticket', async () => {
      const response = await api()
        .post(`/api/tickets/${VALID_UUID}/comments`)
        .send({ message: 'Test comment', userId: customer.id });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: 'Ticket not found',
      });
    });

    it('returns 404 when getting comments for non-existent ticket', async () => {
      const response = await api().get(`/api/tickets/${VALID_UUID}/comments`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: 'Ticket not found',
      });
    });
  });

  describe('invalid state transitions return 400', () => {
    it('returns descriptive message for invalid transition', async () => {
      const createResponse = await createTicketViaApi(customer.id);
      const ticketId = createResponse.body.data.id;

      const response = await changeTicketStatusViaApi(ticketId, 'CLOSED');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        message: 'Cannot transition ticket from OPEN to CLOSED',
      });
    });
  });

  describe('comment errors', () => {
    it('returns 404 when comment author does not exist', async () => {
      const createResponse = await createTicketViaApi(customer.id);
      const ticketId = createResponse.body.data.id;

      const response = await api()
        .post(`/api/tickets/${ticketId}/comments`)
        .send({ message: 'Test comment', userId: VALID_UUID });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: 'User not found',
      });
    });

    it('returns 400 for empty comment message', async () => {
      const createResponse = await createTicketViaApi(customer.id);
      const ticketId = createResponse.body.data.id;

      const response = await api()
        .post(`/api/tickets/${ticketId}/comments`)
        .send({ message: '', userId: customer.id });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
