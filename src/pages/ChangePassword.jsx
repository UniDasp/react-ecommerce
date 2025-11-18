import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import authService from '../services/auth.js'
import { useNavigate } from 'react-router-dom'

export default function ChangePassword() {
  const { token, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  if (!isAuthenticated) {
    // redirect to login, preserving destination
    navigate('/react-ecommerce/login', { replace: true, state: { from: '/react-ecommerce/cambiar-contrasena' } })
    return null
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)
    if (form.newPassword !== form.confirmPassword) {
      setStatus({ ok: false, msg: 'Las contraseñas no coinciden' })
      return
    }
    if (!form.currentPassword || !form.newPassword) {
      setStatus({ ok: false, msg: 'Completa los campos requeridos' })
      return
    }

    setLoading(true)
    try {
      const body = {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword
      }
      await authService.changePassword(token, body)
      setStatus({ ok: true, msg: 'Contraseña cambiada correctamente.' })
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      // navigate back to account after a short delay
      setTimeout(() => navigate('/react-ecommerce/account'), 1200)
    } catch (err) {
      const msg = err?.body?.error || err?.body?.mensaje || err?.body || (err.message || 'Error cambiando contraseña')
      setStatus({ ok: false, msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h3>Cambiar contraseña</h3>
      <form className="mx-auto mt-4" style={{ maxWidth: 520 }} onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Contraseña actual</label>
          <input type="password" name="currentPassword" className="form-control" value={form.currentPassword} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Nueva contraseña</label>
          <input type="password" name="newPassword" className="form-control" value={form.newPassword} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Confirmar nueva contraseña</label>
          <input type="password" name="confirmPassword" className="form-control" value={form.confirmPassword} onChange={handleChange} />
        </div>

        {status && (
          <div className={`alert ${status.ok ? 'alert-success' : 'alert-danger'}`} role="alert">{status.msg}</div>
        )}

        <div className="d-flex justify-content-end">
          <button className="btn btn-primary" disabled={loading}>{loading ? 'Procesando...' : 'Cambiar contraseña'}</button>
        </div>
      </form>
    </div>
  )
}
