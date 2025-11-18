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

export async function createProduct(token, product) {
  const url = `${BASE}/productos`
  return await req(url, token, { method: 'POST', body: JSON.stringify(product) })
}

export async function updateProduct(token, id, updates) {
  const url = `${BASE}/productos/${id}`
  return await req(url, token, { method: 'PUT', body: JSON.stringify(updates) })
}

export async function deleteProduct(token, id) {
  const url = `${BASE}/productos/${id}`
  return await req(url, token, { method: 'DELETE' })
}

export default { createProduct, updateProduct, deleteProduct }
