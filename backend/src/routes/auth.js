const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { generateOtp, hashOtp, isExpired } = require('../utils/otp');
const { sendOtpEmail } = require('../utils/mailer');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

router.post('/signup', async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const name = String(req.body.name || '').trim();

  if (!email || !name) return res.status(400).json({ message: 'Email and name are required' });

  const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL);

  let user = await User.findOne({ email });
  if (user?.passwordHash) {
    return res.status(409).json({ message: 'Account already exists. Please sign in.' });
  }

  if (!user) {
    user = await User.create({
      email,
      name,
      role: adminEmail && email === adminEmail ? 'admin' : 'user',
    });
  } else {
    user.name = name;
    if (adminEmail && email === adminEmail) user.role = 'admin';
  }

  const otp = generateOtp();
  user.otpHash = hashOtp(otp);
  user.otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000);
  user.otpVerified = false;
  await user.save();

  await sendOtpEmail({ to: email, otp });

  return res.json({ message: 'OTP sent' });
});

router.post('/verify-otp', async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const otp = String(req.body.otp || '').trim();

  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (!user.otpHash || !user.otpExpiresAt) {
    return res.status(400).json({ message: 'OTP not requested. Please sign up again.' });
  }

  if (isExpired(user.otpExpiresAt)) {
    return res.status(400).json({ message: 'OTP expired. Please request a new OTP.' });
  }

  if (hashOtp(otp) !== user.otpHash) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  user.otpVerified = true;
  user.otpHash = null;
  user.otpExpiresAt = null;
  await user.save();

  return res.json({ message: 'OTP verified' });
});

router.post('/set-password', async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');

  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
  if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (!user.otpVerified) {
    return res.status(400).json({ message: 'OTP not verified' });
  }

  if (user.passwordHash) {
    return res.status(409).json({ message: 'Password already set. Please sign in.' });
  }

  user.passwordHash = await bcrypt.hash(password, 10);
  user.otpVerified = false;
  await user.save();

  return res.json({ message: 'Password set' });
});

router.post('/login', async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');

  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

  const user = await User.findOne({ email });
  if (!user || !user.passwordHash) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  );

  return res.json({
    token,
    user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role },
  });
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select('email name role');
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json({ user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role } });
});

module.exports = router;
