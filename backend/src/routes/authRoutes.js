const express = require('express');
const authController = require('../controllers/authController');
const asyncHandler = require('../middleware/asyncHandler');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validate');
const { loginSchema } = require('../validations/authValidation');

const router = express.Router();

router.post('/login', validate(loginSchema), asyncHandler(authController.login));
router.get('/me', authenticate, asyncHandler(authController.getMe));
router.post('/logout', authenticate, asyncHandler(authController.logout));

module.exports = router;
