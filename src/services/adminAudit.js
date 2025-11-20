const BASE = 'http://localhost:8080'

function buildQuery(params = {}) {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return
    q.append(k, String(v))
  })
  return q.toString() ? `?${q.toString()}` : ''
}

import { req } from './http.js'

export async function listAudit(token, params = {}) {
  const q = buildQuery(params)
  return await req(`/audit/logs${q}`, token || null, { method: 'GET' })
}

export default { listAudit }
