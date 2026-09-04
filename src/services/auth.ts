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

export function logout(): void {
  pb.authStore.clear()
}

export function subscribeToAuthChange(callback: (user: AuthUser | null) => void): () => void {
  const unsubscribe = pb.authStore.onChange(() => {
    callback(getCurrentUser())
  })
  return unsubscribe
}
