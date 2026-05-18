const nodemailer = require("nodemailer");

/**
 * Mailer Configuration
 * Uses Gmail service for better compatibility with App Passwords.
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify connection configuration on startup
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter.verify((error, success) => {
    if (error) {
      console.error("❌ SMTP Connection Error:", error.message);
    } else {
      console.log("✅ Mail server is ready to send credentials!");
    }
  });
} else {
  console.log("⚠️ Mailer running in DEV MODE (Logging to console only)");
}

/**
 * Send student credentials email.
 */
async function sendCredentialsEmail({ to, studentName, username, password, grade, section }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`\n[MAILER — DEV MODE] Credentials for ${studentName}:`);
    console.log(`  To:       ${to}`);
    console.log(`  Username: ${username}`);
    console.log(`  Password: ${password}`);
    console.log(`  Grade:    ${grade}${section}\n`);
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"Kera High School" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your Kera High School SMS Account Credentials",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 40px 32px; text-align: center; }
    .header h1 { color: #fff; font-size: 24px; margin: 0; }
    .header p  { color: #c7d2fe; font-size: 14px; margin: 8px 0 0; }
    .body   { padding: 32px; }
    .body p { color: #475569; font-size: 15px; line-height: 1.6; }
    .cred-box { background: #f1f5f9; border-radius: 12px; padding: 20px 24px; margin: 24px 0; }
    .cred-row { display: flex; justify-content: space-between; margin-bottom: 12px; }
    .cred-row:last-child { margin-bottom: 0; }
    .cred-label { color: #64748b; font-size: 13px; font-weight: 600; }
    .cred-value { color: #1e293b; font-size: 14px; font-weight: 700; font-family: monospace; }
    .footer { background: #f8fafc; padding: 20px 32px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; }
    .btn { display: inline-block; margin-top: 16px; padding: 14px 32px; background: #4f46e5; color: #fff; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 Welcome to Kera High School SMS</h1>
      <p>Your student account has been created and approved.</p>
    </div>
    <div class="body">
      <p>Dear <strong>${studentName}</strong>,</p>
      <p>Your enrollment has been approved by the school administration. You can now log in to your student portal using the credentials below.</p>
      <div class="cred-box">
        <div class="cred-row">
          <span class="cred-label">Username</span>
          <span class="cred-value">${username}</span>
        </div>
        <div class="cred-row">
          <span class="cred-label">Password</span>
          <span class="cred-value">${password}</span>
        </div>
        <div class="cred-row">
          <span class="cred-label">Grade / Section</span>
          <span class="cred-value">${grade}${section}</span>
        </div>
      </div>
      <p><strong>Important:</strong> Please change your password after your first login for security.</p>
      <center><a class="btn" href="${process.env.FRONTEND_URL || "http://localhost:5173"}/login">Sign In to Portal</a></center>
    </div>
    <div class="footer">
      Kera High School · This is an automated message. Do not reply.
    </div>
  </div>
</body>
</html>
    `,
  });
}

/**
 * Send password reset email.
 */
async function sendPasswordResetEmail({ to, name, token }) {
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${token}`;

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`\n[MAILER — DEV MODE] Password reset for ${name}:`);
    console.log(`  To:  ${to}`);
    console.log(`  URL: ${resetUrl}\n`);
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"Kera High School" <${process.env.SMTP_USER}>`,
    to,
    subject: "Reset Your Kera SMS Password",
    html: `
<p>Hi ${name},</p>
<p>Click the link below to reset your password. This link expires in 1 hour.</p>
<p><a href="${resetUrl}" style="color:#4f46e5;font-weight:bold;">Reset Password</a></p>
<p>If you didn't request this, ignore this email.</p>
<p>— Kera High School</p>
    `,
  });
}

module.exports = { sendCredentialsEmail, sendPasswordResetEmail };
