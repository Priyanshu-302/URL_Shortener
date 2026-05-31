const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD ? process.env.GMAIL_APP_PASSWORD.replace(/\s+/g, "") : "",
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
