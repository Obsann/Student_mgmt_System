require("dotenv").config();
const nodemailer = require("nodemailer");

console.log("SMTP_USER:", process.env.SMTP_USER);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Connection Error:", error);
  } else {
    console.log("✅ Mail server is ready to send credentials!");
    
    // Attempt a test email
    transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER, // Send to self
      subject: "Test Email",
      text: "This is a test email."
    }).then(info => {
      console.log("Email sent:", info.response);
    }).catch(err => {
      console.error("Send error:", err);
    });
  }
});
