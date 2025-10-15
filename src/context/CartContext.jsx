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
      if (existing) {
        items = state.items.map(i => i.id === action.item.id ? { ...i, quantity: i.quantity + action.quantity } : i)
      } else {
        items = [...state.items, { ...action.item, quantity: action.quantity }]
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
      const qty = Math.max(1, action.quantity || 1)
      newState = { ...state, items: state.items.map(i => i.id === action.id ? { ...i, quantity: qty } : i) }
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
      addItem: (item, quantity = 1) => dispatch({ type: 'ADD', item, quantity }),
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
