import { req } from './http.js'

export async function listAllPayments(token) {
  return await req('/pagos', token, { method: 'GET' })
}

export async function adminConfirmPayment(token, id) {
  return await req(`/pagos/${id}/confirmar-admin`, token, { method: 'POST' })
}

export default { listAllPayments, adminConfirmPayment }
