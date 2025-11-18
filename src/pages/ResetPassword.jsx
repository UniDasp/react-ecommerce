import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import authService from '../services/auth.js'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const tokenFromQuery = searchParams.get('token') || ''

  const [form, setForm] = useState({ token: tokenFromQuery, newPassword: '', confirmPassword: '' })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (tokenFromQuery) setForm(f => ({ ...f, token: tokenFromQuery }))
  }, [tokenFromQuery])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)
    if (!form.token) return setStatus({ ok: false, msg: 'Token faltante' })
    if (form.newPassword !== form.confirmPassword) return setStatus({ ok: false, msg: 'Las contraseñas no coinciden' })
    if (form.newPassword.length < 6) return setStatus({ ok: false, msg: 'La contraseña debe tener al menos 6 caracteres' })

    setLoading(true)
    try {
      await authService.resetPassword({ token: form.token, newPassword: form.newPassword, confirmPassword: form.confirmPassword })
      setStatus({ ok: true, msg: 'Contraseña restablecida. Serás redirigido al login.' })
      setTimeout(() => navigate('/react-ecommerce/login'), 1400)
    } catch (err) {
      const msg = err?.body?.error || err?.body?.mensaje || err?.body || (err.message || 'Error al restablecer contraseña')
      setStatus({ ok: false, msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5">
      <div className="card mx-auto" style={{ maxWidth: 560 }}>
        <div className="card-body p-4">
          <h3 className="mb-3">Restablecer contraseña</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Token</label>
              <input className="form-control" name="token" value={form.token} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Nueva contraseña</label>
              <input type="password" className="form-control" name="newPassword" value={form.newPassword} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirmar nueva contraseña</label>
              <input type="password" className="form-control" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
            </div>

            {status && (
              <div className={`alert ${status.ok ? 'alert-success' : 'alert-danger'}`} role="alert">{status.msg}</div>
            )}

            <div className="d-flex justify-content-end">
              <button className="btn btn-primary" disabled={loading}>{loading ? 'Procesando...' : 'Restablecer contraseña'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
