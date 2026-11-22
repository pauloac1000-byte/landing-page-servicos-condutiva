import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { isUserAuthenticated, logoutAutomatico } from '@/services/auth'

// Rotas da área restrita (Área de equipe). Fora delas, qualquer sessão de
// colaborador é encerrada automaticamente — inclusive na navegação interna
// do SPA (ex.: botão "Landing Page" ou logo dentro do painel).
const ROTAS_PROTEGIDAS = ['/leads', '/contratos']

/**
 * Guarda global de sessão: garante que a sessão da Área de equipe exista
 * apenas dentro das rotas protegidas. Ao sair delas (navegação interna do
 * SPA), encerra a sessão e marca o sinal exibido na tela de login.
 */
export function SessionGuard() {
  const location = useLocation()
  const autenticado = isUserAuthenticated()

  useEffect(() => {
    if (!autenticado) return
    const emRotaProtegida = ROTAS_PROTEGIDAS.some((p) => location.pathname.startsWith(p))
    if (!emRotaProtegida) {
      logoutAutomatico('saida_pagina')
    }
  }, [location.pathname, autenticado])

  return null
}
