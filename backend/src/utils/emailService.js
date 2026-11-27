import nodemailer from 'nodemailer';

let cachedTransporter = null;

/**
 * Lazily create the Nodemailer Gmail SMTP transporter after dotenv has loaded.
 * Strips any spaces from EMAIL_APP_PASSWORD and never logs credentials.
 */
const getTransporter = () => {
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_APP_PASSWORD?.replace(/\s+/g, '');

  if (!user || !pass) {
    throw new Error('Email service is not configured (missing EMAIL_USER or EMAIL_APP_PASSWORD)');
  }

  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });
  }

  return cachedTransporter;
};

/**
 * Verify Gmail SMTP connectivity and authentication safely.
 */
export const verifyEmailConnection = async () => {
  const transporter = getTransporter();
  await transporter.verify();
  return true;
};

const sendEmail = async ({ to, subject, text }) => {
  if (!to) {
    throw new Error('Recipient email address is required');
  }

  const transporter = getTransporter();
  const fromUser = process.env.EMAIL_USER?.trim();

  const info = await transporter.sendMail({
    from: `"Service Request Portal" <${fromUser}>`,
    to,
    subject,
    text
  });

  return info;
};

export default sendEmail;
