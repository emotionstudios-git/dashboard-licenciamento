# Dashboard Licenciamento — Decisões Técnicas

## v0.1 — MVP Funcional

### O que está no ar (2026-08-31)

1. **Schema D1** — 5 tabelas:
   - `contracts` — dados mestres de contratos (tipo, datas, MG, %, Vertical)
   - `reports_monthly` — relatórios por licenciado/mês (quantidade, royalties, devoluções)
   - `diagnoses` — consolidado por período (MG, royalties acumulados, shortfall)
   - `users` — mapeamento CF Access + perfis
   - `alerts` — alertas gerados (vencimento, MG, cobrança, shortfall)

2. **API Endpoints** (`/api/contracts/*`):
   - `GET /api/contracts/summary` — dados do painel (status count, receita tipo, vencimentos, shortfall)
   - `GET /api/contracts/list` — lista de contratos com status

3. **Visões React**:
   - **Dashboard** — painel executivo (4 abas conceitualmente, 1 aba agora)
     - Status de contratos (ativo/renegociação/vencido/distratado)
     - Receita royalties 2026 por tipo de licenciado
     - Calendário de vencimentos (próximos 90 dias)
     - Shortfall (MG não superado)

4. **Dados Iniciais** (seed):
   - 5 licenciados de exemplo (Adijomar, Ciranda, ECAD, Netflix, Valéria Bispo)
   - Relatórios mensais 2026 (últimos 6 meses)
   - Diagnósticos consolidados 2026

### Stack final
- Frontend: Vite + React 19 + Tailwind 4
- Backend: Cloudflare Pages Functions (Node.js 18+)
- Database: D1 (SQLite) `dashboard-licenciamento-db`
- Auth: CF Access (middleware + JWT) — **pendente configurar perfis**

### Decisões

**1. Dados sensíveis — CF Access com 3 perfis (não implementado ainda)**
- Perfil 1 (Head — Camila): acesso completo + DRE + planejado x realizado
- Perfil 2 (Financeiro — Alessandra): MG, parcelas, OS — sem DRE
- Perfil 3 (Outros): royalties, shortfall — sem dados sensíveis

Middleware pronto (`_middleware.js`), precisa:
1. Setup no Zero Trust Cloudflare (app "Dashboard Licenciamento", política por perfil)
2. Queries SQL com filtro por perfil (SELECT WHERE user_profile = '?')

**2. Importação de dados — manual pra MVP, automação depois**
- Seed.sql com 5 licenciados (exemplo)
- Próxima versão: importador CSV desde Google Sheets (`/api/import/csv`)

**3. Alertas — geração manual agora, Cron Worker depois**
- Tabela `alerts` criada, não preenchida
- Cron Job (wrangler `triggers.scheduled`) pra verificar vencimentos diários

**4. D1 Query Builder — queries diretas agora, ORM depois**
- Sem abstração de query builder (queries SQL brutas em `lib/queries.js`)
- MVP robusto, não prematura abstração

### Pendências (P1 — Monique vai fazer)

1. **CF Access — setup dos 3 perfis**
   - Criar app no Zero Trust
   - Criar grupos `dashboard-lic-perfil1`, `dashboard-lic-perfil2`, `dashboard-lic-perfil3`
   - Editar middleware pra validar grupo + email

2. **Visões adicionais (fase 2)**
   - [ ] Financeiro — MG, crédito/débito, OS, parcelas
   - [ ] Vertical — receita bruta × repasse
   - [ ] Histórico — receita anual/mensal, comparativo YoY
   - [ ] OKRs — progresso meta por trimestre

3. **Importação de dados**
   - [ ] Endpoint POST `/api/import/csv` — upload sheet do licenciado
   - [ ] Validação de formato + auto-mapping de colunas
   - [ ] Upsert em `reports_monthly`

4. **Alertas automáticos**
   - [ ] Cron Job diária (vencimento -90/-120 dias)
   - [ ] Cron Job MG não pago (coluna vazia no período)
   - [ ] Email via Resend (mesmo padrão dashboard-shows)

5. **Integração Google Sheets**
   - [ ] OAuth + ler diagnósticos direto do Drive
   - [ ] Sincronização bidirecional pra manutenção

### Gotchas descobertos

- **D1 SQLite date functions**: `julianday()` pra cálculo de dias, `date()` pra formato ISO
- **Cloudflare Pages Functions**: sem suporte a variáveis de ambiente interativas; usar `.dev.vars` local
- **CF Access JWT**: expira 24h, precisa refresh pra sessão longa (usar cookie HTTP-only ao invés)

### Commands úteis

```bash
# Dev local
npm run dev

# D1 queries interativas
npx wrangler d1 shell dashboard-licenciamento-db

# Deploy
npm run build && npx wrangler pages deploy dist

# Logs em produção
npx wrangler tail dashboard-licenciamento
```

### Próximas sessões

Monique vai trabalhar em:
1. Setup CF Access (priority)
2. Importador CSV + validação
3. Visão financeira (MG, crédito/débito)
4. Cron Jobs de alerta

Fred revisa PRs, mergeia main, redeploya automático.
