import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../../context/CartContext.jsx'

export default function Navbar() {
  const { items } = useCart()
  const count = items.reduce((sum, it) => sum + it.quantity, 0)
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark app-navbar sticky-top shadow-sm py-2">
      <div className="container">
        <Link className="navbar-brand text-truncate" to="/">🎮 LEVEL-UP GAMER</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample" aria-controls="navbarsExample" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarsExample">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item">
              <NavLink className="nav-link text-nowrap" to="/react-ecommerce/">Inicio</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-nowrap" to="/react-ecommerce/products">Productos</NavLink>
            </li>
          </ul>
          <ul className="navbar-nav align-items-lg-center">
            <li className="nav-item">
              <NavLink className="nav-link text-nowrap" to="/react-ecommerce/cart">Carrito ({count})</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
