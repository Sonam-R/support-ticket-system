jest.mock('../../src/repositories/ticketRepository', () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  count: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  updateStatus: jest.fn(),
  remove: jest.fn(),
}));

jest.mock('../../src/repositories/userRepository', () => ({
  findById: jest.fn(),
}));

const VALID_UUID = '00000000-0000-0000-0000-000000000001';
const AppError = require('../../src/utils/AppError');
const ticketRepository = require('../../src/repositories/ticketRepository');
const userRepository = require('../../src/repositories/userRepository');
const ticketService = require('../../src/services/ticketService');

const defaultListOptions = {
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  order: 'desc',
};

describe('ticketService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ticketRepository.findAll.mockResolvedValue([]);
    ticketRepository.count.mockResolvedValue(0);
  });

  describe('getTickets query builder', () => {
    it('uses empty where clause when no filters are provided', async () => {
      await ticketService.getTickets(defaultListOptions);

      expect(ticketRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} }),
      );
    });

    it('builds status filter', async () => {
      await ticketService.getTickets({ ...defaultListOptions, status: 'OPEN' });

      expect(ticketRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { AND: [{ status: 'OPEN' }] },
        }),
      );
    });

    it('builds priority filter', async () => {
      await ticketService.getTickets({ ...defaultListOptions, priority: 'HIGH' });

      expect(ticketRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { AND: [{ priority: 'HIGH' }] },
        }),
      );
    });

    it('builds assignee filter', async () => {
      await ticketService.getTickets({
        ...defaultListOptions,
        assignedTo: VALID_UUID,
      });

      expect(ticketRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { AND: [{ assignedToId: VALID_UUID }] },
        }),
      );
    });

    it('builds case-insensitive search on title and description', async () => {
      await ticketService.getTickets({
        ...defaultListOptions,
        search: 'payment',
      });

      expect(ticketRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            AND: [
              {
                OR: [
                  { title: { contains: 'payment', mode: 'insensitive' } },
                  { description: { contains: 'payment', mode: 'insensitive' } },
                ],
              },
            ],
          },
        }),
      );
    });

    it('ignores whitespace-only search', async () => {
      await ticketService.getTickets({
        ...defaultListOptions,
        search: '   ',
      });

      expect(ticketRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} }),
      );
    });

    it('combines multiple filters with AND', async () => {
      await ticketService.getTickets({
        ...defaultListOptions,
        status: 'OPEN',
        priority: 'HIGH',
        assignedTo: VALID_UUID,
        search: 'billing',
      });

      expect(ticketRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            AND: [
              { status: 'OPEN' },
              { priority: 'HIGH' },
              { assignedToId: VALID_UUID },
              {
                OR: [
                  { title: { contains: 'billing', mode: 'insensitive' } },
                  { description: { contains: 'billing', mode: 'insensitive' } },
                ],
              },
            ],
          },
        }),
      );
    });

    it('applies pagination skip and take', async () => {
      await ticketService.getTickets({
        ...defaultListOptions,
        page: 3,
        limit: 5,
      });

      expect(ticketRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 5,
        }),
      );
    });

    it('applies sorting orderBy', async () => {
      await ticketService.getTickets({
        ...defaultListOptions,
        sortBy: 'title',
        order: 'asc',
      });

      expect(ticketRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { title: 'asc' },
        }),
      );
    });

    it('returns pagination metadata', async () => {
      ticketRepository.count.mockResolvedValue(25);

      const result = await ticketService.getTickets({
        ...defaultListOptions,
        page: 2,
        limit: 10,
      });

      expect(result.pagination).toEqual({
        page: 2,
        limit: 10,
        total: 25,
        totalPages: 3,
        hasNext: true,
        hasPrevious: true,
      });
    });
  });

  describe('createTicket', () => {
    it('throws when creator is not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(
        ticketService.createTicket({
          title: 'Valid title',
          description: 'Description',
          category: 'GENERAL',
          createdById: VALID_UUID,
        }),
      ).rejects.toThrow(new AppError('Creator user not found', 404));
    });

    it('creates ticket when creator exists', async () => {
      const ticket = { id: VALID_UUID, title: 'Valid title' };
      userRepository.findById.mockResolvedValue({ id: VALID_UUID });
      ticketRepository.create.mockResolvedValue(ticket);

      const result = await ticketService.createTicket({
        title: 'Valid title',
        description: 'Description',
        category: 'GENERAL',
        createdById: VALID_UUID,
      });

      expect(result).toEqual(ticket);
      expect(ticketRepository.create).toHaveBeenCalled();
    });
  });

  describe('getTicketById', () => {
    it('throws when ticket is not found', async () => {
      ticketRepository.findById.mockResolvedValue(null);

      await expect(ticketService.getTicketById(VALID_UUID)).rejects.toThrow(
        new AppError('Ticket not found', 404),
      );
    });

    it('enriches ticket with allowed transitions', async () => {
      ticketRepository.findById.mockResolvedValue({
        id: VALID_UUID,
        status: 'OPEN',
      });

      const result = await ticketService.getTicketById(VALID_UUID);

      expect(result.allowedTransitions).toEqual(['IN_PROGRESS', 'CANCELLED']);
    });
  });

  describe('updateTicket', () => {
    it('throws when ticket is not found', async () => {
      ticketRepository.findById.mockResolvedValue(null);

      await expect(
        ticketService.updateTicket(VALID_UUID, { title: 'Updated title' }),
      ).rejects.toThrow(new AppError('Ticket not found', 404));
    });

    it('throws when assignee is not found', async () => {
      ticketRepository.findById.mockResolvedValue({ id: VALID_UUID });
      userRepository.findById.mockResolvedValue(null);

      await expect(
        ticketService.updateTicket(VALID_UUID, { assignedToId: VALID_UUID }),
      ).rejects.toThrow(new AppError('Assigned user not found', 404));
    });
  });

  describe('changeTicketStatus', () => {
    it('throws when ticket is not found', async () => {
      ticketRepository.findById.mockResolvedValue(null);

      await expect(
        ticketService.changeTicketStatus(VALID_UUID, 'IN_PROGRESS'),
      ).rejects.toThrow(new AppError('Ticket not found', 404));
    });

    it('rejects invalid state transition', async () => {
      ticketRepository.findById.mockResolvedValue({
        id: VALID_UUID,
        status: 'OPEN',
      });

      await expect(
        ticketService.changeTicketStatus(VALID_UUID, 'CLOSED'),
      ).rejects.toThrow(AppError);
    });
  });

  describe('deleteTicket', () => {
    it('throws when ticket is not found', async () => {
      ticketRepository.findById.mockResolvedValue(null);

      await expect(ticketService.deleteTicket(VALID_UUID)).rejects.toThrow(
        new AppError('Ticket not found', 404),
      );
    });

    it('removes ticket when it exists', async () => {
      ticketRepository.findById.mockResolvedValue({ id: VALID_UUID });
      ticketRepository.remove.mockResolvedValue();

      await ticketService.deleteTicket(VALID_UUID);

      expect(ticketRepository.remove).toHaveBeenCalledWith(VALID_UUID);
    });
  });
});
