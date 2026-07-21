const AppError = require('../utils/AppError');

const allowedTransitions = {
  OPEN: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['RESOLVED', 'CANCELLED'],
  RESOLVED: ['CLOSED'],
  CLOSED: [],
  CANCELLED: [],
};

function getAllowedTransitions(currentStatus) {
  return allowedTransitions[currentStatus] || [];
}

function validateStatusTransition(currentStatus, nextStatus) {
  if (!Object.prototype.hasOwnProperty.call(allowedTransitions, currentStatus)) {
    throw new AppError(`Invalid current status: ${currentStatus}`, 400);
  }

  const validNextStatuses = allowedTransitions[currentStatus];

  if (!validNextStatuses.includes(nextStatus)) {
    throw new AppError(
      `Cannot transition ticket from ${currentStatus} to ${nextStatus}`,
      400,
    );
  }
}

module.exports = {
  allowedTransitions,
  getAllowedTransitions,
  validateStatusTransition,
};
