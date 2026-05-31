const nodemailer = require("nodemailer");

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD ? process.env.GMAIL_APP_PASSWORD.replace(/\s+/g, "") : "",
      },
    });
  }
  return transporter;
};

const sendEmail = async ({ to, subject, html }) => {
  const transport = getTransporter();
  const info = await transport.sendMail({
    from: `"SecureLink" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
  console.log("Email sent:", info.messageId);
  return info;
};

module.exports = { sendEmail };
