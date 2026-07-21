const AppError = require('../utils/AppError');
const historyRepository = require('../repositories/historyRepository');
const ticketRepository = require('../repositories/ticketRepository');

const HISTORY_ACTIONS = {
  TICKET_CREATED: 'TICKET_CREATED',
  TICKET_UPDATED: 'TICKET_UPDATED',
  ASSIGNED: 'ASSIGNED',
  UNASSIGNED: 'UNASSIGNED',
  PRIORITY_CHANGED: 'PRIORITY_CHANGED',
  STATUS_CHANGED: 'STATUS_CHANGED',
  COMMENT_ADDED: 'COMMENT_ADDED',
};

const UPDATABLE_FIELDS = ['title', 'description', 'category'];

const getAssigneeName = (assignee) => assignee?.name ?? null;

const logHistory = async (record) => {
  return historyRepository.create(record);
};

const logTicketCreated = async (ticket, performedById) => {
  await logHistory({
    ticketId: ticket.id,
    action: HISTORY_ACTIONS.TICKET_CREATED,
    performedById,
  });

  if (ticket.assignedToId) {
    await logHistory({
      ticketId: ticket.id,
      action: HISTORY_ACTIONS.ASSIGNED,
      field: 'assignedTo',
      oldValue: null,
      newValue: getAssigneeName(ticket.assignedTo),
      performedById,
    });
  }
};

const logTicketUpdated = async (existingTicket, updatedTicket, normalizedData, performedById) => {
  const records = [];

  if (
    Object.prototype.hasOwnProperty.call(normalizedData, 'priority') &&
    normalizedData.priority !== existingTicket.priority
  ) {
    records.push({
      ticketId: existingTicket.id,
      action: HISTORY_ACTIONS.PRIORITY_CHANGED,
      field: 'priority',
      oldValue: existingTicket.priority,
      newValue: normalizedData.priority,
      performedById,
    });
  }

  if (Object.prototype.hasOwnProperty.call(normalizedData, 'assignedToId')) {
    const previousAssigneeId = existingTicket.assignedToId ?? null;
    const nextAssigneeId = normalizedData.assignedToId ?? null;

    if (previousAssigneeId !== nextAssigneeId) {
      const previousName = getAssigneeName(existingTicket.assignedTo);
      const nextName = getAssigneeName(updatedTicket.assignedTo);

      if (nextAssigneeId === null) {
        records.push({
          ticketId: existingTicket.id,
          action: HISTORY_ACTIONS.UNASSIGNED,
          field: 'assignedTo',
          oldValue: previousName,
          newValue: null,
          performedById,
        });
      } else {
        records.push({
          ticketId: existingTicket.id,
          action: HISTORY_ACTIONS.ASSIGNED,
          field: 'assignedTo',
          oldValue: previousName,
          newValue: nextName,
          performedById,
        });
      }
    }
  }

  for (const field of UPDATABLE_FIELDS) {
    if (
      Object.prototype.hasOwnProperty.call(normalizedData, field) &&
      normalizedData[field] !== existingTicket[field]
    ) {
      records.push({
        ticketId: existingTicket.id,
        action: HISTORY_ACTIONS.TICKET_UPDATED,
        field,
        oldValue: existingTicket[field],
        newValue: normalizedData[field],
        performedById,
      });
    }
  }

  if (records.length === 0) {
    return;
  }

  await historyRepository.createMany(records);
};

const logStatusChanged = async (existingTicket, newStatus, performedById) => {
  await logHistory({
    ticketId: existingTicket.id,
    action: HISTORY_ACTIONS.STATUS_CHANGED,
    field: 'status',
    oldValue: existingTicket.status,
    newValue: newStatus,
    performedById,
  });
};

const logCommentAdded = async (ticketId, performedById) => {
  await logHistory({
    ticketId,
    action: HISTORY_ACTIONS.COMMENT_ADDED,
    performedById,
  });
};

const getTicketHistory = async (ticketId) => {
  const ticket = await ticketRepository.existsById(ticketId);

  if (!ticket) {
    throw new AppError('Ticket not found', 404);
  }

  return historyRepository.findByTicketId(ticketId);
};

module.exports = {
  HISTORY_ACTIONS,
  logTicketCreated,
  logTicketUpdated,
  logStatusChanged,
  logCommentAdded,
  getTicketHistory,
};
