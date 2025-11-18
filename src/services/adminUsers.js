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

export async function listUsers(token) {
  const url = `${BASE}/usuarios`
  return await req(url, token || null, { method: 'GET' })
}

// update roles for a user. rolesArr should be an array of strings, e.g. ['ROLE_ADMIN']
export async function updateUserRoles(token, id, rolesArr) {
  const url = `${BASE}/usuarios/${id}`
  // send only roles to avoid overwriting unintended fields
  return await req(url, token || null, { method: 'PUT', body: JSON.stringify({ roles: rolesArr }) })
}

// update arbitrary user fields (admin). `updates` should be an object with allowed fields.
export async function updateUser(token, id, updates) {
  const url = `${BASE}/usuarios/${id}`
  return await req(url, token || null, { method: 'PUT', body: JSON.stringify(updates) })
}

export default { listUsers, updateUserRoles }
