const welcomeEmailTemplate = ({ name }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to SecureLink</title>
</head>
<body style="margin:0;padding:0;background-color:#0f0f13;font-family:'Segoe UI',Arial,sans-serif;">
 
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f13;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
 
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="
                    background: linear-gradient(135deg, #7c3aed, #4f46e5);
                    border-radius: 16px;
                    padding: 12px 28px;
                  ">
                    <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:1px;">
                      🔗 SecureLink
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
 
          <!-- Card -->
          <tr>
            <td style="
              background: linear-gradient(145deg, #1a1a2e, #16213e);
              border-radius: 20px;
              border: 1px solid #2a2a4a;
              overflow: hidden;
            ">
 
              <!-- Top accent bar -->
              <tr>
                <td style="
                  height: 4px;
                  background: linear-gradient(90deg, #7c3aed, #4f46e5, #06b6d4);
                "></td>
              </tr>
 
              <!-- Hero area -->
              <tr>
                <td style="
                  background: linear-gradient(135deg, #7c3aed18, #4f46e510);
                  padding: 48px 48px 36px;
                  text-align: center;
                  border-bottom: 1px solid #2a2a4a;
                ">
                  <div style="font-size:56px;margin-bottom:16px;">🚀</div>
 
                  <h1 style="
                    margin: 0 0 12px 0;
                    font-size: 28px;
                    font-weight: 700;
                    color: #ffffff;
                  ">
                    Welcome aboard, ${name}!
                  </h1>
 
                  <p style="
                    margin: 0;
                    font-size: 15px;
                    color: #8b8ba7;
                    line-height: 1.6;
                    max-width: 380px;
                    display: inline-block;
                  ">
                    Your SecureLink account is ready. Start sharing links with full control over who can access them.
                  </p>
                </td>
              </tr>
 
              <!-- Features -->
              <tr>
                <td style="padding: 36px 48px 40px;">
 
                  <p style="
                    margin: 0 0 20px 0;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    color: #4a4a6a;
                    font-weight: 600;
                  ">What you can do</p>
 
                  <!-- Feature 1 -->
                  <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:12px;">
                    <tr>
                      <td style="
                        background:#ffffff06;
                        border:1px solid #ffffff0e;
                        border-radius:12px;
                        padding:16px 20px;
                      ">
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="width:40px;vertical-align:middle;font-size:22px;">🌍</td>
                            <td style="vertical-align:middle;padding-left:14px;">
                              <span style="color:#ffffff;font-size:14px;font-weight:600;">Public Short URLs</span>
                              <br/>
                              <span style="color:#8b8ba7;font-size:13px;">Share with anyone — no restrictions</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
 
                  <!-- Feature 2 -->
                  <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:12px;">
                    <tr>
                      <td style="
                        background:#7c3aed0a;
                        border:1px solid #7c3aed33;
                        border-radius:12px;
                        padding:16px 20px;
                      ">
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="width:40px;vertical-align:middle;font-size:22px;">🔐</td>
                            <td style="vertical-align:middle;padding-left:14px;">
                              <span style="color:#a78bfa;font-size:14px;font-weight:600;">Protected URLs</span>
                              <br/>
                              <span style="color:#8b8ba7;font-size:13px;">Restrict access to specific email addresses</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
 
                  <!-- Feature 3 -->
                  <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:32px;">
                    <tr>
                      <td style="
                        background:#06b6d40a;
                        border:1px solid #06b6d433;
                        border-radius:12px;
                        padding:16px 20px;
                      ">
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="width:40px;vertical-align:middle;font-size:22px;">✉️</td>
                            <td style="vertical-align:middle;padding-left:14px;">
                              <span style="color:#22d3ee;font-size:14px;font-weight:600;">Magic Link Access</span>
                              <br/>
                              <span style="color:#8b8ba7;font-size:13px;">Verified one-time links via email</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
 
                  <!-- CTA -->
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="
                        background: linear-gradient(135deg, #7c3aed, #4f46e5);
                        border-radius: 12px;
                        box-shadow: 0 8px 24px #7c3aed44;
                      ">
                        <a href="${process.env.CLIENT_URL || '#'}" style="
                          display: inline-block;
                          padding: 16px 40px;
                          color: #ffffff;
                          font-size: 15px;
                          font-weight: 600;
                          text-decoration: none;
                        ">
                          Go to Dashboard →
                        </a>
                      </td>
                    </tr>
                  </table>
 
                </td>
              </tr>
 
            </td>
          </tr>
 
          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0;font-size:12px;color:#4a4a6a;">
                You're receiving this because you just signed up for SecureLink.
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:#4a4a6a;">
                © 2025 SecureLink. Privacy-first URL sharing.
              </p>
            </td>
          </tr>
 
        </table>
      </td>
    </tr>
  </table>
 
</body>
</html>
  `;
};

module.exports = { welcomeEmailTemplate };
