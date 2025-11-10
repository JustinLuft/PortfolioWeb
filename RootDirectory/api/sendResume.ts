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
      subject: "Justin Luft Resume",
      text: "Hello! Here’s my resume as requested.",
      attachments: [
        {
          filename: "Justin_Luft_Resume.pdf",
          path: path.join(process.cwd(), 'public', 'JustinLuftResume.pdf'),
        },
      ],
    });

    res.status(200).json({ message: 'Resume sent successfully!' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
