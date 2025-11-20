/**
 * AdminPage (template)
 * --------------------------------------------------
 * Página de ejemplo para pruebas rápidas de endpoints administrativos.
 * - Propósito: UI mínima (formulario + botones) para probar rutas protegidas
 *   del backend desde el frontend de forma directa.
 * - Dependencias: sólo importa los helpers del template `adminService` y
 *   `isUnauthorizedError` desde `src/services/http.js`.
 * - Qué editar:
 *    - Sustituir las rutas de prueba por tus rutas reales si quieres usar
 *      este archivo como página productiva.
 *    - Para producción, copia la lógica necesaria dentro de tu página real
 *      y usa `useAuth()` para obtener `token` y `user` desde el contexto.
 * - Token: el campo 'Token' puede recibir el valor completo `Bearer ...`
 *   o sólo el JWT; el helper `req` añadirá el prefijo si es necesario.
 */

import React, { useState } from 'react'
import { isUnauthorizedError } from '../../../services/http.js'
import * as adminService from '../../services/admin/adminService.js'

export default function AdminPage() {
  const [token, setToken] = useState('')
  const [path, setPath] = useState('/test/hola')
  const [method, setMethod] = useState('GET')
  const [query, setQuery] = useState('')
  const [body, setBody] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e && e.preventDefault()
    setResult(null)
    setError(null)
    try {
      const queryObj = {}
      if (query && query.trim()) {
        try {
          if (query.trim().startsWith('{')) {
            Object.assign(queryObj, JSON.parse(query))
          } else {
            const params = new URLSearchParams(query)
            for (const [k, v] of params.entries()) queryObj[k] = v
          }
        } catch (e) {
          // Ignoramos los errores
        }
      }
      const opts = { method, query: queryObj }
      if (body && body.trim()) {
        try { opts.body = JSON.parse(body) } catch (e) { opts.body = body }
      }
      const res = await adminService.callProtected(token || null, path, opts)
      setResult(res)
    } catch (err) {
      if (isUnauthorizedError(err)) {
        setError({ message: 'No autorizado (401/403)', detail: err })
        return
      }
      setError(err)
    }
  }

  const doListPending = async () => {
    setResult(null)
    setError(null)
    try {
      // Ejemplo real: llama al helper `listPendingOrders` exportado por el
      // service de template. Cambia o amplía este helper según tu API.
      const res = await adminService.listPendingOrders(token || null)
      setResult(res)
    } catch (err) {
      if (isUnauthorizedError(err)) { setError({ message: 'No autorizado (401/403)', detail: err }); return }
      setError(err)
    }
  }

  const [confirmId, setConfirmId] = useState('')
  const doConfirm = async () => {
    if (!confirmId) return alert('Ingrese ID de orden')
    setResult(null)
    setError(null)
    try {
      // Ejemplo real: confirmar orden por ID usando `confirmOrder`.
      // Asegúrate de que el endpoint coincida con tu backend.
      const res = await adminService.confirmOrder(token || null, confirmId)
      setResult(res)
    } catch (err) {
      if (isUnauthorizedError(err)) { setError({ message: 'No autorizado (401/403)', detail: err }); return }
      setError(err)
    }
  }

  return (
    <div className="container">
      <h3>Template Admin Page (plug & play)</h3>
      <form onSubmit={submit} className="mb-3">
        <div className="mb-2">
          <label className="form-label">Token (opcional)</label>
          <input className="form-control" value={token} onChange={e => setToken(e.target.value)} placeholder="Bearer ... or raw token" />
        </div>
        <div className="row g-2">
          <div className="col-md-6">
            <label className="form-label">Path</label>
            <input className="form-control" value={path} onChange={e => setPath(e.target.value)} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Method</label>
            <select className="form-select" value={method} onChange={e => setMethod(e.target.value)}>
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Query (a=1&b=2 or JSON)</label>
            <input className="form-control" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
        </div>

        <div className="mb-2 mt-2">
          <label className="form-label">Body (JSON)</label>
          <textarea className="form-control" rows={4} value={body} onChange={e => setBody(e.target.value)} />
        </div>

        <div className="mt-2">
          <button className="btn btn-neon">Enviar</button>
          <button type="button" className="btn btn-outline-secondary ms-2" onClick={doListPending}>Listar órdenes pendientes</button>
        </div>
      </form>

      <div className="mb-3">
        <label className="form-label">Confirmar orden por ID</label>
        <div className="d-flex gap-2">
          <input className="form-control" value={confirmId} onChange={e => setConfirmId(e.target.value)} placeholder="Order ID" />
          <button className="btn btn-primary" onClick={doConfirm}>Confirmar</button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <strong>{error.message || 'Error'}</strong>
          <pre style={{whiteSpace: 'pre-wrap'}}>{JSON.stringify(error.detail || error, null, 2)}</pre>
        </div>
      )}

      {result && (
        <div className="card p-3">
          <h5>Respuesta</h5>
          <pre style={{whiteSpace: 'pre-wrap'}}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
