const express = require('express');
const commentController = require('../controllers/commentController');
const asyncHandler = require('../middleware/asyncHandler');
const validate = require('../middleware/validate');
const {
  createCommentSchema,
  getCommentsSchema,
} = require('../validations/commentValidation');

const router = express.Router({ mergeParams: true });

router.post('/', validate(createCommentSchema), asyncHandler(commentController.addComment));

router.get('/', validate(getCommentsSchema), asyncHandler(commentController.getComments));

module.exports = router;
