const nodemailer = require('nodemailer');
const { env } = require('../config/env');

let transporter = null;

if (env.emailUser && env.emailPass) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.emailUser,
      pass: env.emailPass,
    },
  });
}

async function sendWelcomeEmail({ email, name }) {
  if (!transporter) {
    console.log(`[Email Mock] Welcome email simulated for ${name} <${email}>`);
    return { success: true, simulated: true };
  }

  const mailOptions = {
    from: `"UPSC EdTech Platform" <${env.emailUser}>`,
    to: email,
    subject: 'Welcome to Aspiria - Your UPSC CSE Preparation Partner!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #1e3a8a;">Welcome to Aspiria, ${name}!</h2>
        <p>Your journey towards becoming a Civil Servant starts now. We are thrilled to have you onboard.</p>
        <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0;">
          <h4 style="margin: 0 0 10px 0; color: #1e293b;">Here is how to get started:</h4>
          <ul style="margin: 0; padding-left: 20px; color: #475569;">
            <li>Explore our curated GS 1, 2, 3, and 4 Masterclasses.</li>
            <li>Take diagnostic Prelims Mock Tests to assess your baseline.</li>
            <li>Use the 24/7 AI Mentor for instant doubt clearing and Mains evaluation.</li>
            <li>Review daily The Hindu & PIB Current Affairs updates.</li>
          </ul>
        </div>
        <p style="color: #64748b; font-size: 13px;">If you have any questions, reply directly to this email.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent to ${email}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`Email send failed for ${email}:`, err.message);
    return { success: false, error: err.message };
  }
}

module.exports = {
  sendWelcomeEmail,
};
