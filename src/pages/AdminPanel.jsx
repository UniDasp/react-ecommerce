import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import Unauthorized from '../components/Unauthorized.jsx'
import { listProducts } from '../services/products.js'
import { createProduct, updateProduct, deleteProduct } from '../services/adminProducts.js'
import { listCategories } from '../services/categories.js'
import { createCategory } from '../services/categories.js'
import { listUsers, updateUserRoles, updateUser } from '../services/adminUsers.js'
import { listAudit } from '../services/adminAudit.js'
import { listAllPayments, adminConfirmPayment } from '../services/adminPayments.js'

export default function AdminPanel() {
  const { user, token, handleUnauthorized } = useAuth()
  const [fetchError, setFetchError] = useState(null)
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersSaving, setUsersSaving] = useState(false)
  const [editingUserId, setEditingUserId] = useState(null)
  const [userEditDraft, setUserEditDraft] = useState(null)

  const [editingProductId, setEditingProductId] = useState(null)
  const [editDraft, setEditDraft] = useState(null)
  const [newProduct, setNewProduct] = useState({ name: '', price: '', categoryId: '', image: '', description: '', stock: 0, featured: false })
  const [newCategory, setNewCategory] = useState({ name: '', code: '', description: '' })

  const [tab, setTab] = useState('products')
  const [payments, setPayments] = useState([])
  const [paymentsLoading, setPaymentsLoading] = useState(false)
  const [auditLoading, setAuditLoading] = useState(false)
  const [auditResponse, setAuditResponse] = useState(null) // full paged response
  const [auditParams, setAuditParams] = useState({ username: '', path: '', success: '', from: '', to: '', sort: '', page: 0, size: 50 })

  const isAdmin = user && (user.roles?.includes('ROLE_ADMIN') || user.roles?.includes('admin') || user.role === 'admin')
  if (!user || !isAdmin) {
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
    ;(async () => {
      setSaving(true)
      try {
        const body = {
          name: newProduct.name || 'Sin nombre',
          price: Number(newProduct.price) || 0,
          categoryId: newProduct.categoryId ? Number(newProduct.categoryId) : null,
          image: newProduct.image || '',
          description: newProduct.description || '',
          stock: Number(newProduct.stock) || 0,
          featured: Boolean(newProduct.featured)
        }
        const created = await createProduct(token || null, body)
        setProducts(prev => [created, ...prev])
        setNewProduct({ name: '', price: '', categoryId: '', image: '', description: '', stock: 0, featured: false })
      } catch (err) {
        console.error('Crear producto falló', err)
        try {
          if (handleUnauthorized && handleUnauthorized(err)) return
        } catch (e) {}
        setFetchError(err)
        alert('No se pudo crear el producto')
      } finally {
        setSaving(false)
      }
    })()
  }
  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      try {
        const [items, cats] = await Promise.all([listProducts(), listCategories()])
        if (!mounted) return
        setProducts(items || [])
        setCategories(cats || [])
      } catch (err) {
        console.error('No se pudieron cargar productos/categorías', err)
        try { if (handleUnauthorized && handleUnauthorized(err)) return } catch (e) {}
        if (mounted) {
          setProducts([])
          setCategories([])
        }
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    ;(async () => {
      setUsersLoading(true)
      try {
        if (!token) {
          if (mounted) setUsers([])
          return
        }
        const u = await listUsers(token)
        console.debug('AdminPanel: fetched users ->', u)
        if (!mounted) return
        setUsers(Array.isArray(u) ? u : (u?.users || []))
      } catch (err) {
        console.error('No se pudieron cargar usuarios', err)
        try { if (handleUnauthorized && handleUnauthorized(err)) return } catch (e) {}
        if (mounted) setUsers([])
      } finally {
        if (mounted) setUsersLoading(false)
      }
    })()

    return () => { mounted = false }
  }, [token])


  const changeUserRole = (id, newRole) => {
    if (user.id === id) return
    ;(async () => {
      setUsersSaving(true)
      try {
        const rolesArr = (newRole === 'admin') ? ['ROLE_ADMIN'] : ['ROLE_USER']
        const res = await updateUserRoles(token || null, id, rolesArr)
        setUsers(prev => prev.map(u => u.id === id ? ({ ...u, roles: rolesArr, role: newRole, ...((res && typeof res === 'object') ? res : {}) }) : u))
      } catch (err) {
        console.error('Error updating user role', err)
        try { if (handleUnauthorized && handleUnauthorized(err)) return } catch (e) {}
        setFetchError(err)
        alert('No se pudo cambiar el rol del usuario')
      } finally {
        setUsersSaving(false)
      }
    })()
  }
  const startEdit = (id) => {
    const p = products.find(x => x.id === id)
    if (!p) return
    setEditingProductId(id)
    setEditDraft({
      name: p.name || '',
      description: p.description || '',
      price: p.price ?? 0,
      categoryId: p.categoryId ?? p.category ?? '',
      stock: p.stock ?? 0,
      featured: !!p.featured,
      image: p.image || '',
      code: p.code || '',
      active: typeof p.active === 'boolean' ? p.active : true
    })
  }

  const saveEdit = async (id) => {
    if (!editDraft) return
    setSaving(true)
    try {
      const body = {
        name: editDraft.name,
        description: editDraft.description,
        price: (() => { const v = Number(editDraft.price); return Number.isFinite(v) ? v : 0 })(),
        categoryId: editDraft.categoryId ? Number(editDraft.categoryId) : null,
        stock: (() => { const s = Number(editDraft.stock); return Number.isFinite(s) ? s : 0 })(),
        featured: Boolean(editDraft.featured),
        image: editDraft.image || '',
        code: editDraft.code || undefined,
        active: typeof editDraft.active === 'boolean' ? editDraft.active : true
      }
      const updated = await updateProduct(token || null, id, body)
      setProducts(prev => prev.map(p => p.id === id ? ({ ...p, ...(updated || body) }) : p))
      setEditingProductId(null)
      setEditDraft(null)
    } catch (err) {
      console.error('Error saving product', err)
      try { if (handleUnauthorized && handleUnauthorized(err)) return } catch (e) {}
      setFetchError(err)
      alert('No se pudo guardar el producto')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!confirm('¿Eliminar producto? Esta acción no se puede deshacer.')) return
    setSaving(true)
    try {
      await deleteProduct(token || null, id)
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error('Error deleting producto', err)
      try { if (handleUnauthorized && handleUnauthorized(err)) return } catch (e) {}
      setFetchError(err)
      alert('No se pudo eliminar el producto')
    } finally {
      setSaving(false)
    }
  }
  const getDisplayUsername = (u) => {
    return u?.username || u?.user || u?.userName || u?.name || ((u?.firstName || u?.lastName) ? `${u.firstName || ''} ${u.lastName || ''}`.trim() : '') || ''
  }
  const getDisplayEmail = (u) => {
    return u?.email || u?.mail || ''
  }
  const getDisplayRole = (u) => {
    if (!u) return ''
    if (u.role) return u.role
    if (Array.isArray(u.roles) && u.roles.length > 0) {
      if (u.roles.includes('ROLE_ADMIN') || u.roles.includes('ADMIN')) return 'admin'
      return (u.roles[0] || '')
    }
    return ''
  }

  const startEditUser = (u) => {
    const isTargetAdmin = (u.role === 'admin') || (Array.isArray(u.roles) && (u.roles.includes('ROLE_ADMIN') || u.roles.includes('ADMIN')))
    if (isTargetAdmin) {
      alert('No se pueden editar usuarios con rol de administrador desde aquí.')
      return
    }
    setEditingUserId(u.id)
    setUserEditDraft({
      username: u.username || '',
      email: u.email || '',
      firstName: u.firstName || '',
      lastName: u.lastName || '',
      fullName: u.fullName || `${u.firstName || ''} ${u.lastName || ''}`.trim(),
      phone: u.phone || '',
      address: u.address || '',
      region: u.region || '',
      city: u.city || '',
      role: getDisplayRole(u) === 'admin' ? 'admin' : 'user'
    })
  }

  const cancelEditUser = () => {
    setEditingUserId(null)
    setUserEditDraft(null)
  }

  const saveUserEdit = async (id) => {
    if (!userEditDraft) return
    setUsersSaving(true)
    try {
      const target = users.find(u => u.id === id)
      const isTargetAdmin = (target?.role === 'admin') || (Array.isArray(target?.roles) && (target.roles.includes('ROLE_ADMIN') || target.roles.includes('ADMIN')))
      if (isTargetAdmin) {
        alert('No se pueden editar usuarios administradores desde aquí.')
        setUsersSaving(false)
        return
      }
      const payload = Object.fromEntries(Object.entries(userEditDraft).filter(([k, v]) => v !== undefined))
      if (payload.role !== undefined) {
        if (id === user.id) {
          alert('No puedes cambiar tu propio rol.')
          setUsersSaving(false)
          return
        }
        payload.roles = payload.role === 'admin' ? ['ROLE_ADMIN'] : ['ROLE_USER']
        delete payload.role
      }
      const res = await updateUser(token || null, id, payload)
      setUsers(prev => prev.map(u => u.id === id ? ({ ...u, ...(res || payload) }) : u))
      cancelEditUser()
    } catch (err) {
      console.error('Error saving user', err)
      alert('No se pudo guardar el usuario')
    } finally {
      setUsersSaving(false)
    }
  }

  return (
    <div className="admin-panel">
      {fetchError && <Unauthorized error={fetchError} />}
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
            <div className="h1 mb-0">{users.filter(u => (u.role === 'admin') || (Array.isArray(u.roles) && (u.roles.includes('ROLE_ADMIN') || u.roles.includes('ADMIN')))).length}</div>
            <div className="text-muted small">Administradores</div>
          </div>
        </div>
      </div>

      <div className="admin-tabs d-flex gap-2 mb-3">
        <button className={`btn ${tab === 'products' ? 'btn-neon' : 'btn-outline-secondary'}`} onClick={() => setTab('products')}>Productos</button>
        <button className={`btn ${tab === 'users' ? 'btn-neon' : 'btn-outline-secondary'}`} onClick={() => setTab('users')}>Usuarios</button>
            <button className={`btn ${tab === 'orders' ? 'btn-neon' : 'btn-outline-secondary'}`} onClick={async () => { setTab('orders'); if (!paymentsLoading) {
            setPaymentsLoading(true)
            try {
              const list = await listAllPayments(token)
              setPayments(Array.isArray(list) ? list : (list || []))
            } catch (err) {
              console.error('Error loading payments', err)
              try { if (handleUnauthorized && handleUnauthorized(err)) return } catch (e) {}
              setFetchError(err)
              setPayments([])
            } finally {
              setPaymentsLoading(false)
            }
          } }}>Pedidos</button>
        <button className={`btn ${tab === 'audit' ? 'btn-neon' : 'btn-outline-secondary'}`} onClick={() => setTab('audit')}>Auditoría</button>
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
                <select className="form-select" value={newProduct.categoryId} onChange={e => setNewProduct({ ...newProduct, categoryId: e.target.value })}>
                  <option value="">Selecciona categoría</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-6">
                <input className="form-control" placeholder="Imagen (url)" value={newProduct.image} onChange={e => setNewProduct({ ...newProduct, image: e.target.value })} />
              </div>
              <div className="col-3">
                <input className="form-control" placeholder="Stock" type="number" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
              </div>
              <div className="col-3 d-flex align-items-center">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="featuredToggle" checked={newProduct.featured} onChange={e => setNewProduct({ ...newProduct, featured: e.target.checked })} />
                  <label className="form-check-label small" htmlFor="featuredToggle">Destacado</label>
                </div>
              </div>
              <div className="col-12">
                <textarea className="form-control" placeholder="Descripción" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
              </div>
              <div className="col-12 d-grid mt-2">
                <button className="btn btn-neon">Añadir producto</button>
              </div>
            </form>

            <div className="border-top pt-3">
              <h6 className="mb-3">Categorías</h6>
              <form className="row g-2 align-items-center" onSubmit={async (e) => {
                e.preventDefault()
                setSaving(true)
                try {
                  const body = {
                    name: newCategory.name || 'Sin nombre',
                    code: newCategory.code || undefined,
                    description: newCategory.description || ''
                  }
                  const created = await createCategory(token || null, body)
                  setCategories(prev => [created, ...prev])
                  setNewCategory({ name: '', code: '', description: '' })
                } catch (err) {
                  console.error('Crear categoría falló', err)
                  alert('No se pudo crear la categoría')
                } finally {
                  setSaving(false)
                }
              }}>
                <div className="col-4">
                  <input className="form-control" placeholder="Nombre" value={newCategory.name} onChange={e => setNewCategory(n => ({ ...n, name: e.target.value }))} />
                </div>
                <div className="col-2">
                  <input className="form-control" placeholder="Código" value={newCategory.code} onChange={e => setNewCategory(n => ({ ...n, code: e.target.value }))} />
                </div>
                <div className="col-4">
                  <input className="form-control" placeholder="Descripción" value={newCategory.description} onChange={e => setNewCategory(n => ({ ...n, description: e.target.value }))} />
                </div>
                <div className="col-2 d-grid">
                  <button className="btn btn-outline-secondary" disabled={saving}>Crear categoría</button>
                </div>
              </form>

              <div className="mt-3">
                <small className="text-muted">Categorías existentes:</small>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {categories.length === 0 ? <div className="text-muted">—</div> : categories.map(c => (
                    <span key={c.id || c.code} className="badge bg-light text-dark">{c.name} {c.code ? `(${c.code})` : ''}</span>
                  ))}
                </div>
              </div>
            </div>

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
                          <input className="form-control form-control-sm" value={editDraft?.name || ''} onChange={e => setEditDraft(d => ({ ...d, name: e.target.value }))} />
                        ) : (
                          <div className="d-flex align-items-center gap-2">
                            <strong>{p.name}</strong>
                            {p.featured && <span className="badge bg-warning">Destacado</span>}
                          </div>
                        )}
                      </td>
                      <td className="text-muted small">
                        {editingProductId === p.id ? (
                          <input className="form-control form-control-sm" value={editDraft?.description || ''} onChange={e => setEditDraft(d => ({ ...d, description: e.target.value }))} />
                        ) : (
                          (p.description ? (p.description.length > 80 ? p.description.slice(0, 80) + '…' : p.description) : <span className="text-muted">—</span>)
                        )}
                      </td>
                      <td style={{width:120}}>
                        {editingProductId === p.id ? (
                          <input className="form-control form-control-sm" type="number" value={editDraft?.price || 0} onChange={e => setEditDraft(d => ({ ...d, price: Number(e.target.value) }))} />
                        ) : (
                          `${Number(p.price).toLocaleString()} CLP`
                        )}
                      </td>
                      <td style={{minWidth:160}}>
                        {editingProductId === p.id ? (
                          <div className="d-flex flex-column">
                            <select className="form-select form-select-sm mb-2" value={editDraft?.categoryId || ''} onChange={e => setEditDraft(d => ({ ...d, categoryId: Number(e.target.value) }))}>
                              <option value="">--</option>
                              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <div className="d-flex gap-2 align-items-center">
                              <div style={{width: '60%'}}>
                                <input className="form-control form-control-sm" type="number" value={editDraft?.stock ?? 0} onChange={e => setEditDraft(d => ({ ...d, stock: Number(e.target.value) }))} placeholder="Stock" />
                              </div>
                              <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" id={`featured-${p.id}`} checked={!!editDraft?.featured} onChange={e => setEditDraft(d => ({ ...d, featured: e.target.checked }))} />
                                <label className="form-check-label small ms-2" htmlFor={`featured-${p.id}`}>Destacado</label>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="d-flex flex-column">
                            <span className="badge bg-light text-dark">{p.category || (categories.find(c => c.id === p.categoryId)?.name) || '—'}</span>
                            <small className="text-muted mt-1">Stock: {p.stock ?? '—'}</small>
                          </div>
                        )}
                      </td>
                      <td className="text-end">
                        <div className="btn-group">
                          {editingProductId === p.id ? (
                            <>
                              <button className="btn btn-sm btn-success" onClick={() => saveEdit(p.id)}>Guardar</button>
                              <button className="btn btn-sm btn-outline-secondary" onClick={() => { setEditingProductId(null); setEditDraft(null); }}>Cancelar</button>
                            </>
                          ) : (
                            <>
                              <button className="btn btn-sm btn-outline-secondary" onClick={() => startEdit(p.id)}>Editar</button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteProduct(p.id)}>Borrar</button>
                            </>
                          )}
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
                  {usersLoading ? (
                    <tr>
                      <td colSpan={4} className="text-center">Cargando usuarios…</td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center">No hay usuarios registrados</td>
                    </tr>
                  ) : (
                    users.map(u => {
                      const isAdminUser = (u.role === 'admin') || (Array.isArray(u.roles) && (u.roles.includes('ROLE_ADMIN') || u.roles.includes('ADMIN')))
                      if (editingUserId === u.id) {
                        return (
                          <tr key={u.id}>
                            <td colSpan={4}>
                              <div className="row g-2">
                                <div className="col-12 col-md-4">
                                  <input className="form-control form-control-sm" placeholder="Usuario" value={userEditDraft?.username || ''} onChange={e => setUserEditDraft(d => ({ ...d, username: e.target.value })) } disabled= {true} />
                                </div>
                                <div className="col-12 col-md-4">
                                  <input className="form-control form-control-sm" placeholder="Email" value={userEditDraft?.email || ''} onChange={e => setUserEditDraft(d => ({ ...d, email: e.target.value }))} disabled={true} />
                                </div>
                                <div className="col-6 col-md-2">
                                  <input className="form-control form-control-sm" placeholder="Nombre" value={userEditDraft?.firstName || ''} onChange={e => setUserEditDraft(d => ({ ...d, firstName: e.target.value }))} />
                                </div>
                                <div className="col-6 col-md-2">
                                  <input className="form-control form-control-sm" placeholder="Apellido" value={userEditDraft?.lastName || ''} onChange={e => setUserEditDraft(d => ({ ...d, lastName: e.target.value }))} />
                                </div>
                                <div className="col-6 col-md-3">
                                  <input className="form-control form-control-sm" placeholder="Teléfono" value={userEditDraft?.phone || ''} onChange={e => setUserEditDraft(d => ({ ...d, phone: e.target.value }))} />
                                </div>
                                <div className="col-6 col-md-3">
                                  <input className="form-control form-control-sm" placeholder="Dirección" value={userEditDraft?.address || ''} onChange={e => setUserEditDraft(d => ({ ...d, address: e.target.value }))} />
                                </div>
                                <div className="col-6 col-md-3">
                                  <input className="form-control form-control-sm" placeholder="Región" value={userEditDraft?.region || ''} onChange={e => setUserEditDraft(d => ({ ...d, region: e.target.value }))} />
                                </div>
                                <div className="col-6 col-md-3">
                                  <input className="form-control form-control-sm" placeholder="Ciudad" value={userEditDraft?.city || ''} onChange={e => setUserEditDraft(d => ({ ...d, city: e.target.value }))} />
                                </div>
                                <div className="col-6 col-md-3">
                                  <select className="form-select form-select-sm" value={userEditDraft?.role || 'user'} onChange={e => setUserEditDraft(d => ({ ...d, role: e.target.value }))}>
                                    <option value="user">user</option>
                                    <option value="admin">admin</option>
                                  </select>
                                </div>
                                <div className="col-12 text-end mt-2">
                                  <div className="btn-group">
                                    <button className="btn btn-sm btn-success" onClick={() => saveUserEdit(u.id)} disabled={usersSaving}>Guardar</button>
                                    <button className="btn btn-sm btn-outline-secondary" onClick={cancelEditUser}>Cancelar</button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )
                      }

                      return (
                        <tr key={u.id}>
                          <td style={{minWidth: 180}}>
                            <div>
                              <strong>{getDisplayUsername(u)}</strong>
                              <div className="text-muted small">ID: {u.id}</div>
                            </div>
                          </td>
                          <td>
                            <div>{getDisplayEmail(u) || <span className="text-muted">—</span>}</div>
                          </td>
                          <td style={{width: 180}}>
                            <div className="d-flex align-items-center gap-2">
                              <span className="badge bg-light text-dark">{getDisplayRole(u) || 'user'}</span>
                            </div>
                          </td>
                          <td className="text-end">
                            <div className="btn-group">
                              {!isAdminUser && <button className="btn btn-sm btn-outline-secondary" onClick={() => startEditUser(u)}>Editar</button>}
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {tab === 'orders' && (
        <div className="card gamer-card mb-4">
          <div className="card-body">
            <h5>Pedidos</h5>
            <div className="mb-3">
              <button className="btn btn-sm btn-neon" onClick={async () => {
                setPaymentsLoading(true)
                try {
                  const list = await listAllPayments(token)
                  setPayments(Array.isArray(list) ? list : (list || []))
                } catch (err) {
                  console.error('Error reloading payments', err)
                  alert('No se pudieron cargar pedidos')
                } finally {
                  setPaymentsLoading(false)
                }
              }}>Recargar</button>
            </div>

            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Monto</th>
                    <th>Estado</th>
                    <th>Creado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {paymentsLoading ? (
                    <tr><td colSpan={6} className="text-center">Cargando…</td></tr>
                  ) : !payments || payments.length === 0 ? (
                    <tr><td colSpan={6} className="text-center">No hay pedidos</td></tr>
                  ) : (
                    payments.map(p => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.userName || p.userEmail || p.user}</td>
                        <td>{p.totalAmount}</td>
                        <td>{p.status}</td>
                        <td>{p.createdAt}</td>
                        <td className="text-end">
                          {p.status === 'PENDING' ? (
                            <div className="btn-group">
                              <button className="btn btn-sm btn-success" onClick={async () => {
                                if (!confirm('Confirmar pedido manualmente?')) return
                                try {
                                  const res = await adminConfirmPayment(token, p.id)
                                  alert(res?.mensaje || 'Pedido confirmado')
                                  const list = await listAllPayments(token)
                                  setPayments(Array.isArray(list) ? list : (list || []))
                                } catch (err) {
                                  console.error('Error confirming payment', err)
                                  try { if (handleUnauthorized && handleUnauthorized(err)) return } catch (e) {}
                                  setFetchError(err)
                                  alert(err?.body?.error || err?.message || 'No se pudo confirmar')
                                }
                              }}>Confirmar</button>
                            </div>
                          ) : (
                            <small className="text-muted">—</small>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {tab === 'audit' && (
        <div className="card gamer-card mb-4">
          <div className="card-body">
            <h5>Registros de Auditoría</h5>
            <div className="row g-2 align-items-end mb-3">
              <div className="col-12 col-md-2">
                <label className="form-label small">Usuario</label>
                <input className="form-control form-control-sm" value={auditParams.username} onChange={e => setAuditParams(p => ({ ...p, username: e.target.value }))} />
              </div>
              <div className="col-12 col-md-2">
                <label className="form-label small">Ruta (parcial)</label>
                <input className="form-control form-control-sm" value={auditParams.path} onChange={e => setAuditParams(p => ({ ...p, path: e.target.value }))} />
              </div>
              <div className="col-12 col-md-2">
                <label className="form-label small">Éxito</label>
                <select className="form-select form-select-sm" value={auditParams.success} onChange={e => setAuditParams(p => ({ ...p, success: e.target.value }))}>
                  <option value="">Cualquiera</option>
                  <option value="true">Éxito</option>
                  <option value="false">Error</option>
                </select>
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label small">Desde (ISO)</label>
                <input className="form-control form-control-sm" placeholder="2025-11-01T00:00:00" value={auditParams.from} onChange={e => setAuditParams(p => ({ ...p, from: e.target.value }))} />
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label small">Hasta (ISO)</label>
                <input className="form-control form-control-sm" placeholder="2025-11-14T00:00:00" value={auditParams.to} onChange={e => setAuditParams(p => ({ ...p, to: e.target.value }))} />
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label small">Orden</label>
                <input className="form-control form-control-sm" placeholder="username,asc" value={auditParams.sort} onChange={e => setAuditParams(p => ({ ...p, sort: e.target.value }))} />
              </div>
              <div className="col-12 col-md-2">
                <label className="form-label small">Tamaño</label>
                <input className="form-control form-control-sm" type="number" value={auditParams.size} onChange={e => setAuditParams(p => ({ ...p, size: Number(e.target.value) }))} />
              </div>
              <div className="col-12 col-md-12 text-end mt-2">
                <button className="btn btn-sm btn-neon" onClick={async () => {
                  setAuditLoading(true)
                  try {
                    const params = Object.fromEntries(Object.entries(auditParams).filter(([k, v]) => v !== '' && v !== undefined && v !== null))
                    const res = await listAudit(token || null, params)
                    console.debug('AdminPanel: audit res ->', res)
                    setAuditResponse(res)
                  } catch (err) {
                    console.error('Error loading audit', err)
                    alert('No se pudo cargar audit logs')
                    setAuditResponse(null)
                  } finally {
                    setAuditLoading(false)
                  }
                }}>Buscar</button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Roles</th>
                    <th>Método</th>
                    <th>Ruta</th>
                    <th>Acción</th>
                    <th>Éxito</th>
                    <th>Fecha/Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLoading ? (
                    <tr><td colSpan={8} className="text-center">Cargando…</td></tr>
                  ) : !auditResponse || !Array.isArray(auditResponse.content) || auditResponse.content.length === 0 ? (
                    <tr><td colSpan={8} className="text-center">No hay eventos</td></tr>
                  ) : (
                    auditResponse.content.map(ev => (
                      <tr key={ev.id}>
                        <td>{ev.id}</td>
                        <td>{ev.username}</td>
                        <td>{ev.roles}</td>
                        <td>{ev.httpMethod}</td>
                        <td>{ev.path}</td>
                        <td style={{maxWidth: 240}} className="text-truncate">{ev.action}</td>
                        <td>{String(ev.success)}</td>
                        <td>{ev.timestamp}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {auditResponse && (
              <div className="d-flex justify-content-between mt-2 small text-muted">
                <div>Mostrando {auditResponse.numberOfElements} de {auditResponse.totalElements} resultados</div>
                <div>Página {auditResponse.number + 1} / {auditResponse.totalPages}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
