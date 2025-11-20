import { req } from './http.js'

export async function createProduct(token, product) {
  return await req('/productos', token, { method: 'POST', body: product })
}

export async function updateProduct(token, id, updates) {
  return await req(`/productos/${id}`, token, { method: 'PUT', body: updates })
}

export async function deleteProduct(token, id) {
  return await req(`/productos/${id}`, token, { method: 'DELETE' })
}

export default { createProduct, updateProduct, deleteProduct }
