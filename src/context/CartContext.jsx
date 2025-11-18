import { createContext, useContext, useMemo, useReducer, useEffect } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'levelup-gamer-cart'

function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : { items: [] }
  } catch {
    return { items: [] }
  }
}

function saveToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

function reducer(state, action) {
  let newState
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(i => i.id === action.item.id)
      let items
      const stock = action.item?.stock ?? null
      if (existing) {
        const newQty = existing.quantity + action.quantity
        const capped = (stock !== null && !isNaN(stock)) ? Math.min(newQty, stock) : newQty
        items = state.items.map(i => i.id === action.item.id ? { ...i, quantity: capped } : i)
      } else {
        const qty = action.quantity || 1
        const capped = (stock !== null && !isNaN(stock)) ? Math.min(qty, stock) : qty
        items = [...state.items, { ...action.item, quantity: capped }]
      }
      newState = { ...state, items }
      saveToStorage(newState)
      return newState
    }
    case 'REMOVE': {
      newState = { ...state, items: state.items.filter(i => i.id !== action.id) }
      saveToStorage(newState)
      return newState
    }
    case 'CLEAR': {
      newState = { ...state, items: [] }
      saveToStorage(newState)
      return newState
    }
    case 'UPDATE_QTY': {
      const desired = Math.max(1, action.quantity || 1)
      newState = { ...state, items: state.items.map(i => {
        if (i.id !== action.id) return i
        const stock = i.stock ?? null
        const finalQty = (stock !== null && !isNaN(stock)) ? Math.min(desired, stock) : desired
        return { ...i, quantity: finalQty }
      }) }
      saveToStorage(newState)
      return newState
    }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadFromStorage)
  const value = useMemo(() => {
    const total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    return {
      items: state.items,
      total,
      addItem: (item, quantity = 1) => {
        const existing = state.items.find(i => i.id === item.id)
        const currentQty = existing ? existing.quantity : 0
        const stock = item?.stock ?? null
        if (stock !== null && !isNaN(stock)) {
          if (stock <= 0) {
            return { ok: false, reason: 'out_of_stock' }
          }
          const allowed = Math.max(0, stock - currentQty)
          if (allowed <= 0) return { ok: false, reason: 'limit_reached' }
          const toAdd = Math.min(quantity, allowed)
          dispatch({ type: 'ADD', item, quantity: toAdd })
          return { ok: true, added: toAdd }
        }
        dispatch({ type: 'ADD', item, quantity })
        return { ok: true, added: quantity }
      },
      removeItem: (id) => dispatch({ type: 'REMOVE', id }),
      clear: () => dispatch({ type: 'CLEAR' }),
      updateQuantity: (id, quantity) => dispatch({ type: 'UPDATE_QTY', id, quantity })
    }
  }, [state])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}
