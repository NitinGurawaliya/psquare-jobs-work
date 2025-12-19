const brevo = require('@getbrevo/brevo');

let apiInstance = null;

function hasBrevoEnv() {
  // API key properly check करें - trim करके empty string check
  const apiKey = process.env.BREVO_API_KEY;
  return Boolean(apiKey && String(apiKey).trim().length > 0);
}

function getBrevoClient() {
  if (!apiInstance && hasBrevoEnv()) {
    // Brevo API client initialization - सही तरीका
    apiInstance = new brevo.TransactionalEmailsApi();
    // API key set करें
    apiInstance.setApiKey(0, process.env.BREVO_API_KEY); // 0 = apiKey enum value
  }
  return apiInstance;
}

async function sendEmail({ to, otp }) {
  // Development mode - अगर API key नहीं है तो console में print करें
  if (!hasBrevoEnv()) {
    console.log(`[DEV MODE] OTP for ${to}: ${otp}`);
    return { success: true };
  }

  try {
    const client = getBrevoClient();
    if (!client) {
      throw new Error('Brevo client not initialized');
    }

    const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.MAIL_FROM;
    const senderName = process.env.BREVO_SENDER_NAME || 'Job Bank';

    if (!senderEmail) {
      throw new Error('BREVO_SENDER_EMAIL or MAIL_FROM environment variable is required');
    }

    // Brevo SendSmtpEmail object बनाएं
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = 'OTP for Job Bank';
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Your OTP Code</h2>
        <p>Your OTP is: <strong style="font-size: 24px; color: #007bff;">${otp}</strong></p>
        <p>This OTP will expire in 2 minutes.</p>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">If you didn't request this OTP, please ignore this email.</p>
      </div>
    `;
    sendSmtpEmail.textContent = `Your OTP is ${otp}. It expires in 2 minutes.`;
    sendSmtpEmail.sender = { name: senderName, email: senderEmail };
    sendSmtpEmail.to = [{ email: to }];

    // Email भेजें
    const result = await client.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email sent successfully via Brevo. Message ID:", result.messageId);

    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("❌ Email send error:", error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
}

module.exports = {
  sendEmail
};