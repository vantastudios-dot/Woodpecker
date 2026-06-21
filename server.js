const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8085;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '')));

// Generate unique booking ID
const generateBookingId = () => {
  return `BOOK-${Math.floor(10000 + Math.random() * 90000)}`;
};

// Reusable email wrapper for professional HTML formatting
const wrapHtmlEmail = (content, ownerEmail) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Woodpecker Bar & Lounge</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; color: #333333;">
  <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
    <div style="background-color: #0d1012; padding: 30px 20px; text-align: center; border-bottom: 3px solid #c8974a;">
      <h1 style="color: #c8974a; margin: 0; font-size: 28px; letter-spacing: 2px; text-transform: uppercase;">Woodpecker</h1>
      <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 14px; letter-spacing: 1px;">Premium Bar & Lounge</p>
    </div>
    <div style="padding: 40px 30px;">
      ${content}
    </div>
    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
      <p style="margin: 0; font-size: 12px; color: #888888;">Woodpecker Bar & Lounge, Hazratganj, Lucknow</p>
      <p style="margin: 10px 0 0 0; font-size: 12px; color: #aaaaaa;">
        If you no longer wish to receive these emails, you can 
        <a href="mailto:${ownerEmail}?subject=unsubscribe" style="color: #c8974a; text-decoration: underline;">unsubscribe here</a>.
      </p>
    </div>
  </div>
</body>
</html>
`;

const buildMessage = (to, fromEmail, ownerEmail, subject, text, htmlContent) => ({
  to,
  from: `"Woodpecker Bar" <${fromEmail}>`,
  subject,
  text,
  html: wrapHtmlEmail(htmlContent, ownerEmail)
});

// Helper for Nodemailer transport
const getTransporter = () => {
  const fromEmail = process.env.FROM_EMAIL || 'uprisingstudio25@gmail.com';
  const appPassword = process.env.GMAIL_APP_PASSWORD;
  
  if (!appPassword || appPassword.includes('YOUR_')) {
    throw new Error('Missing GMAIL_APP_PASSWORD');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: fromEmail,
      pass: appPassword
    }
  });
};

// API Route for bookings
app.post('/api/bookings', async (req, res) => {
  const { name, phone, date, time, guests, remarks } = req.body;
  const email = req.body.email || 'customer@example.com';
  const bookingId = generateBookingId();
  
  const ownerEmail = process.env.OWNER_EMAIL || 'uprisingstudio25@gmail.com';
  const fromEmail = process.env.FROM_EMAIL || 'uprisingstudio25@gmail.com';

  try {
    const transporter = getTransporter();

    const ownerMsg = buildMessage(
      ownerEmail,
      fromEmail,
      ownerEmail,
      `New Table Booking - ${name}`,
      `New table reservation:\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nDate: ${date}\nTime: ${time}\nParty Size: ${guests}\nRemarks: ${remarks || 'None'}\nConfirmation #: ${bookingId}`,
      `
        <h2 style="color: #c8974a; margin-top: 0;">NEW BOOKING - ACTION REQUIRED</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Party Size:</strong> ${guests}</p>
        <p><strong>Remarks:</strong> ${remarks || 'None'}</p>
        <p><strong>Confirmation #:</strong> ${bookingId}</p>
      `
    );

    const customerMsg = buildMessage(
      email,
      fromEmail,
      ownerEmail,
      `Your Table Booking Confirmed ✓`,
      `Hi ${name},\nYour table is reserved!\nDate: ${date}\nTime: ${time}\nParty Size: ${guests} people\nLocation: Woodpecker Bar, Hazratganj, Lucknow\nPhone: +91 99364 38000\nConfirmation #: ${bookingId}\nSee you soon!`,
      `
        <h2 style="color: #c8974a; margin-top: 0; text-align: center;">YOUR TABLE IS RESERVED ✓</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Thank you for choosing Woodpecker! Your table reservation is confirmed.</p>
        <div style="background-color: #fbf8f1; border-left: 4px solid #c8974a; padding: 15px; margin: 20px 0;">
          <p style="margin: 5px 0;">📅 <strong>Date:</strong> ${date} at ${time}</p>
          <p style="margin: 5px 0;">👥 <strong>Party Size:</strong> ${guests} people</p>
          <p style="margin: 5px 0;">📝 <strong>Special Requests:</strong> ${remarks || 'None'}</p>
          <p style="margin: 5px 0;">📍 <strong>Location:</strong> Woodpecker Bar, Hazratganj, Lucknow</p>
          <p style="margin: 5px 0;">📞 <strong>Call us:</strong> +91 99364 38000</p>
        </div>
        <p style="font-size: 18px; text-align: center;"><strong>Confirmation #: <span style="color: #c8974a;">${bookingId}</span></strong></p>
        <p>Questions? Reply directly to this email or call us.</p>
        <p>See you soon!</p>
      `
    );

    await Promise.all([
      transporter.sendMail(ownerMsg),
      transporter.sendMail(customerMsg)
    ]);

    console.log('Local Express Server: Booking emails sent successfully via Nodemailer');
    res.status(200).json({ success: true, bookingId });
  } catch (error) {
    console.error('Error sending emails locally:', error);
    res.status(500).json({ success: false, error: 'Failed to send confirmation emails' });
  }
});

// API Route for newsletter subscription
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;
  const ownerEmail = process.env.OWNER_EMAIL || 'uprisingstudio25@gmail.com';
  const fromEmail = process.env.FROM_EMAIL || 'uprisingstudio25@gmail.com';

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

  try {
    const transporter = getTransporter();

    const ownerMsg = buildMessage(
      ownerEmail,
      fromEmail,
      ownerEmail,
      `New Newsletter Subscriber`,
      `New subscriber: ${email}`,
      `
        <h2 style="color: #c8974a; margin-top: 0;">NEW SUBSCRIBER</h2>
        <p>You have a new subscriber to your mailing list:</p>
        <div style="background-color: #fbf8f1; border-left: 4px solid #c8974a; padding: 15px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
        </div>
      `
    );

    const customerMsg = buildMessage(
      email,
      fromEmail,
      ownerEmail,
      `Welcome to Woodpecker Bar & Lounge!`,
      `Hi there,\nThank you for subscribing to our newsletter! You'll be the first to know about our upcoming events, exclusive offers, and new menu items.\nCheers,\nThe Woodpecker Team`,
      `
        <h2 style="color: #c8974a; margin-top: 0; text-align: center;">WELCOME TO WOODPECKER</h2>
        <p>Hi there,</p>
        <p>Thank you for joining our exclusive mailing list!</p>
        <p>You'll be the first to hear about our special events, live music lineups, exclusive offers, and seasonal menus.</p>
        <br/>
        <p>Cheers,</p>
        <p><strong>The Woodpecker Team</strong></p>
      `
    );

    await Promise.all([
      transporter.sendMail(ownerMsg),
      transporter.sendMail(customerMsg)
    ]);

    console.log('Local Express Server: Newsletter emails sent successfully via Nodemailer');
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending newsletter emails locally:', error);
    res.status(500).json({ success: false, error: 'Failed to subscribe' });
  }
});

// For any other route, serve index.html (SPA fallback)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
