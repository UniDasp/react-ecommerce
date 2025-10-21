import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div className="register-page">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 col-xl-6">
          <div className="card gamer-card no-hover">
            <div className="card-body p-4 p-md-5">
              <h2 className="section-title text-center mb-2">🎮 Crear Cuenta</h2>
              <p className="auth-subtitle">Regístrate para comenzar a comprar en LEVEL-UP GAMER</p>

              <form>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="nombre" className="form-label">
                      Nombre
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      placeholder="Tu nombre"
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="apellido" className="form-label">
                      Apellido
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="apellido"
                      placeholder="Tu apellido"
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" placeholder="tu@email.com" />
                    <small className="text-muted auth-small-info">🎓 Usa tu correo @duocuc.cl para obtener 20% de descuento</small>
                  </div>

                  <div className="col-md-6">
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

                  <div className="col-md-6">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirmar Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="telefono" className="form-label">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="telefono"
                      placeholder="+56 9 1234 5678"
                    />
                  </div>

                  <div className="col-12">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="terms"
                      />
                      <label className="form-check-label" htmlFor="terms">
                        Acepto los{' '}
                        <Link to="/terms" className="text-decoration-none">
                          términos y condiciones
                        </Link>
                      </label>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="newsletter"
                      />
                      <label className="form-check-label" htmlFor="newsletter">
                        Quiero recibir ofertas y novedades por email
                      </label>
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

              <div className="text-center">
                <p className="text-muted mb-2">¿Ya tienes cuenta?</p>
                <Link to="/login" className="btn btn-outline-neon">
                  Iniciar Sesión
                </Link>
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
