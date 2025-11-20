import { req } from './http.js'

export async function listUsers(token) {
  return await req('/usuarios', token || null, { method: 'GET' })
}
export async function updateUserRoles(token, id, rolesArr) {
  return await req(`/usuarios/${id}`, token || null, { method: 'PUT', body: { roles: rolesArr } })
}
export async function updateUser(token, id, updates) {
  return await req(`/usuarios/${id}`, token || null, { method: 'PUT', body: updates })
}

export default { listUsers, updateUserRoles }
