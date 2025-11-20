import { createContext, useContext, useEffect, useState } from 'react'
import { req, axiosInstance } from '../services/http.js'
import { useNavigate, useLocation } from 'react-router-dom'
const STORAGE_USER_KEY = 'levelup-user'
const STORAGE_TOKEN_KEY = 'levelup-token'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_USER_KEY)
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      return null
    }
  })

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_TOKEN_KEY) || null
    } catch (e) {
      return null
    }
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
      if (token) localStorage.setItem(STORAGE_TOKEN_KEY, token)
      else localStorage.removeItem(STORAGE_TOKEN_KEY)
    } catch (e) {
    }
  }, [token])
  const parseJwt = (t) => {
    try {
      const parts = t.split('.')
      if (parts.length < 2) return null
      const payload = parts[1]
      const b64 = payload.replace(/-/g, '+').replace(/_/g, '/')
      const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4)
      const json = atob(padded)
      return JSON.parse(json)
    } catch (e) {
      return null
    }
  }
  const fetchProfile = async (t) => {
    if (!t) return { ok: false }
    try {
      const data = await req('/autenticacion/yo', t, { method: 'GET' })
      const u = data.user || data.usuario || data || {}
      const rolesRaw = u.roles || u.authorities || u.role || []
      const rolesArr = Array.isArray(rolesRaw) ? rolesRaw : (rolesRaw ? [rolesRaw] : [])

      const userObj = {
        id: u.id || u.userId || u.sub || null,
        username: u.username || u.user || u.sub || null,
        email: u.email || u.mail || null,
        firstName: u.firstName || u.first_name || u.nombre || null,
        lastName: u.lastName || u.last_name || u.apellido || null,
        fullName: u.fullName || u.name || ((u.firstName || u.lastName) ? `${u.firstName || ''} ${u.lastName || ''}`.trim() : null),
        phone: u.phone || u.telefono || null,
        address: u.address || u.direccion || null,
        region: u.region || null,
        city: u.city || null,
        roles: rolesArr
      }
      setUser(userObj)
      return { ok: true, user: userObj }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  }
  useEffect(() => {
    let mounted = true
    const load = async () => {
      if (!token) return
      const res = await fetchProfile(token)
      if (!res.ok && mounted) {
        const payload = parseJwt(token)
        if (payload) {
          const username = payload.username || payload.sub || payload.user || null
          const email = payload.email || payload.mail || null
          const roles = payload.roles || payload.authorities || payload.role || []
          const rolesArr = Array.isArray(roles) ? roles : (typeof roles === 'string' ? [roles] : [])
          setUser({ username, email, roles: rolesArr })
        }
      }
    }
    load()
    return () => { mounted = false }
  }, [token])

  // Centralized interceptor: if backend returns 401 -> logout and go to login
  // if 403 -> redirect to home. This helps keep UX consistent.
  useEffect(() => {
    const id = axiosInstance.interceptors.response.use(
      (r) => r,
      (err) => {
        try {
          const status = err && err.response && err.response.status
          if (status === 401) {
            // invalid / expired token
            setUser(null)
            setToken(null)
            try {
              const from = location && location.pathname ? location.pathname : '/'
              navigate('/react-ecommerce/login', { state: { from } })
            } catch (e) {}
          } else if (status === 403) {
            try { navigate('/react-ecommerce/') } catch (e) {}
          }
        } catch (e) {}
        return Promise.reject(err)
      }
    )
    return () => {
      try { axiosInstance.interceptors.response.eject(id) } catch (e) {}
    }
  }, [navigate, location])

  const login = async (username, password) => {
    try {
      const data = await req('/autenticacion/login', null, { method: 'POST', body: { username, password } })
        const receivedToken = data.token || data.accessToken || data.jwt || null
        const parsed = receivedToken ? parseJwt(receivedToken) : null

        const readKey = (obj, key) => {
          if (!obj) return undefined
          if (key.includes('.')) {
            return key.split('.').reduce((o, k) => (o ? o[k] : undefined), obj)
          }
          return obj[key]
        }

        const getFirst = (keys) => {
          for (const k of keys) {
            const v1 = readKey(data, k)
            if (v1 !== undefined && v1 !== null) return v1
            const v2 = readKey(data.user || data.usuario || {}, k)
            if (v2 !== undefined && v2 !== null) return v2
            const v3 = readKey(parsed, k)
            if (v3 !== undefined && v3 !== null) return v3
          }
          return null
        }

        const resUser = getFirst(['username', 'user', 'sub', 'userName']) || username
        const resEmail = getFirst(['email', 'mail']) || null
        const resFirst = getFirst(['firstName', 'first_name', 'nombre', 'given_name']) || null
        const resLast = getFirst(['lastName', 'last_name', 'apellido', 'family_name']) || null
        const resFull = getFirst(['fullName', 'name']) || (resFirst || resLast ? `${resFirst || ''} ${resLast || ''}`.trim() : null)
        const resPhone = getFirst(['phone', 'telefono']) || null
        const resAddress = getFirst(['address', 'direccion']) || null
        const resRegion = getFirst(['region']) || null
        const resCity = getFirst(['city']) || null
        const rolesRaw = getFirst(['roles', 'authorities', 'role']) || []
        const rolesArr = Array.isArray(rolesRaw) ? rolesRaw : (rolesRaw ? [rolesRaw] : [])

        const userObj = {
          username: resUser,
          email: resEmail,
          firstName: resFirst,
          lastName: resLast,
          fullName: resFull,
          phone: resPhone,
          address: resAddress,
          region: resRegion,
          city: resCity,
          roles: rolesArr
        }
        setToken(receivedToken || null)
        const profile = receivedToken ? await fetchProfile(receivedToken) : null
        if (profile && profile.ok) {
          return { ok: true, user: profile.user, token: receivedToken }
        }
        setUser(userObj)
        return { ok: true, user: userObj, token: receivedToken }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
  }

  const handleUnauthorized = (err) => {
    try {
      const status = err && (err.status || (err.response && err.response.status))
      if (status === 401) {
        logout()
        try { navigate('/react-ecommerce/login', { state: { from: location && location.pathname } }) } catch (e) {}
        return true
      }
      if (status === 403) {
        try { navigate('/react-ecommerce/') } catch (e) {}
        return true
      }
    } catch (e) {}
    return false
  }
  const updateProfile = async (id, updates) => {
    try {
      let targetId = id
      if (token) {
        const prof = await fetchProfile(token)
        if (prof && prof.ok && prof.user && prof.user.id) {
          setUser(prof.user)
          targetId = prof.user.id
        }
      }

      if (!targetId) {
        targetId = user?.id || null
        if (!targetId && token) {
          const parsed = parseJwt(token)
          targetId = parsed?.id || parsed?.sub || parsed?.userId || null
        }
      }

      if (!targetId) {
        return { ok: false, error: 'No user id available for update' }
      }

      if (!token) return { ok: false, error: 'No auth token' }
      const cleanedId = (typeof targetId === 'string' && targetId.toLowerCase() === 'null') ? null : targetId
      if (!cleanedId) return { ok: false, error: 'Resolved user id is invalid' }
      let numericId = Number(cleanedId)
      if (typeof cleanedId === 'string' && isNaN(numericId)) {
        const parsed = parseInt(cleanedId, 10)
      }
      const idForUrl = (!isNaN(numericId) && numericId !== null) ? numericId : cleanedId
      const url = `http://localhost:8080/usuarios/${idForUrl}`
      try {
        console.debug('AuthContext.updateProfile -> url, cleanedId, numericId, tokenPresent, updates', { url, cleanedId, numericId, tokenPresent: !!token, updates })
      } catch (e) {}
      const bodyToSend = {}
      for (const [k, v] of Object.entries(updates || {})) {
        if (v !== null && v !== undefined) bodyToSend[k] = v
      }
      if (!isNaN(numericId) && numericId !== null) bodyToSend.id = numericId
      else bodyToSend.id = cleanedId
      try { console.debug('AuthContext.updateProfile -> sending body', bodyToSend) } catch (e) {}
      const parsed = await req(url, token, { method: 'PUT', body: bodyToSend })
      try { console.debug('AuthContext.updateProfile -> response', { url, parsed }) } catch (e) {}
      if (parsed) {
        if (token) {
          const refreshed = await fetchProfile(token)
          if (refreshed && refreshed.ok) {
            return { ok: true, user: refreshed.user }
          }
        }
        setUser(prev => prev ? ({ ...prev, ...parsed }) : parsed)
        return { ok: true, user: parsed }
      }
      if (token) {
        const refreshed = await fetchProfile(token)
        if (refreshed && refreshed.ok) {
          return { ok: true, user: refreshed.user }
        }
      }
      setUser(prev => prev ? ({ ...prev, ...(updates || {}) }) : (updates || {}))
      return { ok: true, user: updates || null }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  }
  const isAuthenticated = Boolean(token)
  const value = { user, token, isAuthenticated, login, logout, updateProfile, handleUnauthorized }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
