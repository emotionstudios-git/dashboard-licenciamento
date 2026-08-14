export async function onRequest({ request, env }) {
  if (request.method !== 'GET') return new Response(null, { status: 405 })
  
  try {
    const db = env.DB
    const result = await db.prepare(`
      SELECT
        id, contract_number, licensee_name, brand, type,
        start_date, end_date, mg_total, royalty_percent,
        mg_status,
        CAST((julianday(end_date) - julianday('now')) AS INTEGER) as dias_até_vencimento
      FROM contracts
      ORDER BY end_date ASC
    `).all()
    
    return new Response(JSON.stringify(result.results), {
      headers: { 'content-type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }
}
