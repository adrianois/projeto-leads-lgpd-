import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { insertLead, fetchLeads } from './db.js';
import { sendLeadNotification } from './mailer.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.post('/api/leads', async (req, res) => {
  try {
    const { email, name, cta, source, origin, consent, metadata } = req.body;

    if (!email || !cta) {
      return res.status(400).json({ error: 'Email e CTA são obrigatórios.' });
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
    console.error('Erro em /api/leads:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

app.get('/api/leads', async (req, res) => {
  try {
    const { cta, source, startDate, endDate } = req.query;
    const leads = await fetchLeads({ cta, source, startDate, endDate });
    res.json({ data: leads });
  } catch (error) {
    console.error('Erro em GET /api/leads:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor de leads rodando em http://localhost:${PORT}`);
});
