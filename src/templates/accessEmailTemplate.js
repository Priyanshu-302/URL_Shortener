const accessEmailTemplate = ({ accessLink, shortCode }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Access Request</title>
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
 
              <!-- Body -->
              <tr>
                <td style="padding: 48px 48px 40px;">
 
                  <!-- Lock icon circle -->
                  <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                    <tr>
                      <td style="
                        background: linear-gradient(135deg, #7c3aed22, #4f46e522);
                        border: 1px solid #7c3aed44;
                        border-radius: 50%;
                        width: 64px;
                        height: 64px;
                        text-align: center;
                        vertical-align: middle;
                        font-size: 28px;
                        line-height: 64px;
                      ">🔐</td>
                    </tr>
                  </table>
 
                  <h1 style="
                    margin: 0 0 12px 0;
                    font-size: 26px;
                    font-weight: 700;
                    color: #ffffff;
                    line-height: 1.3;
                  ">
                    You've been granted access
                  </h1>
 
                  <p style="
                    margin: 0 0 28px 0;
                    font-size: 15px;
                    color: #8b8ba7;
                    line-height: 1.6;
                  ">
                    Someone shared a protected link with you. Click the button below to access it securely.
                  </p>
 
                  <!-- Short code pill -->
                  <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                    <tr>
                      <td style="
                        background: #ffffff0a;
                        border: 1px solid #ffffff14;
                        border-radius: 8px;
                        padding: 10px 18px;
                      ">
                        <span style="color:#8b8ba7;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Short Code</span>
                        <br/>
                        <span style="color:#a78bfa;font-size:16px;font-weight:600;font-family:monospace;">
                          ${shortCode}
                        </span>
                      </td>
                    </tr>
                  </table>
 
                  <!-- CTA Button -->
                  <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                    <tr>
                      <td style="
                        background: linear-gradient(135deg, #7c3aed, #4f46e5);
                        border-radius: 12px;
                        box-shadow: 0 8px 24px #7c3aed44;
                      ">
                        <a href="${accessLink}" style="
                          display: inline-block;
                          padding: 16px 40px;
                          color: #ffffff;
                          font-size: 15px;
                          font-weight: 600;
                          text-decoration: none;
                          letter-spacing: 0.3px;
                        ">
                          Access Protected Link →
                        </a>
                      </td>
                    </tr>
                  </table>
 
                  <!-- Divider -->
                  <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:24px;">
                    <tr>
                      <td style="border-top:1px solid #2a2a4a;"></td>
                    </tr>
                  </table>
 
                  <!-- Warning pills -->
                  <table cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="padding-right:12px;width:50%;">
                        <table cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="
                              background:#f59e0b11;
                              border:1px solid #f59e0b33;
                              border-radius:8px;
                              padding:12px 14px;
                            ">
                              <span style="font-size:18px;">⏱</span>
                              <br/>
                              <span style="color:#fbbf24;font-size:12px;font-weight:600;">Expires in 15 minutes</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                      <td style="width:50%;">
                        <table cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="
                              background:#ef444411;
                              border:1px solid #ef444433;
                              border-radius:8px;
                              padding:12px 14px;
                            ">
                              <span style="font-size:18px;">🚫</span>
                              <br/>
                              <span style="color:#f87171;font-size:12px;font-weight:600;">Single use only</span>
                            </td>
                          </tr>
                        </table>
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
                Didn't request this? Ignore this email — the link will expire automatically.
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

module.exports = { accessEmailTemplate };
