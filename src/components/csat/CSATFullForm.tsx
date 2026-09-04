import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  FileCheck,
  FileSpreadsheet,
  HelpCircle,
  Send,
  Star,
  User,
  ShieldAlert,
} from 'lucide-react'
import { CSATReviewStep } from './CSATReviewStep'
import type { ContractRecord, CSATSubmissionData, ProblemResolvedOption } from '@/types'

interface CSATFullFormProps {
  contract: ContractRecord
  isSubmitting: boolean
  onSubmit: (data: CSATSubmissionData) => Promise<void>
  onBack: () => void
}

export function CSATFullForm({ contract, isSubmitting, onSubmit, onBack }: CSATFullFormProps) {
  // Today's date in YYYY-MM-DD
  const todayFormatted = new Date().toISOString().slice(0, 10)

  // Identificação
  const [clientName, setClientName] = React.useState(contract.client_name)
  const [evaluationDate, setEvaluationDate] = React.useState(todayFormatted)
  const [respondentName, setRespondentName] = React.useState('')
  const [respondentRole, setRespondentRole] = React.useState('')
  const [serviceEvaluated, setServiceEvaluated] = React.useState('')
  const [technicianName, setTechnicianName] = React.useState(contract.technician_name)

  // Resolução direta
  const [problemResolved, setProblemResolved] = React.useState<ProblemResolvedOption>('sim')

  // Seções de avaliação (1 a 5)
  const [scoreGeneral, setScoreGeneral] = React.useState<number>(5)
  const [scoreTechnical, setScoreTechnical] = React.useState<number>(5)
  const [scoreService, setScoreService] = React.useState<number>(5)
  const [scoreValue, setScoreValue] = React.useState<number>(5)

  // Lealdade (NPS 0 a 10)
  const [npsScore, setNpsScore] = React.useState<number>(10)
  const [npsReason, setNpsReason] = React.useState('')
  const [npsImprovement, setNpsImprovement] = React.useState('')
  const [renewalIntent, setRenewalIntent] = React.useState('')

  // Perguntas abertas
  const [positiveHighlights, setPositiveHighlights] = React.useState('')
  const [pointsToImprove, setPointsToImprove] = React.useState('')
  const [additionalServicesNeeded, setAdditionalServicesNeeded] = React.useState('')
  const [finalComments, setFinalComments] = React.useState('')

  // Checkbox de autorização
  const [contactAuthorized, setContactAuthorized] = React.useState(false)

  // Estado para controlar a exibição do resumo de revisão antes do envio definitivo
  const [isReviewing, setIsReviewing] = React.useState(false)

  // Form errors
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!clientName.trim()) errs.clientName = 'Informe o cliente ou empresa.'
    if (!evaluationDate.trim()) errs.evaluationDate = 'Informe a data da avaliação.'
    if (!respondentName.trim()) errs.respondentName = 'Informe o responsável pelo preenchimento.'
    if (!respondentRole.trim()) errs.respondentRole = 'Informe o cargo ou função do responsável.'
    if (!serviceEvaluated.trim()) errs.serviceEvaluated = 'Informe o serviço avaliado.'
    if (!technicianName.trim()) errs.technicianName = 'Informe o técnico responsável da Condutiva.'
    if (!problemResolved) errs.problemResolved = 'Selecione se o problema foi resolvido.'

    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      // scroll to top or alert
      window.scrollTo({ top: 120, behavior: 'smooth' })
      return false
    }
    return true
  }

  const getSubmissionPayload = (): CSATSubmissionData => {
    return {
      contractId: contract.id,
      contractNumber: contract.contract_number,
      serviceOrderNumber: contract.service_order_number,
      formVersion: 'completo',

      clientName,
      evaluationDate,
      respondentName,
      respondentRole,
      serviceEvaluated,
      technicianName,

      problemResolved,

      scoreGeneralSatisfaction: scoreGeneral,
      scoreTechnicalExecution: scoreTechnical,
      scoreCustomerService: scoreService,
      scorePerceivedValue: scoreValue,

      npsScore,
      npsReason,
      npsImprovement,
      renewalIntent,

      positiveHighlights,
      pointsToImprove,
      additionalServicesNeeded,
      finalComments,

      contactAuthorized,
    }
  }

  const handleOpenReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || isSubmitting) return
    setIsReviewing(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleConfirmSubmit = async () => {
    if (isSubmitting) return
    const payload = getSubmissionPayload()
    await onSubmit(payload)
  }

  if (isReviewing) {
    return (
      <CSATReviewStep
        data={getSubmissionPayload()}
        isSubmitting={isSubmitting}
        onConfirm={handleConfirmSubmit}
        onBack={() => {
          setIsReviewing(false)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />
    )
  }

  return (
    <form onSubmit={handleOpenReview} className="space-y-8 animate-in fade-in duration-300">
      {/* Navigation header */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-slate-600 hover:text-slate-900 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Voltar às opções
        </Button>
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#4d7c0f] bg-[#8CC63F]/15 px-2.5 py-1 rounded">
          Formulário Completo • 7 Seções
        </span>
      </div>

      {/* Main Title */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
          Avaliação de Satisfação CSAT — Formulário Completo
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Preencha os campos abaixo com a sua percepção técnica e operacional sobre o atendimento
          prestado. Campos marcados com <span className="text-rose-600 font-bold">*</span> são de
          preenchimento obrigatório.
        </p>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-xs flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Campos pendentes de preenchimento:</strong>
            <p className="mt-1">
              Por favor, verifique os campos obrigatórios em destaque antes de prosseguir com o
              envio.
            </p>
          </div>
        </div>
      )}

      {/* 1. SEÇÃO IDENTIFICAÇÃO */}
      <Card className="border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#8CC63F] text-slate-950 text-xs font-black flex items-center justify-center">
              1
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider">
              Identificação do Atendimento
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {contract.contract_number} / {contract.service_order_number}
          </span>
        </div>

        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="clientName"
                className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5"
              >
                Cliente ou empresa <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Nome da empresa"
                className={`text-sm ${errors.clientName ? 'border-rose-400 focus:border-rose-500' : ''}`}
              />
              {errors.clientName && (
                <span className="text-[11px] text-rose-600 mt-1 block">{errors.clientName}</span>
              )}
            </div>

            <div>
              <Label
                htmlFor="evaluationDate"
                className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5"
              >
                Data da avaliação <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="evaluationDate"
                type="date"
                value={evaluationDate}
                onChange={(e) => setEvaluationDate(e.target.value)}
                className={`text-sm font-mono ${errors.evaluationDate ? 'border-rose-400 focus:border-rose-500' : ''}`}
              />
              {errors.evaluationDate && (
                <span className="text-[11px] text-rose-600 mt-1 block">
                  {errors.evaluationDate}
                </span>
              )}
            </div>

            <div>
              <Label
                htmlFor="respondentName"
                className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5"
              >
                Responsável pelo preenchimento <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="respondentName"
                value={respondentName}
                onChange={(e) => setRespondentName(e.target.value)}
                placeholder="Seu nome completo"
                className={`text-sm ${errors.respondentName ? 'border-rose-400 focus:border-rose-500' : ''}`}
              />
              {errors.respondentName && (
                <span className="text-[11px] text-rose-600 mt-1 block">
                  {errors.respondentName}
                </span>
              )}
            </div>

            <div>
              <Label
                htmlFor="respondentRole"
                className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5"
              >
                Cargo ou função <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="respondentRole"
                value={respondentRole}
                onChange={(e) => setRespondentRole(e.target.value)}
                placeholder="Ex.: Gerente de Manutenção, Engenheiro de Automação"
                className={`text-sm ${errors.respondentRole ? 'border-rose-400 focus:border-rose-500' : ''}`}
              />
              {errors.respondentRole && (
                <span className="text-[11px] text-rose-600 mt-1 block">
                  {errors.respondentRole}
                </span>
              )}
            </div>

            <div>
              <Label
                htmlFor="serviceEvaluated"
                className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5"
              >
                Serviço avaliado <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="serviceEvaluated"
                value={serviceEvaluated}
                onChange={(e) => setServiceEvaluated(e.target.value)}
                placeholder="Ex.: Calibração e Manutenção de Válvulas / Instrumentação"
                className={`text-sm ${errors.serviceEvaluated ? 'border-rose-400 focus:border-rose-500' : ''}`}
              />
              {errors.serviceEvaluated && (
                <span className="text-[11px] text-rose-600 mt-1 block">
                  {errors.serviceEvaluated}
                </span>
              )}
            </div>

            <div>
              <Label
                htmlFor="technicianName"
                className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5"
              >
                Técnico da Condutiva responsável pelo atendimento{' '}
                <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="technicianName"
                value={technicianName}
                onChange={(e) => setTechnicianName(e.target.value)}
                placeholder="Nome do técnico da Condutiva"
                className={`text-sm ${errors.technicianName ? 'border-rose-400 focus:border-rose-500' : ''}`}
              />
              {errors.technicianName && (
                <span className="text-[11px] text-rose-600 mt-1 block">
                  {errors.technicianName}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. RESOLUÇÃO DIRETA DO PROBLEMA */}
      <Card className="border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-[#8CC63F] text-slate-950 text-xs font-black flex items-center justify-center">
            2
          </span>
          <h2 className="text-sm font-bold uppercase tracking-wider">Resolução da Demanda</h2>
        </div>

        <CardContent className="p-6 space-y-3">
          <Label className="text-sm font-bold text-slate-900 block">
            O problema ou solicitação foi resolvido? <span className="text-rose-600">*</span>
          </Label>
          <p className="text-xs text-slate-500">
            Indique se o objetivo da ordem de serviço executada pela Condutiva foi alcançado com
            sucesso.
          </p>

          <RadioGroup
            value={problemResolved}
            onValueChange={(val) => setProblemResolved(val as ProblemResolvedOption)}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2"
          >
            <label
              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                problemResolved === 'sim'
                  ? 'border-[#8CC63F] bg-[#8CC63F]/10 text-slate-900 font-semibold shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <RadioGroupItem value="sim" id="prob-sim" />
              <span className="text-sm">Sim</span>
            </label>

            <label
              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                problemResolved === 'nao'
                  ? 'border-rose-400 bg-rose-50 text-slate-900 font-semibold shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <RadioGroupItem value="nao" id="prob-nao" />
              <span className="text-sm">Não</span>
            </label>

            <label
              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                problemResolved === 'nao_se_aplica'
                  ? 'border-slate-400 bg-slate-100 text-slate-900 font-semibold shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <RadioGroupItem value="nao_se_aplica" id="prob-na" />
              <span className="text-sm">Não se aplica</span>
            </label>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* 3, 4, 5: BLOCOS DE AVALIAÇÃO DE NOTAS 1 A 5 */}
      <Card className="border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#8CC63F] text-slate-950 text-xs font-black flex items-center justify-center">
              3
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider">
              Dimensões de Avaliação do Serviço (Escala de 1 a 5)
            </h2>
          </div>
          <span className="text-[11px] text-slate-300 hidden sm:inline">
            1 = Discordo totalmente | 5 = Concordo totalmente
          </span>
        </div>

        <CardContent className="p-6 space-y-6 divide-y divide-slate-100">
          {/* Dimensão: Satisfação Geral */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#4d7c0f] font-mono">
                  Seção 3.1 • Satisfação Geral
                </span>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">
                  De modo geral, estou plenamente satisfeito(a) com a qualidade e o resultado do
                  serviço entregue pela Condutiva.
                </p>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-700 self-start sm:self-center shrink-0">
                Nota: {scoreGeneral} / 5
              </span>
            </div>
            <Rating1to5 value={scoreGeneral} onChange={setScoreGeneral} />
          </div>

          {/* Dimensão: Execução Técnica */}
          <div className="space-y-3 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#4d7c0f] font-mono">
                  Seção 3.2 • Execução Técnica
                </span>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">
                  A equipe técnica demonstrou domínio dos procedimentos, ferramentas adequadas,
                  precisão diagnóstica e rigor técnico na intervenção.
                </p>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-700 self-start sm:self-center shrink-0">
                Nota: {scoreTechnical} / 5
              </span>
            </div>
            <Rating1to5 value={scoreTechnical} onChange={setScoreTechnical} />
          </div>

          {/* Dimensão: Atendimento */}
          <div className="space-y-3 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#4d7c0f] font-mono">
                  Seção 3.3 • Atendimento e Relacionamento
                </span>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">
                  A postura, pontualidade, clareza na comunicação, cordialidade e disponibilidade do
                  profissional atenderam às expectativas da nossa operação.
                </p>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-700 self-start sm:self-center shrink-0">
                Nota: {scoreService} / 5
              </span>
            </div>
            <Rating1to5 value={scoreService} onChange={setScoreService} />
          </div>

          {/* Dimensão: Valor Percebido */}
          <div className="space-y-3 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#4d7c0f] font-mono">
                  Seção 3.4 • Valor Percebido
                </span>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">
                  O serviço executado agregou valor concreto à confiabilidade, segurança e
                  continuidade operacional da nossa planta.
                </p>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-700 self-start sm:self-center shrink-0">
                Nota: {scoreValue} / 5
              </span>
            </div>
            <Rating1to5 value={scoreValue} onChange={setScoreValue} />
          </div>
        </CardContent>
      </Card>

      {/* 4. LEALDADE (NPS) */}
      <Card className="border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#8CC63F] text-slate-950 text-xs font-black flex items-center justify-center">
              4
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider">
              Lealdade e Recomendação (NPS)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Escala 0 a 10</span>
        </div>

        <CardContent className="p-6 space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-bold text-slate-900 block">
              Em uma escala de 0 a 10, qual a probabilidade de você recomendar a Unidade de Serviços
              da Condutiva para um colega ou outra empresa do setor?{' '}
              <span className="text-rose-600">*</span>
            </Label>
            <p className="text-xs text-slate-500">
              0 significa &quot;Muito improvável&quot; e 10 significa &quot;Com certeza
              recomendaria&quot;.
            </p>

            {/* 0 to 10 selector */}
            <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5 pt-2">
              {Array.from({ length: 11 }, (_, i) => i).map((score) => {
                const isSelected = npsScore === score
                let colorClasses = 'border-slate-200 hover:border-slate-400 text-slate-700 bg-white'
                if (isSelected) {
                  if (score <= 6) {
                    colorClasses = 'border-rose-500 bg-rose-500 text-white font-bold shadow-xs'
                  } else if (score <= 8) {
                    colorClasses =
                      'border-amber-500 bg-amber-500 text-slate-950 font-bold shadow-xs'
                  } else {
                    colorClasses =
                      'border-[#8CC63F] bg-[#8CC63F] text-slate-950 font-black shadow-xs ring-2 ring-[#8CC63F]/40'
                  }
                }
                return (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setNpsScore(score)}
                    className={`py-3 rounded-lg border text-sm font-mono transition-all text-center cursor-pointer ${colorClasses}`}
                  >
                    {score}
                  </button>
                )
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-1 pt-1">
              <span>0 = Muito improvável</span>
              <span className="text-slate-700 font-semibold">Nota selecionada: {npsScore}</span>
              <span>10 = Com certeza recomendaria</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <Label
                htmlFor="npsReason"
                className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5"
              >
                Qual o principal motivo para a sua nota?
              </Label>
              <Textarea
                id="npsReason"
                rows={3}
                value={npsReason}
                onChange={(e) => setNpsReason(e.target.value)}
                placeholder="Explique os fatores que mais influenciaram a sua avaliação..."
                className="text-xs leading-relaxed"
              />
            </div>

            <div>
              <Label
                htmlFor="npsImprovement"
                className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5"
              >
                O que a Condutiva precisaria fazer para receber uma nota ainda maior?
              </Label>
              <Textarea
                id="npsImprovement"
                rows={3}
                value={npsImprovement}
                onChange={(e) => setNpsImprovement(e.target.value)}
                placeholder="Ações, agilidade, relatórios ou outros pontos que fariam a diferença..."
                className="text-xs leading-relaxed"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <Label
              htmlFor="renewalIntent"
              className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5"
            >
              Você pretende renovar ou contratar novamente este serviço com a Condutiva?
            </Label>
            <Textarea
              id="renewalIntent"
              rows={2}
              value={renewalIntent}
              onChange={(e) => setRenewalIntent(e.target.value)}
              placeholder="Indique a intenção de continuidade da sua empresa para futuros atendimentos..."
              className="text-xs leading-relaxed"
            />
          </div>
        </CardContent>
      </Card>

      {/* 5. PERGUNTAS ABERTAS E FEEDBACK DETALHADO */}
      <Card className="border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-[#8CC63F] text-slate-950 text-xs font-black flex items-center justify-center">
            5
          </span>
          <h2 className="text-sm font-bold uppercase tracking-wider">Considerações Abertas</h2>
        </div>

        <CardContent className="p-6 space-y-4">
          <div>
            <Label
              htmlFor="positiveHighlights"
              className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5"
            >
              O que mais chamou atenção de forma positiva no atendimento?
            </Label>
            <Textarea
              id="positiveHighlights"
              rows={3}
              value={positiveHighlights}
              onChange={(e) => setPositiveHighlights(e.target.value)}
              placeholder="Destaques sobre o técnico, postura, rapidez, ferramental, clareza..."
              className="text-xs leading-relaxed"
            />
          </div>

          <div>
            <Label
              htmlFor="pointsToImprove"
              className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5"
            >
              O que a Condutiva poderia melhorar neste serviço?
            </Label>
            <Textarea
              id="pointsToImprove"
              rows={3}
              value={pointsToImprove}
              onChange={(e) => setPointsToImprove(e.target.value)}
              placeholder="Pontos de melhoria operacional, comunicação, prazos ou execução técnica..."
              className="text-xs leading-relaxed"
            />
          </div>

          <div>
            <Label
              htmlFor="additionalServicesNeeded"
              className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5"
            >
              Existe outro serviço que a Condutiva poderia oferecer para a sua operação?
            </Label>
            <Textarea
              id="additionalServicesNeeded"
              rows={3}
              value={additionalServicesNeeded}
              onChange={(e) => setAdditionalServicesNeeded(e.target.value)}
              placeholder="Demandas técnicas, manutenções, calibrações ou necessidades futuras da sua planta..."
              className="text-xs leading-relaxed"
            />
          </div>

          <div>
            <Label
              htmlFor="finalComments"
              className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5"
            >
              Comentários finais
            </Label>
            <Textarea
              id="finalComments"
              rows={3}
              value={finalComments}
              onChange={(e) => setFinalComments(e.target.value)}
              placeholder="Espaço livre para observações adicionais..."
              className="text-xs leading-relaxed"
            />
          </div>

          {/* Checkbox de contato */}
          <div className="pt-4 border-t border-slate-100">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <Checkbox
                checked={contactAuthorized}
                onCheckedChange={(checked) => setContactAuthorized(Boolean(checked))}
                className="mt-0.5 border-slate-400 data-[state=checked]:bg-[#8CC63F] data-[state=checked]:border-[#8CC63F] data-[state=checked]:text-slate-950"
              />
              <span className="text-xs text-slate-700 leading-relaxed font-medium">
                Autorizo a Condutiva a entrar em contato para aprofundar este feedback.
              </span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Submissão */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-600">
          <p className="font-semibold text-slate-800">
            Confirmação de envio para o Contrato {contract.contract_number} / OS{' '}
            {contract.service_order_number}
          </p>
          <p className="mt-0.5 text-slate-500">
            Ao clicar em &quot;Enviar Avaliação&quot;, suas respostas serão vinculadas
            permanentemente ao histórico do contrato.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isSubmitting}
            className="border-slate-300 text-slate-700 hover:bg-slate-100 flex-1 sm:flex-initial"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#8CC63F] hover:bg-[#7cb633] text-slate-950 font-black text-sm uppercase tracking-wide px-8 py-5 shadow-sm flex items-center justify-center gap-2 flex-1 sm:flex-initial cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Enviar</span>
          </Button>
        </div>
      </div>
    </form>
  )
}

function Rating1to5({ value, onChange }: { value: number; onChange: (val: number) => void }) {
  const labels: Record<number, string> = {
    1: 'Discordo totalmente',
    2: 'Discordo parcialmente',
    3: 'Neutro / Regular',
    4: 'Concordo parcialmente',
    5: 'Concordo totalmente',
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((score) => {
          const isSelected = value === score
          return (
            <button
              key={score}
              type="button"
              onClick={() => onChange(score)}
              className={`p-3 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                isSelected
                  ? 'border-[#8CC63F] bg-[#8CC63F]/15 text-slate-950 ring-2 ring-[#8CC63F]/50 font-bold'
                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="font-mono text-base font-black">{score}</span>
              <span className="text-[10px] hidden md:block text-slate-600 line-clamp-1">
                {labels[score]}
              </span>
            </button>
          )
        })}
      </div>
      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
        <span>1: Discordo totalmente</span>
        <span className="text-slate-800 font-semibold">{labels[value]}</span>
        <span>5: Concordo totalmente</span>
      </div>
    </div>
  )
}
