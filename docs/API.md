# API Leads - Documentação

## Endpoints

### POST /api/leads
Captura um novo lead.

**Body:**
```json
{
  "email": "contato@exemplo.com",
  "name": "Nome",
  "cta": "inscrever-gratuitamente",
  "source": "blog-lgpd",
  "origin": "https://seublog.com/post",
  "consent": true,
  "metadata": {}
}
```

**Response:** `201 Created`
```json
{
  "message": "Lead recebido com sucesso.",
  "lead": { ... }
}
```

---

### GET /api/leads
Lista leads (requer autenticação).

**Headers:**
```
x-api-key: <ADMIN_API_KEY>
```

**Query params:**
- `cta`: filtrar por CTA
- `source`: filtrar por fonte
- `startDate`: data início (ISO)
- `endDate`: data fim (ISO)

**Response:** `200 OK`
```json
{
  "data": [ ... ]
}
```

---

## Rate Limiting

- `POST /api/leads`: 100 req/15 min
- `GET /api/leads`: 10 req/15 min

---

## LGPD

Consentimento explícito é obrigatório: `consent: true`
