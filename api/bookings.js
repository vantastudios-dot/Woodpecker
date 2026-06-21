const nodemailer = require('nodemailer');

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
  html: wrapHtmlEmail(htmlContent, ownerEmail),
  headers: {
    'List-Unsubscribe': `<mailto:${ownerEmail}?subject=unsubscribe>`,
    'X-Priority': '3',
    'X-Mailer': 'Nodemailer'
  }
});

const generateBookingId = () => {
  return `BOOK-${Math.floor(10000 + Math.random() * 90000)}`;
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, phone, date, time, guests, remarks } = req.body;
  const email = req.body.email || 'customer@example.com';
  const bookingId = generateBookingId();
  
  const ownerEmail = process.env.OWNER_EMAIL || 'hello@restaurantname.com';
  const fromEmail = process.env.FROM_EMAIL || 'noreply@restaurantname.com';
  const appPassword = process.env.GMAIL_APP_PASSWORD;

  if (!appPassword || appPassword.includes('YOUR_')) {
    console.error('GMAIL_APP_PASSWORD is missing in environment variables!');
    return res.status(500).json({ success: false, error: 'Server configuration error: Missing App Password' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: fromEmail,
      pass: appPassword
    }
  });

  try {
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

    res.status(200).json({ success: true, bookingId });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ success: false, error: 'Failed to send confirmation emails' });
  }
};
