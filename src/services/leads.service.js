import supabase from '../lib/supabase.js';

export async function insertLead({ entity_id, email, name, cta, source, origin, consent, metadata }) {
  const { data, error } = await supabase
    .from('leads')
    .insert([{ entity_id, email, name, cta, source, origin, consent, metadata }])
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchLeads({ cta, source, startDate, endDate }) {
  let query = supabase.from('leads').select('id, email, name, cta, source, origin, consent, metadata, created_at');

  if (cta) query = query.eq('cta', cta);
  if (source) query = query.eq('source', source);
  if (startDate) query = query.gte('created_at', startDate);
  if (endDate) query = query.lte('created_at', endDate);

  const { data, error } = await query.order('created_at', { ascending: false }).limit(500);

  if (error) {
    throw error;
  }

  return data;
}
