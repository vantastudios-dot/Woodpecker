const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
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

// Configure SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Generate unique booking ID
const generateBookingId = () => {
  return `BOOK-${Math.floor(10000 + Math.random() * 90000)}`;
};

// API Route for bookings
app.post('/api/bookings', async (req, res) => {
  const { name, phone, date, guests } = req.body;
  const email = req.body.email || 'customer@example.com'; // Adding a fallback for testing since form didn't originally have email
  const bookingId = generateBookingId();
  
  const ownerEmail = process.env.OWNER_EMAIL || 'hello@restaurantname.com';
  const fromEmail = process.env.FROM_EMAIL || 'noreply@restaurantname.com';

  console.log(`New booking received: ${name}, ${phone}, ${date}, Guests: ${guests}`);

  try {
    // 1. Email to Restaurant Owner
    const ownerMsg = {
      to: ownerEmail,
      from: fromEmail,
      subject: `New Table Booking - ${name}`,
      text: `New table reservation:
Name: ${name}
Phone: ${phone}
Email: ${email}
Date: ${date}
Party Size: ${guests}
Confirmation #: ${bookingId}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #c8974a;">NEW BOOKING - ACTION REQUIRED</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Party Size:</strong> ${guests}</p>
          <p><strong>Confirmation #:</strong> ${bookingId}</p>
          <hr/>
          <p><a href="http://localhost:8085/admin">View in Admin Panel</a></p>
        </div>
      `,
    };

    // 2. Email to Customer
    const customerMsg = {
      to: email,
      from: fromEmail,
      subject: `Your Table Booking Confirmed ✓`,
      text: `Hi ${name},\nYour table is reserved!\nDate: ${date}\nParty Size: ${guests} people\nLocation: Woodpecker Bar, Hazratganj, Lucknow\nPhone: +91 99364 38000\nConfirmation #: ${bookingId}\nSee you soon!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; text-align: center;">
          <h2 style="color: #c8974a;">YOUR TABLE BOOKING CONFIRMED ✓</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>Your table is reserved!</p>
          <ul style="list-style: none; padding: 0; display: inline-block; text-align: left;">
            <li>📅 <strong>Date:</strong> ${date}</li>
            <li>👥 <strong>Party Size:</strong> ${guests} people</li>
            <li>📍 <strong>Location:</strong> Woodpecker Bar, Hazratganj, Lucknow</li>
            <li>📞 <strong>Call us:</strong> +91 99364 38000</li>
          </ul>
          <p><strong>Confirmation #:</strong> ${bookingId}</p>
          <p>Questions? Reply to this email or call us directly.</p>
          <p>See you soon!</p>
        </div>
      `,
    };

    // Send emails if API key is present
    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'YOUR_SENDGRID_API_KEY' && process.env.SENDGRID_API_KEY !== 'SG.YOUR_SENDGRID_API_KEY') {
      await Promise.all([
        sgMail.send(ownerMsg),
        sgMail.send(customerMsg)
      ]);
      console.log('Emails sent successfully');
    } else {
      console.log('SENDGRID_API_KEY not set. Skipping actual email send. Pretending it succeeded.');
    }

    res.status(200).json({ success: true, bookingId });
  } catch (error) {
    console.error('Error sending emails:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    res.status(500).json({ success: false, error: 'Failed to send confirmation emails' });
  }
});

// API Route for newsletter subscription
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;
  const ownerEmail = process.env.OWNER_EMAIL || 'hello@restaurantname.com';
  const fromEmail = process.env.FROM_EMAIL || 'noreply@restaurantname.com';

  console.log(`New newsletter subscription: ${email}`);

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

  try {
    const ownerMsg = {
      to: ownerEmail,
      from: fromEmail,
      subject: `New Newsletter Subscriber`,
      text: `New subscriber: ${email}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #c8974a;">NEW SUBSCRIBER</h2>
          <p>You have a new subscriber to your mailing list:</p>
          <p><strong>Email:</strong> ${email}</p>
        </div>
      `,
    };

    const customerMsg = {
      to: email,
      from: fromEmail,
      subject: `Welcome to Woodpecker Bar & Lounge!`,
      text: `Hi there,\nThank you for subscribing to our newsletter! You'll be the first to know about our upcoming events, exclusive offers, and new menu items.\nCheers,\nThe Woodpecker Team`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; text-align: center;">
          <h2 style="color: #c8974a;">WELCOME TO WOODPECKER</h2>
          <p>Hi there,</p>
          <p>Thank you for joining our mailing list!</p>
          <p>You'll be the first to hear about our special events, live music lineups, exclusive offers, and seasonal menus.</p>
          <br/>
          <p>Cheers,</p>
          <p><strong>The Woodpecker Team</strong></p>
        </div>
      `,
    };

    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'YOUR_SENDGRID_API_KEY' && process.env.SENDGRID_API_KEY !== 'SG.YOUR_SENDGRID_API_KEY') {
      await Promise.all([
        sgMail.send(ownerMsg),
        sgMail.send(customerMsg)
      ]);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending newsletter emails:', error);
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
