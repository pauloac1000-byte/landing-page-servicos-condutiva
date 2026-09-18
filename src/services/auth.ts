import pb from '@/lib/pocketbase/client'

export interface AuthUser {
  id: string
  email: string
  name?: string
  avatar?: string
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

export function logout(): void {
  try {
    pb.authStore.clear()
  } finally {
    purgeAuthStorage()
  }
}

export function subscribeToAuthChange(callback: (user: AuthUser | null) => void): () => void {
  const unsubscribe = pb.authStore.onChange(() => {
    callback(getCurrentUser())
  })
  return unsubscribe
}
