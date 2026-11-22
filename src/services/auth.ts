import pb from '@/lib/pocketbase/client'

export interface AuthUser {
  id: string
  email: string
  name?: string
  avatar?: string
}

// Chave do sinal efêmero de "sessão encerrada por segurança" (logout automático
// ao sair da área restrita, restauração de cache do navegador, etc).
// localStorage: sobrevive ao fechamento da aba/navegador, mas NÃO a uma janela
// nova/anônima — exatamente o escopo desejado para o aviso na tela de login.
export const SESSAO_ENCERRADA_STORAGE_KEY = 'condutiva_sessao_encerrada'
// TTL do sinal: evita exibir aviso antigo em um acesso muito posterior.
const SESSAO_ENCERRADA_TTL_MS = 60 * 60 * 1000

/**
 * Grava o sinal de sessão encerrada por segurança. Deve ser chamado ANTES de
 * sair da página (unload/bfcache) para que a tela de login exiba o aviso.
 */
export function marcarSessaoEncerrada(motivo: 'saida_pagina' | 'bfcache' | 'purge'): void {
  try {
    localStorage.setItem(SESSAO_ENCERRADA_STORAGE_KEY, JSON.stringify({ motivo, ts: Date.now() }))
  } catch {
    // Tratamento silencioso para restrições de sandbox de storage do navegador
  }
}

/**
 * Lê (sem remover) o sinal de sessão encerrada por segurança. A leitura é não
 * destrutiva para ser segura em remontagens do React; a limpeza acontece logo
 * depois, via limparSinalSessaoEncerrada(), quando a tela de login montar.
 */
export function lerSinalSessaoEncerrada(): boolean {
  try {
    const raw = localStorage.getItem(SESSAO_ENCERRADA_STORAGE_KEY)
    if (!raw) return false
    const parsed = JSON.parse(raw) as { motivo?: string; ts?: number }
    if (typeof parsed?.ts !== 'number') return true
    return Date.now() - parsed.ts <= SESSAO_ENCERRADA_TTL_MS
  } catch {
    return false
  }
}

/** Remove o sinal de sessão encerrada (após exibir o aviso na tela de login). */
export function limparSinalSessaoEncerrada(): void {
  try {
    localStorage.removeItem(SESSAO_ENCERRADA_STORAGE_KEY)
  } catch {
    // Tratamento silencioso
  }
}

export function getCurrentUser(): AuthUser | null {
  if (pb.authStore.isValid && pb.authStore.record) {
    const r = pb.authStore.record
    return {
      id: r.id,
      email: (r.email as string) || '',
      name: (r.name as string) || (r.email as string) || 'Colaborador',
      avatar: (r.avatar as string) || '',
    }
  }
  return null
}

export function isUserAuthenticated(): boolean {
  return pb.authStore.isValid && pb.authStore.record !== null
}

export async function loginWithEmail(email: string, password: string): Promise<AuthUser> {
  const authData = await pb.collection('users').authWithPassword(email.trim(), password)
  const r = authData.record
  return {
    id: r.id,
    email: (r.email as string) || '',
    name: (r.name as string) || (r.email as string) || 'Colaborador',
    avatar: (r.avatar as string) || '',
  }
}

// Lista de chaves legadas e resíduos de storage para expurgo preventivo
export const LEGACY_AUTH_STORAGE_KEYS = [
  'pocketbase_auth',
  'condutiva_leads_authenticated',
  'condutiva_cliente_session',
] as const

/**
 * Limpeza preventiva de qualquer resquício de autenticação persistido em navegadores anteriores.
 * A sessão vive exclusivamente em memória RAM durante o ciclo da página ativa.
 */
export function purgeAuthStorage(): void {
  try {
    for (const key of LEGACY_AUTH_STORAGE_KEYS) {
      localStorage.removeItem(key)
      sessionStorage.removeItem(key)
    }
  } catch {
    // Tratamento silencioso para restrições de sandbox de storage do navegador
  }
}

// Execução preventiva imediata na importação do módulo de autenticação
purgeAuthStorage()

/**
 * Logout padrão (botão "Sair"). A sessão já é não persistente, mas por defesa
 * em profundidade o authStore é limpo e o storage é expurgado.
 */
export function logout(): void {
  try {
    pb.authStore.clear()
  } finally {
    purgeAuthStorage()
  }
}

/**
 * Logout automático por segurança, com marcação do motivo ANTES de sair da
 * página (unload/bfcache). A tela de login usa o sinal para exibir o aviso.
 */
export function logoutAutomatico(motivo: 'saida_pagina' | 'bfcache' | 'purge'): void {
  marcarSessaoEncerrada(motivo)
  logout()
}

export function subscribeToAuthChange(callback: (user: AuthUser | null) => void): () => void {
  const unsubscribe = pb.authStore.onChange(() => {
    callback(getCurrentUser())
  })
  return unsubscribe
}
