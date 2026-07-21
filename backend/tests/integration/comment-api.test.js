const { api, createTicketViaApi } = require('../helpers');

describe('Comment API', () => {
  let customer;

  beforeEach(() => {
    customer = global.getTestCustomer();
  });

  describe('POST /api/tickets/:ticketId/comments', () => {
    it('adds a comment to a ticket', async () => {
      const createResponse = await createTicketViaApi(customer.id);
      const ticketId = createResponse.body.data.id;

      const response = await api()
        .post(`/api/tickets/${ticketId}/comments`)
        .send({
          message: 'Investigating the issue',
          userId: customer.id,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        message: 'Investigating the issue',
        ticketId,
        userId: customer.id,
      });
    });
  });

  describe('GET /api/tickets/:ticketId/comments', () => {
    it('returns comments for a ticket', async () => {
      const createResponse = await createTicketViaApi(customer.id);
      const ticketId = createResponse.body.data.id;

      await api()
        .post(`/api/tickets/${ticketId}/comments`)
        .send({
          message: 'First comment on ticket',
          userId: customer.id,
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
  });
});
