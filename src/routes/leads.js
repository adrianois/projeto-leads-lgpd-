import express from 'express';
import rateLimit from 'express-rate-limit';
import { createLead, getLeads } from '../controllers/leadsController.js';
import { apiKeyAuth } from '../middleware/auth.js';

const router = express.Router();

const leadsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Muitas requisições, tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Acesso negado por limite de requisições.',
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/', leadsLimiter, createLead);
router.get('/', strictLimiter, apiKeyAuth, getLeads);

export default router;
