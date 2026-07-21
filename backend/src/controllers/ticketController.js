const { sendSuccess } = require('../utils/apiResponse');
const ticketService = require('../services/ticketService');

const createTicket = async (req, res) => {
  const ticket = await ticketService.createTicket(req.body);
  sendSuccess(res, ticket, 201);
};

const getTickets = async (req, res) => {
  const result = await ticketService.getTickets(req.validated.query);
  sendSuccess(res, result);
};

const getTicketById = async (req, res) => {
  const ticket = await ticketService.getTicketById(req.params.id);
  sendSuccess(res, ticket);
};

const updateTicket = async (req, res) => {
  const ticket = await ticketService.updateTicket(req.params.id, req.body, req.user.id);
  sendSuccess(res, ticket);
};

const changeTicketStatus = async (req, res) => {
  const ticket = await ticketService.changeTicketStatus(
    req.params.id,
    req.body.status,
    req.user.id,
  );
  sendSuccess(res, ticket);
};

const deleteTicket = async (req, res) => {
  await ticketService.deleteTicket(req.params.id);
  sendSuccess(res, { message: 'Ticket deleted successfully' });
};

const getTicketHistory = async (req, res) => {
  const history = await ticketService.getTicketHistory(req.params.ticketId);
  sendSuccess(res, history);
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
