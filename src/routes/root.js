import express from 'express';
import { requireRoot } from '../middleware/auth.js';
import { 
  createEntity, 
  getEntities, 
  updateEntityStatus,
  createPayment,
  getPayments,
  updatePaymentStatus
} from '../controllers/rootController.js';

const router = express.Router();

// Aplica middleware de autenticação Root para todas as rotas abaixo
router.use(requireRoot);

// Rotas de Entidades
router.post('/entities', createEntity);
router.get('/entities', getEntities);
router.put('/entities/:id/status', updateEntityStatus);

// Rotas de Pagamentos
router.post('/payments', createPayment);
router.get('/payments', getPayments);
router.put('/payments/:id/status', updatePaymentStatus);

export default router;
