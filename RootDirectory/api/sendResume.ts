import nodemailer from 'nodemailer';

// ---------------- In-Memory Rate Limiter ----------------
const rateLimitMap = new Map<string, { count: number; last: number }>();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;

export default async function handler(req: any, res: any) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // Rate limiting
  const now = Date.now();
  const entry = rateLimitMap.get(ip as string) || { count: 0, last: now };

  if (now - entry.last > WINDOW_MS) {
    // Reset window
    entry.count = 0;
    entry.last = now;
  }

  if (entry.count >= MAX_REQUESTS) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute and try again.' });
  }

  entry.count += 1;
  rateLimitMap.set(ip as string, entry);

  // ---------------- Method check ----------------
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // ---------------- Nodemailer transporter ----------------
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
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
          <h2 style="color:#000000; font-weight: 600;">Hello,</h2>
          <p style="font-size: 16px; color: #333333;">
            Thank you for requesting my resume. You can download it directly using the button below or find it attached to this email:
          </p>
          <table cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
            <tr>
              <td style="background-color: #000000; border-radius: 6px;">
                <a href="${process.env.SITE_URL}/JustinLuftResume.pdf" 
                   style="display:inline-block; padding: 12px 24px; font-size: 16px; color: #ffffff !important; background-color: #000000; text-decoration: none; border-radius: 6px; font-weight: 500;">
                  Download Resume
                </a>
              </td>
            </tr>
          </table>
          <p style="font-size: 16px; color: #333333;">
            <strong>Important:</strong> This is an automated email. Please do not reply directly to this address.
          </p>
          <p style="font-size: 16px; color: #333333;">
            Best regards,<br/>
            <span style="color:#000000; font-weight: 500;">Justin Luft</span>
          </p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 12px; color: #777777;">
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
