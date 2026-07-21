const AppError = require('../utils/AppError');
const ticketRepository = require('../repositories/ticketRepository');
const userRepository = require('../repositories/userRepository');
const {
  logTicketCreated,
  logTicketUpdated,
  logStatusChanged,
  getTicketHistory,
} = require('./historyService');
const {
  getAllowedTransitions,
  validateStatusTransition,
} = require('./statusTransitionService');

const enrichWithAllowedTransitions = (ticket) => ({
  ...ticket,
  allowedTransitions: getAllowedTransitions(ticket.status),
});

const normalizeAssigneeFields = (data) => {
  const normalized = { ...data };

  if (Object.prototype.hasOwnProperty.call(normalized, 'assignedTo')) {
    normalized.assignedToId =
      normalized.assignedTo === null || normalized.assignedTo === undefined
        ? null
        : normalized.assignedTo;
    delete normalized.assignedTo;
  }

  return normalized;
};

const validateAssignee = async (assignedToId) => {
  if (assignedToId === null || assignedToId === undefined) {
    return;
  }

  const assignee = await userRepository.findById(assignedToId);

  if (!assignee) {
    throw new AppError('Assigned user not found', 404);
  }
};

const createTicket = async (ticketData) => {
  const normalizedData = normalizeAssigneeFields(ticketData);
  const creator = await userRepository.findById(normalizedData.createdById);

  if (!creator) {
    throw new AppError('Creator user not found', 404);
  }

  await validateAssignee(normalizedData.assignedToId);

  const ticket = await ticketRepository.create(normalizedData);
  await logTicketCreated(ticket, normalizedData.createdById);

  return ticket;
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

  const normalizedData = normalizeAssigneeFields(updateData);

  if (Object.prototype.hasOwnProperty.call(normalizedData, 'assignedToId')) {
    await validateAssignee(normalizedData.assignedToId);
  }

  const updatedTicket = await ticketRepository.update(id, normalizedData);
  await logTicketUpdated(
    existingTicket,
    updatedTicket,
    normalizedData,
    existingTicket.createdById,
  );

  return updatedTicket;
};

const changeTicketStatus = async (ticketId, newStatus) => {
  const existingTicket = await ticketRepository.findById(ticketId);

  if (!existingTicket) {
    throw new AppError('Ticket not found', 404);
  }

  validateStatusTransition(existingTicket.status, newStatus);

  const updatedTicket = await ticketRepository.updateStatus(ticketId, newStatus);
  await logStatusChanged(existingTicket, newStatus, existingTicket.createdById);

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
  getTicketHistory,
};
