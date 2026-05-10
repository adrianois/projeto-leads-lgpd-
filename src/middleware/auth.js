import { loadEnvironment } from '../config/environment.js';

const env = loadEnvironment();

export function apiKeyAuth(req, res, next) {
  const key = req.headers['x-api-key'];
  if (!key || key !== env.adminApiKey) {
    return res.status(401).json({ error: 'API key inválida ou ausente.' });
  }
  next();
}
