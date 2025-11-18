const BASE = 'http://localhost:8080'

async function req(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, opts)
  const txt = await res.text().catch(() => null)
  let parsed = null
  try { parsed = txt ? JSON.parse(txt) : null } catch (e) { parsed = null }
  if (!res.ok) throw { status: res.status, body: parsed || txt }
  return parsed
}

export async function login(credentials) {
  return await req('/autenticacion/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials) })
}

export async function register(body) {
  return await req('/autenticacion/registrar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}

export async function refresh(token) {
  return await req('/autenticacion/refrescar', { method: 'POST', headers: { 'Authorization': token } })
}

export async function validate(token) {
  return await req('/autenticacion/validar', { method: 'GET', headers: { 'Authorization': token } })
}

export async function getCurrentUser(token) {
  return await req('/autenticacion/yo', { method: 'GET', headers: { 'Authorization': token } })
}

export async function changePassword(token, body) {
  return await req('/autenticacion/cambiar-contrasena', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(body)
  })
}

export async function recoverPassword(body) {
  // body should be { email: 'user@example.com' }
  return await req('/autenticacion/recuperar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}

export async function resetPassword(body) {
  // body should be { token: '...', newPassword: '...', confirmPassword: '...' }
  return await req('/autenticacion/reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}

export default { login, register, refresh, validate, getCurrentUser, changePassword, recoverPassword, resetPassword }
