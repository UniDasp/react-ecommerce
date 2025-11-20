/**
 * publicService (template)
 * --------------------------------------------------
 * Comentarios en español:
 * - Propósito: ejemplos de endpoints públicos (no requieren token).
 * - Dependencia: usa `safeReq`/`req` desde `src/services/http.js`.
 * - Qué editar: cambiar las rutas (`/api/products`, `/public/ping`) según tu backend.
 * - Uso: estas funciones pueden ser llamadas directamente desde páginas públicas.
 *
 * Nota: `safeReq` es adecuado para endpoints públicos; `req` es para llamadas que
 * aceptan token (protegidas). Los errores devueltos por `req`/`safeReq` tienen
 * la forma `{ status, body, unauthorized }`.
 */

import { safeReq, req } from '../../../services/http.js'

// Listar productos (público)
// - query: objeto con parámetros opcionales (p.ej. { categoria: 1, q: 'mouse' })
export async function listProducts(query = {}) {
  const qs = Object.keys(query || {}).length ? ('?' + new URLSearchParams(query).toString()) : ''
  return safeReq(`/api/products${qs}`, { method: 'GET' })
}

// Obtener producto por id
export async function getProduct(id) {
  return safeReq(`/api/products/${id}`, { method: 'GET' })
}

// Ping público de ejemplo (útil para comprobar que el backend responde)
export async function ping() {
  return safeReq('/public/ping')
}

// Wrapper genérico para llamadas públicas desde las páginas template
export async function callPublic(path, opts = {}) {
  const method = opts.method || 'GET'
  const query = opts.query || {}
  const qs = Object.keys(query || {}).length ? ('?' + new URLSearchParams(query).toString()) : ''
  const params = opts.params || undefined
  const headers = opts.headers || {}
  return safeReq(`${path}${qs}`, { method, headers, params })
}

export default { listProducts, getProduct, ping }
