const prisma = require('../config/prisma');

const findById = (id) => {
  return prisma.user.findUnique({ where: { id } });
};

module.exports = {
  findById,
};
