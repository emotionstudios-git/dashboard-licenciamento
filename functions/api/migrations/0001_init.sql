-- Contratos
CREATE TABLE IF NOT EXISTS contracts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  contract_number TEXT UNIQUE NOT NULL,
  licensee_name TEXT NOT NULL,
  cnpj TEXT NOT NULL,
  brand TEXT NOT NULL, -- '3 Palavrinhas', '3 Little Words', etc
  type TEXT NOT NULL, -- 'produto', 'produto_proprio', 'conteudo', 'digital', 'editora', 'parque'
  exclusive BOOLEAN DEFAULT 0,
  territory TEXT, -- 'Brasil', 'Global', 'LATAM', etc
  channels TEXT, -- JSON: ['varejo', 'e-commerce', 'tv', 'streaming']
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  royalty_percent REAL NOT NULL,
  mg_total REAL, -- Mínimo Garantido total
  mg_status TEXT DEFAULT 'ativo', -- 'ativo', 'em_renegociacao', 'vencido', 'distratado'
  has_vertical BOOLEAN DEFAULT 0,
  vertical_percent REAL, -- 20 ou 30
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Relatórios mensais (produto e produto próprio)
CREATE TABLE IF NOT EXISTS reports_monthly (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  contract_id INTEGER NOT NULL,
  month TEXT NOT NULL, -- 'YYYY-MM'
  channel TEXT,
  category TEXT,
  sku TEXT,
  quantity_sold INTEGER,
  price_gross REAL,
  revenue_gross REAL,
  taxes_icms REAL,
  taxes_cofins REAL,
  taxes_pis REAL,
  quantity_returned INTEGER,
  revenue_returned REAL,
  revenue_net REAL,
  royalty_rate REAL,
  royalty_amount REAL,
  mg_paid REAL,
  credit_balance REAL, -- saldo: positivo = crédito, negativo = débito
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(contract_id) REFERENCES contracts(id)
);

-- Diagnósticos consolidados (por contrato x período)
CREATE TABLE IF NOT EXISTS diagnoses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  contract_id INTEGER NOT NULL,
  period TEXT NOT NULL, -- 'YYYY' ou 'YYYY-Q1'
  royalties_reported_gross REAL,
  royalties_reported_net REAL,
  royalties_accumulated REAL,
  mg_paid_total REAL,
  shortfall REAL, -- MG - royalties acumulados
  status TEXT DEFAULT 'ativo', -- 'ativo', 'finalizado', 'shortfall'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(contract_id) REFERENCES contracts(id)
);

-- Usuários (para CF Access mapping)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  profile TEXT NOT NULL, -- '1' (head), '2' (financeiro), '3' (outros)
  active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alertas gerados
CREATE TABLE IF NOT EXISTS alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  contract_id INTEGER,
  type TEXT NOT NULL, -- 'vencimento', 'mg_nao_pago', 'cobranca', 'shortfall'
  description TEXT,
  triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved BOOLEAN DEFAULT 0,
  FOREIGN KEY(contract_id) REFERENCES contracts(id)
);

CREATE INDEX idx_contracts_type ON contracts(type);
CREATE INDEX idx_contracts_mg_status ON contracts(mg_status);
CREATE INDEX idx_reports_contract_month ON reports_monthly(contract_id, month);
CREATE INDEX idx_diagnoses_contract ON diagnoses(contract_id);
