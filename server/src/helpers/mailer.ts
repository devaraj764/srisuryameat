import dotenv from 'dotenv'
dotenv.config();
import nodemailer, { Transporter } from 'nodemailer';

// Define the transporter
const transporter: Transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD
  }
});

// Function to send emails
export async function sendMails(subject: string, body: string, emails: string[]): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.APP_USER,
      to: emails.join(','),
      subject: subject,
      html: body
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}