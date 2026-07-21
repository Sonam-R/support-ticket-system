const AppError = require('../utils/AppError');
const ticketRepository = require('../repositories/ticketRepository');
const userRepository = require('../repositories/userRepository');
const {
  getAllowedTransitions,
  validateStatusTransition,
} = require('./statusTransitionService');

const enrichWithAllowedTransitions = (ticket) => ({
  ...ticket,
  allowedTransitions: getAllowedTransitions(ticket.status),
});

const createTicket = async (ticketData) => {
  const creator = await userRepository.findById(ticketData.createdById);

  if (!creator) {
    throw new AppError('Creator user not found', 404);
  }

  return ticketRepository.create(ticketData);
};

const getTickets = async ({
  page,
  limit,
  status,
  priority,
  assignedTo,
  search,
  sortBy,
  order,
}) => {
  const conditions = [];

  if (status) {
    conditions.push({ status });
  }

  if (priority) {
    conditions.push({ priority });
  }

  if (assignedTo) {
    conditions.push({ assignedToId: assignedTo });
  }

  const keyword = search?.trim();
  if (keyword) {
    conditions.push({
      OR: [
        { title: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
      ],
    });
  }

  const where = conditions.length > 0 ? { AND: conditions } : {};
  const skip = (page - 1) * limit;
  const orderBy = { [sortBy]: order };

  const [tickets, total] = await Promise.all([
    ticketRepository.findAll({ where, skip, take: limit, orderBy }),
    ticketRepository.count(where),
  ]);

  const totalPages = Math.ceil(total / limit) || 0;

  return {
    tickets,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    },
  };
};

const getTicketById = async (id) => {
  const ticket = await ticketRepository.findById(id);

  if (!ticket) {
    throw new AppError('Ticket not found', 404);
  }

  return enrichWithAllowedTransitions(ticket);
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

const changeTicketStatus = async (ticketId, newStatus) => {
  const existingTicket = await ticketRepository.findById(ticketId);

  if (!existingTicket) {
    throw new AppError('Ticket not found', 404);
  }

  validateStatusTransition(existingTicket.status, newStatus);

  const updatedTicket = await ticketRepository.updateStatus(ticketId, newStatus);

  return enrichWithAllowedTransitions(updatedTicket);
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
  changeTicketStatus,
  deleteTicket,
};
