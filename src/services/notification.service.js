import transporter from '../lib/mailer.js';
import { loadEnvironment } from '../config/environment.js';

const env = loadEnvironment();

export async function sendLeadNotification(lead) {
  if (!env.alertEmailTo) {
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
    from: env.emailFrom,
    to: env.alertEmailTo,
    subject: 'Novo lead LGPD capturado',
    html
  });
}
