/**
 * PublicPage (template)
 * --------------------------------------------------
 * Página de ejemplo para probar endpoints públicos.
 * - Propósito: UI ligera para testear `listProducts`, `getProduct`, `ping`
 *   y también cualquier ruta pública mediante `callPublic`.
 * - Dependencia: sólo `publicService` (que a su vez usa `safeReq` desde
 *   `src/services/http.js`).
 * - Qué editar: cambia las rutas de ejemplo por tus rutas reales. Para
 *   llamadas protegidas, usa en su lugar `callProtected` en servicios que
 *   usen `req`.
 */

import React, { useState } from 'react'
import * as publicService from '../../services/public/publicService.js'

export default function PublicPage() {
  const [path, setPath] = useState('/public/ping')
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
      const res = await publicService.callPublic(path, opts)
      setResult(res)
    } catch (err) {
      setError(err)
    }
  }

  const doPing = async () => {
    setResult(null); setError(null)
    try {
      // Ejemplo: ping al backend para comprobar disponibilidad.
      const res = await publicService.ping()
      setResult(res)
    } catch (err) {
      setError(err)
    }
  }

  const doListProducts = async () => {
    setResult(null); setError(null)
    try {
      // Ejemplo: obtener listado de productos públicos.
      const res = await publicService.listProducts()
      setResult(res)
    } catch (err) {
      setError(err)
    }
  }

  return (
    <div className="container">
      <h3>Template Public Page (plug & play)</h3>
      <form onSubmit={submit} className="mb-3">
        <div className="row g-2">
          <div className="col-md-8">
            <label className="form-label">Path</label>
            <input className="form-control" value={path} onChange={e => setPath(e.target.value)} />
          </div>
          <div className="col-md-2">
            <label className="form-label">Method</label>
            <select className="form-select" value={method} onChange={e => setMethod(e.target.value)}>
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label">Query</label>
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
          <strong>Error</strong>
          <pre style={{whiteSpace: 'pre-wrap'}}>{JSON.stringify(error, null, 2)}</pre>
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
