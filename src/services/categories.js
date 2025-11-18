const BASE = 'http://localhost:8080'

async function safeFetch(url, opts) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), 10000)
  try {
    const res = await fetch(url, { signal: controller.signal, ...opts })
    clearTimeout(id)
    if (!res.ok) {
      const txt = await res.text().catch(() => null)
      throw new Error(txt || `HTTP ${res.status}`)
    }
    const json = await res.json().catch(() => null)
    return json
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('Request timeout')
    throw err
  }
}

export async function listCategories() {
  const url = `${BASE}/categorias`
  return await safeFetch(url)
}

export async function createCategory(token, body) {
  const url = `${BASE}/categorias`
  const headers = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  headers['Content-Type'] = 'application/json'
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) })
  const txt = await res.text().catch(() => null)
  let parsed = null
  try { parsed = txt ? JSON.parse(txt) : null } catch (e) { parsed = null }
  if (!res.ok) throw { status: res.status, body: parsed || txt }
  return parsed
}

export async function getCategoryById(id) {
  const url = `${BASE}/categorias/${id}`
  const data = await safeFetch(url)
  if (Array.isArray(data)) {
    const cat = data.find(c => String(c.id) === String(id))
    if (!cat) throw new Error('Categoría no encontrada')
    return cat
  }
  if (!data) throw new Error('Categoría no encontrada')
  return data
}

export default { listCategories, getCategoryById }
