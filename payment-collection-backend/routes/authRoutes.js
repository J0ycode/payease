const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// POST /api/auth/login — issue a JWT for a given accountNumber
router.post('/login', login);

module.exports = router;
