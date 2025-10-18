import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          <div className="card gamer-card no-hover">
            <div className="card-body p-4 p-md-5">
              <h2 className="section-title text-center mb-4">
                🎮 Iniciar Sesión
              </h2>

              <form>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="tu@email.com"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="••••••••"
                  />
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
                  <button type="submit" className="btn btn-neon btn-lg">
                    Iniciar Sesión
                  </button>
                </div>

                <div className="text-center mb-3">
                  <a href="#" className="text-muted small">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <hr className="my-4" />

                <div className="text-center">
                  <p className="text-muted mb-2">¿No tienes cuenta?</p>
                  <Link
                    to="/react-ecommerce/register"
                    className="btn btn-outline-neon"
                  >
                    Crear cuenta
                  </Link>
                </div>
              </form>
            </div>
          </div>

          <div className="text-center mt-4">
            <Link to="/react-ecommerce/" className="text-muted">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
