import { createClient } from '@supabase/supabase-js';
import { loadEnvironment } from '../config/environment.js';

const env = loadEnvironment();

const supabase = createClient(env.supabaseUrl, env.supabaseKey, {
  auth: { persistSession: false }
});

export default supabase;
