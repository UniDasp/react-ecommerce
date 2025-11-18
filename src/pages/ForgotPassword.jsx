import { useState } from 'react'
import { Link } from 'react-router-dom'
import authService from '../services/auth.js'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)
    if (!email) return setStatus({ ok: false, msg: 'Ingresa un correo electrónico' })
    setLoading(true)
    try {
      const res = await authService.recoverPassword({ email })
      // backend may return a message or token (dev). Show friendly message.
      const msg = (res && (res.mensaje || res.message || JSON.stringify(res))) || 'Si el correo existe, se enviaron instrucciones.'
      setStatus({ ok: true, msg })
    } catch (err) {
      const errMsg = err?.body?.error || err?.body?.mensaje || err?.body || (err.message || 'Error enviando solicitud')
      setStatus({ ok: false, msg: errMsg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="forgot-page text-center py-5">
      <div className="card gamer-card d-inline-block" style={{ maxWidth: 560 }}>
        <div className="card-body p-4">
          <h2 className="section-title mb-3">🤭 Olvidaste tu contraseña</h2>
          <p className="text-muted mb-3">Introduce tu correo y te enviaremos instrucciones para restablecer la contraseña.</p>

          <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: 420 }}>
            <div className="mb-3 text-start">
              <label className="form-label">Correo electrónico</label>
              <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" />
            </div>

            {status && (
              <div className={`alert ${status.ok ? 'alert-success' : 'alert-danger'}`} role="alert">{status.msg}</div>
            )}

            <div className="d-flex justify-content-center gap-2">
              <button className="btn btn-neon" type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Enviar instrucciones'}</button>
              <Link to="/react-ecommerce/login" className="btn btn-outline-neon">Volver a iniciar sesión</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
