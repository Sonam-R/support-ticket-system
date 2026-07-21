const AppError = require('../utils/AppError');
const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');

const ensureUserExists = async (id) => {
  const user = await userRepository.findById(id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

const ensureUniqueEmail = async (email, excludeId) => {
  const existingUser = await userRepository.findByEmail(email, { excludeId });

  if (existingUser) {
    throw new AppError('A user with this email already exists', 409);
  }
};

const createUser = async ({ name, email, role, password }) => {
  await ensureUniqueEmail(email);

  const hashedPassword = await bcrypt.hash(password, 10);

  return userRepository.create({
    name,
    email,
    role,
    password: hashedPassword,
  });
};

const getUsers = async ({ page, limit, search, sortBy, order, role }) => {
  const conditions = [];

  if (role) {
    conditions.push({ role });
  }

  const keyword = search?.trim();
  if (keyword) {
    conditions.push({
      OR: [
        { name: { contains: keyword, mode: 'insensitive' } },
        { email: { contains: keyword, mode: 'insensitive' } },
      ],
    });
  }

  const where = conditions.length > 0 ? { AND: conditions } : {};
  const skip = (page - 1) * limit;
  const orderBy = { [sortBy]: order };

  const [users, total] = await Promise.all([
    userRepository.findAll({ where, skip, take: limit, orderBy }),
    userRepository.count(where),
  ]);

  const totalPages = Math.ceil(total / limit) || 0;

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    },
  };
};

const getUserById = async (id) => {
  const user = await ensureUserExists(id);
  const stats = await userRepository.getTicketStats(id);

  return {
    ...user,
    stats,
  };
};

const updateUser = async (id, updateData) => {
  await ensureUserExists(id);

  if (updateData.email) {
    await ensureUniqueEmail(updateData.email, id);
  }

  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }

  return userRepository.update(id, updateData);
};

const deleteUser = async (id) => {
  await ensureUserExists(id);
  await userRepository.unassignTickets(id);
  await userRepository.softDelete(id);
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
