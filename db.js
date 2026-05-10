import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export async function insertLead({ email, name, cta, source, origin, consent, metadata }) {
  const query = `
    INSERT INTO leads (email, name, cta, source, origin, consent, metadata)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, email, name, cta, source, origin, consent, metadata, created_at
  `;
  const values = [email, name, cta, source, origin, consent, metadata];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function fetchLeads({ cta, source, startDate, endDate }) {
  const conditions = [];
  const values = [];

  if (cta) {
    values.push(cta);
    conditions.push(`cta = $${values.length}`);
  }

  if (source) {
    values.push(source);
    conditions.push(`source = $${values.length}`);
  }

  if (startDate) {
    values.push(startDate);
    conditions.push(`created_at >= $${values.length}`);
  }

  if (endDate) {
    values.push(endDate);
    conditions.push(`created_at <= $${values.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const query = `
    SELECT id, email, name, cta, source, origin, consent, metadata, created_at
    FROM leads
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT 500
  `;

  const result = await pool.query(query, values);
  return result.rows;
}
