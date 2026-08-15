-- Licenciados de exemplo
INSERT INTO contracts (contract_number, licensee_name, cnpj, brand, type, exclusive, territory, channels, start_date, end_date, royalty_percent, mg_total, has_vertical, vertical_percent) VALUES
('20109', 'Adijomar', '12.345.678/0001-90', '3 Palavrinhas', 'produto', 0, 'Brasil', '["varejo", "e-commerce"]', '2023-01-01', '2025-12-31', 8.0, 50000, 1, 20),
('20110', 'Ciranda Cultural', '23.456.789/0001-01', '3 Palavrinhas', 'produto', 0, 'Brasil', '["varejo"]', '2022-06-01', '2026-05-31', 10.0, 75000, 1, 20),
('20111', 'ECAD-ABRAMUS', '34.567.890/0001-12', '3 Palavrinhas', 'conteudo', 0, 'Brasil', '["tv"]', '2021-01-01', '2026-12-31', 12.0, NULL, 0, NULL),
('20112', 'Netflix', '45.678.901/0001-23', '3 Palavrinhas', 'conteudo', 0, 'Global', '["streaming"]', '2020-03-01', '2025-02-28', 15.0, 30000, 0, NULL),
('20113', 'Valéria Bispo', '56.789.012/0001-34', '3 Palavrinhas', 'produto_proprio', 1, 'Brasil', '["loja"]', '2023-07-01', '2026-06-30', 50.0, NULL, 0, NULL);

-- Relatórios mensais 2026 (últimos 6 meses)
INSERT INTO reports_monthly (contract_id, month, channel, category, quantity_sold, price_gross, revenue_gross, taxes_icms, revenue_net, royalty_rate, royalty_amount, mg_paid, credit_balance) VALUES
(1, '2026-08', 'varejo', 'toys', 150, 89.90, 13485.00, 1348.50, 12136.50, 8.0, 970.92, 5000, -1234.56),
(1, '2026-07', 'varejo', 'toys', 120, 89.90, 10788.00, 1078.80, 9709.20, 8.0, 776.74, 0, -3456.78),
(2, '2026-08', 'varejo', 'livros', 80, 45.00, 3600.00, 360.00, 3240.00, 10.0, 324.00, 0, 15234.50),
(2, '2026-07', 'varejo', 'livros', 100, 45.00, 4500.00, 450.00, 4050.00, 10.0, 405.00, 5000, 14905.50),
(3, '2026-08', 'tv', 'conteudo', NULL, NULL, 12000.00, 0, 12000.00, 12.0, 1440.00, NULL, NULL),
(4, '2026-08', 'streaming', 'conteudo', NULL, NULL, 5000.00, 0, 5000.00, 15.0, 750.00, 2000, -8765.43),
(5, '2026-08', 'loja', 'acessorios', 250, 29.90, 7475.00, 747.50, 6727.50, 50.0, 3363.75, NULL, NULL);

-- Diagnósticos consolidados
INSERT INTO diagnoses (contract_id, period, royalties_reported_gross, royalties_reported_net, royalties_accumulated, mg_paid_total, shortfall, status) VALUES
(1, '2026', 11850.00, 9480.00, 45600.00, 5000.00, 4400.00, 'ativo'),
(2, '2026', 7290.00, 7290.00, 32100.00, 10000.00, 42900.00, 'ativo'),
(3, '2026', 14400.00, 14400.00, 86400.00, NULL, NULL, 'ativo'),
(4, '2026', 6250.00, 6250.00, 18750.00, 2000.00, 11250.00, 'ativo'),
(5, '2026', 3363.75, 3363.75, 20182.50, NULL, NULL, 'ativo');

-- Usuários (mapeamento CF Access)
INSERT INTO users (email, name, profile) VALUES
('camila.bellintani@oincfilmes.com.br', 'Camila Bellintani', '1'),
('alessandra.rodrigues@oincfilmes.com.br', 'Alessandra Rodrigues', '2'),
('amanda.cavaggioni@oincfilmes.com.br', 'Amanda Cavaggioni', '3'),
('monique.silva@oincfilmes.com.br', 'Monique Silva', '1');
