import axios from 'axios'

const BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) ? import.meta.env.VITE_API_BASE : 'http://localhost:8080'

const instance = axios.create({
  baseURL: BASE,
  timeout: 10000
})

async function req(pathOrUrl, token = null, opts = {}) {
  const headers = { ...(opts.headers || {}) }
  if (token) {
    if (!headers['Authorization']) headers['Authorization'] = String(token).startsWith('Bearer') ? String(token) : `Bearer ${token}`
  }
  const method = (opts.method || 'GET').toLowerCase()
  const data = opts.body || opts.data
  const params = opts.params || undefined

  try {
    const res = await instance.request({
      url: pathOrUrl,
      method,
      headers,
      data,
      params
    })
    return res.data
  } catch (err) {
    if (err.response) {
      const status = err.response.status
      const body = err.response.data || err.response.statusText
      const unauthorized = status === 401 || status === 403
      throw { status, body, unauthorized }
    }
    if (err.code === 'ECONNABORTED') {
      throw { status: 0, body: { error: 'Request timeout' }, unauthorized: false }
    }
    throw { status: 0, body: { error: err.message || 'Network error' }, unauthorized: false }
  }
}

async function safeReq(pathOrUrl, opts = {}) {
  const headers = opts.headers || {}
  try {
    const res = await instance.request({ url: pathOrUrl, method: opts.method || 'GET', headers, params: opts.params })
    return res.data
  } catch (err) {
    if (err.code === 'ECONNABORTED') throw { status: 0, body: { error: 'Request timeout' }, unauthorized: false }
    if (err.response) {
      const status = err.response.status
      const body = err.response.data || err.response.statusText
      const unauthorized = status === 401 || status === 403
      throw { status, body, unauthorized }
    }
    throw { status: 0, body: { error: err.message || 'Network error' }, unauthorized: false }
  }
}

export { instance as axiosInstance, req, safeReq }

export function isUnauthorizedError(err) {
  return !!(err && (err.unauthorized === true || err.status === 401 || err.status === 403))
}
