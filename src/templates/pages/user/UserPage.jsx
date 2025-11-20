/**
 * UserPage (template)
 * --------------------------------------------------
 * Página de ejemplo para probar endpoints de usuario protegidos.
 * - Propósito: interfaz de prueba para `getProfile`, `updateProfile` y
 *   llamadas arbitrarias mediante `callProtected`.
 * - Dependencias: `userService` (este archivo) y `isUnauthorizedError`
 *   desde `src/services/http.js`.
 * - Qué editar: en producción, integra `useAuth()` y elimina el campo de
 *   token manual; copia las llamadas que necesites a tu componente final.
 */

import React, { useState } from 'react'
import { isUnauthorizedError } from '../../../services/http.js'
import * as userService from '../../services/user/userService.js'

export default function UserPage() {
  const [token, setToken] = useState('')
  const [path, setPath] = useState('/user/echo')
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
        } catch (e) {}
      }
      const opts = { method, query: queryObj }
      if (body && body.trim()) {
        try { opts.body = JSON.parse(body) } catch (e) { opts.body = body }
      }
      const res = await userService.callProtected(token || null, path, opts)
      setResult(res)
    } catch (err) {
      if (isUnauthorizedError(err)) {
        setError({ message: 'No autorizado (401/403)', detail: err })
        return
      }
      setError(err)
    }
  }

  const doGetProfile = async () => {
    setResult(null)
    setError(null)
    try {
      // Ejemplo: obtener el perfil del usuario actual.
      // Si estás en la app real, utiliza `token` desde `useAuth()`.
      const res = await userService.getProfile(token || null)
      setResult(res)
    } catch (err) {
      if (isUnauthorizedError(err)) { setError({ message: 'No autorizado (401/403)', detail: err }); return }
      setError(err)
    }
  }

  const [updateDraft, setUpdateDraft] = useState({})
  const doUpdateProfile = async () => {
    setResult(null); setError(null)
    try {
      // Ejemplo: actualizar perfil. `updateDraft` es el objeto con los
      // campos a actualizar; modifícalo en la UI según lo requieras.
      const res = await userService.updateProfile(token || null, updateDraft)
      setResult(res)
    } catch (err) {
      if (isUnauthorizedError(err)) { setError({ message: 'No autorizado (401/403)', detail: err }); return }
      setError(err)
    }
  }

  return (
    <div className="container">
      <h3>Template User Page (plug & play)</h3>
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
        </div>
      </form>

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
