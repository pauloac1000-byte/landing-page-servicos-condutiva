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
  FileUp,
  Download,
  Calendar,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'
import {
  getContracts,
  createContract,
  updateContract,
  updateContractQuestionnaireStatus,
  deleteContract,
} from '@/services/contracts'
import {
  getOrdensServico,
  getClientesContratos,
  createOrdemServico,
  updateOrdemServico,
  deleteOrdemServico,
  getOrdemServicoFileUrl,
  getOrdemServicoRelatorioUrl,
  findOrdemServicoByNumero,
  uploadArquivoOS,
  uploadRelatorioAtividadesOS,
  removeArquivoOS,
  removeRelatorioAtividadesOS,
} from '@/services/ordensServico'
import { getCSATResponses } from '@/services/csat'
import { useRealtime } from '@/hooks/use-realtime'
import { useAuth } from '@/hooks/use-auth'
import type {
  ContractRecord,
  ContractFormData,
  QuestionnaireStatus,
  CSATResponseRecord,
  OrdemServicoRecord,
  OrdemServicoFormData,
  ClienteRecord,
  StatusOrdemServico,
} from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { OSCSATEvaluationModal } from '@/components/csat/OSCSATEvaluationModal'

export default function ContractsPage() {
  const { user, isAuthenticated, logout } = useAuth()

  // Tabs: 'contratos' (Contratos & Clientes), 'ordens' (Ordens de Serviço) or 'avaliacoes' (Avaliações CSAT)
  const [activeTab, setActiveTab] = useState<'contratos' | 'ordens' | 'avaliacoes'>('contratos')

  // Contracts data state
  const [contracts, setContracts] = useState<ContractRecord[]>([])
  const [loadingContracts, setLoadingContracts] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | QuestionnaireStatus>('all')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')

  // Ordens de Serviço (múltiplas OS por contrato)
  const [ordensServico, setOrdensServico] = useState<OrdemServicoRecord[]>([])
  const [clientesContratos, setClientesContratos] = useState<ClienteRecord[]>([])
  const [loadingOS, setLoadingOS] = useState(true)
  const [osSearch, setOsSearch] = useState('')
  const [osStatusFilter, setOsStatusFilter] = useState<'all' | StatusOrdemServico>('all')
  const [selectedContratoFilter, setSelectedContratoFilter] = useState<string>('all')

  // Modal de OS (criar / editar)
  const [isOSModalOpen, setIsOSModalOpen] = useState(false)
  const [editingOS, setEditingOS] = useState<OrdemServicoRecord | null>(null)
  const [osFormData, setOsFormData] = useState<OrdemServicoFormData>({
    numero_os: '',
    contrato_id: '',
    data: new Date().toISOString().slice(0, 10),
    status: 'aberta',
    situacao_questionario: 'pendente',
    observacoes: '',
    arquivo: null,
    relatorio_arquivo: null,
    descricao_servico: '',
    tecnico_responsavel: '',
    relatorio_pdf_url: '',
  })
  const [osFormErrors, setOsFormErrors] = useState<Record<string, string>>({})
  const [isSubmittingOS, setIsSubmittingOS] = useState(false)
  const [selectedFileName, setSelectedFileName] = useState<string>('')
  const [selectedRelatorioFileName, setSelectedRelatorioFileName] = useState<string>('')
  const [showManualUrlInput, setShowManualUrlInput] = useState(false)

  // Modal de listagem detalhada de OS de um contrato específico
  const [contractForOSModal, setContractForOSModal] = useState<
    ContractRecord | ClienteRecord | null
  >(null)

  // Modal dedicado: Gerenciar anexos da OS (PDF da OS e Relatório)
  const [osForAttachmentsModal, setOsForAttachmentsModal] = useState<OrdemServicoRecord | null>(
    null,
  )
  const [uploadingAttachmentType, setUploadingAttachmentType] = useState<
    'os' | 'relatorio' | 'both' | null
  >(null)
  const [pendingOsPdfFile, setPendingOsPdfFile] = useState<File | null>(null)
  const [pendingRelatorioPdfFile, setPendingRelatorioPdfFile] = useState<File | null>(null)
  const [attachmentErrors, setAttachmentErrors] = useState<{ os?: string; relatorio?: string }>({})

  // Modal de exclusão de OS
  const [osToDelete, setOsToDelete] = useState<OrdemServicoRecord | null>(null)
  const [isDeletingOS, setIsDeletingOS] = useState(false)

  // Modal para detalhar as respostas da avaliação CSAT da OS
  const [viewingEvaluationOS, setViewingEvaluationOS] = useState<OrdemServicoRecord | null>(null)

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

  const loadOSData = async (silent = false) => {
    if (!silent) setLoadingOS(true)
    try {
      const [osData, clientsData] = await Promise.all([getOrdensServico(), getClientesContratos()])
      setOrdensServico(osData)
      setClientesContratos(clientsData)
    } catch (err: unknown) {
      console.error('Error fetching OS data:', err)
    } finally {
      if (!silent) setLoadingOS(false)
    }
  }

  const loadAllData = (silent = false) => {
    loadContractsData(silent)
    loadCSATData(silent)
    loadOSData(silent)
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
      loadOSData(true)
    }
  })

  // Realtime updates on ordens_servico collection
  useRealtime<OrdemServicoRecord>('ordens_servico', () => {
    if (isAuthenticated) {
      loadOSData(true)
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

  // Mapa de OS por número do contrato (ou contrato_id)
  const ordensPorContrato = useMemo(() => {
    const map = new Map<string, OrdemServicoRecord[]>()
    for (const os of ordensServico) {
      // O contrato pode estar no contrato_id ou no expand.contrato_id.numero_contrato
      const contractNum = os.expand?.contrato_id?.numero_contrato || ''
      const clientId = os.contrato_id || ''

      if (contractNum) {
        const list = map.get(contractNum) || []
        list.push(os)
        map.set(contractNum, list)
      }
      if (clientId) {
        const list = map.get(clientId) || []
        list.push(os)
        map.set(clientId, list)
      }
    }
    return map
  }, [ordensServico])

  // Mapa de resposta CSAT por número da OS (para consulta rápida)
  const csatPorOS = useMemo(() => {
    const map = new Map<string, CSATResponseRecord>()
    for (const r of csatResponses) {
      if (r.service_order_number) {
        const clean = r.service_order_number.trim().toLowerCase()
        if (!map.has(clean)) {
          map.set(clean, r)
        }
      }
    }
    return map
  }, [csatResponses])

  // Obter a resposta CSAT correspondente a uma OS
  const getCSATDaOS = (osNumero?: string): CSATResponseRecord | null => {
    if (!osNumero) return null
    return csatPorOS.get(osNumero.trim().toLowerCase()) || null
  }

  // Obter todas as OS vinculadas a um ContractRecord específico
  const getOSDoContrato = (c: ContractRecord): OrdemServicoRecord[] => {
    // Busca pelo número de contrato (ex: CTR-2025-0142)
    const porNumero = ordensPorContrato.get(c.contract_number) || []
    if (porNumero.length > 0) return porNumero

    // Se cliente correspondente tiver ID
    const clienteCorresp = clientesContratos.find(
      (cl) => cl.numero_contrato.toLowerCase() === c.contract_number.toLowerCase(),
    )
    if (clienteCorresp) {
      const porId = ordensPorContrato.get(clienteCorresp.id) || []
      if (porId.length > 0) return porId
    }

    return []
  }

  // Filtered contracts
  const filteredContracts = useMemo(() => {
    return contracts.filter((item) => {
      const q = search.toLowerCase().trim()
      const osDoContrato = getOSDoContrato(item)
      const matchesOSList = osDoContrato.some(
        (os) =>
          os.numero_os.toLowerCase().includes(q) ||
          (os.observacoes && os.observacoes.toLowerCase().includes(q)) ||
          (os.descricao_servico && os.descricao_servico.toLowerCase().includes(q)),
      )

      const matchesSearch =
        !q ||
        item.contract_number.toLowerCase().includes(q) ||
        item.service_order_number.toLowerCase().includes(q) ||
        item.client_name.toLowerCase().includes(q) ||
        item.client_email.toLowerCase().includes(q) ||
        item.technician_name.toLowerCase().includes(q) ||
        matchesOSList

      const matchesStatus = statusFilter === 'all' || item.questionnaire_status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [contracts, search, statusFilter, ordensPorContrato, clientesContratos])

  // Stats
  const totalCount = contracts.length
  const pendingCount = contracts.filter((c) => c.questionnaire_status === 'pendente').length
  const answeredCount = contracts.filter((c) => c.questionnaire_status === 'respondido').length
  const totalOSCount = ordensServico.length

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
      errors.technicianName = 'Responsável Condutiva é obrigatório.'
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
        setIsFormOpen(false)
        toast({
          title: 'Contrato atualizado',
          description: `Os dados do contrato ${updated.contract_number} foram salvos com sucesso.`,
        })
      } else {
        const created = await createContract(formData)
        setContracts((prev) => [created, ...prev])
        // Atualiza a lista de clientes para vincular OS imediatamente
        loadOSData(true)
        setIsFormOpen(false)
        toast({
          title: 'Contrato cadastrado com sucesso',
          description: `Contrato ${created.contract_number} cadastrado. Deseja criar uma OS agora?`,
          action: (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleOpenCreateOSModal(created)}
              className="bg-[#8CC63F] text-slate-950 hover:bg-[#7ab334] font-bold text-xs h-8 border-none"
            >
              Criar Nova OS
            </Button>
          ),
        })
      }
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

  // Listener de tecla ESC para logout imediato quando nenhum modal secundário estiver aberto
  useEffect(() => {
    if (!isAuthenticated) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Se houver algum modal aberto, fecha o modal primeiro
        if (
          isFormOpen ||
          contractToDelete ||
          isOSModalOpen ||
          contractForOSModal ||
          osForAttachmentsModal ||
          osToDelete ||
          viewingEvaluationOS
        ) {
          return
        }
        // Se nenhum modal estiver ativo, ESC encerra a sessão na área autenticada
        handleLogout()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    isAuthenticated,
    isFormOpen,
    contractToDelete,
    isOSModalOpen,
    contractForOSModal,
    osForAttachmentsModal,
    osToDelete,
    viewingEvaluationOS,
  ])

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

  // =================== GESTÃO DE MÚLTIPLAS ORDENS DE SERVIÇO ===================
  const handleOpenCreateOSModal = (targetContrato?: ContractRecord | ClienteRecord) => {
    setEditingOS(null)
    setSelectedFileName('')

    // Determinar o contrato_id inicial
    let initialContratoId = ''
    if (targetContrato) {
      if ('numero_contrato' in targetContrato) {
        initialContratoId = targetContrato.id
      } else {
        const found = clientesContratos.find(
          (cl) => cl.numero_contrato.toLowerCase() === targetContrato.contract_number.toLowerCase(),
        )
        if (found) initialContratoId = found.id
      }
    } else if (clientesContratos.length > 0) {
      initialContratoId = clientesContratos[0].id
    }

    setSelectedFileName('')
    setSelectedRelatorioFileName('')
    setShowManualUrlInput(false)
    setOsFormData({
      numero_os: '',
      contrato_id: initialContratoId,
      data: new Date().toISOString().slice(0, 10),
      status: 'aberta',
      situacao_questionario: 'pendente',
      observacoes: '',
      arquivo: null,
      relatorio_arquivo: null,
      descricao_servico: '',
      tecnico_responsavel: '',
      relatorio_pdf_url: '',
    })
    setOsFormErrors({})
    setIsOSModalOpen(true)
  }

  const handleOpenEditOSModal = (os: OrdemServicoRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setEditingOS(os)
    setSelectedFileName(os.arquivo ? 'Arquivo PDF da OS já anexado' : '')
    setSelectedRelatorioFileName(
      os.relatorio_arquivo
        ? 'Relatório PDF já anexado no sistema'
        : os.relatorio_pdf_url?.trim()
          ? 'Relatório configurado via link externo'
          : '',
    )
    setShowManualUrlInput(Boolean(!os.relatorio_arquivo && os.relatorio_pdf_url?.trim()))
    setOsFormData({
      numero_os: os.numero_os,
      contrato_id: os.contrato_id,
      data: os.data ? os.data.slice(0, 10) : new Date().toISOString().slice(0, 10),
      status: os.status || 'aberta',
      situacao_questionario:
        os.situacao_questionario || (os.avaliacao_realizada ? 'respondido' : 'pendente'),
      observacoes: os.observacoes || '',
      arquivo: null,
      relatorio_arquivo: null,
      descricao_servico: os.descricao_servico || '',
      tecnico_responsavel: os.tecnico_responsavel || '',
      relatorio_pdf_url: os.relatorio_pdf_url || '',
    })
    setOsFormErrors({})
    setIsOSModalOpen(true)
  }

  // Abrir o modal dedicado "Gerenciar anexos"
  const handleOpenAttachmentsModal = (os: OrdemServicoRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setOsForAttachmentsModal(os)
    setPendingOsPdfFile(null)
    setPendingRelatorioPdfFile(null)
    setAttachmentErrors({})
  }

  // Salvar anexos selecionados no modal "Gerenciar anexos"
  const handleSaveAttachmentsFromModal = async () => {
    if (!osForAttachmentsModal) return
    if (!pendingOsPdfFile && !pendingRelatorioPdfFile) {
      toast({
        title: 'Nenhum novo anexo selecionado',
        description: 'Selecione um arquivo PDF para OS ou Relatório antes de salvar.',
      })
      return
    }

    setUploadingAttachmentType('both')
    try {
      let currentOS = osForAttachmentsModal

      // Upload do arquivo da OS
      if (pendingOsPdfFile) {
        const res = await uploadArquivoOS(currentOS.id, pendingOsPdfFile)
        currentOS = res.record
      }

      // Upload do relatório de atividades
      if (pendingRelatorioPdfFile) {
        const res = await uploadRelatorioAtividadesOS(currentOS.id, pendingRelatorioPdfFile)
        currentOS = res.record
      }

      // Atualiza a lista local
      setOrdensServico((prev) => prev.map((o) => (o.id === currentOS.id ? currentOS : o)))
      setOsForAttachmentsModal(currentOS)
      setPendingOsPdfFile(null)
      setPendingRelatorioPdfFile(null)

      toast({
        title: 'Anexos atualizados com sucesso',
        description: `Os arquivos PDF da OS ${currentOS.numero_os} foram salvos no Skip Cloud.`,
      })
    } catch (err: unknown) {
      console.error('Error uploading attachments:', err)
      toast({
        title: 'Erro ao salvar anexos',
        description: 'Não foi possível salvar os arquivos PDF no Skip Cloud. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setUploadingAttachmentType(null)
    }
  }

  // Remover anexo específico no modal Gerenciar anexos
  const handleRemoveAttachment = async (type: 'os' | 'relatorio') => {
    if (!osForAttachmentsModal) return
    const isOs = type === 'os'
    setUploadingAttachmentType(isOs ? 'os' : 'relatorio')
    try {
      const updated = isOs
        ? await removeArquivoOS(osForAttachmentsModal.id)
        : await removeRelatorioAtividadesOS(osForAttachmentsModal.id)

      setOrdensServico((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
      setOsForAttachmentsModal(updated)
      if (isOs) setPendingOsPdfFile(null)
      else setPendingRelatorioPdfFile(null)

      toast({
        title: isOs ? 'Documento da OS removido' : 'Relatório removido',
        description: `O arquivo PDF foi desvinculado da OS ${updated.numero_os}.`,
      })
    } catch (err: unknown) {
      console.error('Error removing attachment:', err)
      toast({
        title: 'Erro ao remover anexo',
        description: 'Não foi possível excluir o arquivo no Skip Cloud.',
        variant: 'destructive',
      })
    } finally {
      setUploadingAttachmentType(null)
    }
  }

  const validateOSForm = async (): Promise<boolean> => {
    const errors: Record<string, string> = {}
    if (!osFormData.numero_os.trim()) {
      errors.numero_os = 'Número da OS é obrigatório.'
    } else {
      // Verificar unicidade da OS (não pode duplicar número de OS)
      const existing = await findOrdemServicoByNumero(osFormData.numero_os.trim())
      if (existing && (!editingOS || existing.id !== editingOS.id)) {
        errors.numero_os = 'Já existe uma OS cadastrada com este número.'
      }
    }

    if (!osFormData.contrato_id) {
      errors.contrato_id = 'Selecione o contrato correspondente.'
    }

    if (!osFormData.data) {
      errors.data = 'Data da OS é obrigatória.'
    }

    if (!osFormData.status) {
      errors.status = 'Selecione o status da OS (aberta ou executada).'
    }

    if (!osFormData.situacao_questionario) {
      errors.situacao_questionario =
        'Selecione a situação do questionário (pendente ou respondido).'
    }

    // Validação de arquivo da OS (se fornecido, deve ser PDF)
    if (osFormData.arquivo) {
      const isPdf =
        osFormData.arquivo.type === 'application/pdf' ||
        osFormData.arquivo.name.toLowerCase().endsWith('.pdf')
      if (!isPdf) {
        errors.arquivo = 'O arquivo da OS deve ser obrigatoriamente um documento PDF (.pdf).'
      } else if (osFormData.arquivo.size > 15 * 1024 * 1024) {
        errors.arquivo = 'O tamanho máximo do PDF da OS é 15 MB.'
      }
    }

    // Validação de arquivo do Relatório de Atividades (se fornecido, deve ser PDF)
    if (osFormData.relatorio_arquivo) {
      const isPdf =
        osFormData.relatorio_arquivo.type === 'application/pdf' ||
        osFormData.relatorio_arquivo.name.toLowerCase().endsWith('.pdf')
      if (!isPdf) {
        errors.relatorio_arquivo =
          'O Relatório de Atividades deve ser obrigatoriamente um documento PDF (.pdf).'
      } else if (osFormData.relatorio_arquivo.size > 15 * 1024 * 1024) {
        errors.relatorio_arquivo = 'O tamanho máximo do PDF do relatório é 15 MB.'
      }
    }

    setOsFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmitOSForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingOS(true)
    try {
      const isValid = await validateOSForm()
      if (!isValid) {
        setIsSubmittingOS(false)
        return
      }

      if (editingOS) {
        const updated = await updateOrdemServico(editingOS.id, osFormData)
        setOrdensServico((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
        toast({
          title: 'Ordem de Serviço atualizada',
          description: `A OS ${updated.numero_os} foi atualizada com sucesso.`,
        })
      } else {
        const created = await createOrdemServico(osFormData)
        setOrdensServico((prev) => [created, ...prev])
        toast({
          title: 'Ordem de Serviço cadastrada',
          description: `A OS ${created.numero_os} foi vinculada ao contrato com sucesso.`,
        })
      }
      setIsOSModalOpen(false)
    } catch (err: unknown) {
      console.error('Error saving OS:', err)
      toast({
        title: 'Erro ao salvar OS',
        description: 'Verifique se os dados estão corretos e tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmittingOS(false)
    }
  }

  const handleDeleteOSClick = (os: OrdemServicoRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setOsToDelete(os)
  }

  const handleConfirmDeleteOS = async () => {
    if (!osToDelete) return
    setIsDeletingOS(true)
    const target = osToDelete
    try {
      await deleteOrdemServico(target.id)
      setOrdensServico((prev) => prev.filter((o) => o.id !== target.id))
      setOsToDelete(null)
      toast({
        title: 'OS excluída',
        description: `A OS ${target.numero_os} foi removida com sucesso.`,
      })
    } catch (err: unknown) {
      console.error('Error deleting OS:', err)
      toast({
        title: 'Erro ao excluir OS',
        description: 'Não foi possível remover a Ordem de Serviço.',
        variant: 'destructive',
      })
    } finally {
      setIsDeletingOS(false)
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
    <div
      onClick={(e) => {
        // Se o clique ocorreu no backdrop/área externa do container principal (fora do card de conteúdo e fora do header),
        // e nenhum modal estiver aberto, aciona logout automático por "clique fora".
        const target = e.target as HTMLElement
        if (target === e.currentTarget || target.dataset?.backdropLogout === 'true') {
          handleLogout()
        }
      }}
      className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-[#8CC63F] selection:text-slate-950"
    >
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
                Novo Contrato
              </Button>
            )}

            {activeTab === 'ordens' && (
              <Button
                size="sm"
                onClick={() => handleOpenCreateOSModal()}
                className="bg-[#8CC63F] hover:bg-[#7ab334] text-slate-950 font-bold text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Nova OS
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

        {/* Primary Page Navigation Tabs: Contratos & Clientes | Ordens de Serviço & Anexos | Avaliações CSAT */}
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
              <span>Contratos & Clientes</span>
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
              onClick={() => setActiveTab('ordens')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'ordens'
                  ? 'bg-[#8CC63F] text-slate-950 shadow-md shadow-[#8CC63F]/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Ordens de Serviço (OS)</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === 'ordens'
                    ? 'bg-slate-950 text-[#8CC63F]'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {ordensServico.length}
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
        ) : activeTab === 'ordens' ? (
          /* ABA DEDICADA: Ordens de Serviço & Gerenciamento de Anexos */
          <div>
            {/* Cabeçalho da Aba de Ordens de Serviço */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 text-xs font-mono text-[#8CC63F] uppercase tracking-wider">
                    <Layers className="w-4 h-4" />
                    <span>Gestão Operacional de Ordens de Serviço & Anexos</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                    Ordens de Serviço (OS) & Anexos
                  </h1>
                  <p className="text-sm text-slate-400 mt-1 max-w-3xl">
                    Envie, visualize e substitua o documento da <strong>OS (PDF)</strong> e o{' '}
                    <strong>Relatório da atividade (PDF)</strong> com armazenamento no Skip Cloud.
                    Cada arquivo enviado fica disponível para o cliente correspondente na Área do
                    Cliente.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#8CC63F]/10 border border-[#8CC63F]/20 flex items-center justify-center text-[#8CC63F]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">OS com PDF</div>
                      <div className="text-xl font-black text-white">
                        {ordensServico.filter((o) => Boolean(o.arquivo)).length}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Com Relatório</div>
                      <div className="text-xl font-black text-white">
                        {
                          ordensServico.filter((o) =>
                            Boolean(o.relatorio_arquivo || o.relatorio_pdf_url?.trim()),
                          ).length
                        }
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleOpenCreateOSModal()}
                    className="bg-[#8CC63F] hover:bg-[#7ab334] text-slate-950 font-bold text-xs h-12 px-4 rounded-xl shadow-lg shadow-[#8CC63F]/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Nova OS
                  </Button>
                </div>
              </div>
            </div>

            {/* Tabela de Ordens de Serviço com coluna de Anexos e CTA Gerenciar anexos */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#8CC63F] font-bold uppercase tracking-wider">
                    Listagem de Ordens de Serviço
                  </span>
                  <Badge className="bg-slate-900 text-slate-300 border border-slate-800 text-[10px]">
                    {ordensServico.length} registradas
                  </Badge>
                </div>
                <span className="text-xs text-slate-400">
                  Gerencie ambos os PDFs (OS e Relatório) por aqui sem depender do painel externo.
                </span>
              </div>

              {ordensServico.length === 0 ? (
                <div className="p-16 text-center">
                  <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-white">Nenhuma OS encontrada</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    Ainda não existem Ordens de Serviço cadastradas. Clique em Nova OS para começar.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => handleOpenCreateOSModal()}
                    className="mt-4 bg-[#8CC63F] hover:bg-[#7ab334] text-slate-950 font-bold text-xs"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Cadastrar Primeira OS
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase tracking-wider font-mono text-[11px]">
                        <th className="py-3.5 px-4 font-semibold">Ordem de Serviço (OS)</th>
                        <th className="py-3.5 px-4 font-semibold">Contrato Vinculado</th>
                        <th className="py-3.5 px-4 font-semibold">Técnico / Data</th>
                        <th className="py-3.5 px-4 font-semibold">Status</th>
                        <th className="py-3.5 px-4 font-semibold">Anexos</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Gerenciar anexos</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {ordensServico.map((os) => {
                        const fileUrl = getOrdemServicoFileUrl(os)
                        const relUrl = getOrdemServicoRelatorioUrl(os)
                        const csatResp = getCSATDaOS(os.numero_os)
                        const isAvaliada = Boolean(os.avaliacao_realizada || csatResp)

                        return (
                          <tr key={os.id} className="hover:bg-slate-800/30 transition-colors">
                            {/* Número da OS */}
                            <td className="py-3.5 px-4">
                              <div className="flex flex-col gap-0.5">
                                <span className="font-mono font-bold text-white text-sm">
                                  {os.numero_os}
                                </span>
                                {os.descricao_servico && (
                                  <span className="text-slate-400 text-[11px] truncate max-w-[240px]">
                                    {os.descricao_servico}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Contrato / Cliente */}
                            <td className="py-3.5 px-4">
                              <div className="flex flex-col gap-0.5">
                                <span className="font-mono text-xs text-[#8CC63F] font-semibold">
                                  {os.expand?.contrato_id?.numero_contrato || '—'}
                                </span>
                                <span className="text-slate-300 font-medium text-xs truncate max-w-[200px]">
                                  {os.expand?.contrato_id?.nome_cliente || '—'}
                                </span>
                              </div>
                            </td>

                            {/* Técnico e Data */}
                            <td className="py-3.5 px-4">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-slate-200 font-medium">
                                  {os.tecnico_responsavel || '—'}
                                </span>
                                <span className="text-slate-400 font-mono text-[11px]">
                                  {os.data ? new Date(os.data).toLocaleDateString('pt-BR') : '—'}
                                </span>
                              </div>
                            </td>

                            {/* Status e Avaliação */}
                            <td className="py-3.5 px-4">
                              <div className="flex flex-col gap-1 items-start">
                                {os.status === 'executada' ? (
                                  <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] py-0.5 px-2">
                                    Executada
                                  </Badge>
                                ) : (
                                  <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] py-0.5 px-2">
                                    Aberta
                                  </Badge>
                                )}

                                {os.situacao_questionario === 'respondido' || isAvaliada ? (
                                  <span className="text-[10px] text-emerald-400 font-mono inline-flex items-center gap-1">
                                    <CheckCircle2 className="w-2.5 h-2.5" />
                                    Questionário Respondido
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-500 font-mono inline-flex items-center gap-1">
                                    <Clock className="w-2.5 h-2.5" />
                                    Questionário Pendente
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Coluna Anexos: badges com link de download/visualização e status de cada PDF */}
                            <td className="py-3.5 px-4">
                              <div className="flex flex-col gap-1.5">
                                {/* Anexo 1: OS (PDF) */}
                                <div className="flex items-center gap-1.5">
                                  {fileUrl ? (
                                    <a
                                      href={fileUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-[#8CC63F]/15 border border-[#8CC63F]/40 text-[#8CC63F] hover:bg-[#8CC63F]/25 font-medium transition"
                                      title="Abrir/Visualizar documento da OS (PDF)"
                                    >
                                      <FileText className="w-3 h-3" />
                                      <span>OS (PDF)</span>
                                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                                    </a>
                                  ) : (
                                    <Badge className="bg-slate-900 border border-slate-800 text-slate-500 text-[10px] py-0.5 px-1.5 font-mono">
                                      Sem OS (PDF)
                                    </Badge>
                                  )}
                                </div>

                                {/* Anexo 2: Relatório da atividade (PDF) */}
                                <div className="flex items-center gap-1.5">
                                  {relUrl ? (
                                    <a
                                      href={relUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-sky-500/15 border border-sky-500/40 text-sky-400 hover:bg-sky-500/25 font-medium transition"
                                      title="Abrir/Visualizar Relatório da atividade (PDF)"
                                    >
                                      <FileText className="w-3 h-3" />
                                      <span>Relatório (PDF)</span>
                                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                                    </a>
                                  ) : (
                                    <Badge className="bg-slate-900 border border-slate-800 text-slate-500 text-[10px] py-0.5 px-1.5 font-mono">
                                      Sem Relatório
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Coluna Ações / Gerenciar anexos */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => handleOpenAttachmentsModal(os, e)}
                                  className="h-8 px-2.5 text-xs font-semibold gap-1.5 bg-[#8CC63F]/10 border-[#8CC63F]/30 text-[#8CC63F] hover:bg-[#8CC63F]/20 cursor-pointer"
                                  title="Enviar, visualizar ou substituir arquivos PDF da OS"
                                >
                                  <FileUp className="w-3.5 h-3.5" />
                                  <span>Gerenciar anexos</span>
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenEditOSModal(os)}
                                  className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
                                  title="Editar OS"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => handleDeleteOSClick(os, e)}
                                  className="h-8 w-8 p-0 text-slate-400 hover:text-red-400 hover:bg-red-950/30"
                                  title="Excluir OS"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
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
                    Controle unificado de contratos, múltiplas Ordens de Serviço (OS) vinculadas ao
                    mesmo contrato, upload de laudos em PDF e acompanhamento em tempo real.
                  </p>
                </div>

                {/* KPI Cards */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#8CC63F]/10 border border-[#8CC63F]/20 flex items-center justify-center text-[#8CC63F]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Contratos</div>
                      <div className="text-xl font-black text-white">{totalCount}</div>
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Total de OS</div>
                      <div className="text-xl font-black text-white">{totalOSCount}</div>
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

                  <Button
                    size="sm"
                    onClick={() => handleOpenCreateOSModal()}
                    className="bg-[#8CC63F] hover:bg-[#7ab334] text-slate-950 font-bold text-xs h-12 px-4 rounded-xl shadow-lg shadow-[#8CC63F]/20 flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Nova OS
                  </Button>
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
                        <th className="py-3.5 px-4 font-semibold">Contrato</th>
                        <th className="py-3.5 px-4 font-semibold">OS Vinculadas</th>
                        <th className="py-3.5 px-4 font-semibold">Cliente / Empresa</th>
                        <th className="py-3.5 px-4 font-semibold">E-mail do Cliente</th>
                        <th className="py-3.5 px-4 font-semibold">Responsável Condutiva</th>
                        <th className="py-3.5 px-4 font-semibold">Data</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredContracts.map((item) => {
                        const osList = getOSDoContrato(item)
                        return (
                          <tr
                            key={item.id}
                            className="hover:bg-slate-800/30 transition-colors group"
                          >
                            {/* Contract number */}
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-white font-mono text-sm flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#8CC63F]" />
                                {item.contract_number}
                              </span>
                            </td>

                            {/* OS Vinculadas Badge */}
                            <td className="py-3.5 px-4">
                              <Badge className="bg-[#8CC63F]/15 text-[#8CC63F] border border-[#8CC63F]/30 font-mono text-xs font-semibold py-0.5 px-2.5">
                                {osList.length} OS
                              </Badge>
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

                            {/* Technician / Responsável Condutiva */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5 text-slate-300">
                                <UserCheck className="w-3.5 h-3.5 text-[#8CC63F]" />
                                <span>{item.technician_name}</span>
                              </div>
                            </td>

                            {/* Date */}
                            <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                              {formatDate(item.created)}
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setContractForOSModal(item)
                                  }}
                                  className="h-8 px-2.5 bg-slate-900 border-slate-700 text-[#8CC63F] hover:bg-[#8CC63F]/10 hover:border-[#8CC63F]/50 text-xs font-semibold gap-1.5"
                                  title="Ver todas as OS deste contrato"
                                >
                                  <Layers className="w-3.5 h-3.5" />
                                  <span>Ver OS</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => handleOpenEditModal(item, e)}
                                  className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
                                  title="Editar contrato"
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
                        )
                      })}
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
                        <div className="space-y-1 text-slate-400">
                          <div className="flex items-center justify-between">
                            <span>Ordens de Serviço:</span>
                            {(() => {
                              const osList = getOSDoContrato(item)
                              return (
                                <button
                                  type="button"
                                  onClick={() => setContractForOSModal(item)}
                                  className="font-mono font-bold text-[#8CC63F] hover:underline flex items-center gap-1"
                                >
                                  <span>
                                    {osList.length > 0
                                      ? `${osList.length} OS cadastradas`
                                      : item.service_order_number}
                                  </span>
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              )
                            })()}
                          </div>

                          {/* Chips de OS com indicador visual de avaliação */}
                          {(() => {
                            const osList = getOSDoContrato(item)
                            if (osList.length === 0) return null
                            return (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {osList.slice(0, 3).map((os) => {
                                  const csatResp = getCSATDaOS(os.numero_os)
                                  const isAvaliada = Boolean(os.avaliacao_realizada || csatResp)
                                  return (
                                    <button
                                      key={os.id}
                                      type="button"
                                      onClick={() => setViewingEvaluationOS(os)}
                                      title={`OS ${os.numero_os} - Avaliação: ${
                                        isAvaliada ? 'Respondida' : 'Não respondida'
                                      }`}
                                      className={`inline-flex items-center gap-1 font-mono text-[9px] px-1.5 py-0.5 rounded border transition ${
                                        isAvaliada
                                          ? 'bg-emerald-950/70 border-emerald-600/60 text-emerald-300'
                                          : 'bg-slate-900 border-slate-700 text-slate-400'
                                      }`}
                                    >
                                      <span
                                        className={`w-1.5 h-1.5 rounded-full ${
                                          isAvaliada ? 'bg-emerald-400' : 'bg-slate-500'
                                        }`}
                                      />
                                      <span>{os.numero_os}</span>
                                    </button>
                                  )
                                })}
                                {osList.length > 3 && (
                                  <span className="text-[9px] text-slate-500 font-mono self-center">
                                    +{osList.length - 3}
                                  </span>
                                )}
                              </div>
                            )
                          })()}
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
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenCreateOSModal(item)}
                            className="h-7 px-2 bg-slate-900 border-slate-700 text-[#8CC63F] hover:bg-[#8CC63F]/10 text-xs font-semibold gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            OS
                          </Button>
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
        <DialogContent
          onPointerDownOutside={() => handleLogout()}
          onEscapeKeyDown={() => handleLogout()}
          className="bg-slate-900 border-slate-800 text-white max-w-lg rounded-2xl shadow-2xl"
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#8CC63F]" />
              {editingContract ? 'Editar Contrato' : 'Novo Contrato'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Cadastre as informações do contrato e do cliente. As Ordens de Serviço (OS) podem ser
              adicionadas posteriormente.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-4 pt-2">
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

            {/* Responsável Condutiva */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Responsável Condutiva *</label>
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
                    Salvando Contrato...
                  </>
                ) : (
                  'Salvar Contrato'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!contractToDelete} onOpenChange={(open) => !open && setContractToDelete(null)}>
        <DialogContent
          onPointerDownOutside={() => handleLogout()}
          onEscapeKeyDown={() => handleLogout()}
          className="bg-slate-900 border-slate-800 text-white max-w-md rounded-2xl shadow-2xl"
        >
          <DialogHeader>
            <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-2">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <DialogTitle className="text-base font-bold text-white">Excluir Contrato?</DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Tem certeza de que deseja remover permanentemente o contrato{' '}
              <strong className="text-white">{contractToDelete?.contract_number}</strong> do cliente{' '}
              <strong className="text-white">{contractToDelete?.client_name}</strong>? Esta ação não
              pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          {/* Aviso âmbar se houver OS vinculadas a este contrato */}
          {(() => {
            if (!contractToDelete) return null
            const osVinculadas = getOSDoContrato(contractToDelete)
            if (osVinculadas.length === 0) return null

            return (
              <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-3 rounded-xl flex items-start gap-2.5 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-amber-200">
                    Atenção: este contrato possui {osVinculadas.length}{' '}
                    {osVinculadas.length === 1 ? 'OS vinculada' : 'OS vinculadas'}.
                  </p>
                  <p className="text-[11px] text-amber-300/90 leading-relaxed">
                    Excluir o contrato deixará essas Ordens de Serviço sem vínculo direto ou poderá
                    afetar o acesso do cliente na área restrita. Verifique antes de prosseguir.
                  </p>
                </div>
              </div>
            )
          })()}

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

      {/* ================= MODAL: CADASTRO / EDIÇÃO DE ORDEM DE SERVIÇO (OS) ================= */}
      <Dialog open={isOSModalOpen} onOpenChange={setIsOSModalOpen}>
        <DialogContent
          onPointerDownOutside={() => handleLogout()}
          onEscapeKeyDown={() => handleLogout()}
          className="bg-slate-900 border-slate-800 text-white max-w-lg rounded-2xl shadow-2xl"
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#8CC63F]" />
              {editingOS ? 'Editar Ordem de Serviço (OS)' : 'Cadastrar Nova Ordem de Serviço (OS)'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Cadastre e vincule múltiplas Ordens de Serviço a um contrato existente, com data,
              status e upload de arquivo PDF.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitOSForm} className="space-y-4 pt-2">
            {/* Contrato * (Dropdown obrigatório no topo) */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Contrato *</label>
              {clientesContratos.length === 0 ? (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-xl text-xs space-y-1">
                  <p className="font-semibold text-amber-200 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Nenhum contrato cadastrado
                  </p>
                  <p className="text-[11px] text-amber-300/80">
                    Cadastre um contrato primeiro antes de criar uma Ordem de Serviço.
                  </p>
                </div>
              ) : (
                <Select
                  value={osFormData.contrato_id}
                  onValueChange={(val) => {
                    setOsFormData({ ...osFormData, contrato_id: val })
                    if (osFormErrors.contrato_id) {
                      setOsFormErrors({ ...osFormErrors, contrato_id: '' })
                    }
                  }}
                >
                  <SelectTrigger
                    className={`bg-slate-950 border ${
                      osFormErrors.contrato_id ? 'border-red-500' : 'border-slate-800'
                    } text-white text-xs h-9 rounded-xl`}
                  >
                    <SelectValue placeholder="Selecione o contrato..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white max-h-56">
                    {clientesContratos.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.numero_contrato} — {cliente.nome_cliente}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {osFormErrors.contrato_id && (
                <p className="text-[11px] text-red-400">{osFormErrors.contrato_id}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Número da OS */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Número da OS *</label>
                <Input
                  placeholder="Ex: OS-2025-089"
                  value={osFormData.numero_os}
                  onChange={(e) => {
                    setOsFormData({ ...osFormData, numero_os: e.target.value })
                    if (osFormErrors.numero_os) {
                      setOsFormErrors({ ...osFormErrors, numero_os: '' })
                    }
                  }}
                  className={`bg-slate-950 border ${
                    osFormErrors.numero_os ? 'border-red-500' : 'border-slate-800'
                  } text-white text-xs h-9 rounded-xl font-mono`}
                />
                {osFormErrors.numero_os && (
                  <p className="text-[11px] text-red-400">{osFormErrors.numero_os}</p>
                )}
              </div>

              {/* Data da OS */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Data da OS *</label>
                <div className="relative">
                  <Input
                    type="date"
                    value={osFormData.data || ''}
                    onChange={(e) => {
                      setOsFormData({ ...osFormData, data: e.target.value })
                      if (osFormErrors.data) {
                        setOsFormErrors({ ...osFormErrors, data: '' })
                      }
                    }}
                    className={`bg-slate-950 border ${
                      osFormErrors.data ? 'border-red-500' : 'border-slate-800'
                    } text-white text-xs h-9 rounded-xl`}
                  />
                </div>
                {osFormErrors.data && (
                  <p className="text-[11px] text-red-400">{osFormErrors.data}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Status da OS */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Status da OS *</label>
                <Select
                  value={osFormData.status}
                  onValueChange={(val: StatusOrdemServico) =>
                    setOsFormData({ ...osFormData, status: val })
                  }
                >
                  <SelectTrigger className="bg-slate-950 border-slate-800 text-white text-xs h-9 rounded-xl">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white">
                    <SelectItem value="aberta">Aberta</SelectItem>
                    <SelectItem value="executada">Executada</SelectItem>
                  </SelectContent>
                </Select>
                {osFormErrors.status && (
                  <p className="text-[11px] text-red-400">{osFormErrors.status}</p>
                )}
              </div>

              {/* Situação do Questionário * */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  Situação do Questionário *
                </label>
                <Select
                  value={osFormData.situacao_questionario || 'pendente'}
                  onValueChange={(val: QuestionnaireStatus) =>
                    setOsFormData({ ...osFormData, situacao_questionario: val })
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
                {osFormErrors.situacao_questionario && (
                  <p className="text-[11px] text-red-400">{osFormErrors.situacao_questionario}</p>
                )}
              </div>
            </div>

            {/* Técnico Responsável */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Técnico Responsável</label>
              <Input
                placeholder="Ex: Rafael Albuquerque"
                value={osFormData.tecnico_responsavel || ''}
                onChange={(e) =>
                  setOsFormData({ ...osFormData, tecnico_responsavel: e.target.value })
                }
                className="bg-slate-950 border-slate-800 text-white text-xs h-9 rounded-xl"
              />
            </div>

            {/* Descrição do Serviço */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Descrição do Serviço</label>
              <Input
                placeholder="Ex: Manutenção preventiva semestral em transformadores a seco"
                value={osFormData.descricao_servico || ''}
                onChange={(e) =>
                  setOsFormData({ ...osFormData, descricao_servico: e.target.value })
                }
                className="bg-slate-950 border-slate-800 text-white text-xs h-9 rounded-xl"
              />
            </div>

            {/* Anexos da OS: OS (PDF) e Relatório da atividade (PDF) lado a lado com ícones e indicador */}
            <div className="space-y-2 pt-1 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5 uppercase font-mono tracking-wider">
                  <FileText className="w-3.5 h-3.5 text-[#8CC63F]" />
                  <span>Anexos em PDF (Armazenamento Skip Cloud)</span>
                </span>
                <span className="text-[10px] text-slate-500">Apenas arquivos .pdf</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. OS (PDF) */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#8CC63F]" />
                        <span>OS (PDF)</span>
                      </label>

                      {editingOS?.arquivo && (
                        <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[9px] py-0 px-1.5 gap-0.5 font-mono">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Carregado
                        </Badge>
                      )}
                    </div>

                    {/* Botão / Link para visualizar arquivo já enviado */}
                    {editingOS?.arquivo && !osFormData.arquivo && (
                      <div className="pt-0.5">
                        <a
                          href={getOrdemServicoFileUrl(editingOS) || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-[#8CC63F] hover:underline inline-flex items-center gap-1 font-medium bg-[#8CC63F]/10 px-2 py-0.5 rounded transition"
                          title="Abrir o PDF atual da OS"
                        >
                          <Download className="w-3 h-3" />
                          Visualizar PDF atual
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </a>
                      </div>
                    )}

                    {/* Input file */}
                    <div className="border border-dashed border-slate-700 hover:border-[#8CC63F]/60 rounded-lg p-2.5 bg-slate-900/60 transition mt-1.5">
                      <input
                        type="file"
                        id="os-pdf-upload"
                        accept=".pdf,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null
                          if (!file) return

                          const isPdf =
                            file.type === 'application/pdf' ||
                            file.name.toLowerCase().endsWith('.pdf')

                          if (!isPdf) {
                            setOsFormErrors({
                              ...osFormErrors,
                              arquivo:
                                'O arquivo da OS deve ser obrigatoriamente um documento PDF (.pdf).',
                            })
                            return
                          }

                          if (file.size > 10 * 1024 * 1024) {
                            setOsFormErrors({
                              ...osFormErrors,
                              arquivo: 'O tamanho máximo do PDF da OS é 10 MB.',
                            })
                            return
                          }

                          setOsFormData({ ...osFormData, arquivo: file })
                          setSelectedFileName(file.name)
                          if (osFormErrors.arquivo) {
                            setOsFormErrors({ ...osFormErrors, arquivo: '' })
                          }
                        }}
                        className="hidden"
                      />
                      <label
                        htmlFor="os-pdf-upload"
                        className="cursor-pointer block text-xs text-slate-300 hover:text-white truncate font-medium"
                      >
                        {osFormData.arquivo ? (
                          <span className="text-[#8CC63F] font-mono flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 shrink-0" />
                            {osFormData.arquivo.name}
                          </span>
                        ) : editingOS?.arquivo ? (
                          'Substituir PDF da OS...'
                        ) : (
                          'Selecionar OS (PDF)...'
                        )}
                      </label>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {osFormData.arquivo
                          ? `${(osFormData.arquivo.size / (1024 * 1024)).toFixed(2)} MB • Pronto para salvar`
                          : 'Máx. 10 MB (.pdf)'}
                      </p>
                    </div>

                    {osFormData.arquivo && (
                      <button
                        type="button"
                        onClick={() => {
                          setOsFormData({ ...osFormData, arquivo: null })
                          setSelectedFileName(
                            editingOS?.arquivo ? 'Arquivo PDF da OS já anexado' : '',
                          )
                        }}
                        className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        Desfazer seleção
                      </button>
                    )}
                  </div>

                  {osFormErrors.arquivo && (
                    <p className="text-[11px] text-red-400 mt-1">{osFormErrors.arquivo}</p>
                  )}
                </div>

                {/* 2. Relatório da atividade (PDF) */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-sky-400" />
                        <span>Relatório da atividade (PDF)</span>
                      </label>

                      {(editingOS?.relatorio_arquivo || editingOS?.relatorio_pdf_url?.trim()) && (
                        <Badge className="bg-sky-500/15 text-sky-400 border border-sky-500/30 text-[9px] py-0 px-1.5 gap-0.5 font-mono">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Carregado
                        </Badge>
                      )}
                    </div>

                    {/* Visualizar relatório atual */}
                    {(() => {
                      const currentRelatorioUrl =
                        (editingOS && getOrdemServicoRelatorioUrl(editingOS)) ||
                        (osFormData.relatorio_pdf_url?.trim()
                          ? osFormData.relatorio_pdf_url.trim()
                          : null)

                      if (currentRelatorioUrl && !osFormData.relatorio_arquivo) {
                        return (
                          <div className="pt-0.5">
                            <a
                              href={currentRelatorioUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-sky-400 hover:underline inline-flex items-center gap-1 font-medium bg-sky-500/10 px-2 py-0.5 rounded transition"
                              title="Abrir o relatório de atividades em nova aba"
                            >
                              <Download className="w-3 h-3" />
                              Visualizar relatório atual
                              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </a>
                          </div>
                        )
                      }
                      return null
                    })()}

                    {/* Input file */}
                    <div className="border border-dashed border-slate-700 hover:border-sky-500/60 rounded-lg p-2.5 bg-slate-900/60 transition mt-1.5">
                      <input
                        type="file"
                        id="relatorio-pdf-upload"
                        accept=".pdf,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null
                          if (!file) return

                          const isPdf =
                            file.type === 'application/pdf' ||
                            file.name.toLowerCase().endsWith('.pdf')

                          if (!isPdf) {
                            setOsFormErrors({
                              ...osFormErrors,
                              relatorio_arquivo:
                                'O Relatório de Atividades deve ser obrigatoriamente um documento PDF (.pdf).',
                            })
                            return
                          }

                          if (file.size > 15 * 1024 * 1024) {
                            setOsFormErrors({
                              ...osFormErrors,
                              relatorio_arquivo: 'O tamanho máximo do relatório em PDF é de 15 MB.',
                            })
                            return
                          }

                          setOsFormData({
                            ...osFormData,
                            relatorio_arquivo: file,
                            relatorio_pdf_url: '',
                          })
                          setSelectedRelatorioFileName(file.name)
                          if (osFormErrors.relatorio_arquivo) {
                            setOsFormErrors({ ...osFormErrors, relatorio_arquivo: '' })
                          }
                        }}
                        className="hidden"
                      />
                      <label
                        htmlFor="relatorio-pdf-upload"
                        className="cursor-pointer block text-xs text-slate-300 hover:text-white truncate font-medium"
                      >
                        {osFormData.relatorio_arquivo ? (
                          <span className="text-sky-400 font-mono flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 shrink-0" />
                            {osFormData.relatorio_arquivo.name}
                          </span>
                        ) : editingOS?.relatorio_arquivo || editingOS?.relatorio_pdf_url ? (
                          'Substituir Relatório (PDF)...'
                        ) : (
                          'Selecionar Relatório da atividade (PDF)...'
                        )}
                      </label>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {osFormData.relatorio_arquivo
                          ? `${(osFormData.relatorio_arquivo.size / (1024 * 1024)).toFixed(2)} MB • Pronto para salvar`
                          : 'Máx. 15 MB (.pdf)'}
                      </p>
                    </div>

                    {osFormData.relatorio_arquivo && (
                      <button
                        type="button"
                        onClick={() => {
                          setOsFormData({
                            ...osFormData,
                            relatorio_arquivo: null,
                            relatorio_pdf_url: editingOS?.relatorio_pdf_url || '',
                          })
                          setSelectedRelatorioFileName(
                            editingOS?.relatorio_arquivo
                              ? 'Relatório PDF já anexado no sistema'
                              : editingOS?.relatorio_pdf_url?.trim()
                                ? 'Relatório configurado via link externo'
                                : '',
                          )
                        }}
                        className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        Desfazer seleção
                      </button>
                    )}
                  </div>

                  {osFormErrors.relatorio_arquivo && (
                    <p className="text-[11px] text-red-400 mt-1">
                      {osFormErrors.relatorio_arquivo}
                    </p>
                  )}

                  {/* Opção manual para link externo */}
                  <div className="pt-1.5">
                    <button
                      type="button"
                      onClick={() => setShowManualUrlInput(!showManualUrlInput)}
                      className="text-[10px] text-slate-400 hover:text-sky-400 underline underline-offset-2 transition"
                    >
                      {showManualUrlInput ? '▲ Ocultar link manual' : '▼ Link manual (opcional)'}
                    </button>

                    {showManualUrlInput && (
                      <div className="mt-1.5 space-y-1">
                        <Input
                          placeholder="https://exemplo.com/relatorio.pdf"
                          value={osFormData.relatorio_pdf_url || ''}
                          onChange={(e) =>
                            setOsFormData({ ...osFormData, relatorio_pdf_url: e.target.value })
                          }
                          className="bg-slate-900 border-slate-800 text-white text-xs h-7 rounded-lg font-mono"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Observações */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Observações</label>
              <Textarea
                placeholder="Anotações internas, escopo executado, pendências ou observações para o cliente..."
                value={osFormData.observacoes || ''}
                onChange={(e) => setOsFormData({ ...osFormData, observacoes: e.target.value })}
                rows={3}
                className="bg-slate-950 border-slate-800 text-white text-xs rounded-xl resize-none"
              />
            </div>

            {/* Se estiver editando uma OS existente, exibir o status da avaliação e atalho para ver as respostas */}
            {editingOS && (
              <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Avaliação do Questionário desta OS
                  </span>
                  <div className="flex items-center gap-2">
                    {editingOS.avaliacao_realizada || getCSATDaOS(editingOS.numero_os) ? (
                      <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold py-0.5 px-2 gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Respondida
                      </Badge>
                    ) : (
                      <Badge className="bg-slate-800 text-slate-400 border border-slate-700 text-xs py-0.5 px-2 gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Não respondida
                      </Badge>
                    )}
                    {getCSATDaOS(editingOS.numero_os)?.nps_score !== undefined && (
                      <span className="text-xs text-slate-300 font-mono">
                        Nota NPS:{' '}
                        <strong className="text-[#8CC63F]">
                          {getCSATDaOS(editingOS.numero_os)?.nps_score}/10
                        </strong>
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setViewingEvaluationOS(editingOS)}
                  className="bg-slate-900 border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 text-xs font-semibold gap-1.5"
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-[#8CC63F]" />
                  <span>
                    {editingOS.avaliacao_realizada || getCSATDaOS(editingOS.numero_os)
                      ? 'Ver Respostas'
                      : 'Ver Detalhes'}
                  </span>
                </Button>
              </div>
            )}

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsOSModalOpen(false)}
                className="bg-slate-800 border-slate-700 text-slate-300 hover:text-white text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingOS || !osFormData.contrato_id}
                className="bg-[#8CC63F] hover:bg-[#7ab334] text-slate-950 font-bold text-xs cursor-pointer shadow-md shadow-[#8CC63F]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingOS ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Salvando OS...
                  </>
                ) : (
                  'Salvar OS'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: LISTAGEM DE TODAS AS OS DO CONTRATO ================= */}
      <Dialog
        open={Boolean(contractForOSModal)}
        onOpenChange={(open) => !open && setContractForOSModal(null)}
      >
        <DialogContent
          onPointerDownOutside={() => handleLogout()}
          onEscapeKeyDown={() => handleLogout()}
          className="bg-slate-900 border-slate-800 text-white max-w-3xl rounded-2xl shadow-2xl max-h-[85vh] flex flex-col"
        >
          <DialogHeader className="pb-3 border-b border-slate-800">
            {' '}
            <div className="flex items-center justify-between gap-4">
              <div>
                <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#8CC63F]" />
                  <span>Ordens de Serviço do Contrato</span>
                  <Badge className="bg-[#8CC63F]/20 text-[#8CC63F] border border-[#8CC63F]/30 font-mono text-xs">
                    {contractForOSModal
                      ? 'contract_number' in contractForOSModal
                        ? contractForOSModal.contract_number
                        : contractForOSModal.numero_contrato
                      : ''}
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-400 mt-1">
                  Cliente:{' '}
                  <strong className="text-white">
                    {contractForOSModal
                      ? 'client_name' in contractForOSModal
                        ? contractForOSModal.client_name
                        : contractForOSModal.nome_cliente
                      : ''}
                  </strong>{' '}
                  — Todas as OS cadastradas e vinculadas a este contrato.
                </DialogDescription>
              </div>

              <Button
                size="sm"
                onClick={() => {
                  if (contractForOSModal) {
                    handleOpenCreateOSModal(contractForOSModal)
                  }
                }}
                className="bg-[#8CC63F] hover:bg-[#7ab334] text-slate-950 font-bold text-xs shrink-0"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Nova OS
              </Button>
            </div>
          </DialogHeader>

          {/* Listagem das OS do contrato selecionado */}
          <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
            {(() => {
              if (!contractForOSModal) return null
              const contractNum =
                'contract_number' in contractForOSModal
                  ? contractForOSModal.contract_number
                  : contractForOSModal.numero_contrato

              // Filtrar todas as OS vinculadas
              const osList = ordensServico.filter((os) => {
                const matchNum =
                  os.expand?.contrato_id?.numero_contrato?.toLowerCase() ===
                  contractNum.toLowerCase()
                const matchId = os.contrato_id === contractForOSModal.id
                return matchNum || matchId
              })

              if (osList.length === 0) {
                return (
                  <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
                    <Layers className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                    <h4 className="text-sm font-semibold text-white">Nenhuma OS cadastrada</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      Este contrato ainda não possui Ordens de Serviço cadastradas no banco de
                      dados.
                    </p>
                    <Button
                      size="sm"
                      onClick={() => handleOpenCreateOSModal(contractForOSModal)}
                      className="mt-4 bg-[#8CC63F] hover:bg-[#7ab334] text-slate-950 font-bold text-xs"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Cadastrar Primeira OS
                    </Button>
                  </div>
                )
              }

              return (
                <div className="space-y-2.5">
                  {osList.map((os) => {
                    const fileUrl = getOrdemServicoFileUrl(os)
                    return (
                      <div
                        key={os.id}
                        className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 transition flex flex-col md:flex-row md:items-center justify-between gap-3"
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono font-bold text-white text-sm">
                              {os.numero_os}
                            </span>

                            {/* Badge Status */}
                            {os.status === 'executada' ? (
                              <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] py-0.5 px-2">
                                Executada
                              </Badge>
                            ) : (
                              <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] py-0.5 px-2">
                                Aberta
                              </Badge>
                            )}

                            {/* Indicador visual e Status da Avaliação CSAT */}
                            {(() => {
                              const csatResp = getCSATDaOS(os.numero_os)
                              const isAvaliada = Boolean(os.avaliacao_realizada || csatResp)

                              if (isAvaliada) {
                                return (
                                  <button
                                    type="button"
                                    onClick={() => setViewingEvaluationOS(os)}
                                    title="Visualizar as respostas completas do questionário desta OS"
                                    className="inline-flex items-center gap-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold py-0.5 px-2.5 rounded-full transition cursor-pointer group"
                                  >
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    <span>Respondida</span>
                                    {csatResp && (
                                      <span className="text-[9px] font-mono opacity-80 pl-0.5 border-l border-emerald-500/30 ml-0.5">
                                        NPS {csatResp.nps_score}
                                      </span>
                                    )}
                                  </button>
                                )
                              }

                              return (
                                <button
                                  type="button"
                                  onClick={() => setViewingEvaluationOS(os)}
                                  title="OS aguardando avaliação do cliente — clique para verificar status"
                                  className="inline-flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/80 text-[10px] py-0.5 px-2.5 rounded-full transition cursor-pointer"
                                >
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span>Não respondida</span>
                                </button>
                              )
                            })()}

                            {/* Data */}
                            {os.data && (
                              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 ml-auto md:ml-0">
                                <Calendar className="w-3 h-3 text-slate-500" />
                                {new Date(os.data).toLocaleDateString('pt-BR')}
                              </span>
                            )}
                          </div>

                          {/* Descrição e Técnico */}
                          {(os.descricao_servico || os.tecnico_responsavel) && (
                            <p className="text-xs text-slate-300">
                              {os.descricao_servico && <span>{os.descricao_servico}</span>}
                              {os.tecnico_responsavel && (
                                <span className="text-slate-400 ml-2">
                                  — Técnico:{' '}
                                  <strong className="text-slate-200">
                                    {os.tecnico_responsavel}
                                  </strong>
                                </span>
                              )}
                            </p>
                          )}

                          {/* Observações */}
                          {os.observacoes && (
                            <div className="text-[11px] text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800/80">
                              <span className="font-medium text-slate-300">Observações: </span>
                              {os.observacoes}
                            </div>
                          )}
                        </div>

                        {/* Indicadores de Anexos da OS (PDF OS e Relatório) */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* Badge OS PDF */}
                            {fileUrl ? (
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-[#8CC63F]/10 border border-[#8CC63F]/30 text-[#8CC63F] hover:bg-[#8CC63F]/20 transition font-medium"
                                title="Visualizar documento da OS (PDF) em nova aba"
                              >
                                <FileText className="w-3 h-3" />
                                <span>OS (PDF)</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                              </a>
                            ) : (
                              <Badge className="bg-slate-900 border border-slate-800 text-slate-500 text-[10px] py-0.5 px-2 font-normal">
                                Sem PDF da OS
                              </Badge>
                            )}

                            {/* Badge Relatório PDF */}
                            {(() => {
                              const relUrl = getOrdemServicoRelatorioUrl(os)
                              if (relUrl) {
                                return (
                                  <a
                                    href={relUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 transition font-medium"
                                    title="Visualizar relatório da atividade (PDF) em nova aba"
                                  >
                                    <FileText className="w-3 h-3" />
                                    <span>Relatório (PDF)</span>
                                    <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                                  </a>
                                )
                              }
                              return (
                                <Badge className="bg-slate-900 border border-slate-800 text-slate-500 text-[10px] py-0.5 px-2 font-normal">
                                  Sem Relatório
                                </Badge>
                              )
                            })()}
                          </div>
                        </div>

                        {/* Ações da OS */}
                        <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                          {/* CTA dedicado: Gerenciar anexos */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => handleOpenAttachmentsModal(os, e)}
                            className="h-8 px-2.5 text-xs font-semibold gap-1.5 bg-[#8CC63F]/10 border-[#8CC63F]/30 text-[#8CC63F] hover:bg-[#8CC63F]/20 transition"
                            title="Gerenciar anexos: enviar, visualizar e substituir PDFs no Skip Cloud"
                          >
                            <FileUp className="w-3.5 h-3.5" />
                            <span>Gerenciar anexos</span>
                          </Button>

                          {/* Botão para visualizar respostas do questionário da OS */}
                          {(() => {
                            const csatResp = getCSATDaOS(os.numero_os)
                            const isAvaliada = Boolean(os.avaliacao_realizada || csatResp)
                            return (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setViewingEvaluationOS(os)}
                                className={`h-8 px-2.5 text-xs font-semibold gap-1 transition ${
                                  isAvaliada
                                    ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/50 hover:text-emerald-200'
                                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                                title={
                                  isAvaliada
                                    ? 'Ver respostas completas da avaliação'
                                    : 'Ver status da avaliação da OS'
                                }
                              >
                                <FileCheck2 className="w-3.5 h-3.5" />
                                <span>{isAvaliada ? 'Ver Respostas' : 'Avaliação'}</span>
                              </Button>
                            )
                          })()}

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditOSModal(os)}
                            className="h-8 px-2 text-slate-400 hover:text-white hover:bg-slate-800 text-xs"
                            title="Editar esta OS"
                          >
                            <Pencil className="w-3.5 h-3.5 mr-1" />
                            Editar
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDeleteOSClick(os, e)}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-red-400 hover:bg-red-950/30"
                            title="Excluir OS"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })()}
          </div>

          <DialogFooter className="pt-3 border-t border-slate-800 flex justify-between items-center sm:justify-between">
            <span className="text-xs text-slate-500">
              Cada OS possui sua própria credencial de avaliação CSAT para o cliente.
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setContractForOSModal(null)}
              className="bg-slate-800 border-slate-700 text-slate-300 hover:text-white text-xs"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: CONFIRMAÇÃO DE EXCLUSÃO DE OS ================= */}
      <Dialog open={!!osToDelete} onOpenChange={(open) => !open && setOsToDelete(null)}>
        <DialogContent
          onPointerDownOutside={() => handleLogout()}
          onEscapeKeyDown={() => handleLogout()}
          className="bg-slate-900 border-slate-800 text-white max-w-md rounded-2xl shadow-2xl"
        >
          <DialogHeader>
            <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-2">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <DialogTitle className="text-base font-bold text-white">
              Excluir Ordem de Serviço?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Tem certeza de que deseja excluir permanentemente a Ordem de Serviço{' '}
              <strong className="text-white">{osToDelete?.numero_os}</strong>? O arquivo PDF
              associado também será removido. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOsToDelete(null)}
              disabled={isDeletingOS}
              className="bg-slate-800 border-slate-700 text-slate-300 hover:text-white text-xs"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmDeleteOS}
              disabled={isDeletingOS}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
            >
              {isDeletingOS ? (
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

      {/* ================= MODAL DEDICADO: GERENCIAR ANEXOS ================= */}
      <Dialog
        open={Boolean(osForAttachmentsModal)}
        onOpenChange={(open) => {
          if (!open) {
            setOsForAttachmentsModal(null)
            setPendingOsPdfFile(null)
            setPendingRelatorioPdfFile(null)
            setAttachmentErrors({})
          }
        }}
      >
        <DialogContent
          onPointerDownOutside={() => handleLogout()}
          onEscapeKeyDown={() => handleLogout()}
          className="bg-slate-900 border-slate-800 text-white max-w-2xl rounded-2xl shadow-2xl"
        >
          <DialogHeader className="pb-3 border-b border-slate-800">
            {' '}
            <div className="flex items-center gap-2 text-xs font-mono text-[#8CC63F] uppercase tracking-wider">
              <FileUp className="w-4 h-4" />
              <span>Armazenamento Skip Cloud</span>
            </div>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <span>Gerenciar anexos</span>
              <Badge className="bg-[#8CC63F]/20 text-[#8CC63F] border border-[#8CC63F]/30 font-mono text-xs">
                {osForAttachmentsModal?.numero_os}
              </Badge>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Contrato:{' '}
              <strong className="text-slate-200">
                {osForAttachmentsModal?.expand?.contrato_id?.numero_contrato || '—'}
              </strong>{' '}
              • Cliente:{' '}
              <strong className="text-slate-200">
                {osForAttachmentsModal?.expand?.contrato_id?.nome_cliente || '—'}
              </strong>
              . Envie, visualize ou substitua os arquivos PDF desta Ordem de Serviço.
            </DialogDescription>
          </DialogHeader>

          {osForAttachmentsModal && (
            <div className="py-3 space-y-4">
              {/* Grid com os dois arquivos lado a lado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. OS (PDF) */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5 uppercase font-mono">
                        <FileText className="w-4 h-4 text-[#8CC63F]" />
                        <span>OS (PDF)</span>
                      </span>

                      {osForAttachmentsModal.arquivo ? (
                        <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] py-0.5 px-2 gap-1 font-mono">
                          <CheckCircle2 className="w-3 h-3" />
                          Carregado
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-800 text-slate-400 border border-slate-700 text-[10px] py-0.5 px-2">
                          Pendente
                        </Badge>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 mb-3">
                      Documento da Ordem de Serviço emitida para a atividade técnica (máx. 10 MB,
                      apenas PDF).
                    </p>

                    {/* Arquivo atual */}
                    {osForAttachmentsModal.arquivo ? (
                      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 mb-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded bg-[#8CC63F]/15 text-[#8CC63F] flex items-center justify-center shrink-0">
                            <FileText className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-white font-medium truncate">
                              Documento da OS anexado
                            </p>
                            <p className="text-[10px] text-slate-400 truncate font-mono">
                              {osForAttachmentsModal.arquivo}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <a
                            href={getOrdemServicoFileUrl(osForAttachmentsModal) || '#'}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-[#8CC63F] hover:bg-[#8CC63F]/15 rounded transition"
                            title="Visualizar OS (PDF)"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment('os')}
                            disabled={uploadingAttachmentType === 'os'}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded transition"
                            title="Remover arquivo do Skip Cloud"
                          >
                            {uploadingAttachmentType === 'os' ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-lg p-2.5 mb-3 text-center">
                        <p className="text-[11px] text-slate-500 italic">
                          Nenhum documento de OS enviado até o momento.
                        </p>
                      </div>
                    )}

                    {/* Seleção de novo arquivo / substituição */}
                    <div className="border border-dashed border-slate-700 hover:border-[#8CC63F]/60 rounded-xl p-3 bg-slate-900/50 transition">
                      <input
                        type="file"
                        id="modal-os-pdf-input"
                        accept=".pdf,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null
                          if (!file) return

                          const isPdf =
                            file.type === 'application/pdf' ||
                            file.name.toLowerCase().endsWith('.pdf')

                          if (!isPdf) {
                            setAttachmentErrors((prev) => ({
                              ...prev,
                              os: 'O arquivo selecionado deve ser um documento PDF (.pdf).',
                            }))
                            return
                          }

                          if (file.size > 10 * 1024 * 1024) {
                            setAttachmentErrors((prev) => ({
                              ...prev,
                              os: 'O tamanho máximo da OS em PDF é 10 MB.',
                            }))
                            return
                          }

                          setPendingOsPdfFile(file)
                          setAttachmentErrors((prev) => ({ ...prev, os: undefined }))
                        }}
                        className="hidden"
                      />
                      <label
                        htmlFor="modal-os-pdf-input"
                        className="cursor-pointer flex flex-col items-center justify-center text-center gap-1"
                      >
                        <FileUp className="w-5 h-5 text-[#8CC63F]" />
                        <span className="text-xs font-semibold text-slate-200 hover:text-white">
                          {pendingOsPdfFile
                            ? pendingOsPdfFile.name
                            : osForAttachmentsModal.arquivo
                              ? 'Selecionar novo PDF para substituir'
                              : 'Selecionar PDF da OS'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {pendingOsPdfFile
                            ? `${(pendingOsPdfFile.size / (1024 * 1024)).toFixed(2)} MB • Pronto para salvar`
                            : 'Máx. 10 MB (.pdf)'}
                        </span>
                      </label>

                      {pendingOsPdfFile && (
                        <div className="mt-2 text-center">
                          <button
                            type="button"
                            onClick={() => setPendingOsPdfFile(null)}
                            className="text-[10px] text-red-400 hover:text-red-300 underline"
                          >
                            Cancelar seleção
                          </button>
                        </div>
                      )}
                    </div>

                    {attachmentErrors.os && (
                      <p className="text-[11px] text-red-400 mt-1">{attachmentErrors.os}</p>
                    )}
                  </div>
                </div>

                {/* 2. Relatório da atividade (PDF) */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5 uppercase font-mono">
                        <FileText className="w-4 h-4 text-sky-400" />
                        <span>Relatório da atividade (PDF)</span>
                      </span>

                      {osForAttachmentsModal.relatorio_arquivo ||
                      osForAttachmentsModal.relatorio_pdf_url?.trim() ? (
                        <Badge className="bg-sky-500/15 text-sky-400 border border-sky-500/30 text-[10px] py-0.5 px-2 gap-1 font-mono">
                          <CheckCircle2 className="w-3 h-3" />
                          Carregado
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-800 text-slate-400 border border-slate-700 text-[10px] py-0.5 px-2">
                          Pendente
                        </Badge>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 mb-3">
                      Relatório técnico da atividade realizada emitido para o cliente (máx. 15 MB,
                      apenas PDF).
                    </p>

                    {/* Arquivo atual */}
                    {osForAttachmentsModal.relatorio_arquivo ||
                    osForAttachmentsModal.relatorio_pdf_url?.trim() ? (
                      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 mb-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0">
                            <FileText className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-white font-medium truncate">
                              Relatório de atividades anexado
                            </p>
                            <p className="text-[10px] text-slate-400 truncate font-mono">
                              {osForAttachmentsModal.relatorio_arquivo ||
                                osForAttachmentsModal.relatorio_pdf_url}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {(() => {
                            const relUrl = getOrdemServicoRelatorioUrl(osForAttachmentsModal)
                            if (!relUrl) return null
                            return (
                              <a
                                href={relUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 text-sky-400 hover:bg-sky-500/15 rounded transition"
                                title="Visualizar Relatório da atividade (PDF)"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )
                          })()}
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment('relatorio')}
                            disabled={uploadingAttachmentType === 'relatorio'}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded transition"
                            title="Remover relatório do Skip Cloud"
                          >
                            {uploadingAttachmentType === 'relatorio' ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-lg p-2.5 mb-3 text-center">
                        <p className="text-[11px] text-slate-500 italic">
                          Nenhum relatório de atividade enviado até o momento.
                        </p>
                      </div>
                    )}

                    {/* Seleção de novo arquivo / substituição */}
                    <div className="border border-dashed border-slate-700 hover:border-sky-500/60 rounded-xl p-3 bg-slate-900/50 transition">
                      <input
                        type="file"
                        id="modal-relatorio-pdf-input"
                        accept=".pdf,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null
                          if (!file) return

                          const isPdf =
                            file.type === 'application/pdf' ||
                            file.name.toLowerCase().endsWith('.pdf')

                          if (!isPdf) {
                            setAttachmentErrors((prev) => ({
                              ...prev,
                              relatorio: 'O arquivo selecionado deve ser um documento PDF (.pdf).',
                            }))
                            return
                          }

                          if (file.size > 15 * 1024 * 1024) {
                            setAttachmentErrors((prev) => ({
                              ...prev,
                              relatorio: 'O tamanho máximo do relatório em PDF é 15 MB.',
                            }))
                            return
                          }

                          setPendingRelatorioPdfFile(file)
                          setAttachmentErrors((prev) => ({ ...prev, relatorio: undefined }))
                        }}
                        className="hidden"
                      />
                      <label
                        htmlFor="modal-relatorio-pdf-input"
                        className="cursor-pointer flex flex-col items-center justify-center text-center gap-1"
                      >
                        <FileUp className="w-5 h-5 text-sky-400" />
                        <span className="text-xs font-semibold text-slate-200 hover:text-white">
                          {pendingRelatorioPdfFile
                            ? pendingRelatorioPdfFile.name
                            : osForAttachmentsModal.relatorio_arquivo ||
                                osForAttachmentsModal.relatorio_pdf_url
                              ? 'Selecionar novo PDF para substituir'
                              : 'Selecionar Relatório da atividade (PDF)'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {pendingRelatorioPdfFile
                            ? `${(pendingRelatorioPdfFile.size / (1024 * 1024)).toFixed(2)} MB • Pronto para salvar`
                            : 'Máx. 15 MB (.pdf)'}
                        </span>
                      </label>

                      {pendingRelatorioPdfFile && (
                        <div className="mt-2 text-center">
                          <button
                            type="button"
                            onClick={() => setPendingRelatorioPdfFile(null)}
                            className="text-[10px] text-red-400 hover:text-red-300 underline"
                          >
                            Cancelar seleção
                          </button>
                        </div>
                      )}
                    </div>

                    {attachmentErrors.relatorio && (
                      <p className="text-[11px] text-red-400 mt-1">{attachmentErrors.relatorio}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Informação sobre sincronização com a Área do Cliente */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8CC63F] shrink-0 mt-0.5" />
                <span>
                  Os arquivos enviados ficam salvos no storage seguro do Skip Cloud e são
                  disponibilizados automaticamente para o cliente correspondente na Área do Cliente
                  (conforme o plano contratado).
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="pt-3 border-t border-slate-800 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setOsForAttachmentsModal(null)
                setPendingOsPdfFile(null)
                setPendingRelatorioPdfFile(null)
              }}
              className="bg-slate-800 border-slate-700 text-slate-300 hover:text-white text-xs"
            >
              Fechar
            </Button>

            <Button
              type="button"
              onClick={handleSaveAttachmentsFromModal}
              disabled={
                uploadingAttachmentType === 'both' ||
                (!pendingOsPdfFile && !pendingRelatorioPdfFile)
              }
              className="bg-[#8CC63F] hover:bg-[#7ab334] text-slate-950 font-bold text-xs cursor-pointer shadow-md shadow-[#8CC63F]/20"
            >
              {uploadingAttachmentType === 'both' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Salvando anexos no Skip Cloud...
                </>
              ) : (
                'Salvar anexos da OS'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: DETALHES DAS RESPOSTAS DO QUESTIONÁRIO DA OS ================= */}
      {viewingEvaluationOS && (
        <OSCSATEvaluationModal
          open={!!viewingEvaluationOS}
          onOpenChange={(open) => {
            if (!open) setViewingEvaluationOS(null)
          }}
          os={viewingEvaluationOS}
          response={getCSATDaOS(viewingEvaluationOS.numero_os)}
          contractNumber={
            (contractForOSModal
              ? 'contract_number' in contractForOSModal
                ? contractForOSModal.contract_number
                : contractForOSModal.numero_contrato
              : undefined) || viewingEvaluationOS.expand?.contrato_id?.numero_contrato
          }
          clientName={
            (contractForOSModal
              ? 'client_name' in contractForOSModal
                ? contractForOSModal.client_name
                : contractForOSModal.nome_cliente
              : undefined) || viewingEvaluationOS.expand?.contrato_id?.nome_cliente
          }
          onGoToCSATTab={() => {
            setViewingEvaluationOS(null)
            setContractForOSModal(null)
            setIsOSModalOpen(false)
            setActiveTab('avaliacoes')
          }}
        />
      )}
    </div>
  )
}
