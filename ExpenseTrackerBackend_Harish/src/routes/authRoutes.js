const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../middleware/validators');
const verifyToken = require('../middleware/authMiddleware');

// Public routes
router.post('/auth/register', registerValidation, register);
router.post('/auth/login', loginValidation, login);

// Protected routes
router.post('/logout', verifyToken, logout);

module.exports = router;