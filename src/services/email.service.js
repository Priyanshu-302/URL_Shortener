// services/email.service.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // your gmail
    pass: process.env.GMAIL_APP_PASSWORD, // gmail app password (not your login password)
  },
});

const sendEmail = async ({ to, subject, html }) => {
  const info = await transporter.sendMail({
    from: `"SecureLink" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
  console.log("Email sent:", info.messageId);
  return info;
};

module.exports = { sendEmail };
