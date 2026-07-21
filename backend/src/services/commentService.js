const AppError = require('../utils/AppError');
const commentRepository = require('../repositories/commentRepository');
const ticketRepository = require('../repositories/ticketRepository');
const userRepository = require('../repositories/userRepository');

const addComment = async (ticketId, { message, userId }) => {
  const ticket = await ticketRepository.findById(ticketId);

  if (!ticket) {
    throw new AppError('Ticket not found', 404);
  }

  const user = await userRepository.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return commentRepository.create({ message, ticketId, userId });
};

const getComments = async (ticketId) => {
  const ticket = await ticketRepository.findById(ticketId);

  if (!ticket) {
    throw new AppError('Ticket not found', 404);
  }

  return commentRepository.findByTicketId(ticketId);
};

module.exports = {
  addComment,
  getComments,
};
