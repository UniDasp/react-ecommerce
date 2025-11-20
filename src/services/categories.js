import { safeReq, req } from './http.js'

export async function listCategories() {
  return await safeReq('/categorias')
}

export async function createCategory(token, body) {
  return await req('/categorias', token, { method: 'POST', body })
}

export async function getCategoryById(id) {
  const data = await safeReq(`/categorias/${id}`)
  if (Array.isArray(data)) {
    const cat = data.find(c => String(c.id) === String(id))
    if (!cat) throw new Error('Categoría no encontrada')
    return cat
  }
  if (!data) throw new Error('Categoría no encontrada')
  return data
}

export default { listCategories, getCategoryById }
