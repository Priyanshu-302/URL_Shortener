const welcomeEmailTemplate = ({ name }) => {
  return `
    <div style="font-family: Arial, sans-serif;">
      <h1>Welcome ${name} 👋</h1>

      <p>
        Your account has been created successfully.
      </p>

      <p>
        You can now create:
      </p>

      <ul>
        <li>Public short URLs</li>
        <li>Protected secure URLs</li>
      </ul>

      <p>
        Thanks for joining us 🚀
      </p>
    </div>
  `;
};

module.exports = { welcomeEmailTemplate };
