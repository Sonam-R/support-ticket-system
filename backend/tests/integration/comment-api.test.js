const { api, withAuth, createTicketViaApi } = require('../helpers');

describe('Comment API', () => {
  let customer;
  let agent;
  let token;

  beforeEach(() => {
    customer = global.getTestCustomer();
    agent = global.getTestAgent();
    token = global.getTestAgentToken();
  });

  describe('POST /api/tickets/:ticketId/comments', () => {
    it('adds a comment to a ticket', async () => {
      const createResponse = await createTicketViaApi(customer.id);
      const ticketId = createResponse.body.data.id;

      const response = await withAuth(token)
        .post(`/api/tickets/${ticketId}/comments`)
        .send({
          message: 'Investigating the issue',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        message: 'Investigating the issue',
        ticketId,
        userId: agent.id,
      });
    });
  });

  describe('GET /api/tickets/:ticketId/comments', () => {
    it('returns comments for a ticket', async () => {
      const createResponse = await createTicketViaApi(customer.id);
      const ticketId = createResponse.body.data.id;

      await withAuth(token)
        .post(`/api/tickets/${ticketId}/comments`)
        .send({
          message: 'First comment on ticket',
        });

      const response = await api().get(`/api/tickets/${ticketId}/comments`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toMatchObject({
        message: 'First comment on ticket',
        ticketId,
      });
    });

    it('returns 400 for invalid ticket id format', async () => {
      const response = await withAuth(token)
        .post('/api/tickets/invalid-id/comments')
        .send({ message: 'Test comment' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
