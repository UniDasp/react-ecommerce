import React from 'react'
import { Link } from 'react-router-dom'
import { isUnauthorizedError } from '../services/http.js'

export default function Unauthorized({ error, className = '' , showLogin = true }) {
  if (!error) return null
  if (!isUnauthorizedError(error)) return null

  const status = error.status || 0
  let title = 'No autorizado'
  let detail = 'No tienes permisos para ver este recurso.'

  if (status === 401) {
    detail = 'Debes iniciar sesión para acceder a esta sección.'
  } else if (status === 403) {
    detail = 'Acceso denegado: se requieren permisos de administrador.'
  }

  return (
    <div className={`alert alert-danger ${className}`} role="alert">
      <div className="d-flex flex-column">
        <strong className="mb-1">{title}</strong>
        <div className="mb-2">{detail}</div>
        <div className="d-flex gap-2">
          {showLogin && (
            <Link to="/react-ecommerce/login" className="btn btn-sm btn-outline-light">Iniciar sesión</Link>
          )}
        </div>
      </div>
    </div>
  )
}
