const AppError = require('../utils/AppError');
const ticketRepository = require('../repositories/ticketRepository');
const userRepository = require('../repositories/userRepository');

const createTicket = async (ticketData) => {
  const creator = await userRepository.findById(ticketData.createdById);

  if (!creator) {
    throw new AppError('Creator user not found', 404);
  }

  return ticketRepository.create(ticketData);
};

const getTickets = async ({ page, limit, status }) => {
  const where = status ? { status } : {};
  const skip = (page - 1) * limit;

  const [tickets, total] = await Promise.all([
    ticketRepository.findAll({ where, skip, take: limit }),
    ticketRepository.count(where),
  ]);

  return {
    tickets,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 0,
    },
  };
};

const getTicketById = async (id) => {
  const ticket = await ticketRepository.findById(id);

  if (!ticket) {
    throw new AppError('Ticket not found', 404);
  }

  return ticket;
};

const updateTicket = async (id, updateData) => {
  const existingTicket = await ticketRepository.findById(id);

  if (!existingTicket) {
    throw new AppError('Ticket not found', 404);
  }

  if (updateData.assignedToId) {
    const assignee = await userRepository.findById(updateData.assignedToId);

    if (!assignee) {
      throw new AppError('Assigned user not found', 404);
    }
  }

  return ticketRepository.update(id, updateData);
};

const deleteTicket = async (id) => {
  const existingTicket = await ticketRepository.findById(id);

  if (!existingTicket) {
    throw new AppError('Ticket not found', 404);
  }

  await ticketRepository.remove(id);
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
};
