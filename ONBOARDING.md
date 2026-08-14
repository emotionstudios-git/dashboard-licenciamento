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

5. **Deploy automático** — após merge, build + deploy Cloudflare Pages

## Fase 1 — Escopo

### Schema D1 (tabelas)
- `contracts` — número, CNPJ, marca, tipo, datas, MG, %, Vertical
- `contract_products` — SKU, categoria, canal, restrições
- `reports_monthly` — relatórios por licenciado/mês (quantidade, royalties, devoluções)
- `diagnoses` — consolidado de performance (histórico multi-guia)
- `selloff` — período de escoamento pós-contrato
- `addendums` — alterações de contrato
- `alerts` — vencimentos, MG não pago, cobrança, shortfall

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
A: Não — setupar quando começar a prototipar. Copiar padrão do dashboard-shows.

**Q: E se precisar executar SQL ad-hoc?**
A: `wrangler d1 execute dashboard-licenciamento-db --command "SELECT..."`

**Q: Quem aprova PRs?**
A: Fred — mas Monique você comenta, sugere, valida estrutura antes de Fred mergear.

---

**Pronto?** Clone o repo, suba uma branch, e vamos começar!

Dúvidas → Fred ou revisa o superprompt (Kit Licenciamento).
