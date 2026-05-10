import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import dotenv from 'dotenv';
import leadsRouter from './routes/leads.js';
import { corsMiddleware } from './middleware/cors.js';
import { loadEnvironment } from './config/environment.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const env = loadEnvironment();

// Security
app.use(helmet());
app.use(corsMiddleware);

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

// Not found handler
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

// Start server
const PORT = env.port;
app.listen(PORT, () => {
  console.log(`🚀 Servidor de leads rodando em http://localhost:${PORT}`);
  console.log(`📊 Dashboard em http://localhost:${PORT}/dashboard.html`);
  console.log(`📝 Formulário em http://localhost:${PORT}/form-example.html`);
});
