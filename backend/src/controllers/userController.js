const { sendSuccess } = require('../utils/apiResponse');
const userService = require('../services/userService');

const createUser = async (req, res) => {
  const user = await userService.createUser(req.body);
  sendSuccess(res, user, 201);
};

const getUsers = async (req, res) => {
  const result = await userService.getUsers(req.validated.query);
  sendSuccess(res, result);
};

const getUserById = async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  sendSuccess(res, user);
};

const updateUser = async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  sendSuccess(res, user);
};

const deleteUser = async (req, res) => {
  await userService.deleteUser(req.params.id);
  sendSuccess(res, { message: 'User deleted successfully' });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
