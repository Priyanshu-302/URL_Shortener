const sendEmail = async ({ to, subject, html }) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "dasp98458@gmail.com";

  if (!apiKey) {
    throw new Error("BREVO_API_KEY environment variable is not defined");
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: "SecureLink",
        email: senderEmail,
      },
      to: [
        {
          email: to,
        },
      ],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Brevo API error: ${errorText}`);
  }

  const data = await response.json();
  console.log("Email sent successfully via Brevo API:", data);
  return data;
};

module.exports = { sendEmail };
