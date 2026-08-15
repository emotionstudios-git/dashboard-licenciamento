# Onboarding — Dashboard Licenciamento

Bem-vindo! Aqui você encontra como começar a colaborar no novo dashboard de gestão de licenciamento da Oinc.

## O que é

Dashboard central para gestão de contratos de licenciamento, royalties, mínimo garantido (MG), shortfall e alertas financeiros. Consolida dados de 6 tipos de licenciados (produto, produto próprio, conteúdo, digital, editora, parque) com histórico desde 2019.

**Acesso:** https://dashboard-licenciamento.pages.dev (CF Access SSO, controle por perfil)

## Kit de referência

Toda a especificação está em `/Users/betavalente/Downloads/Kit Licenciamento-*.zip`:
- **1_superprompt_licenciamento_estrategico.txt** — contexto completo, tipos de licenciado, regras de negócio, campos de dados, visões, alertas
- **2_kit_informacoes_licenciamento_estrategico.docx** — guia operacional
- **3_planilhas/** — diagnósticos ativos/inativos, controles, planejamento
- **4_referencias_visuais/** — contratos de exemplo, documentos

Copie o superprompt pra qualquer sessão do Claude com perguntas específicas sobre o escopo.

## Stakeholders

- **Camila Bellintani** (Head) — aprova decisões, validação de escopo
- **Amanda Cavaggioni** (Operacional) — onboarding de licenciados
- **Alessandra Rodrigues** (Financeiro) — dados de MG, OS, recibos
- **Adriano Assunção** (DRE/Planejado) — projeções, acesso Perfil 1
- **Monique Silva** (você — Referência Técnica) — mantém dados, valida estruturas

## Setup local

```bash
# Clonar
git clone https://github.com/emotionstudios-git/dashboard-licenciamento.git
cd dashboard-licenciamento

# Instalar
npm install

# Dev
npm run dev  # http://localhost:5173

# .dev.vars (copiar .dev.vars.example e preencher com secrets locais)
cp .dev.vars.example .dev.vars
# JWT_SECRET, etc.
```

## Stack
- **Frontend:** Vite + React 19 + Tailwind 4 + Recharts (gráficos)
- **Backend:** Cloudflare Pages + Functions
- **Database:** D1 (SQLite) — `dashboard-licenciamento-db`
- **Auth:** CF Access (3 perfis: Head, Financeiro, Outros)

## Fluxo de trabalho

1. **Cria branch** com nome descritivo:
   ```bash
   git checkout -b feat/schema-contratos
   git checkout -b fix/calculo-shortfall
   ```

2. **Commit em português:**
   ```bash
   git commit -m "feat(schema): adiciona tabela contratos com datas e tipos"
   ```

3. **Abre PR contra main** (main está protegida — 1 review obrigatório)
   ```bash
   git push origin feat/seu-nome
   # GitHub: abrir PR via interface
   ```

4. **Fred revisa** — você comenta no PR, Fred mergeia quando aprovado

5. **Deploy** — Fred deploya após o merge (ainda não é automático; ver abaixo)

## ⚠️ Estado real do que está no ar (leia antes de mexer)

**Os dados do dashboard são FICTÍCIOS.** Os 5 licenciados que aparecem
(Adijomar, Ciranda Cultural, ECAD-ABRAMUS, Netflix, Valéria Bispo) e todos os
valores de royalties/MG/shortfall foram inventados só pra dar forma às telas.
**Nada veio das planilhas do Kit Licenciamento.** Não use esses números pra
nenhuma conversa com a área, e não mostre a tela pra Camila/Alessandra sem
antes trocar por dado real ou marcar como demo.

A tabela "Vencimentos Próximos" aparece vazia — a query está correta, é que
nenhum contrato de exemplo vence nos próximos 90 dias.

## 🔧 Gotchas de deploy (todos custaram tempo — não repita)

Estes quatro morderam durante o setup inicial. Estão resolvidos no repo, mas
saber por quê evita reintroduzir:

1. **Deploye SEMPRE de dentro da pasta do projeto.** `wrangler pages deploy`
   procura a pasta `functions/` no diretório ONDE VOCÊ RODOU o comando, não no
   diretório que você passou como argumento. Rodar de fora sobe só os arquivos
   estáticos, sem as Functions — a API some, o front recebe HTML no lugar de
   JSON e a tela fica vazia sem erro nenhum. (`npx --prefix=x` NÃO resolve: o
   `--prefix` só diz onde achar o wrangler, não muda o diretório.)

2. **`pages_build_output_dir` é obrigatório no `wrangler.toml`.** Sem esse
   campo o wrangler **ignora o arquivo inteiro** (avisa numa linha fácil de não
   ver e segue) — então o binding do D1 não sobe, `env.DB` fica `undefined` e
   toda a API quebra.

3. **Nada de arquivo não-JS dentro de `functions/`.** O wrangler trata tudo
   nessa pasta como código de rota. Os `.sql` das migrations estavam lá e
   quebravam o bundle com `No such module "node:stream"`. Migrations vivem em
   `migrations/` na raiz.

4. **"Deployment complete" do CLI NÃO significa que subiu.** O wrangler imprime
   isso mesmo quando o estágio final falha. O alias do domínio só migra pra
   deployments bem-sucedidos, então um deploy quebrado deixa o site servindo a
   versão anterior silenciosamente. Confira de verdade:
   ```bash
   npx wrangler pages deployment list --project-name=dashboard-licenciamento
   ```
   e veja se o deployment novo é o que está com o alias do domínio.

**Rodar local com D1 e Functions:** use `npx wrangler pages dev` sem flags — ele
lê o binding do `wrangler.toml`. Se passar `--d1 DB=...` na mão, o wrangler cria
um segundo banco local vazio e você recebe `no such table`. Pra semear o local:
```bash
npx wrangler d1 execute dashboard-licenciamento-db --local --file migrations/0001_init.sql
npx wrangler d1 execute dashboard-licenciamento-db --local --file migrations/0002_seed_data.sql
```
(Troque `--local` por `--remote` pra mexer no banco de produção — cuidado.)

## Fase 1 — Escopo

### Schema D1
**Já existe** (migrations 0001 + 0002, aplicadas no D1 remoto):
- `contracts` — número, CNPJ, marca, tipo, datas, MG, %, Vertical
- `reports_monthly` — relatórios por licenciado/mês (quantidade, royalties, devoluções)
- `diagnoses` — consolidado por período (MG, royalties acumulados, shortfall)
- `users` — e-mail + perfil (1/2/3), pra mapear com o CF Access
- `alerts` — vencimentos, MG não pago, cobrança, shortfall (tabela criada, ainda sem uso)

**Ainda falta modelar** (previsto no superprompt, não implementado):
- `contract_products` — SKU, categoria, canal, restrições
- `selloff` — período de escoamento pós-contrato (90 dias padrão)
- `addendums` — aditivos (novos SKUs, novo MG, novo prazo, território)
- Distrato — campos a formalizar com a área (motivo, data efetiva, fase,
  pendências financeiras, decisão sobre estoque)

### Visões principais
- **Gestão:** painel de status (ativo/renegociação/sell off/vencido/distratado), calendário, saúde da carteira
- **Financeiro:** MG, crédito/débito, parcelas, OS, fundo de marketing
- **Vertical:** receita bruta × repasse (20%/30%) × líquida
- **Performance:** royalties por categoria/licenciado/tipo, comparativo YoY, top performers
- **Histórico:** receita anual/mensal com filtro ativos/inativos

### CF Access (perfis)
- **Perfil 1 (Head):** acesso completo + DRE + planejado x realizado
- **Perfil 2 (Financeiro):** MG, parcelas, OS, recibos — sem DRE
- **Perfil 3 (Outros):** royalties, shortfall, MG — sem dados financeiros internos

Configurar na borda do CF Access (Zero Trust > Applications).

## Arquivos-chave

- `src/components/` — React componentes (painel gestão, financeiro, performance)
- `functions/api/` — endpoints /api/* 
- `functions/api/lib/` — queries, validação, domínio
- `src/lib/` — utilitários (formatação, cálculos lado-client)
- `CLAUDE.md` — decisões técnicas, problemas conhecidos

## Perguntas frequentes

**Q: Como integro dados do Google Sheets?**
A: Via Google Sheets API (OAuth) ou export CSV importado no D1. Verificar no CLAUDE.md quando definido.

**Q: CF Access já está configurado?**
A: A borda sim — o app existe e cobre os 3 domínios, com políticas pros grupos
`oinc-tool-licenciamento` (você está nele) e `oinc-admins`. O que NÃO existe
ainda é a distinção dos 3 perfis DENTRO do app: hoje quem entra vê tudo. Essa
é a primeira tarefa (ver P1 abaixo).

**Q: E se precisar executar SQL ad-hoc?**
A: `npx wrangler d1 execute dashboard-licenciamento-db --local --command "SELECT..."`
(`--remote` bate no banco de produção — use com cuidado.)

**Q: Quem aprova PRs?**
A: Fred — mas Monique você comenta, sugere, valida estrutura antes de Fred mergear.

---

**Pronto?** Clone o repo, suba uma branch, e vamos começar!

Dúvidas → Fred ou revisa o superprompt (Kit Licenciamento).
