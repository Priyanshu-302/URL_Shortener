const accessEmailTemplate = ({ accessLink, shortCode }) => {
  return `
    <div style="font-family: Arial, sans-serif;">
      <h2>Protected URL Access</h2>

      <p>
        You requested access to the protected link:
      </p>

      <p>
        <strong>${shortCode}</strong>
      </p>

      <a
        href="${accessLink}"
        style="
          display:inline-block;
          padding:12px 20px;
          background:#000;
          color:#fff;
          text-decoration:none;
          border-radius:6px;
        "
      >
        Access Link
      </a>

      <p>
        This link expires in 15 minutes.
      </p>

      <p>
        If you did not request this,
        ignore this email.
      </p>
    </div>
  `;
};

module.exports = { accessEmailTemplate };
