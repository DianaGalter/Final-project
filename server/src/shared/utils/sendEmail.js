import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

let transporter;
let testAccount;

const getTransporter = async () => {
  if (transporter) return transporter;

  const missingConfig = !env.email.host || !env.email.user || !env.email.pass;
  if (missingConfig && env.nodeEnv === 'development') {
    if (!testAccount) {
      testAccount = await nodemailer.createTestAccount();
    }
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.info('Using Ethereal test email account for local development');
  } else {
    transporter = nodemailer.createTransport({
      host: env.email.host,
      port: env.email.port,
      auth: env.email.user
        ? { user: env.email.user, pass: env.email.pass }
        : undefined,
    });
  }

  return transporter;
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const transport = await getTransporter();
  const info = await transport.sendMail({
    from: env.email.from,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]+>/g, ''),
  });

  if (env.nodeEnv === 'development') {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.info(`Email preview URL: ${previewUrl}`);
    }
  }

  return info;
};
