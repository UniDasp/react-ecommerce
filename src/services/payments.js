import { req } from './http.js'

export async function initiatePayment(token, paymentDto) {
  return await req('/pagos', token, { method: 'POST', body: paymentDto })
}

export async function confirmPayment(token, id, processRequest, paymentToken) {
  const headers = { 'Content-Type': 'application/json' }
  if (paymentToken) headers['Authorization'] = paymentToken
  return await req(`/pagos/${id}/confirmar`, null, { method: 'POST', headers, body: processRequest })
}

export async function getMyPayments(token) {
  return await req('/pagos/mis-pagos', token, { method: 'GET' })
}

export async function getPaymentById(token, id) {
  return await req(`/pagos/${id}`, token, { method: 'GET' })
}

export async function refundPayment(token, id) {
  return await req(`/pagos/${id}/reembolsar`, token, { method: 'POST' })
}

export default { initiatePayment, confirmPayment, getMyPayments, getPaymentById, refundPayment }
