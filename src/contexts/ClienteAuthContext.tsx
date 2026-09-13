import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ClienteRecord } from '@/types'
import { buscarClientePorContrato } from '@/services/clienteArea'

// Medida de segurança: a sessão da Área do Cliente NUNCA é persistida no disco/storage/cookie.
// Vive exclusivamente em memória durante o ciclo de vida do painel aberto.
// Caso a chave legada ainda exista no navegador de sessões antigas, ela é expurgada na inicialização.
const LEGACY_CLIENTE_SESSION_STORAGE_KEY = 'condutiva_cliente_session'

interface ClienteAuthContextType {
  cliente: ClienteRecord | null
  isAuthenticated: boolean
  isModalOpen: boolean
  isLoading: boolean
  openModal: (defaultTab?: 'login' | 'primeiro_acesso' | 'esqueci_senha') => void
  closeModal: () => void
  isDashboardOpen: boolean
  openDashboard: () => void
  closeDashboard: () => void
  openClienteArea: () => void
  setSession: (cliente: ClienteRecord) => void
  clearSession: () => void
  refreshCliente: () => Promise<void>
  activeModalTab: 'login' | 'primeiro_acesso' | 'esqueci_senha'
  setActiveModalTab: (tab: 'login' | 'primeiro_acesso' | 'esqueci_senha') => void
}

const ClienteAuthContext = createContext<ClienteAuthContextType | undefined>(undefined)

export function ClienteAuthProvider({ children }: { children: React.ReactNode }) {
  const [cliente, setCliente] = useState<ClienteRecord | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDashboardOpen, setIsDashboardOpen] = useState(false)
  const [activeModalTab, setActiveModalTab] = useState<
    'login' | 'primeiro_acesso' | 'esqueci_senha'
  >('login')

  // Limpeza de segurança na inicialização: remove resquícios de sessões legadas do localStorage
  useEffect(() => {
    try {
      localStorage.removeItem(LEGACY_CLIENTE_SESSION_STORAGE_KEY)
      sessionStorage.removeItem(LEGACY_CLIENTE_SESSION_STORAGE_KEY)
    } catch {
      // Ignora restrições de sandbox de storage
    }
  }, [])

  // Medida de segurança: ao descarregar a página (refresh, fechar aba, navegar para fora),
  // expurgar a sessão e qualquer dado residual imediatamente
  useEffect(() => {
    const handleUnload = () => {
      try {
        localStorage.removeItem(LEGACY_CLIENTE_SESSION_STORAGE_KEY)
        sessionStorage.removeItem(LEGACY_CLIENTE_SESSION_STORAGE_KEY)
      } catch {
        // no-op
      }
    }
    window.addEventListener('beforeunload', handleUnload)
    return () => {
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [])

  const setSession = (newCliente: ClienteRecord) => {
    // Sessão estritamente em memória
    setCliente(newCliente)
  }

  const clearSession = () => {
    // Logout completo: encerra sessão em memória e fecha dashboard
    setCliente(null)
    setIsDashboardOpen(false)
    try {
      localStorage.removeItem(LEGACY_CLIENTE_SESSION_STORAGE_KEY)
      sessionStorage.removeItem(LEGACY_CLIENTE_SESSION_STORAGE_KEY)
    } catch (e) {
      console.error('Falha ao limpar sessão do cliente:', e)
    }
  }

  const refreshCliente = async () => {
    if (!cliente?.numero_contrato) return
    try {
      const fresh = await buscarClientePorContrato(cliente.numero_contrato)
      if (fresh) {
        setSession(fresh)
      }
    } catch (e) {
      console.error('Erro ao atualizar dados do cliente:', e)
    }
  }

  const openModal = (tab: 'login' | 'primeiro_acesso' | 'esqueci_senha' = 'login') => {
    setActiveModalTab(tab)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const openDashboard = () => {
    setIsModalOpen(false)
    setIsDashboardOpen(true)
  }

  const closeDashboard = () => {
    // Medida de segurança: fechar a janela da Área do Cliente faz logout automático imediato
    clearSession()
  }

  const openClienteArea = () => {
    if (cliente) {
      setIsModalOpen(false)
      setIsDashboardOpen(true)
    } else {
      openModal('login')
    }
  }

  return (
    <ClienteAuthContext.Provider
      value={{
        cliente,
        isAuthenticated: !!cliente,
        isModalOpen,
        isLoading,
        openModal,
        closeModal,
        isDashboardOpen,
        openDashboard,
        closeDashboard,
        openClienteArea,
        setSession,
        clearSession,
        refreshCliente,
        activeModalTab,
        setActiveModalTab,
      }}
    >
      {children}
    </ClienteAuthContext.Provider>
  )
}

export function useClienteAuth(): ClienteAuthContextType {
  const context = useContext(ClienteAuthContext)
  if (!context) {
    throw new Error('useClienteAuth deve ser utilizado dentro de um ClienteAuthProvider')
  }
  return context
}
