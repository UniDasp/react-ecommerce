import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../../context/CartContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Navbar() {
  const { items } = useCart()
  const { user, logout } = useAuth()
  const count = items.reduce((sum, it) => sum + it.quantity, 0)
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark app-navbar sticky-top shadow-sm py-2">
      <div className="container">
        <Link className="navbar-brand text-truncate" to="/react-ecommerce/">🎮 LEVEL-UP GAMER</Link>
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

            {user ? (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="userMenu" role="button" data-bs-toggle="dropdown" aria-expanded="false">👤</a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
                  <li><span className="dropdown-item-text">{user.username}</span></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" to="/react-ecommerce/account">Mi cuenta</Link></li>
                  <li><Link className="dropdown-item" to="/react-ecommerce/mis-pagos">Mis pagos</Link></li>
                  {(user && (user.roles?.includes('ROLE_ADMIN') || user.roles?.includes('admin') || user.role === 'admin')) && (
                    <li><Link className="dropdown-item" to="/react-ecommerce/admin">Panel Admin</Link></li>
                  )}
                  <li><button className="dropdown-item" onClick={() => logout()}>Cerrar sesión</button></li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <NavLink className="nav-link text-nowrap" to="/react-ecommerce/login">Iniciar Sesión</NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
