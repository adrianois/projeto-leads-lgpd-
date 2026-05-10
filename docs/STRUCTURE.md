# Estrutura do Projeto

```
projeto-leads-lgpd/
│
├── src/                              # Código-fonte principal
│   ├── index.js                      # Servidor Express (main)
│   │
│   ├── config/
│   │   └── environment.js            # Carregamento de variáveis de ambiente
│   │
│   ├── middleware/
│   │   ├── auth.js                   # Autenticação via API Key
│   │   ├── cors.js                   # Configuração de CORS
│   │   └── validation.js             # Validação de email
│   │
│   ├── services/
│   │   ├── db.js                     # Conexão Supabase e queries
│   │   └── mailer.js                 # Envio de notificações por email
│   │
│   ├── controllers/
│   │   └── leadsController.js        # Lógica de negócio dos leads
│   │
│   └── routes/
│       └── leads.js                  # Rotas da API /api/leads
│
├── public/                            # Arquivos estáticos (frontend)
│   ├── dashboard.html                # Painel de visualização de leads
│   ├── dashboard.js                  # Lógica do dashboard
│   ├── form-example.html             # Exemplo de formulário
│   ├── form-example.js               # Lógica do formulário
│   └── styles.css                    # Estilos CSS
│
├── scripts/                           # Utilitários e scripts
│   └── test-db-connection.js         # Teste de conexão com Supabase
│
├── config/                            # Configurações do projeto
│   └── supabase-init.sql             # SQL inicial para criação da tabela
│
├── docs/                              # Documentação
│   ├── API.md                        # Documentação de endpoints
│   └── STRUCTURE.md                  # Este arquivo
│
├── .env                              # Variáveis de ambiente (não commitar)
├── .env.example                      # Exemplo de variáveis de ambiente
├── .gitignore                        # Git ignore rules
├── package.json                      # Dependências e scripts
├── package-lock.json                 # Lock de versões
└── README.md                         # Documentação principal
```

## Padrão de Arquitetura

Este projeto segue a arquitetura em camadas:

- **Routes**: Definem os endpoints e middlewares
- **Controllers**: Contêm a lógica de negócio das requisições
- **Services**: Interagem com banco de dados e APIs externas
- **Middleware**: Tratam autenticação, validação e CORS
- **Config**: Gerenciam configurações globais

## Como Executar

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Testar conexão com banco
npm run test-db

# Executar em produção
npm start
```

## Variáveis de Ambiente

Copie `.env.example` para `.env` e preencha:

- `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_API_KEY` para acesso ao dashboard
- Configurações de SMTP do Gmail
- `ALLOWED_ORIGINS` para CORS

## Objetos Principais

### Lead
```javascript
{
  id: number,
  email: string,
  name: string | null,
  cta: string,
  source: string | null,
  origin: string | null,
  consent: boolean,
  metadata: object,
  created_at: ISO8601 string
}
```
