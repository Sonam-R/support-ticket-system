const prisma = require('../config/prisma');

const create = (data) => {
  return prisma.comment.create({
    data,
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });
};

const findByTicketId = (ticketId) => {
  return prisma.comment.findMany({
    where: { ticketId },
    orderBy: { createdAt: 'asc' },
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });
};

module.exports = {
  create,
  findByTicketId,
};
