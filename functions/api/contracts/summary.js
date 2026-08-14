import { getContractsSummary, getRoyaltiesByType, getUpcomingVencimentos, getShortfallStatus } from '../lib/queries.js'

export async function onRequest({ request, env, data }) {
  if (request.method !== 'GET') return new Response(null, { status: 405 })
  
  try {
    const db = env.DB
    const [summary, royalties, upcoming, shortfall] = await Promise.all([
      getContractsSummary(db),
      getRoyaltiesByType(db),
      getUpcomingVencimentos(db, 90),
      getShortfallStatus(db),
    ])
    
    return new Response(JSON.stringify({
      summary,
      royalties,
      upcoming,
      shortfall,
    }), {
      headers: { 'content-type': 'application/json' },
    })
  } catch (err) {
    console.error('API erro:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }
}
