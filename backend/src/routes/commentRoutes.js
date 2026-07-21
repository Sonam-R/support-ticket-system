const express = require('express');
const commentController = require('../controllers/commentController');
const asyncHandler = require('../middleware/asyncHandler');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { TICKET_WRITERS } = require('../constants');
const {
  createCommentSchema,
  getCommentsSchema,
} = require('../validations/commentValidation');

const router = express.Router({ mergeParams: true });

router.post(
  '/',
  authenticate,
  authorize(...TICKET_WRITERS),
  validate(createCommentSchema),
  asyncHandler(commentController.addComment),
);

router.get('/', validate(getCommentsSchema), asyncHandler(commentController.getComments));

module.exports = router;
