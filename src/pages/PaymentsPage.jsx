import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import * as paymentsService from '../services/payments.js'

export default function PaymentsPage() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [payments, setPayments] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      try {
        if (token) {
          try {
            const res = await paymentsService.getMyPayments(token)
            if (!mounted) return
            setPayments(Array.isArray(res) ? res : (res?.payments || []))
            return
          } catch (err) {
            console.warn('Fetching payments from backend failed, falling back to localStorage', err)
          }
        }
        try {
          const raw = localStorage.getItem('levelup-orders')
          const arr = raw ? JSON.parse(raw) : []
          if (!mounted) return
          setPayments(arr)
        } catch (e) {
          if (!mounted) return
          setPayments([])
        }
      } catch (err) {
        if (!mounted) return
        setError(err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [token])

  if (loading) return <div className="text-center py-5"><div className="spinner-border" role="status" /></div>
  if (error) return <div className="alert alert-danger">Error: {String(error)}</div>

  return (
    <div>
      <h2 className="section-title mb-4">Mis Pagos</h2>
      {payments.length === 0 ? (
        <div className="alert alert-info">No tienes pagos registrados.</div>
      ) : (
        <div className="row g-3">
          {payments.map(p => (
            <div key={p.id} className="col-12">
              <div className="card gamer-card">
                <div className="card-body d-flex justify-content-between align-items-start">
                  <div>
                    <strong>Orden #{p.id}</strong>
                    <div className="text-muted small">{new Date(p.date || p.createdAt || Date.now()).toLocaleString()}</div>
                    <div className="mt-2">Total: <strong>${Number(p.total || p.totalAmount || 0).toLocaleString()}</strong></div>
                    <div className="text-muted small">Método: {p.metodoPago || p.paymentMethod || '—'}</div>
                    <div className="text-muted small">Email: {p.email || p.userEmail || '—'}</div>
                  </div>
                  <div style={{minWidth: 220}}>
                    <div className="text-end">
                      <div className="text-muted small">Items:</div>
                      <ul className="list-unstyled small mb-0">
                        {(p.items || p.products || []).map((it, idx) => (
                          <li key={idx}>{it.name || it.code || it.id} x{it.quantity || 1} — ${Number(it.price || it.unitPrice || 0).toLocaleString()}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
