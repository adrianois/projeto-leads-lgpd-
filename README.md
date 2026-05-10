# projeto-leads-lgpd-

Sistema de Captura e Gerenciamento de Leads para CTAs

## O que foi criado

- Backend Node.js com `Express.js` para receber leads via `POST /api/leads`
- Conexão com Supabase via `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`
- Dashboard simples em `public/dashboard.html`
- Notificação por email via `Nodemailer`
- Integração preparada para formulários estáticos do blog

## Estrutura do projeto

- `server.js` - servidor Express com rotas de API
- `db.js` - camada leve de acesso ao Postgres
- `mailer.js` - envio de email de alerta
- `public/dashboard.html` - painel de visualização de leads
- `public/dashboard.js` - filtros e listagem dinâmica
- `public/styles.css` - estilos básicos
- `.env.example` - variáveis de ambiente para DB e email

## Instalação

1. Copie `.env.example` para `.env`
2. Abra o Supabase e crie um novo projeto PostgreSQL
3. No painel do Supabase, abra o SQL Editor e execute o arquivo `supabase-init.sql`
4. Preencha `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` em `.env`
5. Preencha os dados de SMTP em `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS` e `ALERT_EMAIL_TO`
6. Rode:

```bash
npm install
npm run dev
```

## Teste de conexão com o Supabase

Se você quiser validar a conexão com o Supabase localmente, execute:

```bash
node test-db-connection.js
```

O script tentará conectar usando `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` do seu `.env`.

## Configuração SMTP Gmail

Para usar o email `adriano.uperttech@gmail.com`, as configurações são:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=adriano.uperttech@gmail.com
EMAIL_PASS=<sua-senha-ou-app-password>
EMAIL_FROM=adriano.uperttech@gmail.com
ALERT_EMAIL_TO=<seu-email-de-alertas>
```

- Use `smtp.gmail.com` com STARTTLS e porta `587`.
- `EMAIL_SECURE=false` funciona com STARTTLS na porta `587`.
- Não compartilhe sua senha real no repositório.

## Como gerar a senha de app do Google

1. Acesse `https://myaccount.google.com/` e entre com `adriano.uperttech@gmail.com`.
2. No painel lateral, clique em `Segurança`.
3. Em `Como fazer login no Google`, verifique se `Verificação em duas etapas` está ativada.
   - Se não estiver, ative-a primeiro.
4. Após ativar, volte para `Segurança` e abra `Senhas de app`.
5. Selecione `Email` como app e `Outro (nome personalizado)` como dispositivo.
6. Informe um nome como `Lead API` e clique em `Gerar`.
7. Copie a senha de 16 caracteres exibida.
8. Cole essa senha em `EMAIL_PASS` no arquivo `.env`.

### Exemplo final em `.env`

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=adriano.uperttech@gmail.com
EMAIL_PASS=xxxxxxxxxxxxxxxx
EMAIL_FROM=adriano.uperttech@gmail.com
ALERT_EMAIL_TO=adriano.uperttech@gmail.com
```

> Use `ALERT_EMAIL_TO` para receber a notificação de novos leads.

## Rotas disponíveis

- `POST /api/leads` - recebe um lead
- `GET /api/leads` - retorna leads filtrados
- `GET /health` - checa o status do servidor
- `GET /dashboard.html` - dashboard de leads
- `GET /form-example.html` - exemplo de formulário de captura de lead

## Exemplo de payload de captura

```json
{
  "email": "contato@exemplo.com",
  "name": "Nome do Lead",
  "cta": "inscrever-gratuitamente",
  "source": "blog-lgpd",
  "origin": "https://seublog.com/post-sobre-lgpd",
  "consent": true,
  "metadata": {
    "utm_source": "instagram"
  }
}
```

## Exemplo de integração no blog

```js
async function enviarLead(formData) {
  const payload = {
    email: formData.email,
    name: formData.name,
    cta: formData.cta,
    source: 'blog-lgpd',
    origin: window.location.href,
    consent: formData.consent === true,
    metadata: {
      campaign: 'curso-lgpd'
    }
  };

  const response = await fetch('https://seu-backend.vercel.app/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  return response.json();
}
```

> Também existe um exemplo pronto em `public/form-example.html` com captura de consentimento e envio para `/api/leads`.

## Tabela `leads` no Supabase

Execute este SQL no Supabase SQL Editor para criar a tabela:

```sql
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
```

## LGPD e consentimento

- O backend exige `consent: true` para aceitar o lead.
- O formulário do blog precisa ter checkbox ou declaração de consentimento explícito.
- Os dados são armazenados apenas após o consentimento.

## Deploy

- Recomendado: Vercel, Netlify ou Heroku.
- Defina `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` e variáveis de SMTP no painel do deploy.
- O dashboard estará disponível em `/dashboard.html`.
