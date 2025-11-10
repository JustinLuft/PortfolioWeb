import nodemailer from 'nodemailer';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Justin Luft – Resume",
      html: `
        <div style="font-family: Arial, sans-serif; color: #0af; line-height: 1.5;">
          <h2 style="color:#ff1493;">Hello,</h2>
          <p>
            Thank you for requesting my resume. Please find it attached to this email.
          </p>
          <p>
            <strong>Note:</strong> This is not my main email account. Please do not reply to this address.
          </p>
          <p>
            Best regards,<br/>
            <span style="color:#ff1493;">Justin Luft</span>
          </p>
        </div>
      `,
      text: `
        Hello,

        Thank you for requesting my resume. Please find it attached.

        NOTE: This is not my main email account. Please do not reply to this address.

        Best regards,
        Justin Luft
      `,
      attachments: [
        {
          filename: "JustinLuftResume.pdf",
          path: `${process.env.SITE_URL}/JustinLuftResume.pdf`,
        },
      ],
    });

    res.status(200).json({ message: 'Resume sent successfully!' });
  } catch (err: any) {
    console.error('Error sending resume email:', err);
    res.status(500).json({ error: 'Failed to send resume. Please try again later.' });
  }
}
