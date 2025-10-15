import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="text-center">
      <h1>404</h1>
      <p>Página no encontrada</p>
      <Link to="/" className="btn btn-primary">Ir al inicio</Link>
    </div>
  )
}
