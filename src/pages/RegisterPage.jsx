import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { register as registerUser } from '../services/auth.js'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    region: ''
  })
  const [status, setStatus] = useState(null)

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)
    if (!form.username || !form.password) {
      setStatus({ ok: false, msg: 'Username y password son requeridos' })
      return
    }
    if (form.password !== form.confirmPassword) {
      setStatus({ ok: false, msg: 'Las contraseñas no coinciden' })
      return
    }

    try {
      const body = {
        username: form.username,
        password: form.password,
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        address: form.address,
        region: form.region
      }

      const res = await registerUser(body)

      if (!res) {
        setStatus({ ok: false, msg: 'Error al registrar usuario' })
        return
      }
      setStatus({ ok: true, msg: 'Registro exitoso. Iniciando sesión...' })
      try {
        const loginRes = await login(form.username, form.password)
        if (loginRes.ok) {
          setStatus({ ok: true, msg: 'Inicio de sesión correcto. Redirigiendo...' })
          setTimeout(() => navigate('/react-ecommerce/'), 900)
        } else {
          setStatus({ ok: true, msg: 'Registro OK. Por favor inicia sesión.' })
          setTimeout(() => navigate('/react-ecommerce/login'), 1200)
        }
      } catch (err) {
        setStatus({ ok: true, msg: 'Registro OK. Por favor inicia sesión.' })
        setTimeout(() => navigate('/react-ecommerce/login'), 1200)
      }
    } catch (err) {
      setStatus({ ok: false, msg: err.message })
    }
  }

  return (
    <div className="register-page">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 col-xl-6">
          <div className="card gamer-card no-hover">
            <div className="card-body p-4 p-md-5">
              <h2 className="section-title text-center mb-2">🎮 Crear Cuenta</h2>
              <p className="auth-subtitle">Regístrate para comenzar a comprar en LEVEL-UP GAMER</p>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="firstName" className="form-label">Nombre</label>
                    <input name="firstName" value={form.firstName} onChange={handleChange} type="text" className="form-control" id="firstName" placeholder="Tu nombre" />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="lastName" className="form-label">Apellido</label>
                    <input name="lastName" value={form.lastName} onChange={handleChange} type="text" className="form-control" id="lastName" placeholder="Tu apellido" />
                  </div>

                  <div className="col-12">
                    <label htmlFor="username" className="form-label">Usuario</label>
                    <input name="username" value={form.username} onChange={handleChange} type="text" className="form-control" id="username" placeholder="usuario" />
                  </div>

                  <div className="col-12">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input name="email" value={form.email} onChange={handleChange} type="email" className="form-control" id="email" placeholder="tu@email.com" />
                    <small className="text-muted auth-small-info">🎓 Usa tu correo institucional para descuentos</small>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input name="password" value={form.password} onChange={handleChange} type="password" className="form-control" id="password" placeholder="••••••••" />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                    <input name="confirmPassword" value={form.confirmPassword} onChange={handleChange} type="password" className="form-control" id="confirmPassword" placeholder="••••••••" />
                  </div>

                  <div className="col-12">
                    <label htmlFor="phone" className="form-label">Teléfono</label>
                    <input name="phone" value={form.phone} onChange={handleChange} type="tel" className="form-control" id="phone" placeholder="+56 9 1234 5678" />
                  </div>

                  <div className="col-12">
                    <label htmlFor="address" className="form-label">Dirección</label>
                    <input name="address" value={form.address} onChange={handleChange} type="text" className="form-control" id="address" placeholder="Calle ..." />
                  </div>

                  <div className="col-12">
                    <label htmlFor="region" className="form-label">Región</label>
                    <input name="region" value={form.region} onChange={handleChange} type="text" className="form-control" id="region" placeholder="Región" />
                  </div>

                  <div className="col-12">
                    <div className="form-check">
                      <input type="checkbox" className="form-check-input" id="terms" />
                      <label className="form-check-label" htmlFor="terms">Acepto los{' '}<Link to="/terms" className="text-decoration-none">términos y condiciones</Link></label>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-check">
                      <input type="checkbox" className="form-check-input" id="newsletter" />
                      <label className="form-check-label" htmlFor="newsletter">Quiero recibir ofertas y novedades por email</label>
                    </div>
                  </div>

                  <div className="col-12 mt-4">
                    <div className="d-grid gap-2">
                      <button type="submit" className="btn btn-neon btn-lg">Crear Cuenta</button>
                    </div>
                  </div>
                </div>
              </form>

              <hr className="my-4" />
              {status && (
                <div className={`alert ${status.ok ? 'alert-success' : 'alert-danger'} text-center mt-3`} role="alert">
                  {status.msg}
                </div>
              )}

              <div className="text-center">
                <p className="text-muted mb-2">¿Ya tienes cuenta?</p>
                <Link to="/react-ecommerce/login" className="btn btn-outline-neon">Iniciar Sesión</Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <Link to="/" className="text-muted">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
