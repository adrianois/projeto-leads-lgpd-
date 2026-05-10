import express from 'express';
import { requireEntity } from '../middleware/auth.js';
import { getEntityLeads, getEntityPayments } from '../controllers/entitiesController.js';

const router = express.Router();

// Aplica middleware de autenticação de Entidade
router.use(requireEntity);

// Rotas da Entidade
router.get('/leads', getEntityLeads);
router.get('/payments', getEntityPayments);

export default router;
