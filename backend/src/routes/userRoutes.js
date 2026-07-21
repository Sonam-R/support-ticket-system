const express = require('express');
const userController = require('../controllers/userController');
const asyncHandler = require('../middleware/asyncHandler');
const validate = require('../middleware/validate');
const { getUsersQuerySchema } = require('../validations/userValidation');

const router = express.Router();

router.get('/', validate(getUsersQuerySchema), asyncHandler(userController.getUsers));

module.exports = router;
