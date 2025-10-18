import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { listProducts } from "../services/products.js";
import ProductCard from "../components/products/ProductCard.jsx";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    listProducts()
      .then((data) => {
        if (active) {
          setAllProducts(data);
          setProducts(data);
        }
      })
      .catch((err) => {
        if (active) setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let filtered = [...allProducts];

    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "all") {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setProducts(filtered);
  }, [search, category, sortBy, allProducts]);

  const categories = ["all", ...new Set(allProducts.map((p) => p.category))];

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  if (error)
    return <div className="alert alert-danger">Error: {String(error)}</div>;

  return (
    <div>
      <h2 className="mb-4 section-title">🎮 Catálogo de Productos</h2>

      <div className="card mb-4 gamer-card no-hover">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-md-5">
              <input
                type="search"
                className="form-control"
                placeholder="🔍 Buscar productos gaming..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-6 col-md-3">
              <select
                className="form-select"
                value={category}
                onChange={(e) => {
                  const newCategory = e.target.value;
                  setCategory(newCategory);
                  if (newCategory === "all") {
                    setSearchParams({});
                  } else {
                    setSearchParams({ category: newCategory });
                  }
                }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "Todas las categorías" : cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-6 col-md-4">
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Ordenar por nombre</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3 text-muted">
        <small>
          {products.length} producto{products.length !== 1 ? "s" : ""}{" "}
          encontrado{products.length !== 1 ? "s" : ""}
        </small>
      </div>

      {products.length === 0 ? (
        <div className="alert alert-info">
          No se encontraron productos con los filtros seleccionados.
        </div>
      ) : (
        <div className="row g-4">
          {products.map((p) => (
            <div key={p.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
