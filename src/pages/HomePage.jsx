import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { listProducts } from '../services/products'
import ProductCard from '../components/products/ProductCard'

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  useEffect(() => {
    listProducts().then(data => setFeatured(data.slice(0, 4)))
  }, [])

  return (
    <div className="home-page">
     
      <section className="hero-banner text-center">
        <div className="hero-overlay">
          <h1 className="hero-title">LEVEL-UP GAMER</h1>
          <p className="hero-subtitle">La mejor selección de productos gaming en Chile</p>
          <p className="hero-description">Consolas, accesorios, computadores y más para llevar tu experiencia al siguiente nivel</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap mt-4">
            <Link to="/react-ecommerce/products" className="btn btn-neon btn-lg">Explorar Catálogo</Link>
            <a href="#categorias" className="btn btn-outline-light btn-lg">Ver Categorías</a>
          </div>
        </div>
      </section>

    
      <section id="categorias" className="mb-5">
        <h2 className="section-title text-center">Categorías</h2>
        <div className="row g-4">
          {[
            {k:'Consolas',t:'Consolas',img:'https://i.imgur.com/Ceu19Yq.jpeg', desc: 'PlayStation, Xbox y Nintendo'},
            {k:'Accesorios',t:'Accesorios',img:'https://i.imgur.com/BdFEBnx.jpeg', desc: 'Controladores y auriculares'},
            {k:'Computadores Gamers',t:'Computadores Gamers',img:'https://i.imgur.com/4Szrfso.png', desc: 'Equipos de alto rendimiento'},
            {k:'Juegos de Mesa',t:'Juegos de Mesa',img:'https://i.imgur.com/VrC741p.jpeg', desc: 'Diversión para toda la familia'}
          ].map(c => (
            <div key={c.k} className="col-12 col-sm-6 col-lg-3 col-xl-3">
              <div className="card category-card h-100 gamer-card">
                <img src={c.img} alt={c.t} className="card-img-top" />
                <div className="card-body d-flex flex-column">
                  <h3 className="h5 mb-2">{c.t}</h3>
                  <p className="text-muted small mb-3">{c.desc}</p>
                  <Link to={`/react-ecommerce/products?category=${encodeURIComponent(c.k)}`} className="btn btn-neon btn-sm mt-auto">Ver productos</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

     
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <h2 className="section-title m-0">Productos Destacados</h2>
          <Link to="/products" className="btn btn-sm btn-outline-neon">Ver todos</Link>
        </div>
        <div className="row g-4">
          {featured.map(p => (
            <div key={p.id} className="col-12 col-sm-6 col-lg-3 col-xl-3">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

     
      <section className="mb-5">
        <h2 className="section-title text-center mb-4">¿Cómo Funciona?</h2>
        <div className="row g-4">
          {[
            {t:'Explora',d:'Descubre productos gamers de alta calidad en nuestro catálogo.', icon: '🔍'},
            {t:'Agrega al Carrito',d:'Selecciona tus favoritos y ajusta las cantidades.', icon: '🛒'},
            {t:'Recibe en Casa',d:'Despacho a todo Chile para que sigas jugando.', icon: '🚚'},
          ].map((s,idx) => (
            <div key={idx} className="col-12 col-md-4">
              <div className="card h-100 text-center gamer-card">
                <div className="card-body p-4">
                  <div className="display-4 mb-3">{s.icon}</div>
                  <h3 className="h5 fw-bold">{s.t}</h3>
                  <p className="mb-0 text-muted">{s.d}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
