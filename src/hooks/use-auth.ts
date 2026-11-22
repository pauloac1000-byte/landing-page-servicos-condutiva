import { useState, useEffect } from 'react'
import {
  getCurrentUser,
  isUserAuthenticated,
  subscribeToAuthChange,
  loginWithEmail,
  logout as serviceLogout,
  logoutAutomatico,
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
    // Ao descarregar a página (fechar aba, fechar janela ou navegar para fora),
    // marcar o motivo e deslogar imediatamente. A sessão vive exclusivamente na
    // memória — nada sobrevive ao fechamento da aba ou do navegador.
    const handleUnload = () => {
      try {
        logoutAutomatico('saida_pagina')
      } catch {
        // no-op: unload não pode falhar
      }
    }

    // bfcache: o botão voltar/avançar do navegador pode restaurar a página do
    // cache com estado React e UI já carregados, sem executar nenhum script de
    // unload. Ao detectar restauração (pageshow com persisted=true), a sessão é
    // encerrada e um reload limpo (sem cache) recria a página do zero — caindo
    // na tela de login, nunca numa tela interna com dados do usuário anterior.
    const handlePageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return
      try {
        if (isUserAuthenticated()) {
          logoutAutomatico('bfcache')
        }
      } catch {
        // no-op
      }
      if (typeof window.location.reload === 'function') {
        window.location.reload()
      }
    }

    window.addEventListener('beforeunload', handleUnload)
    window.addEventListener('pagehide', handleUnload)
    window.addEventListener('pageshow', handlePageShow)

    return () => {
      unsubscribe()
      window.removeEventListener('beforeunload', handleUnload)
      window.removeEventListener('pagehide', handleUnload)
      window.removeEventListener('pageshow', handlePageShow)
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
