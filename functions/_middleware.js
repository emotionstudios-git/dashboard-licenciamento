export async function onRequest({ request, next }) {
  const url = new URL(request.url)
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1'
  
  // Validar CF Access em produção
  if (!isLocalDev && !request.headers.get('cf-access-jwt-assertion')) {
    return new Response(JSON.stringify({ error: 'Acesso restrito — autentique via CF Access' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    })
  }
  
  // Extrair email do usuário (CF Access fornece via header)
  const email = request.headers.get('cf-access-authenticated-user-email') || 'dev@localhost'
  request.user = { email }
  
  return next()
}
