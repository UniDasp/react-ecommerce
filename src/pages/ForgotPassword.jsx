import { Link } from 'react-router-dom'

export default function ForgotPassword() {
  return (
    <div className="forgot-page text-center py-5">
      <div className="card gamer-card d-inline-block" style={{maxWidth: 560}}>
        <div className="card-body p-5">
          <h2 className="section-title mb-3">🤭 Olvidaste tu contraseña</h2>
          <p className="text-muted mb-4">Jaja, aca no hay nada XD</p>
          <div className="d-flex justify-content-center gap-2">
            <Link to="/react-ecommerce/" className="btn btn-outline-neon">Volver al inicio</Link>
            <Link to="/react-ecommerce/login" className="btn btn-neon">Ir a iniciar sesión</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
