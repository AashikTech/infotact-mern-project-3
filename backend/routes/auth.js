const express = require('express');
const { register, login, getMe } = require('../controllers/auth');
const { protect } = require('../middleware/auth');
const { validateRegistration, validateLogin } = require('../middleware/validation');

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);

module.exports = router;
