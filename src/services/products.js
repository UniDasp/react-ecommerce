import { safeReq } from './http.js'

export async function listProducts() {
  return await safeReq('/productos')
}

export async function listActiveProducts() {
  return await safeReq('/productos/activos')
}

export async function getProductsByCategory(categoriaId) {
  return await safeReq(`/productos/categoria/${categoriaId}`)
}

export async function searchProducts(query) {
  return await safeReq(`/productos/buscar?consulta=${encodeURIComponent(query)}`)
}

export async function getProductById(id) {
  const data = await safeReq(`/productos/${id}`)
  if (Array.isArray(data)) {
    const prod = data.find(p => String(p.id) === String(id))
    if (!prod) throw new Error('Producto no encontrado')
    return prod
  }
  if (!data) throw new Error('Producto no encontrado')
  return data
}
