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
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="color:#1a73e8; font-weight: 600;">Hello,</h2>
          <p style="font-size: 16px;">
            Thank you for requesting my resume. You can download it directly using the button below or find it attached to this email:
          </p>

          <a href="${process.env.SITE_URL}/JustinLuftResume.pdf" 
             style="display:inline-block; padding: 12px 24px; margin: 20px 0; font-size: 16px; color: #ffffff; background-color: #1a73e8; text-decoration: none; border-radius: 6px; font-weight: 500;">
            Download Resume
          </a>

          <p style="font-size: 16px;">
            <strong>Important:</strong> This is an automated email. Please do not reply directly to this address.
          </p>
          <p style="font-size: 16px;">
            Best regards,<br/>
            <span style="color:#1a73e8; font-weight: 500;">Justin Luft</span>
          </p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 12px; color: #777;">
            You received this email because you requested a copy of Justin Luft's resume.
          </p>
        </div>
      `,
      text: `
        Hello,

        Thank you for requesting my resume. You can download it here: ${process.env.SITE_URL}/JustinLuftResume.pdf
        or find it attached to this email.

        IMPORTANT: This is an automated email. Please do not reply directly to this address.

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
