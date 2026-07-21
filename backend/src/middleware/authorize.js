const AppError = require('../utils/AppError');

const FORBIDDEN_MESSAGE = 'You do not have permission to perform this action.';

const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required.', 401));
  }

  if (!allowedRoles.includes(req.user.role)) {
    return next(new AppError(FORBIDDEN_MESSAGE, 403));
  }

  return next();
};

module.exports = authorize;
