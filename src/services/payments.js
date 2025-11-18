const BASE = 'http://localhost:8080'

async function req(url, token, opts = {}) {
  const headers = opts.headers || {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (opts.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json'
  const res = await fetch(url, { ...opts, headers })
  const txt = await res.text().catch(() => null)
  let parsed = null
  try { parsed = txt ? JSON.parse(txt) : null } catch (e) { parsed = null }
  if (!res.ok) throw { status: res.status, body: parsed || txt }
  return parsed
}

export async function initiatePayment(token, paymentDto) {
  const url = `${BASE}/pagos`
  return await req(url, token, { method: 'POST', body: JSON.stringify(paymentDto) })
}

export async function confirmPayment(token, id, processRequest, paymentToken) {
  const url = `${BASE}/pagos/${id}/confirmar`
  const headers = { 'Content-Type': 'application/json' }
  if (paymentToken) headers['Authorization'] = paymentToken
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(processRequest) })
  const txt = await res.text().catch(() => null)
  let parsed = null
  try { parsed = txt ? JSON.parse(txt) : null } catch (e) { parsed = null }
  if (!res.ok) throw { status: res.status, body: parsed || txt }
  return parsed
}

export async function getMyPayments(token) {
  const url = `${BASE}/pagos/mis-pagos`
  return await req(url, token, { method: 'GET' })
}

export async function getPaymentById(token, id) {
  const url = `${BASE}/pagos/${id}`
  return await req(url, token, { method: 'GET' })
}

export async function refundPayment(token, id) {
  const url = `${BASE}/pagos/${id}/reembolsar`
  return await req(url, token, { method: 'POST' })
}

export default { initiatePayment, confirmPayment, getMyPayments, getPaymentById, refundPayment }
