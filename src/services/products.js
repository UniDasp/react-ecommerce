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

export async function listProducts() {
  const url = `${BASE}/productos`
  return await safeFetch(url)
}

export async function listActiveProducts() {
  const url = `${BASE}/productos/activos`
  return await safeFetch(url)
}

export async function getProductsByCategory(categoriaId) {
  const url = `${BASE}/productos/categoria/${categoriaId}`
  return await safeFetch(url)
}

export async function searchProducts(query) {
  const url = `${BASE}/productos/buscar?consulta=${encodeURIComponent(query)}`
  return await safeFetch(url)
}

export async function getProductById(id) {
  const url = `${BASE}/productos/${id}`
  const data = await safeFetch(url)
  if (Array.isArray(data)) {
    const prod = data.find(p => String(p.id) === String(id))
    if (!prod) throw new Error('Producto no encontrado')
    return prod
  }
  if (!data) throw new Error('Producto no encontrado')
  return data
}
