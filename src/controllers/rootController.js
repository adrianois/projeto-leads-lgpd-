import supabase from '../lib/supabase.js';

// --- ENTITIES ---

export async function createEntity(req, res) {
  try {
    const { name, document } = req.body;

    if (!name || typeof name !== 'string' || !document || typeof document !== 'string') {
      return res.status(400).json({ error: 'Name and document are required and must be strings.' });
    }

    const { data, error } = await supabase
      .from('entities')
      .insert([{ name, document }])
      .select('*')
      .single();

    if (error) {
      if (error.code === '23505') { // unique violation
        return res.status(409).json({ error: 'Uma entidade com este documento já existe.' });
      }
      console.error('Database Error in createEntity:', error);
      return res.status(500).json({ error: 'Erro interno ao criar entidade.' });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error('Exception in createEntity:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

export async function getEntities(req, res) {
  try {
    const { data, error } = await supabase
      .from('entities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database Error in getEntities:', error);
      return res.status(500).json({ error: 'Erro interno ao buscar entidades.' });
    }

    res.json(data);
  } catch (err) {
    console.error('Exception in getEntities:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

export async function updateEntityStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'active' or 'blocked'

    if (status !== 'active' && status !== 'blocked') {
      return res.status(400).json({ error: 'Status inválido. Use "active" ou "blocked".' });
    }

    const { data, error } = await supabase
      .from('entities')
      .update({ status, updated_at: new Date() })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Database Error in updateEntityStatus:', error);
      return res.status(500).json({ error: 'Erro interno ao atualizar status da entidade.' });
    }

    if (!data) {
      return res.status(404).json({ error: 'Entidade não encontrada.' });
    }

    res.json(data);
  } catch (err) {
    console.error('Exception in updateEntityStatus:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

// --- PAYMENTS ---

export async function createPayment(req, res) {
  try {
    const { entity_id, amount, due_date } = req.body;

    if (!entity_id || typeof entity_id !== 'string' || !amount || !due_date) {
      return res.status(400).json({ error: 'entity_id, amount e due_date são obrigatórios.' });
    }

    const { data, error } = await supabase
      .from('payments')
      .insert([{ entity_id, amount, due_date }])
      .select('*')
      .single();

    if (error) {
      console.error('Database Error in createPayment:', error);
      return res.status(500).json({ error: 'Erro interno ao registrar pagamento.' });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error('Exception in createPayment:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

export async function getPayments(req, res) {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        entities:entity_id (name, document)
      `)
      .order('due_date', { ascending: false });

    if (error) {
      console.error('Database Error in getPayments:', error);
      return res.status(500).json({ error: 'Erro interno ao buscar pagamentos.' });
    }

    res.json(data);
  } catch (err) {
    console.error('Exception in getPayments:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

export async function updatePaymentStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'pending', 'paid', 'failed'

    if (!['pending', 'paid', 'failed'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido.' });
    }

    const updateData = { status };
    if (status === 'paid') {
      updateData.payment_date = new Date();
    }

    const { data, error } = await supabase
      .from('payments')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Database Error in updatePaymentStatus:', error);
      return res.status(500).json({ error: 'Erro interno ao atualizar pagamento.' });
    }

    if (!data) {
      return res.status(404).json({ error: 'Pagamento não encontrado.' });
    }

    res.json(data);
  } catch (err) {
    console.error('Exception in updatePaymentStatus:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}
