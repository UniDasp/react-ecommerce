import { createContext, useContext, useEffect, useState } from 'react'
import usersFromFile from '../data/users.json'

const STORAGE_USER_KEY = 'levelup-user'
const STORAGE_USERS_KEY = 'levelup-users'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_USER_KEY)
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      return null
    }
  })

  const [users, setUsers] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_USERS_KEY)
      if (raw) return JSON.parse(raw)
    } catch (e) {
    }
    return usersFromFile
  })

  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user))
      else localStorage.removeItem(STORAGE_USER_KEY)
    } catch (e) {
    }
  }, [user])

  useEffect(() => {
    try {
      if (users) localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users))
    } catch (e) {
    }
  }, [users])

  const login = async (email, password) => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
    if (found) {
      const { password: _p, ...rest } = found
      setUser(rest)
      return { ok: true, user: rest }
    }
    return { ok: false }
  }

  const logout = () => setUser(null)

  const updateProfile = (id, updates) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u))
    if (user && user.id === id) {
      setUser(prev => ({ ...prev, ...updates }))
    }
  }

  const value = { user, users, login, logout, updateProfile }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
