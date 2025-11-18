import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext.jsx'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const stock = product.stock ?? null

  const handleAdd = () => {
    const res = addItem(product, 1)
    if (!res || !res.ok) {
      if (res?.reason === 'out_of_stock') {
        alert('Producto sin stock')
      } else if (res?.reason === 'limit_reached') {
        alert('No puedes agregar más unidades, llegaste al stock disponible')
      } else {
        alert('No se pudo agregar el producto')
      }
    }
  }

  // stock badges
  const stockBadge = () => {
    if (stock === null || stock === undefined) return null
    if (stock <= 0) return <div className="text-danger small mb-2">Agotado</div>
    if (stock === 1) return <div className="text-warning small mb-2">¡Queda el último!</div>
    if (stock <= 5) return <div className="text-warning small mb-2">¡Solo quedan {stock}!</div>
    return null
  }

  return (
    <div className="card h-100 hover-shadow">
      <img src={product.image} className="card-img-top" alt={product.name} style={{height: '200px', objectFit: 'cover'}} />
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-0">{product.name}</h5>
          {product.featured && <span className="badge bg-warning">Destacado</span>}
        </div>
        <p className="card-text text-muted small mb-2">{product.category}</p>
        {stockBadge()}
        <p className="card-text fw-bold fs-5 text-primary mt-auto mb-3">${product.price.toLocaleString('es-CL')}</p>
        <div className="d-flex gap-2">
          <Link className="btn btn-neon btn-sm flex-fill" to={`/react-ecommerce/products/${product.id}`}>Ver detalle</Link>
          <button className="btn btn-outline-neon btn-sm" onClick={handleAdd} title="Agregar al carrito" disabled={stock !== null && stock <= 0}>
            🛒
          </button>
        </div>
      </div>
    </div>
  )
}
