import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate, Link } from 'react-router-dom'

export default function AccountPage() {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    fullName: '',
    phone: '',
    address: '',
    region: '',
    city: '',
    email: ''
  })
  const [status, setStatus] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        phone: user.phone || '',
        address: user.address || '',
        region: user.region || '',
        city: user.city || '',
        email: user.email || ''
      }))
    }
  }, [user])

  if (!user) return (
    <div className="container">
      <h3>Mi cuenta</h3>
      <p>Debes iniciar sesión para ver tu cuenta.</p>
    </div>
  )

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSave = async (e) => {
    e.preventDefault()
    setStatus(null)
    setSaving(true)
    const computedFull = form.fullName && form.fullName.trim()
      ? form.fullName.trim()
      : `${form.firstName || ''} ${form.lastName || ''}`.trim()
    const updates = {
      firstName: form.firstName || null,
      lastName: form.lastName || null,
      fullName: computedFull || null,
      phone: form.phone || null,
      address: form.address || null,
      region: form.region || null,
      city: form.city || null,
      email: form.email || null
    }
    const res = await updateProfile(user.id, updates)
    setSaving(false)
    if (res && res.ok) {
      setStatus({ ok: true, msg: 'Perfil actualizado correctamente.' })
    } else {
      const msg = res?.error || `Error actualizando perfil${res?.status ? ' (' + res.status + ')' : ''}`
      setStatus({ ok: false, msg })
    }
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="mb-0">Mi cuenta</h3>
        <div>
          <Link to="/react-ecommerce/cambiar-contrasena" className="btn btn-outline-secondary me-2">Cambiar contraseña</Link>
        </div>
      </div>
      <form className="mx-auto mt-4" style={{maxWidth: 640}} onSubmit={handleSave}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Nombre</label>
            <input className="form-control" name="firstName" value={form.firstName} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Apellido</label>
            <input className="form-control" name="lastName" value={form.lastName} onChange={handleChange} />
          </div>
          <div className="col-12">
            <label className="form-label">Nombre completo (opcional)</label>
            <input className="form-control" name="fullName" value={form.fullName} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Teléfono</label>
            <input className="form-control" name="phone" value={form.phone} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Dirección</label>
            <input className="form-control" name="address" value={form.address} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Región</label>
            <select className="form-select" name="region" value={form.region} onChange={handleChange}>
              <option value="">Selecciona una región</option>
              <option value="metropolitana">Región Metropolitana</option>
              <option value="valparaiso">Valparaíso</option>
              <option value="biobio">Biobío</option>
              <option value="araucania">Araucanía</option>
              <option value="loslagos">Los Lagos</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Ciudad</label>
            <input className="form-control" name="city" value={form.city} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Correo</label>
            <input className="form-control" name="email" value={form.email} onChange={handleChange} disabled={true}  />
          </div>
        </div>

        {status && (
          <div className={`alert ${status.ok ? 'alert-success' : 'alert-danger'} mt-3`} role="alert">{status.msg}</div>
        )}

        <div className="d-flex justify-content-end">
          <button className="btn btn-primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </form>
    </div>
  )
}
