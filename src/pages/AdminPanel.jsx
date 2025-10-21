import { useState } from 'react'
import productsData from '../data/products.json'
import usersData from '../data/users.json'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminPanel() {
  const { user } = useAuth()
  const [products, setProducts] = useState(productsData.products || [])
  const [users, setUsers] = useState(usersData || [])

  const [editingProductId, setEditingProductId] = useState(null)
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', image: '', description: '' })

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-5">
        <div className="card gamer-card d-inline-block" style={{maxWidth: 540}}>
          <div className="card-body p-4">
            <h3 className="mb-3">Acceso denegado</h3>
            <p className="text-muted">Necesitas permisos de administrador para ver este panel.</p>
          </div>
        </div>
      </div>
    )
  }
  const handleAddProduct = (e) => {
    e.preventDefault()
    const id = `TMP${Date.now()}`
    const price = Number(newProduct.price) || 0
    const prod = { id, code: id, name: newProduct.name || 'Sin nombre', price, category: newProduct.category || 'Varios', image: newProduct.image || '', description: newProduct.description || '' }
    setProducts([prod, ...products])
    setNewProduct({ name: '', price: '', category: '', image: '', description: '' })
  }

  const handleDeleteProduct = (id) => setProducts(products.filter(p => p.id !== id))
  const startEdit = (id) => setEditingProductId(id)
  const [tab, setTab] = useState('products')
  const cancelEdit = () => setEditingProductId(null)

  const saveEdit = (id, updated) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updated } : p))
    setEditingProductId(null)
  }


  const changeUserRole = (id, newRole) => {
    // Para evitar que un admin cambie su propio rol
    if (user.id === id) return
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u))
  }

  return (
    <div className="admin-panel">
      <h2 className="section-title">Panel de Administración</h2>

      <div className="row mb-4">
        <div className="col-12 col-md-4">
          <div className="card p-3 text-center admin-summary">
            <div className="h1 mb-0">{products.length}</div>
            <div className="text-muted small">Productos</div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card p-3 text-center admin-summary">
            <div className="h1 mb-0">{users.length}</div>
            <div className="text-muted small">Usuarios</div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card p-3 text-center admin-summary">
            <div className="h1 mb-0">{users.filter(u => u.role === 'admin').length}</div>
            <div className="text-muted small">Administradores</div>
          </div>
        </div>
      </div>

      <div className="admin-tabs d-flex gap-2 mb-3">
        <button className={`btn ${tab === 'products' ? 'btn-neon' : 'btn-outline-secondary'}`} onClick={() => setTab('products')}>Productos</button>
        <button className={`btn ${tab === 'users' ? 'btn-neon' : 'btn-outline-secondary'}`} onClick={() => setTab('users')}>Usuarios</button>
      </div>

      {tab === 'products' && (
        <div className="card gamer-card mb-4">
          <div className="card-body">
            <h5 className="mb-3">Productos</h5>
            <form className="row g-2 mb-3" onSubmit={handleAddProduct}>
              <div className="col-6">
                <input className="form-control" placeholder="Nombre" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
              </div>
              <div className="col-3">
                <input className="form-control" placeholder="Precio" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
              </div>
              <div className="col-3">
                <input className="form-control" placeholder="Categoría" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} />
              </div>
              <div className="col-12">
                <input className="form-control" placeholder="Imagen (url)" value={newProduct.image} onChange={e => setNewProduct({ ...newProduct, image: e.target.value })} />
              </div>
              <div className="col-12">
                <textarea className="form-control" placeholder="Descripción" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
              </div>
              <div className="col-12 d-grid mt-2">
                <button className="btn btn-neon">Añadir producto</button>
              </div>
            </form>

            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th></th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Categoría</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td style={{width: 72}}>
                        {p.image ? <img src={p.image} alt={p.name} className="product-thumb" /> : <div className="product-thumb placeholder" />}
                      </td>
                      <td style={{minWidth: 180}}>
                        {editingProductId === p.id ? (
                          <input className="form-control form-control-sm" defaultValue={p.name} onBlur={e => saveEdit(p.id, { name: e.target.value })} />
                        ) : <strong>{p.name}</strong>}
                      </td>
                      <td className="text-muted small">
                        {p.description ? (p.description.length > 80 ? p.description.slice(0, 80) + '…' : p.description) : <span className="text-muted">—</span>}
                      </td>
                      <td>{Number(p.price).toLocaleString()} CLP</td>
                      <td><span className="badge bg-light text-dark">{p.category}</span></td>
                      <td className="text-end">
                        <div className="btn-group">
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => startEdit(p.id)}>Editar</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => { if (confirm('¿Borrar producto?')) handleDeleteProduct(p.id) }}>Borrar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}


      
      {tab === 'users' && (
        //Por ahora no se pueden editar usuarios, pero bueno
        <div className="card gamer-card mb-4">
          <div className="card-body">
            <h5>Usuarios</h5>
            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td>
                        {user.id === u.id ? (
                          <span className="badge bg-primary">{u.role} (tu usuario)</span>
                        ) : u.role === 'admin' ? (
                          <span className="badge bg-secondary">admin</span>
                        ) : (
                          <select className="form-select form-select-sm" value={u.role} onChange={e => changeUserRole(u.id, e.target.value)}>
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                          </select>
                        )}
                      </td>
                      <td className="text-end">
                        {u.role === 'admin' && user.id !== u.id ? (
                          <button className="btn btn-sm btn-outline-secondary" disabled title="No puedes editar a otro admin">Editar</button>
                        ) : (
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => alert('Editar usuario (demo)')}>Editar</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
