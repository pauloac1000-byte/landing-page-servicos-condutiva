import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import logoImg from '@/assets/logo-removebg-previewedited-24401.jpg'
import {
  FileText,
  Search,
  RefreshCw,
  Building2,
  Mail,
  UserCheck,
  CheckCircle2,
  Clock,
  Home,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  Loader2,
  Users,
  Filter,
  FileSpreadsheet,
  X,
  FileCheck2,
  User,
} from 'lucide-react'
import {
  getContracts,
  createContract,
  updateContract,
  updateContractQuestionnaireStatus,
  deleteContract,
} from '@/services/contracts'
import { getCSATResponses } from '@/services/csat'
import { useRealtime } from '@/hooks/use-realtime'
import { useAuth } from '@/hooks/use-auth'
import type {
  ContractRecord,
  ContractFormData,
  QuestionnaireStatus,
  CSATResponseRecord,
} from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { AuthGate } from '@/components/AuthGate'
import { CSATEvaluationsPanel } from '@/components/csat/CSATEvaluationsPanel'

export default function ContractsPage() {
  const { user, isAuthenticated, logout } = useAuth()

  // Tabs: 'contratos' (Contratos & OS) or 'avaliacoes' (Avaliações CSAT)
  const [activeTab, setActiveTab] = useState<'contratos' | 'avaliacoes'>('contratos')

  // Contracts data state
  const [contracts, setContracts] = useState<ContractRecord[]>([])
  const [loadingContracts, setLoadingContracts] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | QuestionnaireStatus>('all')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')

  // CSAT responses data state
  const [csatResponses, setCsatResponses] = useState<CSATResponseRecord[]>([])
  const [loadingCSAT, setLoadingCSAT] = useState(true)

  // Create / Edit modal state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingContract, setEditingContract] = useState<ContractRecord | null>(null)
  const [formData, setFormData] = useState<ContractFormData>({
    contractNumber: '',
    serviceOrderNumber: '',
    clientName: '',
    clientEmail: '',
    technicianName: '',
    questionnaireStatus: 'pendente',
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete modal state
  const [contractToDelete, setContractToDelete] = useState<ContractRecord | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Status toggle in progress tracking (row id)
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null)

  const { toast } = useToast()

  const loadContractsData = async (silent = false) => {
    if (!silent) setLoadingContracts(true)
    try {
      const data = await getContracts()
      setContracts(data)
    } catch (err: unknown) {
      console.error('Error fetching contracts:', err)
      toast({
        title: 'Erro ao carregar contratos',
        description: 'Não foi possível carregar os contratos e ordens de serviço.',
        variant: 'destructive',
      })
    } finally {
      if (!silent) setLoadingContracts(false)
    }
  }

  const loadCSATData = async (silent = false) => {
    if (!silent) setLoadingCSAT(true)
    try {
      const data = await getCSATResponses()
      setCsatResponses(data)
    } catch (err: unknown) {
      console.error('Error fetching CSAT responses:', err)
      toast({
        title: 'Erro ao carregar avaliações',
        description: 'Não foi possível carregar as avaliações CSAT.',
        variant: 'destructive',
      })
    } finally {
      if (!silent) setLoadingCSAT(false)
    }
  }

  const loadAllData = (silent = false) => {
    loadContractsData(silent)
    loadCSATData(silent)
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData()
    }
  }, [isAuthenticated])

  // Realtime updates on contracts collection
  useRealtime<ContractRecord>('contracts', () => {
    if (isAuthenticated) {
      loadContractsData(true)
    }
  })

  // Realtime updates on csat_responses collection
  useRealtime<CSATResponseRecord>('csat_responses', () => {
    if (isAuthenticated) {
      loadCSATData(true)
    }
  })

  const handleLogout = () => {
    logout()
    toast({
      title: 'Sessão encerrada',
      description: 'Você saiu da área restrita da Condutiva.',
    })
  }

  // Filtered contracts
  const filteredContracts = useMemo(() => {
    return contracts.filter((item) => {
      const q = search.toLowerCase().trim()
      const matchesSearch =
        !q ||
        item.contract_number.toLowerCase().includes(q) ||
        item.service_order_number.toLowerCase().includes(q) ||
        item.client_name.toLowerCase().includes(q) ||
        item.client_email.toLowerCase().includes(q) ||
        item.technician_name.toLowerCase().includes(q)

      const matchesStatus = statusFilter === 'all' || item.questionnaire_status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [contracts, search, statusFilter])

  // Stats
  const totalCount = contracts.length
  const pendingCount = contracts.filter((c) => c.questionnaire_status === 'pendente').length
  const answeredCount = contracts.filter((c) => c.questionnaire_status === 'respondido').length

  // Quick toggle status
  const handleToggleStatus = async (contract: ContractRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const nextStatus: QuestionnaireStatus =
      contract.questionnaire_status === 'pendente' ? 'respondido' : 'pendente'

    setUpdatingStatusId(contract.id)
    try {
      const updated = await updateContractQuestionnaireStatus(contract.id, nextStatus)
      setContracts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
      toast({
        title: 'Situação atualizada',
        description: `Contrato ${contract.contract_number} alterado para "${nextStatus}".`,
      })
    } catch (err: unknown) {
      console.error('Error updating questionnaire status:', err)
      toast({
        title: 'Erro ao atualizar situação',
        description: 'Não foi possível alterar a situação do questionário.',
        variant: 'destructive',
      })
    } finally {
      setUpdatingStatusId(null)
    }
  }

  // Open modal for new contract
  const handleOpenCreateModal = () => {
    setEditingContract(null)
    setFormData({
      contractNumber: '',
      serviceOrderNumber: '',
      clientName: '',
      clientEmail: '',
      technicianName: '',
      questionnaireStatus: 'pendente',
    })
    setFormErrors({})
    setIsFormOpen(true)
  }

  // Open modal for editing existing contract
  const handleOpenEditModal = (contract: ContractRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setEditingContract(contract)
    setFormData({
      contractNumber: contract.contract_number,
      serviceOrderNumber: contract.service_order_number,
      clientName: contract.client_name,
      clientEmail: contract.client_email,
      technicianName: contract.technician_name,
      questionnaireStatus: contract.questionnaire_status,
    })
    setFormErrors({})
    setIsFormOpen(true)
  }

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    if (!formData.contractNumber.trim()) {
      errors.contractNumber = 'Número do contrato é obrigatório.'
    }
    if (!formData.serviceOrderNumber.trim()) {
      errors.serviceOrderNumber = 'Número da OS é obrigatório.'
    }
    if (!formData.clientName.trim()) {
      errors.clientName = 'Nome do cliente ou empresa é obrigatório.'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.clientEmail.trim()) {
      errors.clientEmail = 'E-mail do cliente é obrigatório.'
    } else if (!emailRegex.test(formData.clientEmail.trim())) {
      errors.clientEmail = 'Informe um endereço de e-mail válido.'
    }
    if (!formData.technicianName.trim()) {
      errors.technicianName = 'Técnico da Condutiva responsável é obrigatório.'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Save (create or update)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      if (editingContract) {
        const updated = await updateContract(editingContract.id, formData)
        setContracts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
        toast({
          title: 'Contrato atualizado',
          description: `Os dados do contrato ${updated.contract_number} foram salvos com sucesso.`,
        })
      } else {
        const created = await createContract(formData)
        setContracts((prev) => [created, ...prev])
        toast({
          title: 'Contrato cadastrado',
          description: `Contrato ${created.contract_number} / OS ${created.service_order_number} cadastrado com sucesso.`,
        })
      }
      setIsFormOpen(false)
    } catch (err: unknown) {
      console.error('Error saving contract:', err)
      toast({
        title: 'Erro ao salvar',
        description: 'Verifique se os dados estão corretos e tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete handling
  const handleDeleteClick = (contract: ContractRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setContractToDelete(contract)
  }

  const handleConfirmDelete = async () => {
    if (!contractToDelete) return
    setIsDeleting(true)
    const target = contractToDelete
    try {
      await deleteContract(target.id)
      setContracts((prev) => prev.filter((c) => c.id !== target.id))
      setContractToDelete(null)
      toast({
        title: 'Registro excluído',
        description: `O contrato ${target.contract_number} foi excluído do sistema.`,
      })
    } catch (err: unknown) {
      console.error('Error deleting contract:', err)
      toast({
        title: 'Erro ao excluir',
        description: 'Não foi possível remover o registro. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Export CSV
  const handleExportCSV = () => {
    if (filteredContracts.length === 0) {
      toast({
        title: 'Sem dados para exportar',
        description: 'Nenhum contrato encontrado com os filtros atuais.',
      })
      return
    }

    const headers = [
      'Data de Cadastro',
      'Número do Contrato',
      'Número da OS',
      'Cliente / Empresa',
      'E-mail do Cliente',
      'Técnico Responsável',
      'Situação do Questionário',
    ]

    const csvRows = [
      headers.join(';'),
      ...filteredContracts.map((c) =>
        [
          `"${new Date(c.created).toLocaleString('pt-BR')}"`,
          `"${(c.contract_number || '').replace(/"/g, '""')}"`,
          `"${(c.service_order_number || '').replace(/"/g, '""')}"`,
          `"${(c.client_name || '').replace(/"/g, '""')}"`,
          `"${(c.client_email || '').replace(/"/g, '""')}"`,
          `"${(c.technician_name || '').replace(/"/g, '""')}"`,
          `"${c.questionnaire_status === 'respondido' ? 'Respondido' : 'Pendente'}"`,
        ].join(';'),
      ),
    ]

    const blob = new Blob(['\uFEFF' + csvRows.join('\n')], {
      type: 'text/csv;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute(
      'download',
      `contratos-os-condutiva-${new Date().toISOString().slice(0, 10)}.csv`,
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  // Gate check: only authenticated internal users can view this panel
  if (!isAuthenticated) {
    return (
      <AuthGate
        title="Painel de Contratos e Avaliações CSAT"
        subtitle="Acesso restrito exclusivamente à equipe técnica e comercial da Condutiva Tecnologia. Faça login com seu e-mail corporativo."
        areaLabel="Painel Interno"
      />
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-[#8CC63F] selection:text-slate-950">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-3 group transition hover:opacity-95"
              title="Voltar à página inicial"
            >
              <div className="bg-white/95 rounded-xl p-1.5 shadow-md flex items-center justify-center border border-slate-700/60 group-hover:border-[#8CC63F]/50 group-hover:scale-[1.02] transition-all">
                <img
                  src={logoImg}
                  alt="Condutiva Tecnologia"
                  className="h-8 md:h-9 w-auto object-contain"
                />
              </div>
              <div className="border-l border-slate-800 pl-3">
                <span className="text-sm md:text-base font-black tracking-wider block text-white font-display uppercase leading-tight">
                  Painel de Gestão
                </span>
                <span className="text-[10px] md:text-[11px] text-[#8CC63F] font-mono uppercase tracking-widest block font-semibold">
                  CONDUTIVA TECNOLOGIA
                </span>
              </div>
            </Link>

            {/* Link to Leads Panel */}
            <div className="hidden lg:flex items-center gap-1 ml-3 pl-3 border-l border-slate-800">
              <Link to="/leads">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white hover:bg-slate-800/60 text-xs gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  Leads & Diagnósticos
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Logged user badge */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-950 border border-slate-800/80 px-2.5 py-1 rounded-xl text-xs">
              <div className="w-5 h-5 rounded-full bg-[#8CC63F]/20 text-[#8CC63F] flex items-center justify-center">
                <User className="w-3 h-3" />
              </div>
              <span className="text-slate-300 font-medium truncate max-w-[160px]">
                {user?.name || user?.email}
              </span>
            </div>

            <Link to="/">
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs hidden sm:flex"
              >
                <Home className="w-3.5 h-3.5 mr-1.5" />
                Site Principal
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={() => loadAllData()}
              disabled={loadingContracts || loadingCSAT}
              className="bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 mr-1.5 ${
                  loadingContracts || loadingCSAT ? 'animate-spin' : ''
                }`}
              />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>

            {activeTab === 'contratos' && (
              <Button
                size="sm"
                onClick={handleOpenCreateModal}
                className="bg-[#8CC63F] hover:bg-[#7ab334] text-slate-950 font-bold text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Novo Contrato / OS
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="bg-slate-900 border-slate-700 text-red-400 hover:text-red-300 hover:bg-red-950/30 hover:border-red-900 text-xs ml-1"
              title="Sair do painel restrito"
            >
              <LogOut className="w-3.5 h-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>

        {/* Primary Page Navigation Tabs: Contratos & OS vs Avaliações CSAT */}
        <div className="border-t border-slate-800/90 bg-slate-950/90 px-4">
          <div className="container mx-auto flex items-center gap-2 overflow-x-auto py-2">
            <button
              type="button"
              onClick={() => setActiveTab('contratos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'contratos'
                  ? 'bg-[#8CC63F] text-slate-950 shadow-md shadow-[#8CC63F]/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Contratos & Ordens de Serviço</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === 'contratos'
                    ? 'bg-slate-950 text-[#8CC63F]'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {contracts.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('avaliacoes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'avaliacoes'
                  ? 'bg-[#8CC63F] text-slate-950 shadow-md shadow-[#8CC63F]/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Avaliações CSAT</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === 'avaliacoes'
                    ? 'bg-slate-950 text-[#8CC63F]'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {csatResponses.length}
              </span>
            </button>

            {/* Mobile quick link to leads */}
            <div className="lg:hidden ml-auto">
              <Link to="/leads">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white text-xs gap-1 h-8 px-2"
                >
                  <Users className="w-3.5 h-3.5" />
                  Leads
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        {activeTab === 'avaliacoes' ? (
          /* ABA: Avaliações CSAT */
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1 text-xs font-mono text-[#8CC63F] uppercase tracking-wider">
                <FileCheck2 className="w-4 h-4" />
                <span>Satisfação do Cliente & Qualidade dos Serviços</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Painel de Avaliações CSAT
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-3xl">
                Acompanhamento unificado das avaliações recebidas via formulário completo e
                aplicação rápida. Análise em tempo real de notas de satisfação, NPS médio, resolução
                e comentários abertos dos clientes.
              </p>
            </div>

            <CSATEvaluationsPanel
              responses={csatResponses}
              loading={loadingCSAT}
              onRefresh={() => loadCSATData()}
            />
          </div>
        ) : (
          /* ABA: Contratos & OS */
          <div>
            {/* Title and KPIs */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 text-xs font-mono text-[#8CC63F] uppercase tracking-wider">
                    <FileText className="w-4 h-4" />
                    <span>Gestão Operacional de Serviços</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                    Contratos & Ordens de Serviço
                  </h1>
                  <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                    Controle unificado de contratos, números de OS vinculados ao mesmo cliente,
                    técnico da Condutiva responsável e acompanhamento do questionário de
                    atendimento.
                  </p>
                </div>

                {/* KPI Cards */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#8CC63F]/10 border border-[#8CC63F]/20 flex items-center justify-center text-[#8CC63F]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Total de Contratos</div>
                      <div className="text-xl font-black text-white">{totalCount}</div>
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Respondidos</div>
                      <div className="text-xl font-black text-white">{answeredCount}</div>
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Pendentes</div>
                      <div className="text-xl font-black text-white">{pendingCount}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Controls */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 mb-6 backdrop-blur">
              <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                {/* Search */}
                <div className="relative w-full md:w-96">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    placeholder="Buscar por Contrato, OS, cliente ou técnico..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 text-xs h-10 rounded-xl focus-visible:ring-[#8CC63F]"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter buttons & actions */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                  <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl p-1">
                    <Filter className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1" />
                    <button
                      type="button"
                      onClick={() => setStatusFilter('all')}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                        statusFilter === 'all'
                          ? 'bg-[#8CC63F] text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Todos ({totalCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilter('respondido')}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition flex items-center gap-1 ${
                        statusFilter === 'respondido'
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'text-emerald-400/80 hover:text-emerald-300'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Respondidos ({answeredCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilter('pendente')}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition flex items-center gap-1 ${
                        statusFilter === 'pendente'
                          ? 'bg-amber-600 text-white font-bold'
                          : 'text-amber-400/80 hover:text-amber-300'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      Pendentes ({pendingCount})
                    </button>
                  </div>

                  {/* View Switch Table/Cards */}
                  <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setViewMode('table')}
                      className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
                        viewMode === 'table'
                          ? 'bg-slate-800 text-white font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Tabela
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('cards')}
                      className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
                        viewMode === 'cards'
                          ? 'bg-slate-800 text-white font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Cards
                    </button>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportCSV}
                    className="bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs h-9 rounded-xl"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-[#8CC63F]" />
                    Exportar CSV
                  </Button>
                </div>
              </div>
            </div>

            {/* Content list / table */}
            {loadingContracts ? (
              <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-16 text-center">
                <Loader2 className="w-8 h-8 text-[#8CC63F] animate-spin mx-auto mb-3" />
                <p className="text-sm text-slate-400">
                  Carregando contratos e ordens de serviço...
                </p>
              </div>
            ) : filteredContracts.length === 0 ? (
              <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-12 text-center">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-white">Nenhum contrato encontrado</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  {search || statusFilter !== 'all'
                    ? 'Nenhum resultado corresponde aos critérios de busca ou filtros selecionados.'
                    : 'Ainda não existem contratos cadastrados no sistema.'}
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  {(search || statusFilter !== 'all') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearch('')
                        setStatusFilter('all')
                      }}
                      className="bg-slate-900 border-slate-700 text-xs"
                    >
                      Limpar Filtros
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={handleOpenCreateModal}
                    className="bg-[#8CC63F] hover:bg-[#7ab334] text-slate-950 font-bold text-xs"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                    Cadastrar Primeiro Contrato
                  </Button>
                </div>
              </div>
            ) : viewMode === 'table' ? (
              /* Table View */
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase tracking-wider font-mono text-[11px]">
                        <th className="py-3.5 px-4 font-semibold">Contrato / OS</th>
                        <th className="py-3.5 px-4 font-semibold">Cliente / Empresa</th>
                        <th className="py-3.5 px-4 font-semibold">E-mail do Cliente</th>
                        <th className="py-3.5 px-4 font-semibold">Técnico Condutiva</th>
                        <th className="py-3.5 px-4 font-semibold text-center">
                          Situação do Questionário
                        </th>
                        <th className="py-3.5 px-4 font-semibold">Data</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredContracts.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-800/30 transition-colors group">
                          {/* Contract & OS numbers linked to client */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-bold text-white font-mono text-sm flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#8CC63F]" />
                                {item.contract_number}
                              </span>
                              <span className="text-slate-400 font-mono text-[11px] pl-3.5">
                                OS:{' '}
                                <strong className="text-slate-200">
                                  {item.service_order_number}
                                </strong>
                              </span>
                            </div>
                          </td>

                          {/* Client / Company */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
                              <span className="font-semibold text-slate-200 text-sm">
                                {item.client_name}
                              </span>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="py-3.5 px-4">
                            <a
                              href={`mailto:${item.client_email}`}
                              className="flex items-center gap-1.5 text-slate-400 hover:text-[#8CC63F] transition-colors"
                              title="Enviar e-mail para o cliente"
                            >
                              <Mail className="w-3.5 h-3.5 text-slate-500" />
                              <span className="truncate max-w-[200px]">{item.client_email}</span>
                            </a>
                          </td>

                          {/* Technician */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <UserCheck className="w-3.5 h-3.5 text-[#8CC63F]" />
                              <span>{item.technician_name}</span>
                            </div>
                          </td>

                          {/* Questionnaire status toggle */}
                          <td className="py-3.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={(e) => handleToggleStatus(item, e)}
                              disabled={updatingStatusId === item.id}
                              title="Clique para alternar a situação do questionário"
                              className="inline-flex items-center gap-1.5 group/btn transition-transform hover:scale-105"
                            >
                              {item.questionnaire_status === 'respondido' ? (
                                <Badge className="bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 gap-1 font-semibold text-[11px] py-1 px-2.5 cursor-pointer">
                                  {updatingStatusId === item.id ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <CheckCircle2 className="w-3 h-3" />
                                  )}
                                  Respondido
                                </Badge>
                              ) : (
                                <Badge className="bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 gap-1 font-semibold text-[11px] py-1 px-2.5 cursor-pointer">
                                  {updatingStatusId === item.id ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Clock className="w-3 h-3" />
                                  )}
                                  Pendente
                                </Badge>
                              )}
                            </button>
                          </td>

                          {/* Date */}
                          <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                            {formatDate(item.created)}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => handleOpenEditModal(item, e)}
                                className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
                                title="Editar contrato / OS"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => handleDeleteClick(item, e)}
                                className="h-8 w-8 p-0 text-slate-400 hover:text-red-400 hover:bg-red-950/30"
                                title="Excluir contrato"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 border-t border-slate-800 bg-slate-950/90 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
                  <span>
                    Exibindo <strong className="text-white">{filteredContracts.length}</strong> de{' '}
                    <strong className="text-white">{contracts.length}</strong> contratos registrados
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Dica: clique na situação para alternar rapidamente entre Pendente e Respondido.
                  </span>
                </div>
              </div>
            ) : (
              /* Cards View (Mobile-friendly alternative) */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredContracts.map((item) => (
                  <Card
                    key={item.id}
                    className="bg-slate-950/70 border-slate-800 hover:border-slate-700 transition shadow-lg relative overflow-hidden"
                  >
                    <div
                      className={`h-1.5 w-full ${
                        item.questionnaire_status === 'respondido'
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                      }`}
                    />
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs font-mono text-[#8CC63F] font-bold">
                            {item.contract_number}
                          </div>
                          <div className="text-sm font-semibold text-white mt-0.5">
                            {item.client_name}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleToggleStatus(item, e)}
                          disabled={updatingStatusId === item.id}
                          title="Alternar situação"
                        >
                          {item.questionnaire_status === 'respondido' ? (
                            <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] py-0.5 px-2">
                              Respondido
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] py-0.5 px-2">
                              Pendente
                            </Badge>
                          )}
                        </button>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-300 pt-1 border-t border-slate-800/80">
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Ordem de Serviço:</span>
                          <span className="font-mono font-bold text-white">
                            {item.service_order_number}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Técnico Responsável:</span>
                          <span className="text-slate-200 font-medium">{item.technician_name}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400 truncate">
                          <span>E-mail:</span>
                          <a
                            href={`mailto:${item.client_email}`}
                            className="text-slate-300 hover:text-[#8CC63F] truncate max-w-[170px]"
                          >
                            {item.client_email}
                          </a>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Cadastrado em {formatDate(item.created)}</span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleOpenEditModal(item, e)}
                            className="h-7 px-2 text-slate-300 hover:text-white text-xs"
                          >
                            <Pencil className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDeleteClick(item, e)}
                            className="h-7 px-2 text-red-400 hover:text-red-300 hover:bg-red-950/30 text-xs"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal: Create / Edit Contract */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#8CC63F]" />
              {editingContract ? 'Editar Contrato & OS' : 'Novo Contrato & Ordem de Serviço'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              O número do contrato e da OS estão associados ao mesmo cliente. Preencha os dados
              abaixo.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Contract Number */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                  <span>Nº do Contrato *</span>
                </label>
                <Input
                  placeholder="Ex: CTR-2025-0301"
                  value={formData.contractNumber}
                  onChange={(e) => {
                    setFormData({ ...formData, contractNumber: e.target.value })
                    if (formErrors.contractNumber) {
                      setFormErrors({ ...formErrors, contractNumber: '' })
                    }
                  }}
                  className={`bg-slate-950 border ${
                    formErrors.contractNumber ? 'border-red-500' : 'border-slate-800'
                  } text-white text-xs h-9 rounded-xl font-mono`}
                />
                {formErrors.contractNumber && (
                  <p className="text-[11px] text-red-400">{formErrors.contractNumber}</p>
                )}
              </div>

              {/* Service Order Number */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                  <span>Nº da OS *</span>
                </label>
                <Input
                  placeholder="Ex: OS-9240"
                  value={formData.serviceOrderNumber}
                  onChange={(e) => {
                    setFormData({ ...formData, serviceOrderNumber: e.target.value })
                    if (formErrors.serviceOrderNumber) {
                      setFormErrors({ ...formErrors, serviceOrderNumber: '' })
                    }
                  }}
                  className={`bg-slate-950 border ${
                    formErrors.serviceOrderNumber ? 'border-red-500' : 'border-slate-800'
                  } text-white text-xs h-9 rounded-xl font-mono`}
                />
                {formErrors.serviceOrderNumber && (
                  <p className="text-[11px] text-red-400">{formErrors.serviceOrderNumber}</p>
                )}
              </div>
            </div>

            {/* Client / Company */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Cliente ou Empresa *</label>
              <Input
                placeholder="Ex: Petrobras S.A. (Refinaria Recap)"
                value={formData.clientName}
                onChange={(e) => {
                  setFormData({ ...formData, clientName: e.target.value })
                  if (formErrors.clientName) {
                    setFormErrors({ ...formErrors, clientName: '' })
                  }
                }}
                className={`bg-slate-950 border ${
                  formErrors.clientName ? 'border-red-500' : 'border-slate-800'
                } text-white text-xs h-9 rounded-xl`}
              />
              {formErrors.clientName && (
                <p className="text-[11px] text-red-400">{formErrors.clientName}</p>
              )}
            </div>

            {/* Client Email */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">E-mail do Cliente *</label>
              <Input
                type="email"
                placeholder="Ex: contato.manutencao@empresa.com.br"
                value={formData.clientEmail}
                onChange={(e) => {
                  setFormData({ ...formData, clientEmail: e.target.value })
                  if (formErrors.clientEmail) {
                    setFormErrors({ ...formErrors, clientEmail: '' })
                  }
                }}
                className={`bg-slate-950 border ${
                  formErrors.clientEmail ? 'border-red-500' : 'border-slate-800'
                } text-white text-xs h-9 rounded-xl`}
              />
              {formErrors.clientEmail && (
                <p className="text-[11px] text-red-400">{formErrors.clientEmail}</p>
              )}
            </div>

            {/* Technician & Questionnaire status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  Técnico Condutiva Responsável *
                </label>
                <Input
                  placeholder="Ex: Rafael Albuquerque"
                  value={formData.technicianName}
                  onChange={(e) => {
                    setFormData({ ...formData, technicianName: e.target.value })
                    if (formErrors.technicianName) {
                      setFormErrors({ ...formErrors, technicianName: '' })
                    }
                  }}
                  className={`bg-slate-950 border ${
                    formErrors.technicianName ? 'border-red-500' : 'border-slate-800'
                  } text-white text-xs h-9 rounded-xl`}
                />
                {formErrors.technicianName && (
                  <p className="text-[11px] text-red-400">{formErrors.technicianName}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  Situação do Questionário *
                </label>
                <Select
                  value={formData.questionnaireStatus}
                  onValueChange={(val: QuestionnaireStatus) =>
                    setFormData({ ...formData, questionnaireStatus: val })
                  }
                >
                  <SelectTrigger className="bg-slate-950 border-slate-800 text-white text-xs h-9 rounded-xl">
                    <SelectValue placeholder="Selecione a situação" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white">
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="respondido">Respondido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-3 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsFormOpen(false)}
                className="bg-slate-800 border-slate-700 text-slate-300 hover:text-white text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#8CC63F] hover:bg-[#7ab334] text-slate-950 font-bold text-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Salvando...
                  </>
                ) : editingContract ? (
                  'Salvar Alterações'
                ) : (
                  'Cadastrar Contrato'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!contractToDelete} onOpenChange={(open) => !open && setContractToDelete(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md rounded-2xl shadow-2xl">
          <DialogHeader>
            <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-2">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <DialogTitle className="text-base font-bold text-white">
              Excluir Contrato & OS?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Tem certeza de que deseja remover permanentemente o contrato{' '}
              <strong className="text-white">{contractToDelete?.contract_number}</strong> (OS{' '}
              <strong className="text-white">{contractToDelete?.service_order_number}</strong>) do
              cliente <strong className="text-white">{contractToDelete?.client_name}</strong>? Esta
              ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setContractToDelete(null)}
              disabled={isDeleting}
              className="bg-slate-800 border-slate-700 text-slate-300 hover:text-white text-xs"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Confirmar Exclusão'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
