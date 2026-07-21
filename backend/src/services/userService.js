const userRepository = require('../repositories/userRepository');

const getUsers = async ({ role } = {}) => {
  const where = role ? { role } : undefined;

  return userRepository.findAll({ where });
};

module.exports = {
  getUsers,
};
