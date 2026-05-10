import dotenv from 'dotenv';
import { loadEnvironment } from './config/environment.js';
import app from './app.js';

dotenv.config();

const env = loadEnvironment();

// Start server
const PORT = env.port;
app.listen(PORT, () => {
  console.log(`🚀 Servidor de leads rodando em http://localhost:${PORT}`);
  console.log(`📊 Dashboard em http://localhost:${PORT}/dashboard.html`);
  console.log(`📝 Formulário em http://localhost:${PORT}/form-example.html`);
});
