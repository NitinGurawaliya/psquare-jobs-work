const nodemailer = require('nodemailer');

function hasSmtpEnv() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: String(process.env.SMTP_SECURE || 'false') === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendOtpEmail({ to, otp }) {
  if (!hasSmtpEnv()) {
    console.log(`[DEV] OTP for ${to}: ${otp}`);
    return;
  }

  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  const transport = getTransport();

  await transport.sendMail({
    from,
    to,
    subject: 'Your Job Bank OTP',
    text: `Your OTP is ${otp}. It expires in 2 minutes.`,
  });
}

module.exports = { sendOtpEmail };
