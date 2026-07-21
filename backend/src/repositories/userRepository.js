const prisma = require('../config/prisma');

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

const activeUserFilter = { deletedAt: null };

const findById = (id, { includeDeleted = false } = {}) => {
  const where = includeDeleted ? { id } : { id, ...activeUserFilter };

  return prisma.user.findFirst({ where, select: userSelect });
};

const findByEmail = (email, { excludeId } = {}) => {
  const where = {
    email,
    ...activeUserFilter,
  };

  if (excludeId) {
    where.id = { not: excludeId };
  }

  return prisma.user.findFirst({ where, select: userSelect });
};

const findByEmailWithPassword = (email) => {
  return prisma.user.findFirst({
    where: { email, ...activeUserFilter },
    select: {
      ...userSelect,
      password: true,
      isActive: true,
    },
  });
};

const findAll = ({ where, skip, take, orderBy = { name: 'asc' } } = {}) => {
  return prisma.user.findMany({
    where: { ...activeUserFilter, ...where },
    skip,
    take,
    orderBy,
    select: userSelect,
  });
};

const count = (where = {}) => {
  return prisma.user.count({
    where: { ...activeUserFilter, ...where },
  });
};

const create = (data) => {
  return prisma.user.create({
    data,
    select: userSelect,
  });
};

const update = (id, data) => {
  return prisma.user.update({
    where: { id },
    data,
    select: userSelect,
  });
};

const softDelete = (id) => {
  return prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() },
    select: userSelect,
  });
};

const unassignTickets = (userId) => {
  return prisma.ticket.updateMany({
    where: { assignedToId: userId },
    data: { assignedToId: null },
  });
};

const getTicketStats = async (userId) => {
  const [assignedTickets, createdTickets] = await Promise.all([
    prisma.ticket.count({ where: { assignedToId: userId } }),
    prisma.ticket.count({ where: { createdById: userId } }),
  ]);

  return { assignedTickets, createdTickets };
};

module.exports = {
  findById,
  findByEmail,
  findByEmailWithPassword,
  findAll,
  count,
  create,
  update,
  softDelete,
  unassignTickets,
  getTicketStats,
};
