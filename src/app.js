import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import leadsRouter from './routes/leads.js';
import rootRouter from './routes/root.js';
import entitiesRouter from './routes/entities.js';
import { corsMiddleware } from './middleware/cors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Security
app.use(helmet());
app.use(corsMiddleware);

// Global Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // Limite de 200 requisições por IP a cada 15 min
  message: 'Muitas requisições deste IP, tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false
});
app.use(globalLimiter);

// Parsing
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: false }));

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// API Routes
app.use('/api/leads', leadsRouter);
app.use('/api/root', rootRouter);
app.use('/api/entity', entitiesRouter);

// Not found handler
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

export default app;
