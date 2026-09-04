import { useState, useEffect } from 'react'
import {
  getCurrentUser,
  subscribeToAuthChange,
  loginWithEmail,
  logout as serviceLogout,
  AuthUser,
} from '@/services/auth'

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => getCurrentUser())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setUser(getCurrentUser())
    const unsubscribe = subscribeToAuthChange((updated) => {
      setUser(updated)
    })
    return () => {
      unsubscribe()
    }
  }, [])

  const login = async (email: string, pass: string) => {
    setLoading(true)
    try {
      const authUser = await loginWithEmail(email, pass)
      setUser(authUser)
      return authUser
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    serviceLogout()
    setUser(null)
  }

  return {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  }
}
