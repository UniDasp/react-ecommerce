import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)
    const res = await login(username, password)
    if (res.ok) {
      setStatus({ ok: true, msg: 'Inicio de sesión exitoso. Redirigiendo...' })
      const dest = (location.state && location.state.from) ? location.state.from : '/react-ecommerce/'
      setTimeout(() => navigate(dest), 700)
    } else {
      setStatus({ ok: false, msg: 'Usuario o contraseña incorrectos' })
    }
  }

  return (
    <div className="login-page">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          <div className="card gamer-card no-hover">
            <div className="card-body p-4 p-md-5">
              <h2 className="section-title text-center mb-2">🎮 Iniciar Sesión</h2>
              <p className="auth-subtitle">Accede a tu cuenta para ver ofertas y pedidos</p>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Usuario</label>
                  <input value={username} onChange={e => setUsername(e.target.value)} type="text" className="form-control" id="username" placeholder="usuario" />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control" id="password" placeholder="••••••••" />
                </div>

                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="remember"
                  />
                  <label className="form-check-label" htmlFor="remember">
                    Recordarme
                  </label>
                </div>

                <div className="d-grid gap-2 mb-3">
                  <button type="submit" className="btn btn-neon btn-lg">Iniciar Sesión</button>
                </div>

                {status && (
                  <div className={`alert ${status.ok ? 'alert-success' : 'alert-danger'} text-center`} role="alert">
                    {status.msg}
                  </div>
                )}

                <div className="text-center mb-3">
                  <Link to="/react-ecommerce/forgot-password" className="text-muted small-link">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <hr className="my-4" />

                <div className="text-center">
                  <p className="text-muted mb-2">¿No tienes cuenta?</p>
                  <Link to="/react-ecommerce/register" className="btn btn-outline-neon">
                    Crear cuenta
                  </Link>
                </div>
              </form>
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
