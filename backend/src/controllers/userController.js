const { sendSuccess } = require('../utils/apiResponse');
const userService = require('../services/userService');

const getUsers = async (req, res) => {
  const users = await userService.getUsers(req.validated.query);
  sendSuccess(res, users);
};

module.exports = {
  getUsers,
};
