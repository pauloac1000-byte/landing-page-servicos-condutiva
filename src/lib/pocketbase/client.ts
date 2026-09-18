import PocketBase, { BaseAuthStore } from 'pocketbase'

// BaseAuthStore mantém o estado da sessão 100% em memória no cliente,
// impedindo que o token seja persistido em localStorage ou sobreviva a reload (F5) / fechamento de aba.
const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL, new BaseAuthStore())
pb.autoCancellation(false)

export default pb
