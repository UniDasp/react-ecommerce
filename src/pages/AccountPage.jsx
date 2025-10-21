import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

export default function AccountPage() {
  const { user, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    region: '',
    email: ''
  })

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        fullName: user.fullName || '',
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

  const handleSave = (e) => {
    e.preventDefault()
    const updates = {
      fullName: form.fullName,
      phone: form.phone,
      address: form.address,
      region: form.region,
      city: form.city
    }
    updateProfile(user.id, updates)
    navigate('/react-ecommerce/')
  }

  return (
    <div className="container">
      <h3>Mi cuenta</h3>
      <form className="mx-auto mt-4" style={{maxWidth: 640}} onSubmit={handleSave}>
        <div className="mb-3">
          <label className="form-label">Nombre completo</label>
          <input className="form-control" name="fullName" value={form.fullName} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Teléfono</label>
          <input className="form-control" name="phone" value={form.phone} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input className="form-control" name="address" value={form.address} onChange={handleChange} />
        </div>
        <div className="mb-3">
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
        <div className="mb-3">
          <label className="form-label">Ciudad</label>
          <input className="form-control" name="city" value={form.city} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo</label>
          <input className="form-control" name="email" value={form.email} disabled />
        </div>
        <div className="d-flex justify-content-end">
          <button className="btn btn-primary">Guardar</button>
        </div>
      </form>
    </div>
  )
}
