import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendLeadNotification(lead) {
  if (!process.env.ALERT_EMAIL_TO) {
    return;
  }

  const html = `
    <h2>Novo lead capturado</h2>
    <p><strong>Email:</strong> ${lead.email}</p>
    <p><strong>Nome:</strong> ${lead.name || 'não informado'}</p>
    <p><strong>CTA:</strong> ${lead.cta}</p>
    <p><strong>Fonte:</strong> ${lead.source || 'não informado'}</p>
    <p><strong>Origem:</strong> ${lead.origin || 'não informado'}</p>
    <p><strong>Data:</strong> ${new Date(lead.created_at).toLocaleString()}</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: process.env.ALERT_EMAIL_TO,
    subject: 'Novo lead LGPD capturado',
    html
  });
}
