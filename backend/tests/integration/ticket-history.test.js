const {
  api,
  withAuth,
  createTicketViaApi,
  createTestAgent,
  prisma,
  VALID_UUID,
} = require('../helpers');

describe('Ticket History API', () => {
  let customer;
  let agent;
  let token;

  beforeEach(() => {
    customer = global.getTestCustomer();
    agent = global.getTestAgent();
    token = global.getTestCustomerToken();
  });

  async function createTicket(overrides = {}) {
    const response = await createTicketViaApi(customer.id, overrides);
    return response.body.data;
  }

  describe('GET /api/tickets/:ticketId/history', () => {
    it('returns empty array when ticket has no history records', async () => {
      const ticket = await prisma.ticket.create({
        data: {
          title: 'Ticket without history',
          description: 'Created directly for empty history test',
          category: 'GENERAL',
          createdById: customer.id,
        },
      });

      const response = await withAuth(token).get(`/api/tickets/${ticket.id}/history`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: [],
      });
    });

    it('returns 404 for non-existent ticket', async () => {
      const response = await withAuth(token).get(`/api/tickets/${VALID_UUID}/history`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Ticket not found');
    });

    it('returns 400 for invalid ticket id', async () => {
      const response = await withAuth(token).get('/api/tickets/not-a-uuid/history');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('automatic history logging', () => {
    it('logs ticket creation', async () => {
      const ticket = await createTicket();

      const response = await withAuth(token).get(`/api/tickets/${ticket.id}/history`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            action: 'TICKET_CREATED',
            performedBy: expect.objectContaining({
              id: customer.id,
              name: customer.name,
              email: customer.email,
            }),
          }),
        ]),
      );
    });

    it('logs assignment on ticket creation', async () => {
      const ticket = await createTicket({ assignedTo: agent.id });

      const response = await withAuth(token).get(`/api/tickets/${ticket.id}/history`);

      expect(response.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            action: 'ASSIGNED',
            field: 'assignedTo',
            newValue: agent.name,
          }),
        ]),
      );
    });

    it('logs ticket update', async () => {
      const ticket = await createTicket();

      await withAuth(token)
        .put(`/api/tickets/${ticket.id}`)
        .send({ title: 'Updated payment issue title' });

      const response = await withAuth(token).get(`/api/tickets/${ticket.id}/history`);

      expect(response.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            action: 'TICKET_UPDATED',
            field: 'title',
            oldValue: 'Payment issue report',
            newValue: 'Updated payment issue title',
          }),
        ]),
      );
    });

    it('logs assignment changes', async () => {
      const ticket = await createTicket();

      await withAuth(token)
        .put(`/api/tickets/${ticket.id}`)
        .send({ assignedTo: agent.id });

      const response = await withAuth(token).get(`/api/tickets/${ticket.id}/history`);

      expect(response.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            action: 'ASSIGNED',
            field: 'assignedTo',
            oldValue: null,
            newValue: agent.name,
          }),
        ]),
      );
    });

    it('logs unassignment', async () => {
      const ticket = await createTicket({ assignedTo: agent.id });

      await withAuth(token)
        .put(`/api/tickets/${ticket.id}`)
        .send({ assignedTo: null });

      const response = await withAuth(token).get(`/api/tickets/${ticket.id}/history`);

      expect(response.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            action: 'UNASSIGNED',
            field: 'assignedTo',
            oldValue: agent.name,
            newValue: null,
          }),
        ]),
      );
    });

    it('logs priority changes', async () => {
      const ticket = await createTicket({ priority: 'HIGH' });

      await withAuth(token)
        .put(`/api/tickets/${ticket.id}`)
        .send({ priority: 'URGENT' });

      const response = await withAuth(token).get(`/api/tickets/${ticket.id}/history`);

      expect(response.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            action: 'PRIORITY_CHANGED',
            field: 'priority',
            oldValue: 'HIGH',
            newValue: 'URGENT',
          }),
        ]),
      );
    });

    it('logs status changes', async () => {
      const ticket = await createTicket();

      await withAuth(token)
        .patch(`/api/tickets/${ticket.id}/status`)
        .send({ status: 'IN_PROGRESS' });

      const response = await withAuth(token).get(`/api/tickets/${ticket.id}/history`);

      expect(response.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            action: 'STATUS_CHANGED',
            field: 'status',
            oldValue: 'OPEN',
            newValue: 'IN_PROGRESS',
          }),
        ]),
      );
    });

    it('does not log failed status transitions', async () => {
      const ticket = await createTicket();

      await withAuth(token)
        .patch(`/api/tickets/${ticket.id}/status`)
        .send({ status: 'CLOSED' });

      const response = await withAuth(token).get(`/api/tickets/${ticket.id}/history`);

      expect(response.body.data).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({ action: 'STATUS_CHANGED', newValue: 'CLOSED' }),
        ]),
      );
    });

    it('logs comment creation', async () => {
      const ticket = await createTicket();

      await withAuth(token)
        .post(`/api/tickets/${ticket.id}/comments`)
        .send({ message: 'Investigating the issue.', userId: agent.id });

      const response = await withAuth(token).get(`/api/tickets/${ticket.id}/history`);

      expect(response.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            action: 'COMMENT_ADDED',
            performedBy: expect.objectContaining({ id: agent.id }),
          }),
        ]),
      );
    });

    it('returns history sorted by newest first', async () => {
      const ticket = await createTicket();

      await withAuth(token)
        .put(`/api/tickets/${ticket.id}`)
        .send({ priority: 'LOW' });

      const response = await withAuth(token).get(`/api/tickets/${ticket.id}/history`);

      const timestamps = response.body.data.map((entry) => new Date(entry.createdAt).getTime());
      const sortedTimestamps = [...timestamps].sort((a, b) => b - a);

      expect(timestamps).toEqual(sortedTimestamps);
    });
  });
});
