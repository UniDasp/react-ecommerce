import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext.jsx'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  return (
    <div className="card h-100 hover-shadow">
      <img src={product.image} className="card-img-top" alt={product.name} style={{height: '200px', objectFit: 'cover'}} />
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-0">{product.name}</h5>
          {product.featured && <span className="badge bg-warning">Destacado</span>}
        </div>
        <p className="card-text text-muted small mb-2">{product.category}</p>
        <p className="card-text fw-bold fs-5 text-primary mt-auto mb-3">${product.price.toLocaleString('es-CL')}</p>
        <div className="d-flex gap-2">
          <Link className="btn btn-neon btn-sm flex-fill" to={`/react-ecommerce/products/${product.id}`}>Ver detalle</Link>
          <button className="btn btn-outline-neon btn-sm" onClick={() => addItem(product, 1)} title="Agregar al carrito">
            🛒
          </button>
        </div>
      </div>
    </div>
  )
}
