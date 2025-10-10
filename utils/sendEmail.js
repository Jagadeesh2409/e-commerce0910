const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secureConnection: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Jagadeesh App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🔐 Your One-Time Password (OTP)",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
        <div style="max-width: 480px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="background: #4285F4; color: white; text-align: center; padding: 15px 0;">
            <h2 style="margin: 0;">Jagadeesh Secure Login</h2>
          </div>
          <div style="padding: 20px; text-align: center;">
            <p style="font-size: 16px; color: #333;">Use the following OTP to complete your login or password reset:</p>
            <h1 style="font-size: 36px; letter-spacing: 5px; color: #4285F4; margin: 20px 0;">${text}</h1>
            <p style="font-size: 14px; color: #777;">This OTP will expire in <strong>5 minutes</strong>. Do not share it with anyone.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #999;">If you didn’t request this, you can safely ignore this email.</p>
          </div>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
