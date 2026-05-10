import { insertLead, fetchLeads } from '../services/leads.service.js';
import { sendLeadNotification } from '../services/notification.service.js';
import { validateEmail } from '../middleware/validation.js';

export async function createLead(req, res) {
  try {
    const { email, name, cta, source, origin, consent, metadata } = req.body;

    if (!email || !cta) {
      return res.status(400).json({ error: 'Email e CTA são obrigatórios.' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Email inválido.' });
    }

    if (consent !== true) {
      return res.status(400).json({ error: 'Consentimento explícito é necessário para LGPD.' });
    }

    const lead = {
      email: email.trim().toLowerCase(),
      name: name ? name.trim() : null,
      cta: cta.trim(),
      source: source ? source.trim() : null,
      origin: origin ? origin.trim() : null,
      consent: true,
      metadata: metadata || {}
    };

    const createdLead = await insertLead(lead);
    sendLeadNotification(createdLead).catch((err) => {
      console.error('Falha ao enviar notificação por email:', err);
    });

    return res.status(201).json({ message: 'Lead recebido com sucesso.', lead: createdLead });
  } catch (error) {
    console.error('Erro ao criar lead:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

export async function getLeads(req, res) {
  try {
    const { cta, source, startDate, endDate } = req.query;
    const leads = await fetchLeads({ cta, source, startDate, endDate });
    res.json({ data: leads });
  } catch (error) {
    console.error('Erro ao listar leads:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}
