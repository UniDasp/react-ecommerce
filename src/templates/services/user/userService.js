/**
 * userService (template)
 * --------------------------------------------------
 * Comentarios en español para guiar al desarrollador.
 * - Propósito: helpers relacionados con el usuario (perfil, actualización).
 * - Dependencia: `req` desde `src/services/http.js`.
 * - Qué editar: adaptar rutas como `/autenticacion/yo` si tu backend usa otra convención.
 * - Recomendación: cuando copies este código a una página real, integra `useAuth()`
 *   para obtener `token` y `user` directamente desde el contexto de la app.
 */

import { req } from '../../../services/http.js'

// Obtener perfil del usuario actual (usa el endpoint `/autenticacion/yo` del backend)
// Parámetros: token (JWT) o null
export async function getProfile(token) {
	return req('/autenticacion/yo', token, { method: 'GET' })
}

// Actualizar perfil del usuario. payload es un objeto con los campos a actualizar.
export async function updateProfile(token, payload) {
	return req('/autenticacion/yo', token, { method: 'PUT', body: payload })
}

// Wrapper genérico para llamadas protegidas desde las páginas template.
// Útil para probar cualquier ruta protegida desde la UI.
export async function callProtected(token, path, opts = {}) {
	const method = (opts.method || 'GET')
	const query = opts.query || {}
	const qs = Object.keys(query || {}).length ? ('?' + new URLSearchParams(query).toString()) : ''
	const body = opts.body !== undefined ? opts.body : opts.data
	return req(`${path}${qs}`, token, { method, body, params: opts.params, headers: opts.headers })
}

export default { getProfile, updateProfile }
