import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Building2, FileSpreadsheet, Send, ShieldAlert, User, Zap } from 'lucide-react'
import { CSATReviewStep } from './CSATReviewStep'
import type { ContractRecord, CSATSubmissionData, ProblemResolvedOption } from '@/types'

interface CSATShortFormProps {
  contract: ContractRecord
  isSubmitting: boolean
  onSubmit: (data: CSATSubmissionData) => Promise<void>
  onBack: () => void
}

type RenewalIntentOption = 'Sim' | 'Talvez' | 'Não'

export function CSATShortForm({ contract, isSubmitting, onSubmit, onBack }: CSATShortFormProps) {
  const todayFormatted = new Date().toISOString().slice(0, 10)

  // 1) "Qual a chance de você recomendar a Condutiva?" — escala de 0 a 10
  const [npsScore, setNpsScore] = React.useState<number | null>(null)

  // 2) "O problema ou solicitação foi resolvido?" — opções: Sim, Não, Não se aplica
  const [problemResolved, setProblemResolved] = React.useState<ProblemResolvedOption | null>(null)

  // 3) "Qual sua satisfação com o atendimento recebido?" — nota de 1 a 5
  const [scoreCustomerService, setScoreCustomerService] = React.useState<number | null>(null)

  // 4) "Qual sua satisfação com a execução técnica?" — nota de 1 a 5
  const [scoreTechnicalExecution, setScoreTechnicalExecution] = React.useState<number | null>(null)

  // 5) "Você pretende renovar ou contratar novamente este serviço com a Condutiva?" — opções: Sim, Talvez, Não
  const [renewalIntent, setRenewalIntent] = React.useState<RenewalIntentOption | null>(null)

  // Ao final:
  // - Campo aberto de observações (textarea, opcional)
  const [finalComments, setFinalComments] = React.useState('')

  // - Checkbox: "Autorizo a Condutiva a entrar em contato para aprofundar este feedback."
  const [contactAuthorized, setContactAuthorized] = React.useState(false)

  // Estado para controlar a exibição do resumo de revisão antes do envio definitivo
  const [isReviewing, setIsReviewing] = React.useState(false)

  // Validação: 5 perguntas são obrigatórias
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const validate = (): boolean => {
    const errs: Record<string, string> = {}

    if (npsScore === null) {
      errs.npsScore =
        'Pergunta 1 obrigatória: selecione uma nota de 0 a 10 para a chance de recomendar a Condutiva.'
    }
    if (!problemResolved) {
      errs.problemResolved =
        'Pergunta 2 obrigatória: informe se o problema ou solicitação foi resolvido.'
    }
    if (scoreCustomerService === null) {
      errs.scoreCustomerService =
        'Pergunta 3 obrigatória: avalie a sua satisfação com o atendimento recebido (1 a 5).'
    }
    if (scoreTechnicalExecution === null) {
      errs.scoreTechnicalExecution =
        'Pergunta 4 obrigatória: avalie a sua satisfação com a execução técnica (1 a 5).'
    }
    if (!renewalIntent) {
      errs.renewalIntent =
        'Pergunta 5 obrigatória: informe se pretende renovar ou contratar novamente.'
    }

    setErrors(errs)
    if (Object.keys(errs).length > 0) {
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
      formVersion: 'curto',

      // Identificação pré-preenchida do contrato validado
      clientName: contract.client_name,
      evaluationDate: todayFormatted,
      respondentName: contract.client_name,
      respondentRole: 'Cliente / Representante da OS',
      serviceEvaluated: 'Atendimento Técnico Conforme Ordem de Serviço',
      technicianName: contract.technician_name,

      // Perguntas centrais da Opção 2
      problemResolved: problemResolved!,
      scoreCustomerService: scoreCustomerService!,
      scoreTechnicalExecution: scoreTechnicalExecution!,
      scoreGeneralSatisfaction: scoreCustomerService!, // Reuso/espelhamento para satisfação geral
      npsScore: npsScore!,
      renewalIntent: renewalIntent!,

      // Observações opcionais
      finalComments: finalComments.trim(),

      // Autorização de contato
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
    <form onSubmit={handleOpenReview} className="space-y-6 animate-in fade-in duration-300">
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
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-800 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-600" />
          Aplicação Rápida • Versão Curta
        </span>
      </div>

      {/* Main Title */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
          Avaliação Rápida CSAT — Versão Curta
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Responda a estas 5 perguntas objetivas sobre o atendimento executado pela Condutiva na OS{' '}
          <strong className="text-slate-900 font-mono">{contract.service_order_number}</strong>.
          Leva cerca de 2 minutos.
        </p>
      </div>

      {/* Identificação: resumo compacto no topo pré-preenchido do contrato validado */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-700">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#4d7c0f]" />
              <span className="text-slate-500">Cliente / Empresa:</span>
              <strong className="font-semibold text-slate-900">{contract.client_name}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-[#4d7c0f]" />
              <span className="text-slate-500">Contrato:</span>
              <span className="font-mono font-bold text-slate-900">{contract.contract_number}</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">OS:</span>
              <span className="font-mono font-bold text-slate-900">
                {contract.service_order_number}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#4d7c0f]" />
              <span className="text-slate-500">Técnico Condutiva:</span>
              <span className="font-semibold text-slate-900">{contract.technician_name}</span>
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 self-start sm:self-center">
            Dados vinculados
          </span>
        </div>
      </div>

      {/* Alerta de validação */}
      {Object.keys(errors).length > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-xs flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="block font-bold">
              Por favor, responda às 5 perguntas obrigatórias:
            </strong>
            <ul className="list-disc pl-4 space-y-0.5 text-rose-900">
              {Object.values(errors).map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* PERGUNTA 1: "Qual a chance de você recomendar a Condutiva?" — escala de 0 a 10 */}
      <Card
        className={`border bg-white shadow-xs overflow-hidden transition-all ${
          errors.npsScore ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-200'
        }`}
      >
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#8CC63F] text-slate-950 text-xs font-black flex items-center justify-center">
              1
            </span>
            <h2 className="text-xs font-bold uppercase tracking-wider">
              Recomendação da Condutiva
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-200 font-mono">
            {npsScore !== null ? `Nota: ${npsScore} / 10` : 'Escala 0 a 10'}
          </span>
        </div>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label className="text-sm font-bold text-slate-900 block">
              Qual a chance de você recomendar a Condutiva?{' '}
              <span className="text-rose-600 font-bold">*</span>
            </Label>
            <p className="text-xs text-slate-500 mt-1">
              Em uma escala de 0 a 10, sendo 0 &quot;Muito improvável&quot; e 10 &quot;Com certeza
              recomendaria&quot;.
            </p>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5 pt-1">
            {Array.from({ length: 11 }, (_, i) => i).map((score) => {
              const isSelected = npsScore === score
              let colorClasses = 'border-slate-200 hover:border-slate-400 text-slate-700 bg-white'
              if (isSelected) {
                if (score <= 6) {
                  colorClasses = 'border-rose-500 bg-rose-500 text-white font-bold shadow-xs'
                } else if (score <= 8) {
                  colorClasses = 'border-amber-500 bg-amber-500 text-slate-950 font-bold shadow-xs'
                } else {
                  colorClasses =
                    'border-[#8CC63F] bg-[#8CC63F] text-slate-950 font-black shadow-xs ring-2 ring-[#8CC63F]/40'
                }
              }
              return (
                <button
                  key={score}
                  type="button"
                  onClick={() => {
                    setNpsScore(score)
                    if (errors.npsScore) {
                      setErrors((prev) => {
                        const copy = { ...prev }
                        delete copy.npsScore
                        return copy
                      })
                    }
                  }}
                  className={`py-3 rounded-lg border text-sm font-mono transition-all text-center cursor-pointer ${colorClasses}`}
                >
                  {score}
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1">
            <span>0 = Muito improvável</span>
            {npsScore !== null ? (
              <span className="text-slate-900 font-bold">Nota selecionada: {npsScore}</span>
            ) : (
              <span className="text-slate-400 italic">Selecione uma nota</span>
            )}
            <span>10 = Com certeza recomendaria</span>
          </div>
          {errors.npsScore && (
            <p className="text-xs text-rose-600 font-medium">{errors.npsScore}</p>
          )}
        </CardContent>
      </Card>

      {/* PERGUNTA 2: "O problema ou solicitação foi resolvido?" — opções: Sim, Não, Não se aplica */}
      <Card
        className={`border bg-white shadow-xs overflow-hidden transition-all ${
          errors.problemResolved ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-200'
        }`}
      >
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-[#8CC63F] text-slate-950 text-xs font-black flex items-center justify-center">
            2
          </span>
          <h2 className="text-xs font-bold uppercase tracking-wider">Resolução da Demanda</h2>
        </div>
        <CardContent className="p-6 space-y-3">
          <Label className="text-sm font-bold text-slate-900 block">
            O problema ou solicitação foi resolvido?{' '}
            <span className="text-rose-600 font-bold">*</span>
          </Label>

          <RadioGroup
            value={problemResolved || ''}
            onValueChange={(val) => {
              setProblemResolved(val as ProblemResolvedOption)
              if (errors.problemResolved) {
                setErrors((prev) => {
                  const copy = { ...prev }
                  delete copy.problemResolved
                  return copy
                })
              }
            }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1"
          >
            <label
              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                problemResolved === 'sim'
                  ? 'border-[#8CC63F] bg-[#8CC63F]/10 text-slate-900 font-semibold ring-1 ring-[#8CC63F]/40'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <RadioGroupItem value="sim" id="short-prob-sim" />
              <span className="text-sm">Sim</span>
            </label>

            <label
              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                problemResolved === 'nao'
                  ? 'border-rose-400 bg-rose-50 text-slate-900 font-semibold ring-1 ring-rose-300'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <RadioGroupItem value="nao" id="short-prob-nao" />
              <span className="text-sm">Não</span>
            </label>

            <label
              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                problemResolved === 'nao_se_aplica'
                  ? 'border-slate-400 bg-slate-100 text-slate-900 font-semibold ring-1 ring-slate-400'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <RadioGroupItem value="nao_se_aplica" id="short-prob-na" />
              <span className="text-sm">Não se aplica</span>
            </label>
          </RadioGroup>
          {errors.problemResolved && (
            <p className="text-xs text-rose-600 font-medium">{errors.problemResolved}</p>
          )}
        </CardContent>
      </Card>

      {/* PERGUNTA 3: "Qual sua satisfação com o atendimento recebido?" — nota de 1 a 5 */}
      <Card
        className={`border bg-white shadow-xs overflow-hidden transition-all ${
          errors.scoreCustomerService ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-200'
        }`}
      >
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#8CC63F] text-slate-950 text-xs font-black flex items-center justify-center">
              3
            </span>
            <h2 className="text-xs font-bold uppercase tracking-wider">Atendimento Recebido</h2>
          </div>
          <span className="text-xs font-bold text-slate-200 font-mono">
            {scoreCustomerService !== null ? `Nota: ${scoreCustomerService} / 5` : 'Nota de 1 a 5'}
          </span>
        </div>
        <CardContent className="p-6 space-y-4">
          <Label className="text-sm font-bold text-slate-900 block">
            Qual sua satisfação com o atendimento recebido?{' '}
            <span className="text-rose-600 font-bold">*</span>
          </Label>

          <Rating1to5Short
            value={scoreCustomerService}
            onChange={(val) => {
              setScoreCustomerService(val)
              if (errors.scoreCustomerService) {
                setErrors((prev) => {
                  const copy = { ...prev }
                  delete copy.scoreCustomerService
                  return copy
                })
              }
            }}
          />
          {errors.scoreCustomerService && (
            <p className="text-xs text-rose-600 font-medium">{errors.scoreCustomerService}</p>
          )}
        </CardContent>
      </Card>

      {/* PERGUNTA 4: "Qual sua satisfação com a execução técnica?" — nota de 1 a 5 */}
      <Card
        className={`border bg-white shadow-xs overflow-hidden transition-all ${
          errors.scoreTechnicalExecution
            ? 'border-rose-400 ring-1 ring-rose-300'
            : 'border-slate-200'
        }`}
      >
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#8CC63F] text-slate-950 text-xs font-black flex items-center justify-center">
              4
            </span>
            <h2 className="text-xs font-bold uppercase tracking-wider">Execução Técnica</h2>
          </div>
          <span className="text-xs font-bold text-slate-200 font-mono">
            {scoreTechnicalExecution !== null
              ? `Nota: ${scoreTechnicalExecution} / 5`
              : 'Nota de 1 a 5'}
          </span>
        </div>
        <CardContent className="p-6 space-y-4">
          <Label className="text-sm font-bold text-slate-900 block">
            Qual sua satisfação com a execução técnica?{' '}
            <span className="text-rose-600 font-bold">*</span>
          </Label>

          <Rating1to5Short
            value={scoreTechnicalExecution}
            onChange={(val) => {
              setScoreTechnicalExecution(val)
              if (errors.scoreTechnicalExecution) {
                setErrors((prev) => {
                  const copy = { ...prev }
                  delete copy.scoreTechnicalExecution
                  return copy
                })
              }
            }}
          />
          {errors.scoreTechnicalExecution && (
            <p className="text-xs text-rose-600 font-medium">{errors.scoreTechnicalExecution}</p>
          )}
        </CardContent>
      </Card>

      {/* PERGUNTA 5: "Você pretende renovar ou contratar novamente este serviço com a Condutiva?" — opções: Sim, Talvez, Não */}
      <Card
        className={`border bg-white shadow-xs overflow-hidden transition-all ${
          errors.renewalIntent ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-200'
        }`}
      >
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-[#8CC63F] text-slate-950 text-xs font-black flex items-center justify-center">
            5
          </span>
          <h2 className="text-xs font-bold uppercase tracking-wider">
            Intenção de Renovação / Nova Contratação
          </h2>
        </div>
        <CardContent className="p-6 space-y-3">
          <Label className="text-sm font-bold text-slate-900 block">
            Você pretende renovar ou contratar novamente este serviço com a Condutiva?{' '}
            <span className="text-rose-600 font-bold">*</span>
          </Label>

          <RadioGroup
            value={renewalIntent || ''}
            onValueChange={(val) => {
              setRenewalIntent(val as RenewalIntentOption)
              if (errors.renewalIntent) {
                setErrors((prev) => {
                  const copy = { ...prev }
                  delete copy.renewalIntent
                  return copy
                })
              }
            }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1"
          >
            <label
              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                renewalIntent === 'Sim'
                  ? 'border-[#8CC63F] bg-[#8CC63F]/10 text-slate-900 font-semibold ring-1 ring-[#8CC63F]/40'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <RadioGroupItem value="Sim" id="renewal-sim" />
              <span className="text-sm font-medium">Sim</span>
            </label>

            <label
              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                renewalIntent === 'Talvez'
                  ? 'border-amber-400 bg-amber-50 text-slate-900 font-semibold ring-1 ring-amber-300'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <RadioGroupItem value="Talvez" id="renewal-talvez" />
              <span className="text-sm font-medium">Talvez</span>
            </label>

            <label
              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                renewalIntent === 'Não'
                  ? 'border-rose-400 bg-rose-50 text-slate-900 font-semibold ring-1 ring-rose-300'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <RadioGroupItem value="Não" id="renewal-nao" />
              <span className="text-sm font-medium">Não</span>
            </label>
          </RadioGroup>
          {errors.renewalIntent && (
            <p className="text-xs text-rose-600 font-medium">{errors.renewalIntent}</p>
          )}
        </CardContent>
      </Card>

      {/* AO FINAL: Observações (opcional) & Checkbox de contato */}
      <Card className="border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center">
            +
          </span>
          <h2 className="text-xs font-bold uppercase tracking-wider">
            Observações e Autorização de Contato
          </h2>
        </div>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label
              htmlFor="shortFinalComments"
              className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5"
            >
              Observações gerais <span className="text-slate-400 font-normal">(opcional)</span>
            </Label>
            <Textarea
              id="shortFinalComments"
              rows={3}
              value={finalComments}
              onChange={(e) => setFinalComments(e.target.value)}
              placeholder="Espaço livre para observações, elogios ou sugestões sobre este atendimento..."
              className="text-xs leading-relaxed"
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
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
            Atendimento: {contract.client_name} ({contract.contract_number} /{' '}
            {contract.service_order_number})
          </p>
          <p className="mt-0.5 text-slate-500">
            Ao enviar, a situação do contrato em /contratos será atualizada para
            &quot;respondido&quot;.
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

function Rating1to5Short({
  value,
  onChange,
}: {
  value: number | null
  onChange: (val: number) => void
}) {
  const labels: Record<number, string> = {
    1: 'Muito insatisfeito',
    2: 'Insatisfeito',
    3: 'Regular',
    4: 'Satisfeito',
    5: 'Muito satisfeito',
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
              <span className="text-[10px] hidden sm:block text-slate-600 line-clamp-1">
                {labels[score]}
              </span>
            </button>
          )
        })}
      </div>
      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
        <span>1 = Muito insatisfeito</span>
        {value !== null ? (
          <span className="text-slate-900 font-bold">{labels[value]}</span>
        ) : (
          <span className="text-slate-400 italic">Selecione uma nota de 1 a 5</span>
        )}
        <span>5 = Muito satisfeito</span>
      </div>
    </div>
  )
}
