const express = require('express');
const ticketController = require('../controllers/ticketController');
const asyncHandler = require('../middleware/asyncHandler');
const validate = require('../middleware/validate');
const {
  createTicketSchema,
  updateTicketSchema,
  changeTicketStatusSchema,
  getTicketsQuerySchema,
  ticketIdParamSchema,
} = require('../validations/ticketValidation');

const router = express.Router();

router.post('/', validate(createTicketSchema), asyncHandler(ticketController.createTicket));

router.get('/', validate(getTicketsQuerySchema), asyncHandler(ticketController.getTickets));

router.get(
  '/:id',
  validate(ticketIdParamSchema),
  asyncHandler(ticketController.getTicketById),
);

router.put(
  '/:id',
  validate(updateTicketSchema),
  asyncHandler(ticketController.updateTicket),
);

router.patch(
  '/:id/status',
  validate(changeTicketStatusSchema),
  asyncHandler(ticketController.changeTicketStatus),
);

router.delete(
  '/:id',
  validate(ticketIdParamSchema),
  asyncHandler(ticketController.deleteTicket),
);

module.exports = router;
