import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProductById } from '../services/products.js'
import { useCart } from '../context/CartContext.jsx'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addItem } = useCart()

  useEffect(() => {
    let active = true
    getProductById(id)
      .then(p => { if (active) setProduct(p) })
      .catch(err => { if (active) setError(err) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Cargando...</span></div></div>
  if (error) return <div className="alert alert-danger">Error: {String(error)}</div>
  if (!product) return <div className="alert alert-warning">Producto no encontrado</div>

  return (
    <div className="product-detail">
      <div className="row g-5">
        <div className="col-12 col-lg-6">
          <div className="card gamer-card">
            <img src={product.image} alt={product.name} className="card-img-top" style={{height: '500px', objectFit: 'cover'}} />
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="card gamer-card h-100">
            <div className="card-body p-4">
              {product.featured && (
                <span className="badge bg-warning mb-3">⭐ Destacado</span>
              )}
              <h1 className="h2 mb-3">{product.name}</h1>
              <p className="text-muted mb-4">
                <span className="badge bg-light text-dark">{product.category}</span>
              </p>
              <p className="lead mb-4">{product.description}</p>
              <div className="mb-4 pb-4 border-bottom">
                <div className="d-flex align-items-baseline gap-2">
                  <span className="text-muted">Precio:</span>
                  <span className="h3 text-primary mb-0">${product.price.toLocaleString()}</span>
                  <span className="text-muted">CLP</span>
                </div>
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-neon btn-lg" onClick={() => addItem(product, 1)}>
                  🛒 Agregar al carrito
                </button>
                <a href="/products" className="btn btn-outline-secondary">
                  ← Volver al catálogo
                </a>
              </div>
              <div className="mt-4 pt-4 border-top">
                <p className="text-muted mb-2"><strong>✓</strong> Envío gratis a todo Chile</p>
                <p className="text-muted mb-2"><strong>✓</strong> Garantía del fabricante</p>
                <p className="text-muted mb-0"><strong>✓</strong> Pago seguro</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
