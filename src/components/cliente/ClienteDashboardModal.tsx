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
} from 'lucide-react'
import { useClienteAuth } from '@/contexts/ClienteAuthContext'
import {
  temAcessoDocumentacaoTecnica,
  listarDocumentosTecnicos,
  validarOSParaAvaliacao,
  atualizarSenhaCliente,
  hashSenhaCliente,
  MENSAGEM_NEGACAO_SENTINELA,
} from '@/services/clienteArea'
import { submitCSATResponse } from '@/services/csat'
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

  // Reset view to 'home' when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentView('home')
      setShowUpgradeAlert(false)
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

  useEffect(() => {
    if (isOpen && cliente) {
      const acesso = temAcessoDocumentacaoTecnica(cliente.nivel_contrato)
      if (acesso.permitido) {
        setIsLoadingDocs(true)
        listarDocumentosTecnicos(cliente.nivel_contrato)
          .then((list) => setDocs(list))
          .catch((err) => console.error('Erro ao listar documentos:', err))
          .finally(() => setIsLoadingDocs(false))
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

  // Handler de clique no Card 2: Documentação Técnica
  const handleAcessarDocumentacao = () => {
    if (!acessoDoc.permitido) {
      // Bloqueado para Sentinela Preventivo -> exibe mensagem de upgrade
      setShowUpgradeAlert(true)
      return
    }
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
      const hashAtual = await hashSenhaCliente(senhaAtual)
      if (cliente.senha !== hashAtual) {
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

  // Filtrar documentos
  const filteredDocs = docs.filter(
    (d) =>
      d.nome.toLowerCase().includes(searchDoc.toLowerCase()) ||
      d.tipo.toLowerCase().includes(searchDoc.toLowerCase()) ||
      (d.descricao && d.descricao.toLowerCase().includes(searchDoc.toLowerCase())),
  )

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
      <DialogContent className="bg-[#0b132b] border border-slate-800 text-white max-w-3xl max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl">
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
            {showUpgradeAlert && (
              <Alert className="border-amber-500/50 bg-amber-950/30 text-amber-200 animate-in fade-in duration-200">
                <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="ml-2 space-y-2">
                  <p className="text-xs sm:text-sm font-medium text-amber-100 leading-relaxed">
                    {MENSAGEM_NEGACAO_SENTINELA}
                  </p>
                  <div className="pt-1 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        onClose()
                        const el = document.querySelector('#planos')
                        if (el) el.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold h-8"
                    >
                      Conhecer Planos de Upgrade
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

                    {isSentinela && (
                      <p className="text-[11px] text-amber-300/90 mt-2 italic bg-amber-950/30 border border-amber-500/20 rounded-md p-2 leading-relaxed">
                        Exclusivo para os planos Controle Operacional e Maestro Engenharia.
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
                    <span>Acessar</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
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

        {/* ================= TELA: DOCUMENTAÇÃO TÉCNICA (BIBLIOTECA FILTRÁVEL) ================= */}
        {currentView === 'documentos' && (
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
                className="text-[11px] font-bold py-0.5 px-2 bg-sky-500/10 text-sky-300 border-sky-500/30"
              >
                Biblioteca Técnica
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#8CC63F]" />
                  <span>Documentação Técnica</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Acesse manuais e esquemas técnicos dos seus equipamentos.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    value={searchDoc}
                    onChange={(e) => setSearchDoc(e.target.value)}
                    placeholder="Pesquisar manual, esquema, datasheet ou certificado..."
                    className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 text-xs py-4 pl-9"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="text-xs text-slate-400 shrink-0">
                  Exibindo <strong>{filteredDocs.length}</strong> documentos
                </div>
              </div>

              {isLoadingDocs ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  Carregando biblioteca técnica da Condutiva...
                </div>
              ) : filteredDocs.length === 0 ? (
                <div className="py-12 text-center bg-slate-900/40 rounded-xl border border-slate-800 text-xs text-slate-500">
                  Nenhum documento encontrado para o critério selecionado.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                  {filteredDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-slate-900/80 border border-slate-800 hover:border-[#8CC63F]/50 rounded-xl p-4 transition-all flex flex-col justify-between space-y-3 group"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <Badge
                            variant="outline"
                            className="text-[10px] font-bold py-0.5 px-2 bg-slate-800 text-slate-300 border-slate-700"
                          >
                            {doc.tipo}
                          </Badge>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Nível: {doc.nivel_minimo_acesso}
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

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">Formato PDF</span>
                        <a
                          href={doc.arquivo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8CC63F]/15 hover:bg-[#8CC63F]/25 text-[#8CC63F] font-bold text-xs transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Acessar PDF</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
