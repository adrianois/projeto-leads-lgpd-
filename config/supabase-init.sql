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
