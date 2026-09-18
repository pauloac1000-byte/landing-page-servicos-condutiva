import React from 'react'
import {
  Star,
  Calendar,
  UserCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronRight,
  Check,
  X,
  MessageSquare,
  Sparkles,
  Info,
  Clock,
  Layers,
  FileCheck2,
  ExternalLink,
} from 'lucide-react'
import type { CSATResponseRecord, OrdemServicoRecord } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

interface OSCSATEvaluationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  os: OrdemServicoRecord | null
  response: CSATResponseRecord | null
  contractNumber?: string
  clientName?: string
  onGoToCSATTab?: () => void
}

/**
 * Calcula média de satisfação (1 a 5) das notas preenchidas na avaliação
 */
function calculateAverageSatisfaction(r: CSATResponseRecord): number {
  const scores: number[] = []
  if (typeof r.score_general_satisfaction === 'number' && r.score_general_satisfaction > 0) {
    scores.push(r.score_general_satisfaction)
  }
  if (typeof r.score_technical_execution === 'number' && r.score_technical_execution > 0) {
    scores.push(r.score_technical_execution)
  }
  if (typeof r.score_customer_service === 'number' && r.score_customer_service > 0) {
    scores.push(r.score_customer_service)
  }
  if (typeof r.score_perceived_value === 'number' && r.score_perceived_value > 0) {
    scores.push(r.score_perceived_value)
  }
  if (scores.length === 0) return 0
  const sum = scores.reduce((acc, v) => acc + v, 0)
  return sum / scores.length
}

function formatDateDisplay(dateStr?: string) {
  if (!dateStr) return '-'
  try {
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      const parts = dateStr.slice(0, 10).split('-')
      return `${parts[2]}/${parts[1]}/${parts[0]}`
    }
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

export function OSCSATEvaluationModal({
  open,
  onOpenChange,
  os,
  response,
  contractNumber,
  clientName,
  onGoToCSATTab,
}: OSCSATEvaluationModalProps) {
  if (!os) return null

  const isAnswered = Boolean(response || os.avaliacao_realizada)
  const displayContractNumber =
    response?.contract_number ||
    contractNumber ||
    os.expand?.contrato_id?.numero_contrato ||
    'Contrato Condutiva'
  const displayClientName =
    response?.client_name ||
    clientName ||
    os.expand?.contrato_id?.nome_cliente ||
    'Cliente Condutiva'

  const avgSat = response ? calculateAverageSatisfaction(response) : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onPointerDownOutside={() => onOpenChange(false)}
        onEscapeKeyDown={() => onOpenChange(false)}
        className="bg-slate-950 border-slate-800 text-slate-100 max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
      >
        <DialogHeader className="pb-3 border-b border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#8CC63F] uppercase tracking-wider">
                {displayContractNumber}
              </span>
              <span className="text-slate-600">•</span>
              <span className="font-mono text-xs text-white">
                OS: <strong className="text-[#8CC63F]">{os.numero_os}</strong>
              </span>
            </div>

            {/* Status da Avaliação */}
            {isAnswered ? (
              <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold py-0.5 px-2.5 gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Respondida</span>
              </Badge>
            ) : (
              <Badge className="bg-slate-800 text-slate-400 border border-slate-700 text-xs py-0.5 px-2.5 gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Não respondida</span>
              </Badge>
            )}
          </div>

          <DialogTitle className="text-lg md:text-xl font-bold text-white pt-2 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-[#8CC63F]" />
            <span>Avaliação do Questionário da OS {os.numero_os}</span>
          </DialogTitle>

          <DialogDescription className="text-xs text-slate-400">
            Cliente: <strong className="text-slate-200">{displayClientName}</strong>
            {os.data && <span className="ml-2">— Data da OS: {formatDateDisplay(os.data)}</span>}
          </DialogDescription>
        </DialogHeader>

        {/* Corpo: Quando NÃO respondida */}
        {!response && (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
              <Clock className="w-6 h-6 text-slate-400" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-semibold text-white">
                Questionário ainda não respondido pelo cliente
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Esta Ordem de Serviço está com a avaliação pendente. Assim que o cliente preencher o
                questionário CSAT através da Área do Cliente ou pelo link de avaliação, as respostas
                completas ficarão disponíveis aqui.
              </p>
            </div>

            {/* Detalhes da OS para conferência */}
            <div className="mt-4 text-left bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 space-y-2 text-xs max-w-md mx-auto">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Dados cadastrais desta OS:
              </span>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Número da OS:</span>
                <span className="font-mono font-bold text-white">{os.numero_os}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Status operacional:</span>
                <span className="capitalize text-slate-200">{os.status || 'aberta'}</span>
              </div>
              {os.tecnico_responsavel && (
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Técnico responsável:</span>
                  <span className="text-slate-200">{os.tecnico_responsavel}</span>
                </div>
              )}
              {os.descricao_servico && (
                <div className="pt-1 border-t border-slate-800/60 text-slate-300">
                  <span className="text-slate-400 block mb-0.5">Descrição do serviço:</span>
                  <span>{os.descricao_servico}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Corpo: Quando RESPONDIDA (exibição completa das respostas) */}
        {response && (
          <div className="space-y-4 pt-2 text-xs">
            {/* Metadados da resposta */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Identificação do Respondente
                </span>
                <p className="text-sm font-semibold text-white">
                  {response.respondent_name || 'Nome não informado'}{' '}
                  {response.respondent_role && (
                    <span className="text-xs text-slate-400 font-normal">
                      ({response.respondent_role})
                    </span>
                  )}
                </p>
                <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#8CC63F]" />
                    Respondido em {formatDateDisplay(response.evaluation_date || response.created)}
                  </span>
                  {response.technician_name && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-[#8CC63F]" />
                        Técnico: {response.technician_name}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Versão do Formulário */}
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Tipo de Formulário
                </span>
                {response.form_version === 'completo' ? (
                  <Badge className="bg-sky-500/15 text-sky-400 border border-sky-500/30 text-xs">
                    Formulário Completo
                  </Badge>
                ) : (
                  <Badge className="bg-purple-500/15 text-purple-400 border border-purple-500/30 text-xs">
                    Aplicação Rápida
                  </Badge>
                )}
              </div>
            </div>

            {/* Serviço Avaliado */}
            {response.service_evaluated && (
              <div className="bg-slate-900/50 border border-slate-800/80 p-3 rounded-xl">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-0.5">
                  Serviço Avaliado
                </span>
                <p className="text-xs font-medium text-slate-200">{response.service_evaluated}</p>
              </div>
            )}

            {/* Indicadores Principais: Problema Resolvido, NPS e Média */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Problema Resolvido */}
              <div className="bg-slate-900/70 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Problema Resolvido?
                </span>
                <div>
                  {response.problem_resolved === 'sim' ? (
                    <div className="inline-flex items-center gap-1.5 text-emerald-400 font-bold text-xs bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Sim, resolvido
                    </div>
                  ) : response.problem_resolved === 'nao' ? (
                    <div className="inline-flex items-center gap-1.5 text-rose-400 font-bold text-xs bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded-md">
                      <XCircle className="w-3.5 h-3.5" />
                      Não resolvido
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 text-slate-400 font-bold text-xs bg-slate-800 px-2 py-0.5 rounded-md">
                      <HelpCircle className="w-3.5 h-3.5" />
                      Não se aplica
                    </div>
                  )}
                </div>
              </div>

              {/* NPS Score */}
              <div className="bg-slate-900/70 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Nota NPS (0 a 10)
                </span>
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-xl font-black font-mono ${
                      response.nps_score >= 9
                        ? 'text-emerald-400'
                        : response.nps_score >= 7
                          ? 'text-amber-400'
                          : 'text-rose-400'
                    }`}
                  >
                    {response.nps_score} / 10
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {response.nps_score >= 9
                      ? 'Promotor'
                      : response.nps_score >= 7
                        ? 'Neutro'
                        : 'Detrator'}
                  </span>
                </div>
              </div>

              {/* Média de Satisfação */}
              <div className="bg-slate-900/70 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Média de Satisfação
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black text-white">
                    {avgSat > 0 ? avgSat.toFixed(1) : response.score_general_satisfaction}
                  </span>
                  <span className="text-slate-400 text-xs">/ 5.0</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 ml-1" />
                </div>
              </div>
            </div>

            {/* Notas por Dimensão (1 a 5) */}
            <div className="bg-slate-900/40 border border-slate-800 p-3.5 rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Notas por Dimensão (Escala de 1 a 5)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Satisfação Geral</span>
                  <span className="text-base font-bold text-white flex items-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {response.score_general_satisfaction}
                  </span>
                </div>

                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Execução Técnica</span>
                  <span className="text-base font-bold text-white flex items-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {response.score_technical_execution ?? '—'}
                  </span>
                </div>

                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Atendimento</span>
                  <span className="text-base font-bold text-white flex items-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {response.score_customer_service ?? '—'}
                  </span>
                </div>

                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Valor Percebido</span>
                  <span className="text-base font-bold text-white flex items-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {response.score_perceived_value ?? '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Justificativas do NPS & Renovação */}
            {(response.nps_reason || response.nps_improvement || response.renewal_intent) && (
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-mono text-[#8CC63F] uppercase tracking-wider block font-semibold">
                  Fundamentação do NPS & Renovação
                </span>
                <div className="space-y-2">
                  {response.nps_reason && (
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 block mb-0.5">
                        Motivo da nota NPS:
                      </span>
                      <p className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
                        "{response.nps_reason}"
                      </p>
                    </div>
                  )}

                  {response.nps_improvement && (
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 block mb-0.5">
                        O que faria a nota ser mais alta:
                      </span>
                      <p className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
                        "{response.nps_improvement}"
                      </p>
                    </div>
                  )}

                  {response.renewal_intent && (
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 block mb-0.5">
                        Intenção de renovação ou novas contratações:
                      </span>
                      <p className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
                        "{response.renewal_intent}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Perguntas Abertas & Comentários */}
            {(response.positive_highlights ||
              response.points_to_improve ||
              response.additional_services_needed ||
              response.final_comments) && (
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-mono text-[#8CC63F] uppercase tracking-wider block font-semibold">
                  Comentários e Observações do Cliente
                </span>
                <div className="space-y-2">
                  {response.positive_highlights && (
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-mono text-emerald-400 block mb-0.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Pontos Positivos & Destaques:
                      </span>
                      <p className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
                        {response.positive_highlights}
                      </p>
                    </div>
                  )}

                  {response.points_to_improve && (
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-mono text-amber-400 block mb-0.5 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        Oportunidades de Melhoria:
                      </span>
                      <p className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
                        {response.points_to_improve}
                      </p>
                    </div>
                  )}

                  {response.additional_services_needed && (
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-mono text-sky-400 block mb-0.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Novas Necessidades / Outros Serviços:
                      </span>
                      <p className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
                        {response.additional_services_needed}
                      </p>
                    </div>
                  )}

                  {response.final_comments && (
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 block mb-0.5 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        Comentários Finais:
                      </span>
                      <p className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
                        {response.final_comments}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Autorização de Contato */}
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Autorização para Contato Posterior
                </span>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  {response.contact_authorized
                    ? 'O cliente autorizou contato posterior da equipe Condutiva.'
                    : 'O cliente optou por não receber contato posterior.'}
                </p>
              </div>
              <Badge
                className={
                  response.contact_authorized
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] px-2.5 py-0.5 gap-1'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 text-[11px] px-2.5 py-0.5 gap-1'
                }
              >
                {response.contact_authorized ? (
                  <>
                    <Check className="w-3 h-3" />
                    Autorizado
                  </>
                ) : (
                  <>
                    <X className="w-3 h-3" />
                    Não autorizado
                  </>
                )}
              </Badge>
            </div>
          </div>
        )}

        <DialogFooter className="pt-3 border-t border-slate-800 flex justify-between items-center sm:justify-between">
          {onGoToCSATTab && isAnswered ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onGoToCSATTab}
              className="text-xs text-[#8CC63F] hover:text-[#7ab334] hover:bg-[#8CC63F]/10 gap-1 px-2"
            >
              <span>Ver no Painel Geral de CSAT</span>
              <ExternalLink className="w-3 h-3" />
            </Button>
          ) : (
            <span className="text-[11px] text-slate-500 font-mono">OS: {os.numero_os}</span>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="bg-slate-800 border-slate-700 text-slate-300 hover:text-white text-xs"
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
