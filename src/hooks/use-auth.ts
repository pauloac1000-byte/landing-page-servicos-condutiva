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

    // Medida de segurança réplica da Área do Cliente:
    // Ao descarregar a página (F5, fechar aba, fechar janela ou navegar para fora),
    // expurgar a sessão e deslogar imediatamente. A sessão vive exclusivamente na memória.
    const handleUnload = () => {
      try {
        serviceLogout()
      } catch {
        // no-op
      }
    }

    window.addEventListener('beforeunload', handleUnload)
    window.addEventListener('pagehide', handleUnload)

    return () => {
      unsubscribe()
      window.removeEventListener('beforeunload', handleUnload)
      window.removeEventListener('pagehide', handleUnload)
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
