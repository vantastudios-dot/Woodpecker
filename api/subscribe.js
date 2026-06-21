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
  html: wrapHtmlEmail(htmlContent, ownerEmail)
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email } = req.body;
  const ownerEmail = process.env.OWNER_EMAIL || 'uprisingstudio25@gmail.com';
  const fromEmail = process.env.FROM_EMAIL || 'uprisingstudio25@gmail.com';
  const appPassword = process.env.GMAIL_APP_PASSWORD;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

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

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending newsletter emails:', error);
    res.status(500).json({ success: false, error: 'Failed to subscribe' });
  }
};
