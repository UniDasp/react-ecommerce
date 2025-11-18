const BASE = 'http://localhost:8080'

function buildQuery(params = {}) {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return
    q.append(k, String(v))
  })
  return q.toString() ? `?${q.toString()}` : ''
}

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

export async function listAudit(token, params = {}) {
  const q = buildQuery(params)
  const url = `${BASE}/audit/logs${q}`
  return await req(url, token || null, { method: 'GET' })
}

export default { listAudit }
