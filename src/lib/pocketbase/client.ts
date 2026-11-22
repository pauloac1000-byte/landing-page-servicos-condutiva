import PocketBase, { BaseAuthStore } from 'pocketbase'

/**
 * Armazenamento de autenticação 100% em memória (BaseAuthStore, sem persistência):
 * nenhum token ou registro de usuário sobrevive a reload, fechamento de aba/navegador
 * ou restauração da página pelo cache do navegador (bfcache). Cada retorno à área
 * restrita exige autenticação nova.
 */
const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL, new BaseAuthStore())
pb.autoCancellation(false)

export default pb
