import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, total, clear } = useCart()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [processing, setProcessing] = useState(false)
  const [orderSummary, setOrderSummary] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    region: '',
    metodoPago: 'tarjeta',
    numeroTarjeta: '',
    nombreTarjeta: '',
    expiracion: '',
    cvv: ''
  })

  // Esto es para comprobar si hay un usuario logeado (if user) y rellenar los datos si es que existe (user.email, user.fullName, etc)
  useEffect(() => {
    if (user && user.email) {
      setFormData(prev => ({ ...prev, email: prev.email || user.email }))
    }

    if (user && user.fullName) {
      setFormData(prev => ({ ...prev, nombre: prev.nombre || user.fullName }))
    }

    if (user && user.phone) {
      setFormData(prev => ({ ...prev, telefono: prev.telefono || user.phone }))
    }

    if (user && user.address) {
      setFormData(prev => ({ ...prev, direccion: prev.direccion || user.address }))
    }

    if (user && user.region) {
      setFormData(prev => ({ ...prev, region: prev.region || user.region }))
    }

    if (user && user.city) {
      setFormData(prev => ({ ...prev, ciudad: prev.city || user.city }))
    }




  }, [user])

  const esEstudianteDuoc = formData.email.toLowerCase().endsWith('@duocuc.cl')
  const descuento = esEstudianteDuoc ? total * 0.20 : 0
  const totalConDescuento = total - descuento

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmitDatos = (e) => {
    e.preventDefault()
    if (formData.nombre && formData.email && formData.telefono && formData.direccion && formData.ciudad && formData.region) {
      setStep(2)
    }
  }

  const handleSubmitPago = (e) => {
    e.preventDefault()
    if (formData.metodoPago === 'tarjeta') {
      if (!formData.numeroTarjeta || !formData.nombreTarjeta || !formData.expiracion || !formData.cvv) {
        return
      }
    }
    setProcessing(true)
    setOrderSummary({
      total: total,
      descuento: descuento,
      totalConDescuento: totalConDescuento,
      esEstudianteDuoc: esEstudianteDuoc
    })
    setTimeout(() => {
      setProcessing(false)
      setStep(3)
      clear()
    }, 3000)
  }

  if (items.length === 0 && step < 3) {
    return (
      <div className="text-center py-5">
        <div className="card gamer-card d-inline-block" style={{maxWidth: '500px'}}>
          <div className="card-body p-5">
            <div className="display-1 mb-4">🛒</div>
            <h2 className="mb-3">Tu carrito está vacío</h2>
            <p className="text-muted mb-4">Agrega productos para continuar con tu compra.</p>
            <Link to="/products" className="btn btn-neon">Explorar Productos</Link>
          </div>
        </div>
      </div>
    )
  }

  if (step === 3 && orderSummary) {
    return (
      <div className="text-center py-5">
        <div className="card gamer-card d-inline-block" style={{maxWidth: '600px'}}>
          <div className="card-body p-5">
            <div className="mb-4">
              <div className="display-1 text-success mb-3">✓</div>
              <h2 className="mb-3">¡Compra exitosa!</h2>
              <p className="text-muted mb-4">
                Tu pedido ha sido procesado correctamente. Recibirás un correo de confirmación en <strong>{formData.email}</strong>
              </p>
              {orderSummary.esEstudianteDuoc && (
                <div className="alert alert-success mb-3">
                  <strong>🎓 Descuento estudiantil aplicado:</strong> Ahorraste ${orderSummary.descuento.toLocaleString()}
                </div>
              )}
              <div className="alert alert-info mb-3">
                <strong>Número de orden:</strong> #{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </div>
              <div className="alert alert-light mb-4">
                <strong>Total pagado:</strong> ${orderSummary.totalConDescuento.toLocaleString()}
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-neon" onClick={() => navigate('/react-ecommerce/')}>Volver al inicio</button>
                <button className="btn btn-outline-secondary" onClick={() => navigate('/react-ecommerce/products')}>Seguir comprando</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <h2 className="section-title mb-4">💳 Finalizar Compra</h2>
      
      <div className="mb-4">
        <div className="d-flex align-items-center justify-content-center gap-3">
          <div className={`step-indicator ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Datos</div>
          </div>
          <div className="step-line"></div>
          <div className={`step-indicator ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Pago</div>
          </div>
          <div className="step-line"></div>
          <div className={`step-indicator ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Confirmación</div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          {step === 1 && (
            <div className="card gamer-card no-hover">
              <div className="card-body p-4">
                <h4 className="mb-4">📋 Datos de envío</h4>
                <form onSubmit={handleSubmitDatos}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Nombre completo *</label>
                      <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email *</label>
                      <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Teléfono *</label>
                      <input type="tel" className="form-control" name="telefono" value={formData.telefono} onChange={handleChange} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Dirección *</label>
                      <input type="text" className="form-control" name="direccion" value={formData.direccion} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Ciudad *</label>
                      <input type="text" className="form-control" name="ciudad" value={formData.ciudad} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Región *</label>
                      <select className="form-select" name="region" value={formData.region} onChange={handleChange} required>
                        <option value="">Selecciona una región</option>
                        <option value="metropolitana">Región Metropolitana</option>
                        <option value="valparaiso">Valparaíso</option>
                        <option value="biobio">Biobío</option>
                        <option value="araucania">Araucanía</option>
                        <option value="loslagos">Los Lagos</option>
                      </select>
                    </div>
                    <div className="col-12 mt-4">
                      <button type="submit" className="btn btn-neon w-100">Continuar al pago →</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="card gamer-card no-hover">
              <div className="card-body p-4">
                <h4 className="mb-4">💳 Método de pago</h4>
                <form onSubmit={handleSubmitPago}>
                  <div className="mb-4">
                    <div className="form-check mb-3">
                      <input className="form-check-input" type="radio" name="metodoPago" value="tarjeta" checked={formData.metodoPago === 'tarjeta'} onChange={handleChange} id="tarjeta" />
                      <label className="form-check-label" htmlFor="tarjeta">
                        💳 Tarjeta de crédito/débito
                      </label>
                    </div>
                    <div className="form-check mb-3">
                      <input className="form-check-input" type="radio" name="metodoPago" value="transferencia" checked={formData.metodoPago === 'transferencia'} onChange={handleChange} id="transferencia" />
                      <label className="form-check-label" htmlFor="transferencia">
                        🏦 Transferencia bancaria
                      </label>
                    </div>
                  </div>

                  {formData.metodoPago === 'tarjeta' && (
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label">Número de tarjeta *</label>
                        <input type="text" className="form-control" name="numeroTarjeta" value={formData.numeroTarjeta} onChange={handleChange} placeholder="1234 5678 9012 3456" maxLength="19" required />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Nombre en la tarjeta *</label>
                        <input type="text" className="form-control" name="nombreTarjeta" value={formData.nombreTarjeta} onChange={handleChange} placeholder="JUAN PEREZ" required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Fecha de expiración *</label>
                        <input type="text" className="form-control" name="expiracion" value={formData.expiracion} onChange={handleChange} placeholder="MM/AA" maxLength="5" required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">CVV *</label>
                        <input type="text" className="form-control" name="cvv" value={formData.cvv} onChange={handleChange} placeholder="123" maxLength="4" required />
                      </div>
                    </div>
                  )}

                  {formData.metodoPago === 'transferencia' && (
                    <div className="alert alert-info">
                      <h6>Datos para transferencia:</h6>
                      <p className="mb-1"><strong>Banco:</strong> Banco Estado</p>
                      <p className="mb-1"><strong>Cuenta:</strong> 12345678</p>
                      <p className="mb-0"><strong>RUT:</strong> 12.345.678-9</p>
                    </div>
                  )}

                  <div className="d-grid gap-2 mt-4">
                    <button type="submit" className="btn btn-neon" disabled={processing}>
                      {processing ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Procesando pago...
                        </>
                      ) : (
                        <>Confirmar y pagar ${totalConDescuento.toLocaleString()}</>
                      )}
                    </button>
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setStep(1)} disabled={processing}>
                      ← Volver
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        <div className="col-12 col-lg-4">
          <div className="card gamer-card no-hover sticky-top" style={{top: '90px'}}>
            <div className="card-body p-4">
              <h5 className="card-title mb-4">Resumen del pedido</h5>
              <div className="mb-3">
                {items.map(item => (
                  <div key={item.id} className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                    <div className="flex-grow-1">
                      <small className="text-muted">{item.name}</small>
                      <small className="d-block text-muted">x{item.quantity}</small>
                    </div>
                    <small>${(item.price * item.quantity).toLocaleString()}</small>
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Subtotal</span>
                <span>${total.toLocaleString()}</span>
              </div>
              {esEstudianteDuoc && (
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-success">🎓 Descuento Estudiante Duoc (20%)</span>
                  <span className="text-success">-${descuento.toLocaleString()}</span>
                </div>
              )}
              <div className="d-flex justify-content-between mb-3 pb-3 border-bottom">
                <span className="text-muted">Envío</span>
                <span className="text-success">Gratis</span>
              </div>
              {esEstudianteDuoc && (
                <div className="alert alert-success p-2 mb-3 small">
                  ¡Descuento estudiantil aplicado! 🎉
                </div>
              )}
              <div className="d-flex justify-content-between mb-0">
                <strong>Total</strong>
                <strong className="text-primary fs-4">${totalConDescuento.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
