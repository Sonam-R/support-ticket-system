const {
  api,
  createTicketViaApi,
  changeTicketStatusViaApi,
} = require('../helpers');

describe('Ticket Status Transitions', () => {
  let customer;

  beforeEach(() => {
    customer = global.getTestCustomer();
  });

  describe('valid transitions', () => {
    it('allows OPEN → IN_PROGRESS', async () => {
      const createResponse = await createTicketViaApi(customer.id);
      const ticketId = createResponse.body.data.id;

      const response = await changeTicketStatusViaApi(ticketId, 'IN_PROGRESS');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('IN_PROGRESS');
    });

    it('allows IN_PROGRESS → RESOLVED', async () => {
      const createResponse = await createTicketViaApi(customer.id);
      const ticketId = createResponse.body.data.id;

      await changeTicketStatusViaApi(ticketId, 'IN_PROGRESS');
      const response = await changeTicketStatusViaApi(ticketId, 'RESOLVED');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('RESOLVED');
    });

    it('allows RESOLVED → CLOSED', async () => {
      const createResponse = await createTicketViaApi(customer.id);
      const ticketId = createResponse.body.data.id;

      await changeTicketStatusViaApi(ticketId, 'IN_PROGRESS');
      await changeTicketStatusViaApi(ticketId, 'RESOLVED');
      const response = await changeTicketStatusViaApi(ticketId, 'CLOSED');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('CLOSED');
    });

    it('allows OPEN → CANCELLED', async () => {
      const createResponse = await createTicketViaApi(customer.id);
      const ticketId = createResponse.body.data.id;

      const response = await changeTicketStatusViaApi(ticketId, 'CANCELLED');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('CANCELLED');
    });

    it('allows IN_PROGRESS → CANCELLED', async () => {
      const createResponse = await createTicketViaApi(customer.id);
      const ticketId = createResponse.body.data.id;

      await changeTicketStatusViaApi(ticketId, 'IN_PROGRESS');
      const response = await changeTicketStatusViaApi(ticketId, 'CANCELLED');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('CANCELLED');
    });
  });

  describe('invalid transitions', () => {
    const invalidTransitions = [
      { from: 'OPEN', to: 'CLOSED', setup: async (ticketId) => ticketId },
      { from: 'OPEN', to: 'RESOLVED', setup: async (ticketId) => ticketId },
      {
        from: 'IN_PROGRESS',
        to: 'CLOSED',
        setup: async (ticketId) => {
          await changeTicketStatusViaApi(ticketId, 'IN_PROGRESS');
          return ticketId;
        },
      },
      {
        from: 'RESOLVED',
        to: 'OPEN',
        setup: async (ticketId) => {
          await changeTicketStatusViaApi(ticketId, 'IN_PROGRESS');
          await changeTicketStatusViaApi(ticketId, 'RESOLVED');
          return ticketId;
        },
      },
      {
        from: 'RESOLVED',
        to: 'CANCELLED',
        setup: async (ticketId) => {
          await changeTicketStatusViaApi(ticketId, 'IN_PROGRESS');
          await changeTicketStatusViaApi(ticketId, 'RESOLVED');
          return ticketId;
        },
      },
      {
        from: 'CLOSED',
        to: 'OPEN',
        setup: async (ticketId) => {
          await changeTicketStatusViaApi(ticketId, 'IN_PROGRESS');
          await changeTicketStatusViaApi(ticketId, 'RESOLVED');
          await changeTicketStatusViaApi(ticketId, 'CLOSED');
          return ticketId;
        },
      },
      {
        from: 'CANCELLED',
        to: 'OPEN',
        setup: async (ticketId) => {
          await changeTicketStatusViaApi(ticketId, 'CANCELLED');
          return ticketId;
        },
      },
    ];

    it.each(invalidTransitions)(
      'rejects $from → $to with 400',
      async ({ from, to, setup }) => {
        const createResponse = await createTicketViaApi(customer.id);
        const ticketId = createResponse.body.data.id;

        await setup(ticketId);

        const response = await changeTicketStatusViaApi(ticketId, to);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          success: false,
          message: `Cannot transition ticket from ${from} to ${to}`,
        });
      },
    );
  });
});
