const express = require('express');
const ticketController = require('../controllers/ticketController');
const asyncHandler = require('../middleware/asyncHandler');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { TICKET_WRITERS, ADMIN_ONLY } = require('../constants');
const {
  createTicketSchema,
  updateTicketSchema,
  changeTicketStatusSchema,
  getTicketsQuerySchema,
  ticketIdParamSchema,
  ticketHistoryParamSchema,
} = require('../validations/ticketValidation');

const router = express.Router();

router.post(
  '/',
  authenticate,
  authorize(...TICKET_WRITERS),
  validate(createTicketSchema),
  asyncHandler(ticketController.createTicket),
);

router.get('/', validate(getTicketsQuerySchema), asyncHandler(ticketController.getTickets));

router.get(
  '/:ticketId/history',
  authenticate,
  validate(ticketHistoryParamSchema),
  asyncHandler(ticketController.getTicketHistory),
);

router.get(
  '/:id',
  validate(ticketIdParamSchema),
  asyncHandler(ticketController.getTicketById),
);

router.put(
  '/:id',
  authenticate,
  authorize(...TICKET_WRITERS),
  validate(updateTicketSchema),
  asyncHandler(ticketController.updateTicket),
);

router.patch(
  '/:id/status',
  authenticate,
  authorize(...TICKET_WRITERS),
  validate(changeTicketStatusSchema),
  asyncHandler(ticketController.changeTicketStatus),
);

router.delete(
  '/:id',
  authenticate,
  authorize(...ADMIN_ONLY),
  validate(ticketIdParamSchema),
  asyncHandler(ticketController.deleteTicket),
);

module.exports = router;
