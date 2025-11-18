const BASE = 'http://localhost:8080'

async function req(url, token, opts = {}) {
  const headers = opts.headers || {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (opts.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json'
  const res = await fetch(url, { ...opts, headers })
  const txt = await res.text().catch(() => null)
  let parsed = null
  try { parsed = txt ? JSON.parse(txt) : null } catch (e) { parsed = null }
  if (!res.ok) throw { status: res.status, body: parsed || txt }
  return parsed
}

export async function listAllPayments(token) {
  const url = `${BASE}/pagos`
  return await req(url, token, { method: 'GET' })
}

export async function adminConfirmPayment(token, id) {
  const url = `${BASE}/pagos/${id}/confirmar-admin`
  return await req(url, token, { method: 'POST' })
}

export default { listAllPayments, adminConfirmPayment }
