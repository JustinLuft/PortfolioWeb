import nodemailer from 'nodemailer';
import path from 'path';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

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
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Justin Luft – Resume",
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #111; line-height: 1.7; max-width: 600px; margin: auto; padding: 26px; border: 1px solid #dcdcdc; border-radius: 8px; background-color: #ffffff;">
          
          <h2 style="font-weight: 600; font-size: 22px; margin-bottom: 16px;">
            Hello,
          </h2>

          <p style="font-size: 16px;">
            Thank you for requesting my resume. You can download it using the button below, and it is also attached to this email.
          </p>

          <a href="${process.env.SITE_URL}/JustinLuftResume.pdf"
            style="
              display:inline-block; 
              padding: 12px 24px; 
              margin: 24px 0; 
              font-size: 15px; 
              font-weight: 600; 
              color: #ffffff !important; 
              background-color: #000000 !important; 
              border: 2px solid #000000 !important; 
              text-decoration: none; 
              border-radius: 6px;
            "
          >
            Download Resume
          </a>

          <p style="font-size: 16px;">
            <strong>Note:</strong> This is an automated email. Please do not reply to this address.
          </p>

          <p style="font-size: 16px; margin-top: 24px;">
            Best regards,<br/>
            <span style="font-weight: 600;">Justin Luft</span>
          </p>

          <hr style="border: none; border-top: 1px solid #e7e7e7; margin: 28px 0;">
          <p style="font-size: 12px; color: #777;">
            You received this email because you requested a copy of Justin Luft's resume.
          </p>
        </div>
      `,
      text: `
        Hello,

        Thank you for requesting my resume. You can download it here: ${process.env.SITE_URL}/JustinLuftResume.pdf
        The resume is also attached to this email.

        Note: This is an automated email. Please do not reply.

        Best regards,
        Justin Luft
      `,
      attachments: [
        {
          filename: "JustinLuftResume.pdf",
          path: path.join(process.cwd(), 'public', 'JustinLuftResume.pdf'),
        },
      ],
    });

    res.status(200).json({ message: 'Resume sent successfully!' });
  } catch (err: any) {
    console.error('Error sending resume email:', err);
    res.status(500).json({ error: 'Failed to send resume. Please try again later.' });
  }
}
