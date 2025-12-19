const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { requireAuth } = require('../middleware/auth');
const { signup , verifyOtp, me, login, setPassword} = require('../controllers/auth.controller');

const router = express.Router();

router.post('/signup',signup );

router.post('/verify-otp', verifyOtp );

router.post('/set-password', setPassword );
router.post('/login', login );

router.get('/me', requireAuth, me);


module.exports = router;
