import { createContext, useContext, useEffect, useState } from 'react'
const STORAGE_USER_KEY = 'levelup-user'
const STORAGE_TOKEN_KEY = 'levelup-token'

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

  // Helper: parse a JWT (no validation) to extract payload
  const parseJwt = (t) => {
    try {
      const parts = t.split('.')
      if (parts.length < 2) return null
      const payload = parts[1]
      // base64url -> base64
      const b64 = payload.replace(/-/g, '+').replace(/_/g, '/')
      const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4)
      const json = atob(padded)
      return JSON.parse(json)
    } catch (e) {
      return null
    }
  }

  // If we have a token but no user, try to derive user info from the token payload
  // Function to fetch full profile from backend using token
  const fetchProfile = async (t) => {
    if (!t) return { ok: false }
    try {
      const res = await fetch('http://localhost:8080/autenticacion/yo', {
        headers: { 'Authorization': `Bearer ${t}` }
      })
      if (!res.ok) return { ok: false, status: res.status }
      const data = await res.json()
      // data may be nested, try common shapes
      const u = data.user || data.usuario || data || {}
      // normalize roles
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

  // when token changes, try to load full profile from backend
  useEffect(() => {
    let mounted = true
    const load = async () => {
      if (!token) return
      const res = await fetchProfile(token)
      if (!res.ok && mounted) {
        // fallback: keep any parsed token info if available
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

  const login = async (username, password) => {
    try {
      const res = await fetch('http://localhost:8080/autenticacion/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      if (!res.ok) {
        // devolver error simple
        return { ok: false, status: res.status }
      }

      const data = await res.json()
        // Try multiple token/property names and nested locations
        const receivedToken = data.token || data.accessToken || data.jwt || null
        const parsed = receivedToken ? parseJwt(receivedToken) : null

        const readKey = (obj, key) => {
          if (!obj) return undefined
          // support nested like 'user.username'
          if (key.includes('.')) {
            return key.split('.').reduce((o, k) => (o ? o[k] : undefined), obj)
          }
          return obj[key]
        }

        const getFirst = (keys) => {
          for (const k of keys) {
            // top-level in response
            const v1 = readKey(data, k)
            if (v1 !== undefined && v1 !== null) return v1
            // nested common properties
            const v2 = readKey(data.user || data.usuario || {}, k)
            if (v2 !== undefined && v2 !== null) return v2
            // token payload
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

        // Prefer fetching the full profile from backend using the token
        setToken(receivedToken || null)
        const profile = receivedToken ? await fetchProfile(receivedToken) : null
        if (profile && profile.ok) {
          return { ok: true, user: profile.user, token: receivedToken }
        }

        // fallback to best-effort user object
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

  // Update the current user's profile by calling backend and updating local state/localStorage
  const updateProfile = async (id, updates) => {
    try {
      // Determine id to update. Prefer fetching the authoritative profile from /autenticacion/yo
      let targetId = id

      // If we have a token, fetch the full profile first and prefer that id
      if (token) {
        const prof = await fetchProfile(token)
        if (prof && prof.ok && prof.user && prof.user.id) {
          // update local user with fresh profile
          setUser(prof.user)
          targetId = prof.user.id
        }
      }

      if (!targetId) {
        // fallback to current memory user or token payload
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

      // ensure targetId is a plain string/number (avoid passing literal 'null')
      const cleanedId = (typeof targetId === 'string' && targetId.toLowerCase() === 'null') ? null : targetId
      if (!cleanedId) return { ok: false, error: 'Resolved user id is invalid' }

      // Try to parse a numeric id (server expects a Long). If parsing fails, still attempt to use the string form
      let numericId = Number(cleanedId)
      if (typeof cleanedId === 'string' && isNaN(numericId)) {
        // try integer parse (handles numeric strings with spaces)
        const parsed = parseInt(cleanedId, 10)
        if (!isNaN(parsed)) numericId = parsed
      }
      const idForUrl = (!isNaN(numericId) && numericId !== null) ? numericId : cleanedId
      const url = `http://localhost:8080/usuarios/${idForUrl}`
      // debug info: do not log full token in production
      try {
        console.debug('AuthContext.updateProfile -> url, cleanedId, numericId, tokenPresent, updates', { url, cleanedId, numericId, tokenPresent: !!token, updates })
      } catch (e) {}

      // include id in body as numeric value when possible; only include defined fields to avoid overwriting with null
      const bodyToSend = {}
      for (const [k, v] of Object.entries(updates || {})) {
        if (v !== null && v !== undefined) bodyToSend[k] = v
      }
      if (!isNaN(numericId) && numericId !== null) bodyToSend.id = numericId
      else bodyToSend.id = cleanedId
      try { console.debug('AuthContext.updateProfile -> sending body', bodyToSend) } catch (e) {}

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bodyToSend)
      })

      // read raw text first (some backends return empty body on success)
      const rawText = await res.text().catch(() => null)
      let parsed = null
      try {
        parsed = rawText ? JSON.parse(rawText) : null
      } catch (e) {
        parsed = null
      }

      try { console.debug('AuthContext.updateProfile -> response', { url, status: res.status, ok: res.ok, bodyText: rawText, parsed }) } catch (e) {}

      if (!res.ok) {
        try { console.error('AuthContext.updateProfile failed', { url, status: res.status, body: rawText }) } catch (e) {}
        return { ok: false, status: res.status, error: rawText || res.statusText }
      }

      // If backend returned updated resource as JSON, use it. If it returned no body (204), try to refresh profile.
      if (parsed) {
        // after successful update, refresh profile from server to ensure canonical state
        if (token) {
          const refreshed = await fetchProfile(token)
          if (refreshed && refreshed.ok) {
            return { ok: true, user: refreshed.user }
          }
        }
        setUser(prev => prev ? ({ ...prev, ...parsed }) : parsed)
        return { ok: true, user: parsed }
      }

      // No JSON body returned. Attempt to refresh canonical profile.
      if (token) {
        const refreshed = await fetchProfile(token)
        if (refreshed && refreshed.ok) {
          return { ok: true, user: refreshed.user }
        }
      }

      // Fall back to merging the updates we sent
      setUser(prev => prev ? ({ ...prev, ...(updates || {}) }) : (updates || {}))
      return { ok: true, user: updates || null }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  }
  const isAuthenticated = Boolean(token)
  const value = { user, token, isAuthenticated, login, logout, updateProfile }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
