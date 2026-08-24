require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: '*', // Allow all origins for local dev; restrict in production
  methods: ['GET', 'POST'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Nodemailer Transporter ────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'Portfolio Email API is running 🚀' });
});

// ─── Send Email Endpoint ───────────────────────────────────────────────────────
app.post('/api/send-email', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and message are required.',
    });
  }

  // Simple email regex check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.',
    });
  }

  // Mail options — sent TO your inbox
  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // Your inbox (sksatyam3373@gmail.com)
    replyTo: email,
    subject: subject
      ? `[Portfolio] ${subject}`
      : `[Portfolio] New message from ${name}`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; background: #0f0f1a; color: #e0e0e0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #7c3aed, #2563eb); padding: 30px; text-align: center;">
          <h1 style="margin: 0; color: #fff; font-size: 24px;">📬 New Portfolio Message</h1>
        </div>
        <div style="padding: 30px;">
          <table style="width:100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #a78bfa; font-weight: bold; width: 100px;">Name:</td>
              <td style="padding: 10px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #a78bfa; font-weight: bold;">Email:</td>
              <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #60a5fa;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #a78bfa; font-weight: bold;">Subject:</td>
              <td style="padding: 10px 0;">${subject || 'No subject'}</td>
            </tr>
          </table>
          <hr style="border: 1px solid #2d2d50; margin: 20px 0;">
          <h3 style="color: #a78bfa; margin-bottom: 10px;">Message:</h3>
          <p style="line-height: 1.7; white-space: pre-wrap; background: #1a1a2e; padding: 15px; border-radius: 8px; border-left: 4px solid #7c3aed;">${message}</p>
        </div>
        <div style="background: #1a1a2e; text-align: center; padding: 15px; font-size: 12px; color: #666;">
          Sent via Satyam Kumar Raj's Portfolio Contact Form
        </div>
      </div>
    `,
  };

  // Auto-reply to sender
  const autoReplyOptions = {
    from: `"Satyam Kumar Raj" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Thanks for reaching out, ${name}! 🙌`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; background: #0f0f1a; color: #e0e0e0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #7c3aed, #2563eb); padding: 30px; text-align: center;">
          <h1 style="margin: 0; color: #fff; font-size: 24px;">Hi ${name}! 👋</h1>
        </div>
        <div style="padding: 30px; line-height: 1.8;">
          <p>Thanks for reaching out through my portfolio! I've received your message and will get back to you as soon as possible.</p>
          <p>Here's a copy of what you sent:</p>
          <blockquote style="background: #1a1a2e; padding: 15px; border-radius: 8px; border-left: 4px solid #7c3aed; font-style: italic;">${message}</blockquote>
          <p>— <strong>Satyam Kumar Raj</strong><br>Full Stack Developer</p>
        </div>
        <div style="background: #1a1a2e; text-align: center; padding: 15px; font-size: 12px; color: #666;">
          This is an automated reply. Please do not reply to this email.
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(autoReplyOptions);

    res.status(200).json({
      success: true,
      message: 'Email sent successfully! I will get back to you soon.',
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Portfolio Email Server running on http://localhost:${PORT}`);
  console.log(`📧 Sending emails as: ${process.env.EMAIL_USER || '(not configured)'}`);
  console.log(`\nEndpoints:`);
  console.log(`  GET  http://localhost:${PORT}/          → Health check`);
  console.log(`  POST http://localhost:${PORT}/api/send-email → Send email\n`);
});
