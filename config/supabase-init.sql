-- Extensão para gerar UUIDs
create extension if not exists "uuid-ossp";

-- Entidades (Clientes do SaaS)
create table if not exists entities (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  document text unique not null, -- CNPJ ou CPF
  api_key text unique not null default uuid_generate_v4()::text,
  status text not null default 'active', -- 'active', 'blocked'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Pagamentos
create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  entity_id uuid references entities(id) on delete cascade,
  amount numeric(10, 2) not null,
  status text not null default 'pending', -- 'pending', 'paid', 'failed'
  due_date date not null,
  payment_date timestamptz,
  created_at timestamptz default now()
);

-- Leads
create table if not exists leads (
  id serial primary key,
  email text not null,
  name text,
  cta text not null,
  source text,
  origin text,
  consent boolean not null default false,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Como a tabela leads já pode existir, precisamos garantir que a coluna entity_id seja adicionada
alter table leads add column if not exists entity_id uuid references entities(id) on delete cascade;

-- Índices para performance
create index if not exists idx_leads_entity_id on leads(entity_id);
create index if not exists idx_payments_entity_id on payments(entity_id);
create index if not exists idx_entities_api_key on entities(api_key);
