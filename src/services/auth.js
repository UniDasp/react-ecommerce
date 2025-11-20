import { req } from './http.js'

export async function login(credentials) {
  return await req('/autenticacion/login', null, { method: 'POST', body: credentials })
}

export async function register(body) {
  return await req('/autenticacion/registrar', null, { method: 'POST', body })
}

export async function refresh(token) {
  return await req('/autenticacion/refrescar', token, { method: 'POST' })
}

export async function validate(token) {
  return await req('/autenticacion/validar', token, { method: 'GET' })
}

export async function getCurrentUser(token) {
  return await req('/autenticacion/yo', token, { method: 'GET' })
}

export async function changePassword(token, body) {
  return await req('/autenticacion/cambiar-contrasena', token, { method: 'POST', body })
}

export async function recoverPassword(body) {
  return await req('/autenticacion/recuperar', null, { method: 'POST', body })
}

export async function resetPassword(body) {
  return await req('/autenticacion/reset', null, { method: 'POST', body })
}

export default { login, register, refresh, validate, getCurrentUser, changePassword, recoverPassword, resetPassword }
