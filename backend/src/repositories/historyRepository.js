const prisma = require('../config/prisma');

const performedBySelect = {
  select: { id: true, name: true, email: true },
};

const create = (data) => {
  return prisma.ticketHistory.create({
    data,
    include: {
      performedBy: performedBySelect,
    },
  });
};

const createMany = (records) => {
  return prisma.ticketHistory.createMany({ data: records });
};

const findByTicketId = (ticketId) => {
  return prisma.ticketHistory.findMany({
    where: { ticketId },
    orderBy: { createdAt: 'desc' },
    include: {
      performedBy: performedBySelect,
    },
  });
};

module.exports = {
  create,
  createMany,
  findByTicketId,
};
