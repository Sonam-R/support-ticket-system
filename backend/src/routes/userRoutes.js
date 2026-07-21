const express = require('express');
const userController = require('../controllers/userController');
const asyncHandler = require('../middleware/asyncHandler');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { ADMIN_ONLY, TICKET_WRITERS } = require('../constants');
const {
  createUserSchema,
  updateUserSchema,
  getUsersQuerySchema,
  userIdParamSchema,
} = require('../validations/userValidation');

const router = express.Router();

router.post(
  '/',
  authenticate,
  authorize(...ADMIN_ONLY),
  validate(createUserSchema),
  asyncHandler(userController.createUser),
);
router.get(
  '/assignable',
  authenticate,
  authorize(...TICKET_WRITERS),
  asyncHandler(userController.getAssignableUsers),
);
router.get(
  '/',
  authenticate,
  authorize(...ADMIN_ONLY),
  validate(getUsersQuerySchema),
  asyncHandler(userController.getUsers),
);
router.get(
  '/:id',
  authenticate,
  authorize(...ADMIN_ONLY),
  validate(userIdParamSchema),
  asyncHandler(userController.getUserById),
);
router.patch(
  '/:id',
  authenticate,
  authorize(...ADMIN_ONLY),
  validate(updateUserSchema),
  asyncHandler(userController.updateUser),
);
router.delete(
  '/:id',
  authenticate,
  authorize(...ADMIN_ONLY),
  validate(userIdParamSchema),
  asyncHandler(userController.deleteUser),
);

module.exports = router;
