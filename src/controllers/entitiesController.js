import supabase from '../lib/supabase.js';

export async function getEntityLeads(req, res) {
  try {
    const entityId = req.entityId; // Set by requireEntity middleware

    const { data, error } = await supabase
      .from('leads')
      .select('id, email, name, cta, source, origin, consent, metadata, created_at')
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database Error in getEntityLeads:', error);
      return res.status(500).json({ error: 'Erro interno ao buscar leads.' });
    }

    res.json(data);
  } catch (err) {
    console.error('Exception in getEntityLeads:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

export async function getEntityPayments(req, res) {
  try {
    const entityId = req.entityId;

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('entity_id', entityId)
      .order('due_date', { ascending: false });

    if (error) {
      console.error('Database Error in getEntityPayments:', error);
      return res.status(500).json({ error: 'Erro interno ao buscar pagamentos.' });
    }

    res.json(data);
  } catch (err) {
    console.error('Exception in getEntityPayments:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}
