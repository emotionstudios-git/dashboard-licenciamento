export async function getContractsSummary(db) {
  const result = await db.prepare(`
    SELECT
      mg_status,
      COUNT(*) as count,
      SUM(CASE WHEN type = 'produto' THEN 1 ELSE 0 END) as produto_count,
      SUM(CASE WHEN type = 'conteudo' THEN 1 ELSE 0 END) as conteudo_count,
      SUM(CASE WHEN type = 'produto_proprio' THEN 1 ELSE 0 END) as proprio_count
    FROM contracts
    GROUP BY mg_status
  `).all()
  return result.results
}

export async function getRoyaltiesByType(db, period = '2026') {
  const result = await db.prepare(`
    SELECT
      c.type,
      COALESCE(SUM(d.royalties_reported_gross), 0) as royalties_gross,
      COALESCE(SUM(d.royalties_reported_net), 0) as royalties_net,
      COUNT(DISTINCT c.id) as licensee_count
    FROM contracts c
    LEFT JOIN diagnoses d ON c.id = d.contract_id AND d.period = ?
    GROUP BY c.type
    ORDER BY royalties_gross DESC
  `).bind(period).all()
  return result.results
}

export async function getUpcomingVencimentos(db, dias = 90) {
  const today = new Date().toISOString().split('T')[0]
  const futureDate = new Date(Date.now() + dias * 86400000).toISOString().split('T')[0]
  
  const result = await db.prepare(`
    SELECT
      id, contract_number, licensee_name, brand, end_date,
      CAST((julianday(end_date) - julianday(?)) AS INTEGER) as dias_até_vencimento
    FROM contracts
    WHERE end_date BETWEEN ? AND ?
      AND mg_status != 'vencido'
    ORDER BY end_date ASC
  `).bind(today, today, futureDate).all()
  
  return result.results
}

export async function getShortfallStatus(db) {
  const result = await db.prepare(`
    SELECT
      c.contract_number, c.licensee_name, c.brand,
      d.mg_paid_total, d.royalties_accumulated,
      d.shortfall,
      CASE WHEN d.shortfall > 0 THEN 'SIM' ELSE 'NÃO' END as em_shortfall
    FROM contracts c
    LEFT JOIN diagnoses d ON c.id = d.contract_id AND d.period = '2026'
    WHERE d.shortfall > 0 OR d.status = 'shortfall'
    ORDER BY d.shortfall DESC
  `).all()
  
  return result.results
}
