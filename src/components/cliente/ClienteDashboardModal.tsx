import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Star,
  BookOpen,
  User,
  LogOut,
  ShieldAlert,
  Download,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Search,
  ArrowRight,
  Lock,
  ChevronLeft,
  FileCheck,
  Building2,
  Loader2,
  ExternalLink,
  MessageCircle,
  Mail,
  Phone,
  FileText,
  FileCode,
  FileCheck2,
  FileSpreadsheet,
  Filter,
  FileDown,
} from 'lucide-react'
import { useClienteAuth } from '@/contexts/ClienteAuthContext'
import { COMPANY_INFO } from '@/data/mockData'
import {
  MENSAGEM_NEGACAO_SENTINELA,
  MENSAGEM_OS_NAO_ENCONTRADA,
  temAcessoDocumentacaoTecnica,
  validarOSParaAvaliacao,
  atualizarSenhaCliente,
  conferirSenhaCliente,
  listarDocumentosTecnicos,
} from '@/services/clienteArea'
import { submitCSATResponse } from '@/services/csat'
import { getOrdensServicoByContratoId, getOrdemServicoFileUrl } from '@/services/ordensServico'
import type {
  DocumentoTecnicoRecord,
  OrdemServicoRecord,
  ContractRecord,
  CSATFormVersion,
  CSATResponseRecord,
  CSATSubmissionData,
} from '@/types'
import { CSATOptionSelector } from '@/components/csat/CSATOptionSelector'
import { CSATFullForm } from '@/components/csat/CSATFullForm'
import { CSATShortForm } from '@/components/csat/CSATShortForm'
import { CSATSuccessScreen } from '@/components/csat/CSATSuccessScreen'

interface ClienteDashboardModalProps {
  isOpen: boolean
  onClose: () => void
}

type AvaliacaoSubStep = 'input_os' | 'select_option' | 'form_full' | 'form_short' | 'success'

type DashboardView = 'home' | 'avaliacao' | 'documentos' | 'minha_conta'

export function ClienteDashboardModal({ isOpen, onClose }: ClienteDashboardModalProps) {
  const { cliente, clearSession, refreshCliente } = useClienteAuth()

  const [currentView, setCurrentView] = useState<DashboardView>('home')

  // Documentos
  const [docs, setDocs] = useState<DocumentoTecnicoRecord[]>([])
  const [isLoadingDocs, setIsLoadingDocs] = useState(false)
  const [docsLoadError, setDocsLoadError] = useState<string | null>(null)
  const [selectedTipo, setSelectedTipo] = useState<string>('todos')
  const [searchDoc, setSearchDoc] = useState('')

  // Avaliação CSAT dentro da Área do Cliente
  const [numeroOS, setNumeroOS] = useState('')
  const [osSearchError, setOsSearchError] = useState<string | null>(null)
  const [isSearchingOS, setIsSearchingOS] = useState(false)
  const [validatedOS, setValidatedOS] = useState<OrdemServicoRecord | null>(null)
  const [validatedContract, setValidatedContract] = useState<ContractRecord | null>(null)
  const [avaliacaoStep, setAvaliacaoStep] = useState<AvaliacaoSubStep>('input_os')
  const [isSubmittingCSAT, setIsSubmittingCSAT] = useState(false)
  const [submittedResponse, setSubmittedResponse] = useState<CSATResponseRecord | null>(null)

  // Mensagem de bloqueio do plano Sentinela
  const [showUpgradeAlert, setShowUpgradeAlert] = useState(false)

  // Minha Conta - Alteração de senha
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmNovaSenha, setConfirmNovaSenha] = useState('')
  const [showSenhas, setShowSenhas] = useState(false)
  const [contaError, setContaError] = useState<string | null>(null)
  const [contaSuccess, setContaSuccess] = useState<string | null>(null)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Ordens de Serviço do Contrato
  const [ordensServico, setOrdensServico] = useState<OrdemServicoRecord[]>([])
  const [isLoadingOS, setIsLoadingOS] = useState(false)
  const [osLoadError, setOsLoadError] = useState<string | null>(null)

  // Reset view to 'home' when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentView('home')
      setShowUpgradeAlert(false)
      setSearchDoc('')
      setSelectedTipo('todos')
      setDocsLoadError(null)
      setOsSearchError(null)
      setContaError(null)
      setContaSuccess(null)
      setAvaliacaoStep('input_os')
      setNumeroOS('')
      setValidatedOS(null)
      setValidatedContract(null)
      setSubmittedResponse(null)
    }
  }, [isOpen])

  // Carregar Ordens de Serviço do contrato do cliente autenticado
  useEffect(() => {
    if (isOpen && cliente?.id) {
      setIsLoadingOS(true)
      setOsLoadError(null)
      getOrdensServicoByContratoId(cliente.id)
        .then((list) => {
          setOrdensServico(list)
        })
        .catch((err) => {
          console.error('Erro ao carregar Ordens de Serviço do cliente:', err)
          setOsLoadError('Não foi possível carregar as Ordens de Serviço no momento.')
        })
        .finally(() => {
          setIsLoadingOS(false)
        })
    }
  }, [isOpen, cliente?.id])

  useEffect(() => {
    if (isOpen && cliente) {
      const acesso = temAcessoDocumentacaoTecnica(cliente.nivel_contrato)
      if (acesso.permitido) {
        setIsLoadingDocs(true)
        setDocsLoadError(null)
        listarDocumentosTecnicos(cliente.nivel_contrato, true)
          .then((list) => setDocs(list))
          .catch((err) => {
            console.error('Erro ao listar documentos:', err)
            setDocsLoadError('Não foi possível carregar os documentos no momento. Tente novamente.')
          })
          .finally(() => setIsLoadingDocs(false))
      } else {
        // Se Sentinela, lista não deve ser preenchida
        setDocs([])
      }
    }
  }, [isOpen, cliente])

  if (!cliente) return null

  const acessoDoc = temAcessoDocumentacaoTecnica(cliente.nivel_contrato)
  const isSentinela = cliente.nivel_contrato === 'Sentinela Preventivo'

  // Handler de clique no Card 1: Avaliar Atendimento
  const handleAcessarAvaliacao = () => {
    setCurrentView('avaliacao')
    setAvaliacaoStep('input_os')
    setOsSearchError(null)
  }

  // Handler direto para iniciar avaliação a partir de uma OS específica da lista
  const handleAvaliarOSIndividual = async (os: OrdemServicoRecord) => {
    setNumeroOS(os.numero_os)
    setOsSearchError(null)
    setCurrentView('avaliacao')

    // Se já avaliada, exibe a etapa de input com a mensagem exata
    if (os.avaliacao_realizada) {
      setAvaliacaoStep('input_os')
      setOsSearchError('Esta Ordem de Serviço já foi avaliada. Obrigado pelo retorno.')
      return
    }

    setIsSearchingOS(true)
    try {
      const resultado = await validarOSParaAvaliacao(os.numero_os, cliente)
      if (resultado.valido) {
        setValidatedOS(resultado.os)
        setValidatedContract(resultado.contract)
        setAvaliacaoStep('select_option')
      } else {
        setAvaliacaoStep('input_os')
        setOsSearchError(resultado.mensagem)
      }
    } catch (err) {
      console.error('Erro ao validar OS:', err)
      setAvaliacaoStep('input_os')
      setOsSearchError(
        'Não localizamos esta Ordem de Serviço. Confira o número e tente novamente ou contate a assistência técnica.',
      )
    } finally {
      setIsSearchingOS(false)
    }
  }

  // Handler de clique no Card 2: Documentação Técnica
  const handleAcessarDocumentacao = () => {
    if (!acessoDoc.permitido) {
      // Bloqueado para Sentinela Preventivo -> exibe alerta e navega para tela de bloqueio dedicada
      setShowUpgradeAlert(true)
      setCurrentView('documentos')
      return
    }
    setShowUpgradeAlert(false)
    setCurrentView('documentos')
  }

  // Validação da OS (cliente autenticado informa apenas a OS)
  const handleIniciarAvaliacao = async (e: React.FormEvent) => {
    e.preventDefault()
    setOsSearchError(null)

    const cleanOS = numeroOS.trim()
    if (!cleanOS) {
      setOsSearchError(
        'Não localizamos esta Ordem de Serviço. Confira o número e tente novamente ou contate a assistência técnica.',
      )
      return
    }

    setIsSearchingOS(true)
    try {
      const resultado = await validarOSParaAvaliacao(cleanOS, cliente)
      if (resultado.valido) {
        setValidatedOS(resultado.os)
        setValidatedContract(resultado.contract)
        setAvaliacaoStep('select_option')
      } else {
        setOsSearchError(resultado.mensagem)
      }
    } catch (err) {
      console.error('Erro ao validar OS:', err)
      setOsSearchError(
        'Não localizamos esta Ordem de Serviço. Confira o número e tente novamente ou contate a assistência técnica.',
      )
    } finally {
      setIsSearchingOS(false)
    }
  }

  // Troca entre formato Completo e Curto
  const handleSelectOption = (option: CSATFormVersion) => {
    if (option === 'completo') {
      setAvaliacaoStep('form_full')
    } else {
      setAvaliacaoStep('form_short')
    }
  }

  // Envio definitivo do questionário CSAT
  const handleCSATSubmit = async (data: CSATSubmissionData) => {
    setIsSubmittingCSAT(true)
    try {
      const response = await submitCSATResponse(data)
      setSubmittedResponse(response)
      if (validatedOS) {
        setValidatedOS({
          ...validatedOS,
          avaliacao_realizada: true,
        })
      }
      if (validatedContract) {
        setValidatedContract({
          ...validatedContract,
          questionnaire_status: 'respondido',
        })
      }
      // Atualizar lista de OS localmente para refletir avaliacao_realizada imediatamente
      const cleanTargetOS = data.serviceOrderNumber.trim().toLowerCase()
      setOrdensServico((prev) =>
        prev.map((item) =>
          item.numero_os.trim().toLowerCase() === cleanTargetOS
            ? { ...item, avaliacao_realizada: true }
            : item,
        ),
      )
      // Recarregar lista do servidor para garantir sincronismo
      if (cliente?.id) {
        getOrdensServicoByContratoId(cliente.id)
          .then((list) => setOrdensServico(list))
          .catch(() => {})
      }
      setAvaliacaoStep('success')
    } catch (err) {
      console.error('Erro ao enviar avaliação CSAT:', err)
      setOsSearchError('Ocorreu um erro ao registrar a avaliação. Por favor, tente novamente.')
    } finally {
      setIsSubmittingCSAT(false)
    }
  }

  const handleResetAvaliacao = () => {
    setAvaliacaoStep('input_os')
    setNumeroOS('')
    setValidatedOS(null)
    setValidatedContract(null)
    setSubmittedResponse(null)
    setOsSearchError(null)
  }

  // Handler de troca de senha
  const handleTrocarSenha = async (e: React.FormEvent) => {
    e.preventDefault()
    setContaError(null)
    setContaSuccess(null)

    if (!senhaAtual) {
      setContaError('Informe a senha atual.')
      return
    }

    if (novaSenha.length < 8) {
      setContaError('A nova senha deve ter no mínimo 8 caracteres.')
      return
    }

    if (novaSenha !== confirmNovaSenha) {
      setContaError('A confirmação não confere com a nova senha digitada.')
      return
    }

    setIsChangingPassword(true)
    try {
      const { confere } = await conferirSenhaCliente(cliente.senha, senhaAtual)
      if (!confere) {
        setContaError('A senha atual digitada está incorreta.')
        setIsChangingPassword(false)
        return
      }

      await atualizarSenhaCliente(cliente.id, novaSenha, false)
      await refreshCliente()

      setContaSuccess('Senha alterada com sucesso!')
      setSenhaAtual('')
      setNovaSenha('')
      setConfirmNovaSenha('')
    } catch (err) {
      console.error('Erro ao alterar senha:', err)
      setContaError('Ocorreu um erro ao atualizar a senha. Tente novamente.')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleLogout = () => {
    clearSession()
    onClose()
  }

  // Filtrar documentos por busca (nome/descrição) e tipo selecionado
  const filteredDocs = docs.filter((d) => {
    // Filtro por tipo
    if (selectedTipo !== 'todos' && d.tipo !== selectedTipo) {
      return false
    }
    // Filtro por termo de busca
    if (!searchDoc.trim()) return true
    const term = searchDoc.toLowerCase()
    return (
      d.nome.toLowerCase().includes(term) ||
      d.tipo.toLowerCase().includes(term) ||
      (d.descricao && d.descricao.toLowerCase().includes(term))
    )
  })

  // Tipos disponíveis na lista para os botões de filtro
  const tiposDisponiveis = ['todos', 'Manual', 'Esquema', 'Datasheet', 'Certificado'] as const

  // Badge cor do plano
  const getNivelBadgeClass = () => {
    if (cliente.nivel_contrato === 'Maestro Engenharia') {
      return 'bg-purple-500/20 text-purple-300 border-purple-500/40'
    }
    if (cliente.nivel_contrato === 'Controle Operacional') {
      return 'bg-sky-500/20 text-sky-300 border-sky-500/40'
    }
    return 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : null)}>
      <DialogContent
        onPointerDownOutside={() => handleLogout()}
        onEscapeKeyDown={() => handleLogout()}
        className="bg-[#0b132b] border border-slate-800 text-white max-w-3xl max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl"
      >
        {/* Cabeçalho do Painel: Empresa, Contrato, Nível do Plano, Minha Conta e Sair */}
        <DialogHeader className="text-left border-b border-slate-800/80 pb-4 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8CC63F] shadow-[0_0_8px_#8CC63F]"></span>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#8CC63F] font-bold">
                  Área do Cliente Autenticada
                </span>
              </div>
              <DialogTitle className="text-lg sm:text-2xl font-black text-white font-display tracking-tight truncate flex items-center gap-2">
                <Building2 className="w-5 h-5 text-slate-400 shrink-0 hidden sm:inline-block" />
                <span>{cliente.nome_cliente}</span>
              </DialogTitle>
              <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-slate-400">
                <span>
                  Contrato:{' '}
                  <strong className="text-slate-200 font-mono">{cliente.numero_contrato}</strong>
                </span>
                <span>•</span>
                <Badge
                  variant="outline"
                  className={`text-[11px] font-bold py-0.5 px-2.5 border ${getNivelBadgeClass()}`}
                >
                  {cliente.nivel_contrato}
                </Badge>
              </div>
            </div>

            {/* Menu Superior: Minha conta (alterar senha) e Sair */}
            <div className="flex items-center gap-2 self-start shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowUpgradeAlert(false)
                  setCurrentView(currentView === 'minha_conta' ? 'home' : 'minha_conta')
                }}
                className={`text-xs h-9 transition-colors ${
                  currentView === 'minha_conta'
                    ? 'border-[#8CC63F] bg-[#8CC63F]/15 text-[#8CC63F]'
                    : 'border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5 mr-1.5 text-[#8CC63F]" />
                Minha conta
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-slate-700 bg-slate-900/60 hover:bg-red-950/40 hover:text-red-300 hover:border-red-800 text-slate-300 text-xs h-9"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                Sair
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* ================= SEÇÃO 1: PAINEL PRINCIPAL (GRID DE 2 CARDS) ================= */}
        {currentView === 'home' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Alerta de Upgrade caso o usuário Sentinela tenha clicado em Documentação Técnica */}
            {showUpgradeAlert && isSentinela && (
              <Alert className="border-amber-500/50 bg-amber-950/40 text-amber-200 animate-in fade-in duration-200">
                <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="ml-2 space-y-2">
                  <AlertTitle className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Acesso Restrito ao Plano Sentinela Preventivo
                  </AlertTitle>
                  <AlertDescription className="text-xs sm:text-sm font-medium text-amber-100 leading-relaxed">
                    {MENSAGEM_NEGACAO_SENTINELA}
                  </AlertDescription>
                  <div className="pt-1.5 flex flex-wrap items-center gap-2">
                    <a
                      href={`https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(
                        `Olá! Sou cliente do plano Sentinela Preventivo (Contrato ${cliente.numero_contrato}) e gostaria de informações sobre upgrade para acessar a Documentação Técnica.`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8CC63F] hover:bg-[#7cb633] text-slate-950 text-xs font-bold transition shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Falar no WhatsApp Comercial</span>
                    </a>
                    <Button
                      size="sm"
                      onClick={() => setCurrentView('documentos')}
                      variant="outline"
                      className="border-amber-500/50 bg-amber-950/30 text-amber-200 hover:bg-amber-900/40 text-xs h-8"
                    >
                      Ver detalhes do bloqueio
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowUpgradeAlert(false)}
                      className="text-amber-300 hover:text-amber-100 hover:bg-amber-950/50 text-xs h-8"
                    >
                      Fechar aviso
                    </Button>
                  </div>
                </div>
              </Alert>
            )}

            {/* Subtítulo institucional do painel */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-mono">
                Funcionalidades Disponíveis
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Selecione abaixo o módulo que deseja gerenciar.
              </p>
            </div>

            {/* Grid com exatamente 2 cards principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {/* Card 1 — Avaliar Atendimento */}
              <div className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-[#8CC63F]/60 rounded-2xl p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between group shadow-lg hover:shadow-[#8CC63F]/5 relative overflow-hidden">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#8CC63F]/15 border border-[#8CC63F]/30 flex items-center justify-center text-[#8CC63F] group-hover:scale-105 transition-transform">
                      <Star className="w-6 h-6" />
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] font-bold py-0.5 px-2 bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    >
                      Liberado
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#8CC63F] transition-colors font-display tracking-tight">
                      Avaliar Atendimento
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                      Avalie o atendimento recebido na sua Ordem de Serviço. Acesso pelo número da
                      OS.
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-800/80">
                  <Button
                    onClick={handleAcessarAvaliacao}
                    className="w-full bg-[#8CC63F] hover:bg-[#7cb633] text-slate-950 font-black text-xs uppercase tracking-wider py-5 rounded-xl shadow-md shadow-[#8CC63F]/20 flex items-center justify-center gap-2 group-hover:translate-x-0.5 transition-all"
                  >
                    <span>Acessar</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Card 2 — Documentação Técnica */}
              <div
                className={`bg-slate-900/80 rounded-2xl p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between shadow-lg relative overflow-hidden border ${
                  isSentinela
                    ? 'border-amber-500/30 hover:border-amber-500/60'
                    : 'border-slate-800 hover:border-[#8CC63F]/60 hover:bg-slate-900 group hover:shadow-[#8CC63F]/5'
                }`}
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform ${
                        isSentinela
                          ? 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                          : 'bg-[#8CC63F]/15 border border-[#8CC63F]/30 text-[#8CC63F] group-hover:scale-105'
                      }`}
                    >
                      <BookOpen className="w-6 h-6" />
                    </div>

                    {isSentinela ? (
                      <Badge
                        variant="outline"
                        className="text-[10px] font-bold py-0.5 px-2 bg-amber-500/15 text-amber-300 border-amber-500/40 flex items-center gap-1"
                      >
                        <Lock className="w-3 h-3" />
                        Requer Upgrade
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-[10px] font-bold py-0.5 px-2 bg-sky-500/10 text-sky-300 border-sky-500/30"
                      >
                        Liberado ({cliente.nivel_contrato})
                      </Badge>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-lg font-bold font-display tracking-tight transition-colors ${
                          isSentinela ? 'text-slate-200' : 'text-white group-hover:text-[#8CC63F]'
                        }`}
                      >
                        Documentação Técnica
                      </h3>
                      {isSentinela && <Lock className="w-4 h-4 text-amber-400 shrink-0" />}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                      Acesse manuais e esquemas técnicos dos seus equipamentos.
                    </p>

                    {isSentinela ? (
                      <div className="mt-2.5 p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30 space-y-1">
                        <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-[11px]">
                          <Lock className="w-3 h-3 text-amber-400" />
                          <span>Bloqueado para Sentinela Preventivo</span>
                        </div>
                        <p className="text-[11px] text-amber-200/90 leading-relaxed">
                          {MENSAGEM_NEGACAO_SENTINELA}
                        </p>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 mt-2">
                        Downloads disponíveis conforme o nível do seu contrato.
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-800/80">
                  <Button
                    onClick={handleAcessarDocumentacao}
                    className={`w-full font-black text-xs uppercase tracking-wider py-5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all ${
                      isSentinela
                        ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 hover:border-amber-400'
                        : 'bg-[#8CC63F] hover:bg-[#7cb633] text-slate-950 shadow-[#8CC63F]/20 group-hover:translate-x-0.5'
                    }`}
                  >
                    {isSentinela && <Lock className="w-3.5 h-3.5 mr-0.5 text-amber-400" />}
                    <span>{isSentinela ? 'Ver condições de acesso' : 'Acessar'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Nova seção: Minhas Ordens de Serviço (carregada diretamente do banco de dados) */}
            <div className="pt-2 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-t border-slate-800/80 pt-5">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-[#8CC63F]" />
                    <span>Minhas Ordens de Serviço</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Histórico de OS vinculadas ao contrato{' '}
                    <strong className="text-slate-200 font-mono">{cliente.numero_contrato}</strong>
                  </p>
                </div>

                {!isLoadingOS && ordensServico.length > 0 && (
                  <Badge
                    variant="outline"
                    className="text-[11px] font-mono py-0.5 px-2.5 border-slate-700 bg-slate-900/60 text-slate-300 self-start sm:self-auto"
                  >
                    Total: <strong className="text-white ml-1">{ordensServico.length}</strong>
                  </Badge>
                )}
              </div>

              {/* Estado de Erro */}
              {osLoadError && (
                <Alert
                  variant="destructive"
                  className="border-red-500/40 bg-red-950/40 text-red-200"
                >
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                  <AlertDescription className="text-xs ml-2">{osLoadError}</AlertDescription>
                </Alert>
              )}

              {/* Estado de Carregamento */}
              {isLoadingOS ? (
                <div className="py-10 text-center bg-slate-900/40 rounded-xl border border-slate-800 text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-[#8CC63F]" />
                  <span>Carregando Ordens de Serviço do seu contrato...</span>
                </div>
              ) : ordensServico.length === 0 ? (
                /* Estado Vazio Amigável */
                <div className="py-8 px-4 text-center bg-slate-900/40 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-500 mx-auto">
                    <FileText className="w-5 h-5" />
                  </div>
                  <p className="font-medium text-slate-300">
                    Nenhuma Ordem de Serviço cadastrada para este contrato no momento.
                  </p>
                  <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                    Assim que uma manutenção ou calibração for registrada pela equipe técnica, ela
                    ficará visível aqui com seu laudo em PDF para download.
                  </p>
                </div>
              ) : (
                /* Apresentação de Ordens de Serviço baseada em Ícones clicáveis para Download do PDF */
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-400">
                    Clique no ícone de qualquer OS para baixar ou visualizar o PDF da Ordem de
                    Serviço.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
                    {ordensServico.map((os) => {
                      const fileUrl = getOrdemServicoFileUrl(os)
                      const isExecutada = os.status === 'executada'
                      const dataFormatada = os.data
                        ? new Date(os.data).toLocaleDateString('pt-BR')
                        : os.created
                          ? new Date(os.created).toLocaleDateString('pt-BR')
                          : null

                      const CardContent = (
                        <div className="p-3.5 flex flex-col items-center text-center space-y-2.5">
                          {/* Ícone principal de Documento / PDF */}
                          <div className="relative">
                            <div
                              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                                fileUrl
                                  ? 'bg-[#8CC63F]/15 border border-[#8CC63F]/35 text-[#8CC63F] group-hover:scale-105 group-hover:bg-[#8CC63F]/25 group-hover:border-[#8CC63F] shadow-sm shadow-[#8CC63F]/10'
                                  : 'bg-slate-800/60 border border-slate-700/60 text-slate-500'
                              }`}
                            >
                              {fileUrl ? (
                                <FileDown className="w-7 h-7 text-[#8CC63F] group-hover:animate-bounce" />
                              ) : (
                                <FileText className="w-7 h-7 text-slate-500" />
                              )}
                            </div>

                            {/* Badge 'PDF' no canto do ícone */}
                            <span
                              className={`absolute -bottom-1 -right-1 text-[9px] font-black font-mono px-1.5 py-0.2 rounded border uppercase tracking-wider ${
                                fileUrl
                                  ? 'bg-[#8CC63F] text-slate-950 border-[#8CC63F]'
                                  : 'bg-slate-800 text-slate-400 border-slate-700'
                              }`}
                            >
                              PDF
                            </span>
                          </div>

                          {/* Identificação da OS: Número em destaque */}
                          <div className="w-full space-y-1">
                            <span className="font-mono font-bold text-white text-xs block truncate group-hover:text-[#8CC63F] transition-colors">
                              {os.numero_os}
                            </span>

                            {/* Status (Executada / Aberta) */}
                            <div className="flex items-center justify-center">
                              {isExecutada ? (
                                <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold py-0 px-1.5 leading-tight">
                                  Executada
                                </Badge>
                              ) : (
                                <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[9px] font-bold py-0 px-1.5 leading-tight">
                                  Aberta
                                </Badge>
                              )}
                            </div>

                            {/* Data */}
                            {dataFormatada && (
                              <span className="text-[10px] text-slate-400 font-mono block truncate">
                                {dataFormatada}
                              </span>
                            )}
                          </div>

                          {/* Ação ou indicação de Download */}
                          <div className="w-full pt-1 border-t border-slate-800/80">
                            {fileUrl ? (
                              <span className="inline-flex items-center justify-center gap-1 text-[11px] font-medium text-[#8CC63F] group-hover:underline">
                                <Download className="w-3 h-3" />
                                <span>Baixar PDF</span>
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500 block truncate">
                                Sem PDF anexado
                              </span>
                            )}
                          </div>
                        </div>
                      )

                      return (
                        <div
                          key={os.id}
                          className="flex flex-col bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden shadow-md transition-all duration-200"
                        >
                          {/* Ícone Clicável Principal de Download */}
                          {fileUrl ? (
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                              title={`Clique para baixar o PDF da ${os.numero_os}`}
                              className="group flex-1 cursor-pointer hover:bg-slate-900 hover:border-[#8CC63F]/50 transition-colors block focus:outline-none focus:ring-1 focus:ring-[#8CC63F]"
                            >
                              {CardContent}
                            </a>
                          ) : (
                            <div
                              title={`Ordem de Serviço ${os.numero_os} (sem arquivo PDF anexado no momento)`}
                              className="group flex-1 opacity-60 cursor-not-allowed bg-slate-950/40"
                            >
                              {CardContent}
                            </div>
                          )}

                          {/* Ação secundária: Avaliar atendimento da OS */}
                          <div className="p-2 pt-0 bg-transparent">
                            {os.avaliacao_realizada ? (
                              <div
                                className="w-full text-center py-1 text-[10px] text-slate-500 flex items-center justify-center gap-1 bg-slate-950/60 rounded border border-slate-800/80"
                                title="Esta OS já foi avaliada. Obrigado!"
                              >
                                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                <span className="truncate">Avaliada</span>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAvaliarOSIndividual(os)}
                                className="w-full h-6 text-[10px] px-1.5 border-slate-800 hover:border-[#8CC63F]/60 bg-slate-950/80 text-slate-300 hover:text-white flex items-center justify-center gap-1"
                                title={`Avaliar atendimento da ${os.numero_os}`}
                              >
                                <Star className="w-2.5 h-2.5 text-[#8CC63F] fill-[#8CC63F]" />
                                <span className="truncate">Avaliar OS</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TELA: AVALIAR ATENDIMENTO (INTEGRADO NA ÁREA DO CLIENTE) ================= */}
        {currentView === 'avaliacao' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Barra superior de navegação da tela de avaliação */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (avaliacaoStep === 'input_os' || avaliacaoStep === 'success') {
                    setCurrentView('home')
                  } else if (avaliacaoStep === 'select_option') {
                    setAvaliacaoStep('input_os')
                  } else {
                    setAvaliacaoStep('select_option')
                  }
                }}
                className="text-xs text-slate-400 hover:text-white -ml-2 h-8 flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>
                  {avaliacaoStep === 'input_os' || avaliacaoStep === 'success'
                    ? 'Voltar ao painel'
                    : avaliacaoStep === 'select_option'
                      ? 'Trocar número da OS'
                      : 'Voltar às opções'}
                </span>
              </Button>
              <Badge
                variant="outline"
                className="text-[11px] font-bold py-0.5 px-2 bg-[#8CC63F]/10 text-[#8CC63F] border-[#8CC63F]/30"
              >
                Avaliar Atendimento • CSAT
              </Badge>
            </div>

            {/* Sub-etapa 1: Formulário de acesso com campo único "Número da Ordem de Serviço (OS)" */}
            {avaliacaoStep === 'input_os' && (
              <div className="space-y-4">
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#8CC63F]/15 border border-[#8CC63F]/30 flex items-center justify-center text-[#8CC63F] shrink-0">
                      <Star className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white font-display">
                        Avaliar Atendimento
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Permite que você avalie o atendimento de uma Ordem de Serviço específica.
                        Como você já está logado, seu contrato{' '}
                        <strong className="text-[#8CC63F] font-mono">
                          {cliente.numero_contrato}
                        </strong>{' '}
                        já está identificado: informe apenas o número da OS.
                      </p>
                    </div>
                  </div>

                  {osSearchError && (
                    <Alert
                      variant="destructive"
                      className="border-red-500/50 bg-red-950/40 text-red-200 animate-in fade-in duration-200"
                    >
                      <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                      <div className="ml-2">
                        <AlertTitle className="text-xs font-bold uppercase tracking-wider text-red-300">
                          Atenção
                        </AlertTitle>
                        <AlertDescription className="text-xs leading-relaxed text-red-200 mt-0.5">
                          {osSearchError}
                        </AlertDescription>
                      </div>
                    </Alert>
                  )}

                  <form onSubmit={handleIniciarAvaliacao} className="space-y-4 pt-1">
                    <div>
                      <label
                        htmlFor="os-input-field"
                        className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2"
                      >
                        Número da Ordem de Serviço (OS) <span className="text-[#8CC63F]">*</span>
                      </label>
                      <Input
                        id="os-input-field"
                        type="text"
                        required
                        value={numeroOS}
                        onChange={(e) => {
                          setNumeroOS(e.target.value)
                          if (osSearchError) setOsSearchError(null)
                        }}
                        placeholder="Ex.: OS-8841 ou OS-8920"
                        className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 font-mono text-sm py-5"
                      />
                      <span className="text-[11px] text-slate-400 mt-1.5 block">
                        Consta no relatório de atendimento técnico ou laudo entregue em campo para o
                        seu contrato.
                      </span>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSearchingOS}
                      className="w-full bg-[#8CC63F] hover:bg-[#7cb633] text-slate-950 font-black text-xs uppercase tracking-wider py-5 rounded-xl shadow-lg shadow-[#8CC63F]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                    >
                      {isSearchingOS ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Localizando Ordem de Serviço...</span>
                        </>
                      ) : (
                        <>
                          <span>Iniciar avaliação</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {/* Sub-etapa 2: Seleção de versão (Completo ou Curto) com CSATOptionSelector reaproveitado */}
            {avaliacaoStep === 'select_option' && validatedContract && (
              <div className="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800">
                <CSATOptionSelector
                  contract={validatedContract}
                  onSelectOption={handleSelectOption}
                  onResetContract={handleResetAvaliacao}
                />
              </div>
            )}

            {/* Sub-etapa 3a: Formulário Completo reaproveitado com revisão "Deseja enviar esta avaliação?" */}
            {avaliacaoStep === 'form_full' && validatedContract && (
              <div className="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800">
                <CSATFullForm
                  contract={validatedContract}
                  isSubmitting={isSubmittingCSAT}
                  onSubmit={handleCSATSubmit}
                  onBack={() => setAvaliacaoStep('select_option')}
                />
              </div>
            )}

            {/* Sub-etapa 3b: Versão Curta reaproveitada com revisão "Deseja enviar esta avaliação?" */}
            {avaliacaoStep === 'form_short' && validatedContract && (
              <div className="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800">
                <CSATShortForm
                  contract={validatedContract}
                  isSubmitting={isSubmittingCSAT}
                  onSubmit={handleCSATSubmit}
                  onBack={() => setAvaliacaoStep('select_option')}
                />
              </div>
            )}

            {/* Sub-etapa 4: Tela de Sucesso com mensagem exata reaproveitada */}
            {avaliacaoStep === 'success' && submittedResponse && (
              <div className="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800">
                <CSATSuccessScreen
                  responseRecord={submittedResponse}
                  onReset={handleResetAvaliacao}
                />
              </div>
            )}
          </div>
        )}

        {/* ================= TELA: DOCUMENTAÇÃO TÉCNICA (BIBLIOTECA OU BLOQUEIO AMIGÁVEL) ================= */}
        {currentView === 'documentos' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView('home')}
                className="text-xs text-slate-400 hover:text-white -ml-2 h-8 flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Voltar ao painel</span>
              </Button>
              <Badge
                variant="outline"
                className={`text-[11px] font-bold py-0.5 px-2.5 ${
                  !acessoDoc.permitido
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                    : 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                }`}
              >
                {!acessoDoc.permitido ? 'Recurso Restrito' : 'Biblioteca Técnica'}
              </Badge>
            </div>

            {/* CASO 1: BLOQUEIO AMIGÁVEL PARA SENTINELA PREVENTIVO (NÃO EXIBE DOCUMENTOS) */}
            {!acessoDoc.permitido ? (
              <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-6 sm:p-8 space-y-6 text-center shadow-xl relative overflow-hidden">
                {/* Efeito sutil no fundo */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-amber-500/5 blur-3xl pointer-events-none"></div>

                <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-inner">
                  <Lock className="w-8 h-8" />
                </div>

                <div className="space-y-2 max-w-xl mx-auto">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-[11px] font-mono font-semibold text-amber-300 mb-1">
                    <span>Contrato:</span>
                    <strong className="text-white">{cliente.numero_contrato}</strong>
                    <span>•</span>
                    <span>{cliente.nivel_contrato}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight">
                    Documentação Técnica Restrita
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pt-1">
                    {MENSAGEM_NEGACAO_SENTINELA}
                  </p>
                </div>

                {/* Caixa explicativa com benefícios dos planos superiores */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 sm:p-5 max-w-xl mx-auto text-left space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    Disponível nos planos Controle Operacional e Maestro Engenharia:
                  </span>
                  <ul className="text-xs text-slate-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#8CC63F] shrink-0 mt-0.5" />
                      <span>
                        Download completo de <strong>manuais de operação</strong> e parametrização
                        de equipamentos inteligentes.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#8CC63F] shrink-0 mt-0.5" />
                      <span>
                        Acesso a <strong>esquemas elétricos</strong>, diagramas unifilares e
                        ligações em campo.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#8CC63F] shrink-0 mt-0.5" />
                      <span>
                        Datasheets de especificações e{' '}
                        <strong>certificados metrológicos padrão RBC</strong>.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Canais claros de contato com o time comercial da Condutiva */}
                <div className="max-w-xl mx-auto pt-2 space-y-3">
                  <span className="text-xs font-semibold text-slate-300 block">
                    Entre em contato com o time comercial da Condutiva para realizar o upgrade:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href={`https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(
                        `Olá! Sou da empresa ${cliente.nome_cliente} (Contrato ${cliente.numero_contrato}, plano Sentinela Preventivo). Tenho interesse no upgrade de contrato para liberar o módulo de Documentação Técnica (manuais e esquemas).`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 p-3.5 rounded-xl bg-[#8CC63F] hover:bg-[#7cb633] text-slate-950 font-bold text-xs transition shadow-lg shadow-[#8CC63F]/10 group"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0 text-slate-950" />
                      <span>Falar via WhatsApp ({COMPANY_INFO.phoneWhatsapp})</span>
                    </a>

                    <a
                      href={`mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(
                        `Solicitação de Upgrade de Contrato - Documentação Técnica [${cliente.numero_contrato}]`,
                      )}&body=${encodeURIComponent(
                        `Olá equipe comercial da Condutiva,\n\nGostaria de solicitar proposta para upgrade de contrato do plano Sentinela Preventivo para Controle Operacional ou Maestro Engenharia, com liberação da Documentação Técnica.\n\nEmpresa: ${cliente.nome_cliente}\nNúmero do Contrato: ${cliente.numero_contrato}\nE-mail: ${cliente.email}\n\nAtenciosamente,`,
                      )}`}
                      className="inline-flex items-center justify-center gap-2 p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-white font-bold text-xs transition shadow-md"
                    >
                      <Mail className="w-4 h-4 shrink-0 text-[#8CC63F]" />
                      <span>Enviar E-mail Comercial</span>
                    </a>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      Telefone fixo:{' '}
                      <a
                        href={`tel:${COMPANY_INFO.phoneLandline.replace(/\D/g, '')}`}
                        className="text-slate-300 hover:text-white underline underline-offset-2"
                      >
                        {COMPANY_INFO.phoneLandline}
                      </a>
                    </span>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => {
                        onClose()
                        const el = document.querySelector('#planos')
                        if (el) el.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="text-[#8CC63F] hover:underline underline-offset-2 font-medium"
                    >
                      Comparar tabela completa de planos
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* CASO 2: BIBLIOTECA DE DOCUMENTOS TÉCNICOS (LIBERADA PARA CONTROLE OPERACIONAL E MAESTRO) */
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 font-display">
                      <BookOpen className="w-5 h-5 text-[#8CC63F]" />
                      <span>Biblioteca de Documentos Técnicos</span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Download de manuais, esquemas e especificações compatíveis com seu contrato (
                      <strong className="text-[#8CC63F]">{cliente.nivel_contrato}</strong>).
                    </p>
                  </div>

                  <div className="text-[11px] font-mono text-slate-400">
                    Nível de acesso:{' '}
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold py-0.5 px-2 ${getNivelBadgeClass()}`}
                    >
                      {cliente.nivel_contrato}
                    </Badge>
                  </div>
                </div>

                {docsLoadError && (
                  <Alert
                    variant="destructive"
                    className="border-red-500/40 bg-red-950/40 text-red-200"
                  >
                    <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                    <AlertDescription className="text-xs ml-2">{docsLoadError}</AlertDescription>
                  </Alert>
                )}

                {/* Barra de Filtros: Busca textual + Filtro por Tipo */}
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <Input
                        type="text"
                        value={searchDoc}
                        onChange={(e) => setSearchDoc(e.target.value)}
                        placeholder="Buscar por nome, tipo ou palavra-chave..."
                        className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 text-xs py-4 pl-9"
                      />
                      <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      {searchDoc && (
                        <button
                          type="button"
                          onClick={() => setSearchDoc('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                        >
                          Limpar
                        </button>
                      )}
                    </div>

                    <div className="text-xs text-slate-400 shrink-0 font-mono">
                      Exibindo <strong className="text-white">{filteredDocs.length}</strong> de{' '}
                      {docs.length} disponíveis
                    </div>
                  </div>

                  {/* Filtro por Tipo (Pills) */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/80">
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                      <Filter className="w-3 h-3 text-slate-500" />
                      Tipo:
                    </span>
                    {tiposDisponiveis.map((tipo) => {
                      const isSelected = selectedTipo === tipo
                      return (
                        <button
                          key={tipo}
                          type="button"
                          onClick={() => setSelectedTipo(tipo)}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                            isSelected
                              ? 'bg-[#8CC63F]/20 text-[#8CC63F] border-[#8CC63F]/60 font-bold'
                              : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                          }`}
                        >
                          {tipo === 'todos' ? 'Todos os Tipos' : tipo}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Listagem em Grid de Documentos */}
                {isLoadingDocs ? (
                  <div className="py-16 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-[#8CC63F]" />
                    <span>Carregando biblioteca de documentos técnicos...</span>
                  </div>
                ) : filteredDocs.length === 0 ? (
                  <div className="py-12 text-center bg-slate-900/40 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-2">
                    <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="font-medium text-slate-300">
                      Nenhum documento encontrado para os filtros selecionados.
                    </p>
                    {(searchDoc || selectedTipo !== 'todos') && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSearchDoc('')
                          setSelectedTipo('todos')
                        }}
                        className="text-xs text-[#8CC63F] hover:text-[#8CC63F]/80 h-8"
                      >
                        Limpar filtros de busca
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[52vh] overflow-y-auto pr-1">
                    {filteredDocs.map((doc) => {
                      const getTipoBadgeStyle = () => {
                        switch (doc.tipo) {
                          case 'Manual':
                            return 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                          case 'Esquema':
                            return 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          case 'Datasheet':
                            return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          case 'Certificado':
                            return 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                          default:
                            return 'bg-slate-800 text-slate-300 border-slate-700'
                        }
                      }

                      return (
                        <div
                          key={doc.id}
                          className="bg-slate-900/80 border border-slate-800 hover:border-[#8CC63F]/50 rounded-xl p-4 transition-all flex flex-col justify-between space-y-3 group shadow-md hover:shadow-[#8CC63F]/5"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <Badge
                                variant="outline"
                                className={`text-[10px] font-bold py-0.5 px-2 border ${getTipoBadgeStyle()}`}
                              >
                                {doc.tipo}
                              </Badge>
                              <span className="text-[10px] text-slate-500 font-mono">
                                Nível mín.: {doc.nivel_minimo_acesso}
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-white group-hover:text-[#8CC63F] transition-colors leading-snug">
                              {doc.nome}
                            </h4>

                            {doc.descricao && (
                              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                {doc.descricao}
                              </p>
                            )}
                          </div>

                          <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                            <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5 text-slate-500" />
                              <span>Documento PDF</span>
                            </span>

                            <a
                              href={doc.arquivo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8CC63F] hover:bg-[#7cb633] text-slate-950 font-bold text-xs transition shadow-sm group-hover:scale-102"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Baixar</span>
                            </a>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= TELA: MINHA CONTA (ALTERAR SENHA) ================= */}
        {currentView === 'minha_conta' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView('home')}
                className="text-xs text-slate-400 hover:text-white -ml-2 h-8 flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Voltar ao painel</span>
              </Button>
              <Badge
                variant="outline"
                className="text-[11px] font-bold py-0.5 px-2 bg-slate-800 text-slate-300 border-slate-700"
              >
                Minha Conta
              </Badge>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Alteração de Senha</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Atualize sua senha de acesso à Área do Cliente.
                  </p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                  <User className="w-4 h-4" />
                </div>
              </div>

              {contaError && (
                <Alert
                  variant="destructive"
                  className="border-red-500/40 bg-red-950/40 text-red-200"
                >
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                  <AlertDescription className="text-xs ml-2">{contaError}</AlertDescription>
                </Alert>
              )}

              {contaSuccess && (
                <Alert className="border-[#8CC63F]/50 bg-emerald-950/40 text-emerald-200">
                  <CheckCircle2 className="h-4 w-4 text-[#8CC63F] shrink-0" />
                  <AlertDescription className="text-xs ml-2">{contaSuccess}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleTrocarSenha} className="space-y-4">
                <div>
                  <label
                    htmlFor="senha-atual"
                    className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5"
                  >
                    Senha Atual <span className="text-[#8CC63F]">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="senha-atual"
                      type={showSenhas ? 'text' : 'password'}
                      required
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                      placeholder="Digite sua senha atual"
                      className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 text-sm py-4 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSenhas(!showSenhas)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showSenhas ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="nova-senha"
                      className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5"
                    >
                      Nova Senha <span className="text-[#8CC63F]">*</span>
                    </label>
                    <Input
                      id="nova-senha"
                      type={showSenhas ? 'text' : 'password'}
                      required
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 text-sm py-4"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirm-nova-senha"
                      className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5"
                    >
                      Confirmar Nova Senha <span className="text-[#8CC63F]">*</span>
                    </label>
                    <Input
                      id="confirm-nova-senha"
                      type={showSenhas ? 'text' : 'password'}
                      required
                      value={confirmNovaSenha}
                      onChange={(e) => setConfirmNovaSenha(e.target.value)}
                      placeholder="Repita a nova senha"
                      className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 text-sm py-4"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isChangingPassword}
                    className="w-full sm:w-auto bg-[#8CC63F] hover:bg-[#7cb633] text-slate-950 font-black text-xs uppercase tracking-wide py-5 px-6 rounded-xl shadow-lg shadow-[#8CC63F]/20 disabled:opacity-60"
                  >
                    {isChangingPassword ? 'Atualizando...' : 'Confirmar Alteração de Senha'}
                  </Button>
                </div>
              </form>

              {cliente.senha_alterada_em && (
                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500">
                  Última alteração de senha:{' '}
                  {new Date(cliente.senha_alterada_em).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
