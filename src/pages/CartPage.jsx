import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function CartPage() {
  const navigate = useNavigate()
  const { items, removeItem, clear, total, updateQuantity } = useCart()
  if (items.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="card gamer-card d-inline-block" style={{maxWidth: '500px'}}>
          <div className="card-body p-5">
            <div className="display-1 mb-4">🛒</div>
            <h2 className="mb-3">Tu carrito está vacío</h2>
            <p className="text-muted mb-4">Agrega productos para continuar con tu compra.</p>
<Link href="/react-ecommerce/products" className="btn btn-neon">Explorar productos</Link>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="cart-page">
      <h2 className="section-title mb-4">🛒 Carrito de Compras</h2>
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card gamer-card no-hover">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(it => (
                      <tr key={it.id}>
                        <td><strong>{it.name}</strong></td>
                        <td className="text-muted">${it.price.toLocaleString()}</td>
                        <td>
                          <input type="number" min="1" className="form-control" style={{ width: 90 }} value={it.quantity} onChange={(e)=> updateQuantity(it.id, Number(e.target.value))} />
                        </td>
                        <td><strong>${(it.price * it.quantity).toLocaleString()}</strong></td>
                        <td>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(it.id)}>Quitar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="card gamer-card no-hover">
            <div className="card-body">
              <h5 className="card-title mb-4">Resumen del pedido</h5>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Productos ({items.length})</span>
                <span>${total.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-3 pb-3 border-bottom">
                <span className="text-muted">Envío</span>
                <span className="text-success">Gratis</span>
              </div>
              <div className="d-flex justify-content-between mb-4">
                <strong>Total</strong>
                <strong className="text-primary fs-4">${total.toLocaleString()}</strong>
              </div>
              <button className="btn btn-neon w-100 mb-2" onClick={() => navigate('/checkout')}>Finalizar Compra</button>
              <button className="btn btn-outline-secondary w-100" onClick={clear}>Vaciar carrito</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
