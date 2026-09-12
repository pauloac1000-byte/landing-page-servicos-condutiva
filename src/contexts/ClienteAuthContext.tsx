import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ClienteRecord } from '@/types'
import { buscarClientePorContrato } from '@/services/clienteArea'

const CLIENTE_SESSION_STORAGE_KEY = 'condutiva_cliente_session'

interface ClienteAuthContextType {
  cliente: ClienteRecord | null
  isAuthenticated: boolean
  isModalOpen: boolean
  isLoading: boolean
  openModal: (defaultTab?: 'login' | 'primeiro_acesso' | 'esqueci_senha') => void
  closeModal: () => void
  setSession: (cliente: ClienteRecord) => void
  clearSession: () => void
  refreshCliente: () => Promise<void>
  activeModalTab: 'login' | 'primeiro_acesso' | 'esqueci_senha'
  setActiveModalTab: (tab: 'login' | 'primeiro_acesso' | 'esqueci_senha') => void
}

const ClienteAuthContext = createContext<ClienteAuthContextType | undefined>(undefined)

export function ClienteAuthProvider({ children }: { children: React.ReactNode }) {
  const [cliente, setCliente] = useState<ClienteRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeModalTab, setActiveModalTab] = useState<
    'login' | 'primeiro_acesso' | 'esqueci_senha'
  >('login')

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CLIENTE_SESSION_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as ClienteRecord
        if (parsed?.id && parsed?.numero_contrato) {
          setCliente(parsed)
          // Silently refresh in the background
          buscarClientePorContrato(parsed.numero_contrato)
            .then((fresh) => {
              if (fresh) {
                setCliente(fresh)
                localStorage.setItem(CLIENTE_SESSION_STORAGE_KEY, JSON.stringify(fresh))
              }
            })
            .catch(() => {
              // ignore network errors on silent refresh
            })
        }
      }
    } catch (e) {
      console.error('Falha ao restaurar sessão de cliente:', e)
      localStorage.removeItem(CLIENTE_SESSION_STORAGE_KEY)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const setSession = (newCliente: ClienteRecord) => {
    setCliente(newCliente)
    try {
      localStorage.setItem(CLIENTE_SESSION_STORAGE_KEY, JSON.stringify(newCliente))
    } catch (e) {
      console.error('Falha ao salvar sessão do cliente no localStorage:', e)
    }
  }

  const clearSession = () => {
    setCliente(null)
    try {
      localStorage.removeItem(CLIENTE_SESSION_STORAGE_KEY)
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

  return (
    <ClienteAuthContext.Provider
      value={{
        cliente,
        isAuthenticated: !!cliente,
        isModalOpen,
        isLoading,
        openModal,
        closeModal,
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
