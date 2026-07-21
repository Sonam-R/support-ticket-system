const authService = require('../services/authService');
const { sendSuccess } = require('../utils/apiResponse');

const login = async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });

  res.status(200).json({
    success: true,
    token: result.token,
    user: result.user,
  });
};

const getMe = async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);
  sendSuccess(res, user);
};

const logout = async (req, res) => {
  sendSuccess(res, { message: 'Logged out successfully' });
};

module.exports = {
  login,
  getMe,
  logout,
};
