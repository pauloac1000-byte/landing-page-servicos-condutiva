import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  FileCheck,
  ArrowLeft,
  Send,
  Building2,
  FileSpreadsheet,
  User,
  Calendar,
  Wrench,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Loader2,
  Star,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react'
import type { CSATSubmissionData } from '@/types'

interface CSATReviewModalOrStepProps {
  data: CSATSubmissionData
  isSubmitting: boolean
  onConfirm: () => void | Promise<void>
  onBack: () => void
}

const SCORE_LABELS: Record<number, string> = {
  1: 'Muito insatisfeito / Discordo totalmente',
  2: 'Insatisfeito / Discordo parcialmente',
  3: 'Regular / Neutro',
  4: 'Satisfeito / Concordo parcialmente',
  5: 'Muito satisfeito / Concordo totalmente',
}

const PROBLEM_RESOLVED_LABELS: Record<string, string> = {
  sim: 'Sim',
  nao: 'Não',
  nao_se_aplica: 'Não se aplica',
}

export function CSATReviewStep({
  data,
  isSubmitting,
  onConfirm,
  onBack,
}: CSATReviewModalOrStepProps) {
  const isFull = data.formVersion === 'completo'

  const getNpsBadgeColor = (score: number) => {
    if (score <= 6) return 'bg-rose-500 text-white'
    if (score <= 8) return 'bg-amber-500 text-slate-950 font-bold'
    return 'bg-[#8CC63F] text-slate-950 font-black'
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Bar with back */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          disabled={isSubmitting}
          className="text-slate-600 hover:text-slate-900 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Voltar para edição
        </Button>
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#4d7c0f] bg-[#8CC63F]/15 px-2.5 py-1 rounded">
          Revisão de Respostas • {isFull ? 'Versão Completa' : 'Versão Curta'}
        </span>
      </div>

      {/* Header Banner */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8CC63F]/10 border border-[#8CC63F]/30 text-[#4d7c0f] text-xs font-semibold">
          <FileCheck className="w-3.5 h-3.5 text-[#8CC63F]" />
          <span>Confirmação prévia ao envio</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
          Resumo do Questionário Preenchido
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Por favor, confira as respostas registradas abaixo antes de confirmar o envio.
        </p>
      </div>

      {/* Dados do Contrato e Identificação */}
      <Card className="border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#8CC63F]" />
            Dados do Atendimento
          </span>
          <span className="text-[11px] font-mono text-slate-300">
            {data.contractNumber} / {data.serviceOrderNumber}
          </span>
        </div>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                Cliente / Empresa
              </span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                {data.clientName}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                Contrato / OS
              </span>
              <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">
                {data.contractNumber} • {data.serviceOrderNumber}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                Data da Avaliação
              </span>
              <span className="font-mono font-semibold text-slate-800 text-sm mt-0.5 block">
                {data.evaluationDate}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                Responsável pelo Preenchimento
              </span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                {data.respondentName} {data.respondentRole ? `(${data.respondentRole})` : ''}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                Técnico Condutiva
              </span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                {data.technicianName}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                Serviço Avaliado
              </span>
              <span className="font-semibold text-slate-800 mt-0.5 block line-clamp-2">
                {data.serviceEvaluated}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo das Perguntas e Respostas */}
      <Card className="border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <Star className="w-4 h-4 text-[#8CC63F]" />
            Perguntas e Respostas Registradas
          </span>
          <span className="text-xs font-mono text-slate-300">
            {isFull ? 'Formulário Completo' : 'Formulário Rápido (5 perguntas)'}
          </span>
        </div>

        <CardContent className="p-5 space-y-4 divide-y divide-slate-100">
          {/* Pergunta: Resolução do problema */}
          <div className="pt-2 first:pt-0 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-700">
                O problema ou solicitação foi resolvido?
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  data.problemResolved === 'sim'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : data.problemResolved === 'nao'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-slate-100 text-slate-700 border border-slate-300'
                }`}
              >
                {data.problemResolved === 'sim' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                )}
                {data.problemResolved === 'nao' && (
                  <XCircle className="w-3.5 h-3.5 text-rose-700" />
                )}
                {PROBLEM_RESOLVED_LABELS[data.problemResolved] || data.problemResolved}
              </span>
            </div>
          </div>

          {/* NPS */}
          <div className="pt-3 space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-700">
                {isFull
                  ? 'Probabilidade de recomendar a Unidade de Serviços da Condutiva (NPS 0 a 10)'
                  : 'Qual a chance de você recomendar a Condutiva? (Escala 0 a 10)'}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs ${getNpsBadgeColor(
                    data.npsScore,
                  )}`}
                >
                  {data.npsScore}
                </span>
                <span className="text-xs font-semibold text-slate-800">
                  {data.npsScore >= 9
                    ? 'Promotor (9-10)'
                    : data.npsScore >= 7
                      ? 'Neutro (7-8)'
                      : 'Detrator (0-6)'}
                </span>
              </div>
            </div>
            {data.npsReason && (
              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-md border border-slate-200/80">
                <strong className="text-slate-800">Motivo da nota:</strong> {data.npsReason}
              </p>
            )}
            {data.npsImprovement && (
              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-md border border-slate-200/80">
                <strong className="text-slate-800">O que faria a nota ser maior:</strong>{' '}
                {data.npsImprovement}
              </p>
            )}
          </div>

          {/* Notas 1 a 5 (Atendimento e Execução Técnica para ambos; Geral e Valor no Completo) */}
          {data.scoreCustomerService !== undefined && data.scoreCustomerService !== null && (
            <div className="pt-3 space-y-1">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-bold text-slate-700">
                  Satisfação com o Atendimento Recebido:
                </span>
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {data.scoreCustomerService} / 5 • {SCORE_LABELS[data.scoreCustomerService]}
                </span>
              </div>
            </div>
          )}

          {data.scoreTechnicalExecution !== undefined && data.scoreTechnicalExecution !== null && (
            <div className="pt-3 space-y-1">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-bold text-slate-700">Satisfação com a Execução Técnica:</span>
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {data.scoreTechnicalExecution} / 5 • {SCORE_LABELS[data.scoreTechnicalExecution]}
                </span>
              </div>
            </div>
          )}

          {isFull &&
            data.scoreGeneralSatisfaction !== undefined &&
            data.scoreGeneralSatisfaction !== null && (
              <div className="pt-3 space-y-1">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-slate-700">
                    Satisfação Geral com o Resultado:
                  </span>
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {data.scoreGeneralSatisfaction} / 5 •{' '}
                    {SCORE_LABELS[data.scoreGeneralSatisfaction]}
                  </span>
                </div>
              </div>
            )}

          {isFull &&
            data.scorePerceivedValue !== undefined &&
            data.scorePerceivedValue !== null && (
              <div className="pt-3 space-y-1">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-slate-700">
                    Percepção de Valor Agregado à Operação:
                  </span>
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {data.scorePerceivedValue} / 5 • {SCORE_LABELS[data.scorePerceivedValue]}
                  </span>
                </div>
              </div>
            )}

          {/* Intenção de Renovação / Contratação */}
          {data.renewalIntent && (
            <div className="pt-3 space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <span className="font-bold text-slate-700">
                  Pretende renovar ou contratar novamente este serviço com a Condutiva?
                </span>
                <span className="font-semibold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200 self-start sm:self-auto">
                  {data.renewalIntent}
                </span>
              </div>
            </div>
          )}

          {/* Perguntas abertas adicionais (Versão completa) */}
          {isFull && (
            <>
              {data.positiveHighlights && (
                <div className="pt-3 space-y-1">
                  <span className="text-xs font-bold text-slate-700 block">
                    Destaques positivos do atendimento:
                  </span>
                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200/80 leading-relaxed">
                    {data.positiveHighlights}
                  </p>
                </div>
              )}

              {data.pointsToImprove && (
                <div className="pt-3 space-y-1">
                  <span className="text-xs font-bold text-slate-700 block">
                    Pontos que a Condutiva pode melhorar:
                  </span>
                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200/80 leading-relaxed">
                    {data.pointsToImprove}
                  </p>
                </div>
              )}

              {data.additionalServicesNeeded && (
                <div className="pt-3 space-y-1">
                  <span className="text-xs font-bold text-slate-700 block">
                    Outros serviços de interesse para a operação:
                  </span>
                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200/80 leading-relaxed">
                    {data.additionalServicesNeeded}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Observações / comentários finais */}
          {data.finalComments && (
            <div className="pt-3 space-y-1">
              <span className="text-xs font-bold text-slate-700 block">
                Comentários / Observações finais:
              </span>
              <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200/80 leading-relaxed">
                {data.finalComments}
              </p>
            </div>
          )}

          {/* Autorização de contato */}
          <div className="pt-3 flex items-center gap-2 text-xs text-slate-700">
            <ShieldCheck
              className={`w-4 h-4 ${data.contactAuthorized ? 'text-emerald-600' : 'text-slate-400'}`}
            />
            <span>
              <strong>Autorização de contato para aprofundar feedback:</strong>{' '}
              {data.contactAuthorized ? 'Autorizado pelo cliente' : 'Não autorizado'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Caixa de Confirmação com a pergunta EXATA exigida: "Deseja enviar esta avaliação?" e botões "Enviar" e "Voltar" */}
      <Card className="border-2 border-[#8CC63F] bg-slate-950 text-white shadow-lg overflow-hidden">
        <CardContent className="p-6 sm:p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8CC63F]">
                Confirmação de Registro
              </span>
              {/* PERGUNTA EXATA REQUISITADA PELO USUÁRIO */}
              <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                Deseja enviar esta avaliação?
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                Suas respostas serão salvas na base de dados, vinculadas ao contrato{' '}
                <strong className="text-white font-mono">{data.contractNumber}</strong> e à OS{' '}
                <strong className="text-white font-mono">{data.serviceOrderNumber}</strong>, e
                encaminhadas por e-mail para a equipe técnica da Condutiva.
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2 border-t border-slate-800">
            {/* BOTÃO EXATO "Voltar" */}
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isSubmitting}
              className="w-full sm:w-auto border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 bg-transparent py-5 px-6 font-bold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>

            {/* BOTÃO EXATO "Enviar" */}
            <Button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-[#8CC63F] hover:bg-[#7cb633] text-slate-950 font-black text-sm uppercase tracking-wide py-5 px-8 shadow-lg shadow-[#8CC63F]/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Enviar</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
