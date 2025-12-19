const crypto = require('crypto');

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function hashOtp(otp) {
  return crypto.createHash('sha256').update(String(otp)).digest('hex');
}

function isExpired(expiresAt) {
  return !expiresAt || new Date(expiresAt).getTime() < Date.now();
}

module.exports = { generateOtp, hashOtp, isExpired };
