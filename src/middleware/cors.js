import cors from 'cors';
import { loadEnvironment } from '../config/environment.js';

const env = loadEnvironment();

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || env.allowedOrigins.some(o => o.trim() === (origin || '').trim())) {
      callback(null, true);
    } else {
      callback(new Error('CORS bloqueado'));
    }
  },
  credentials: true
});
