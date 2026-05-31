const { resend } = require("../config/resend");

// Send Email
const sendEmail = async ({ to, subject, html }) => {
  const response = await resend.emails.send({
    from: process.env.RESEND_SENDER_EMAIL,

    to,

    subject,

    html,
  });

  console.log(response);

  return response;
};

module.exports = {
  sendEmail,
};
