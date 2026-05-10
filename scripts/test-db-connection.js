import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('ERRO: variáveis SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY não encontradas em .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function main() {
  try {
    const test = await supabase.rpc('now');
    console.log('✓ Conexão Supabase OK', test.data || 'OK');

    const response = await supabase
      .from('leads')
      .select('id')
      .limit(1);

    if (response.error) {
      throw response.error;
    }

    console.log('✓ Tabela leads encontrada:', response.data && response.data.length >= 0);
  } catch (error) {
    console.error('✗ Falha na conexão:', error.message);
    if (error.code) console.error('Código do erro:', error.code);
    process.exit(1);
  }
}

main();
