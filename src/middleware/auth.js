import { loadEnvironment } from '../config/environment.js';
import supabase from '../lib/supabase.js';

const env = loadEnvironment();

export function requireRoot(req, res, next) {
  const key = req.headers['x-api-key'];
  if (!key || key !== env.adminApiKey) {
    return res.status(401).json({ error: 'Acesso negado. Chave Root inválida.' });
  }
  next();
}

export async function requireEntity(req, res, next) {
  const key = req.headers['x-api-key'];
  if (!key) {
    return res.status(401).json({ error: 'Chave da entidade ausente.' });
  }

  // Verificar no banco de dados se a chave existe e está ativa
  const { data, error } = await supabase
    .from('entities')
    .select('id, status')
    .eq('api_key', key)
    .single();

  if (error || !data) {
    return res.status(401).json({ error: 'Chave da entidade inválida.' });
  }

  if (data.status !== 'active') {
    return res.status(403).json({ error: 'Entidade bloqueada ou inativa.' });
  }

  // Passar o id da entidade para a rota
  req.entityId = data.id;
  next();
}
