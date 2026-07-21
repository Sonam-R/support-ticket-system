const prisma = require('../config/prisma');

const findById = (id) => {
  return prisma.user.findUnique({ where: { id } });
};

const findAll = ({ where, orderBy = { name: 'asc' } } = {}) => {
  return prisma.user.findMany({
    where,
    orderBy,
    select: { id: true, name: true, email: true, role: true },
  });
};

module.exports = {
  findById,
  findAll,
};
