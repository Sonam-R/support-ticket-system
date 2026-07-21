const express = require('express');
const userController = require('../controllers/userController');
const asyncHandler = require('../middleware/asyncHandler');
const validate = require('../middleware/validate');
const {
  createUserSchema,
  updateUserSchema,
  getUsersQuerySchema,
  userIdParamSchema,
} = require('../validations/userValidation');

const router = express.Router();

router.post('/', validate(createUserSchema), asyncHandler(userController.createUser));
router.get('/', validate(getUsersQuerySchema), asyncHandler(userController.getUsers));
router.get('/:id', validate(userIdParamSchema), asyncHandler(userController.getUserById));
router.patch('/:id', validate(updateUserSchema), asyncHandler(userController.updateUser));
router.delete('/:id', validate(userIdParamSchema), asyncHandler(userController.deleteUser));

module.exports = router;
