const prisma = require('../config/prisma');

const ticketInclude = {
  createdBy: {
    select: { id: true, name: true, email: true, role: true },
  },
  assignedTo: {
    select: { id: true, name: true, email: true, role: true },
  },
  comments: {
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  },
  attachments: {
    orderBy: { createdAt: 'asc' },
  },
  history: {
    orderBy: { createdAt: 'asc' },
  },
};

const create = (data) => {
  return prisma.ticket.create({
    data,
    include: {
      createdBy: {
        select: { id: true, name: true, email: true, role: true },
      },
      assignedTo: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });
};

const findAll = ({ where, skip, take, orderBy = { createdAt: 'desc' } }) => {
  return prisma.ticket.findMany({
    where,
    skip,
    take,
    orderBy,
    include: {
      createdBy: {
        select: { id: true, name: true, email: true, role: true },
      },
      assignedTo: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });
};

const count = (where) => {
  return prisma.ticket.count({ where });
};

const findById = (id) => {
  return prisma.ticket.findUnique({
    where: { id },
    include: ticketInclude,
  });
};

const update = (id, data) => {
  return prisma.ticket.update({
    where: { id },
    data,
    include: {
      createdBy: {
        select: { id: true, name: true, email: true, role: true },
      },
      assignedTo: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });
};

const remove = (id) => {
  return prisma.ticket.delete({ where: { id } });
};

const updateStatus = (ticketId, status) => {
  return prisma.ticket.update({
    where: { id: ticketId },
    data: { status },
    include: ticketInclude,
  });
};

module.exports = {
  create,
  findAll,
  count,
  findById,
  update,
  updateStatus,
  remove,
};
