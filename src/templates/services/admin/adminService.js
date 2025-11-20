/**
 * adminService (template)
 * --------------------------------------------------
 * Comentarios en español para que el desarrollador sepa qué editar.
 * - Propósito: ejemplos de llamadas administrativas.
 * - Dependencia: sólo usa el helper central `req` de `src/services/http.js`.
 * - Cómo usar: importar estas funciones desde una página o componente.
 * - Qué editar: cambiar las rutas (`/api/admin/...`) por las rutas reales del backend.
 * - Nota: estas funciones devuelven lo que `req` devuelve (res.data). Los errores
 *   lanzados por `req` tienen la forma: { status, body, unauthorized }.
 */

import { req } from '../../../services/http.js'

// Ejemplo: confirmar una orden desde el panel admin.
// Parámetros:
// - token: string JWT o null
// - orderId: identificador de la orden a confirmar
// Retorno: respuesta del backend (res.data)
export async function confirmOrder(token, orderId) {
	// Ajusta la ruta a la convención de tu backend si es necesario
	return req(`/api/admin/orders/${orderId}/confirm`, token, { method: 'POST' })
}

// Ejemplo: listar órdenes pendientes.
// Parámetros:
// - token: string JWT o null
// - query: objeto con parámetros de consulta opcionales (p.ej. { page: 0, size: 20 })
export async function listPendingOrders(token, query = {}) {
	const qs = Object.keys(query || {}).length ? ('?' + new URLSearchParams(query).toString()) : ''
	return req('/api/admin/orders/pending' + qs, token, { method: 'GET' })
}

// Wrapper genérico para llamadas protegidas desde las páginas template.
// Útil para probar rutas arbitrarias desde la UI de templates.
export async function callProtected(token, path, opts = {}) {
	const method = (opts.method || 'GET')
	const query = opts.query || {}
	const qs = Object.keys(query || {}).length ? ('?' + new URLSearchParams(query).toString()) : ''
	const body = opts.body !== undefined ? opts.body : opts.data
	return req(`${path}${qs}`, token, { method, body, params: opts.params, headers: opts.headers })
}

export default { confirmOrder, listPendingOrders }
