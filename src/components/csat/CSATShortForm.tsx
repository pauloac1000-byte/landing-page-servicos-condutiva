import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Loader2, Send, ShieldAlert, Zap } from 'lucide-react'
import type { ContractRecord, CSATSubmissionData, ProblemResolvedOption } from '@/types'

interface CSATShortFormProps {
  contract: ContractRecord
  isSubmitting: boolean
  onSubmit: (data: CSATSubmissionData) => Promise<void>
  onBack: () => void
}

export function CSATShortForm({ contract, isSubmitting, onSubmit, onBack }: CSATShortFormProps) {
  const todayFormatted = new Date().toISOString().slice(0, 10)

  // 1. Identificação do respondente
  const [respondentName, setRespondentName] = React.useState('')
  const [respondentRole, setRespondentRole] = React.useState('')

  // 2. Resolução do problema (Sim, Não, Não se aplica)
  const [problemResolved, setProblemResolved] = React.useState<ProblemResolvedOption>('sim')

  // 3. Satisfação geral (1 a 5)
  const [scoreGeneral, setScoreGeneral] = React.useState<number>(5)

  // 4. Recomendação / NPS (0 a 10)
  const [npsScore, setNpsScore] = React.useState<number>(10)

  // 5. Comentário aberto essencial
  const [finalComments, setFinalComments] = React.useState('')

  // Checkbox de autorização
  const [contactAuthorized, setContactAuthorized] = React.useState(false)

  // Errors
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!respondentName.trim()) errs.respondentName = 'Informe o seu nome completo.'
    if (!respondentRole.trim()) errs.respondentRole = 'Informe o seu cargo ou função.'
    if (!problemResolved) errs.problemResolved = 'Selecione se o problema foi resolvido.'

    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      window.scrollTo({ top: 120, behavior: 'smooth' })
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || isSubmitting) return

    await onSubmit({
      contractId: contract.id,
      contractNumber: contract.contract_number,
      serviceOrderNumber: contract.service_order_number,
      formVersion: 'curto',

      clientName: contract.client_name,
      evaluationDate: todayFormatted,
      respondentName,
      respondentRole,
      serviceEvaluated: 'Atendimento Técnico Conforme Ordem de Serviço',
      technicianName: contract.technician_name,

      problemResolved,
      scoreGeneralSatisfaction: scoreGeneral,

      npsScore,
      finalComments,

      contactAuthorized,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
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
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-1 rounded flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-600" />
          Versão Curta • 5 Perguntas Essenciais
        </span>
      </div>

      {/* Main Title */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
          Avaliação Rápida CSAT — Versão Curta
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Preencha as 5 perguntas essenciais para compartilhar a sua percepção sobre o atendimento
          prestado pela Condutiva na OS{' '}
          <strong className="text-slate-900 font-mono">{contract.service_order_number}</strong>.
        </p>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-xs flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Campos pendentes de preenchimento:</strong>
            <p className="mt-1">
              Por favor, informe seu nome e cargo antes de prosseguir com o envio da avaliação
              rápida.
            </p>
          </div>
        </div>
      )}

      {/* Pergunta 1: Identificação do Responsável */}
      <Card className="border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-[#8CC63F] text-slate-950 text-xs font-black flex items-center justify-center">
            1
          </span>
          <h2 className="text-xs font-bold uppercase tracking-wider">
            Identificação do Responsável
          </h2>
        </div>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="shortRespondentName"
                className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5"
              >
                Seu nome completo <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="shortRespondentName"
                value={respondentName}
                onChange={(e) => setRespondentName(e.target.value)}
                placeholder="Nome do responsável pelo feedback"
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
                htmlFor="shortRespondentRole"
                className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5"
              >
                Seu cargo ou função <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="shortRespondentRole"
                value={respondentRole}
                onChange={(e) => setRespondentRole(e.target.value)}
                placeholder="Ex.: Coordenador de Manutenção"
                className={`text-sm ${errors.respondentRole ? 'border-rose-400 focus:border-rose-500' : ''}`}
              />
              {errors.respondentRole && (
                <span className="text-[11px] text-rose-600 mt-1 block">
                  {errors.respondentRole}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pergunta 2: O problema foi resolvido? */}
      <Card className="border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-[#8CC63F] text-slate-950 text-xs font-black flex items-center justify-center">
            2
          </span>
          <h2 className="text-xs font-bold uppercase tracking-wider">Resolução do Atendimento</h2>
        </div>
        <CardContent className="p-6 space-y-3">
          <Label className="text-sm font-bold text-slate-900 block">
            O problema ou solicitação foi resolvido? <span className="text-rose-600">*</span>
          </Label>

          <RadioGroup
            value={problemResolved}
            onValueChange={(val) => setProblemResolved(val as ProblemResolvedOption)}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1"
          >
            <label
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                problemResolved === 'sim'
                  ? 'border-[#8CC63F] bg-[#8CC63F]/10 text-slate-900 font-semibold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <RadioGroupItem value="sim" id="short-prob-sim" />
              <span className="text-sm">Sim</span>
            </label>

            <label
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                problemResolved === 'nao'
                  ? 'border-rose-400 bg-rose-50 text-slate-900 font-semibold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <RadioGroupItem value="nao" id="short-prob-nao" />
              <span className="text-sm">Não</span>
            </label>

            <label
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                problemResolved === 'nao_se_aplica'
                  ? 'border-slate-400 bg-slate-100 text-slate-900 font-semibold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <RadioGroupItem value="nao_se_aplica" id="short-prob-na" />
              <span className="text-sm">Não se aplica</span>
            </label>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Pergunta 3: Satisfação Geral (1 a 5) */}
      <Card className="border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#8CC63F] text-slate-950 text-xs font-black flex items-center justify-center">
              3
            </span>
            <h2 className="text-xs font-bold uppercase tracking-wider">
              Satisfação Geral com o Serviço
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-200">Nota: {scoreGeneral} / 5</span>
        </div>
        <CardContent className="p-6 space-y-4">
          <p className="text-sm font-semibold text-slate-900">
            De modo geral, como você avalia o serviço e a atuação técnica da Condutiva nesta ordem
            de serviço?
          </p>

          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((score) => {
              const isSelected = scoreGeneral === score
              const labels = [
                'Muito insatisfeito',
                'Insatisfeito',
                'Regular',
                'Satisfeito',
                'Muito satisfeito',
              ]
              return (
                <button
                  key={score}
                  type="button"
                  onClick={() => setScoreGeneral(score)}
                  className={`p-3 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? 'border-[#8CC63F] bg-[#8CC63F]/15 text-slate-950 ring-2 ring-[#8CC63F]/50 font-bold'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-mono text-base font-black">{score}</span>
                  <span className="text-[10px] hidden sm:block text-slate-600 line-clamp-1">
                    {labels[score - 1]}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span>1 = Discordo totalmente / Insatisfeito</span>
            <span>5 = Concordo totalmente / Plenamente satisfeito</span>
          </div>
        </CardContent>
      </Card>

      {/* Pergunta 4: NPS 0 a 10 */}
      <Card className="border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#8CC63F] text-slate-950 text-xs font-black flex items-center justify-center">
              4
            </span>
            <h2 className="text-xs font-bold uppercase tracking-wider">
              Recomendação da Condutiva (NPS)
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-200 font-mono">Nota: {npsScore} / 10</span>
        </div>
        <CardContent className="p-6 space-y-4">
          <p className="text-sm font-semibold text-slate-900">
            Em uma escala de 0 a 10, qual a probabilidade de você recomendar a Unidade de Serviços
            da Condutiva?
          </p>

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
                  onClick={() => setNpsScore(score)}
                  className={`py-3 rounded-lg border text-sm font-mono transition-all text-center cursor-pointer ${colorClasses}`}
                >
                  {score}
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span>0 = Muito improvável</span>
            <span>10 = Com certeza recomendaria</span>
          </div>
        </CardContent>
      </Card>

      {/* Pergunta 5: Comentário Aberto */}
      <Card className="border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-[#8CC63F] text-slate-950 text-xs font-black flex items-center justify-center">
            5
          </span>
          <h2 className="text-xs font-bold uppercase tracking-wider">
            Comentário ou Ponto de Destaque
          </h2>
        </div>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label
              htmlFor="shortFinalComments"
              className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5"
            >
              Observações gerais, elogios ou sugestões de melhoria
            </Label>
            <Textarea
              id="shortFinalComments"
              rows={3}
              value={finalComments}
              onChange={(e) => setFinalComments(e.target.value)}
              placeholder="Compartilhe em poucas linhas o que mais marcou o atendimento ou o que podemos aprimorar..."
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
          <p className="mt-0.5 text-slate-500">Tempo de resposta estimado: menos de 2 minutos.</p>
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
            className="bg-[#8CC63F] hover:bg-[#7cb633] text-slate-950 font-black text-sm uppercase tracking-wide px-8 py-5 shadow-sm flex items-center justify-center gap-2 flex-1 sm:flex-initial"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Enviar Avaliação Rápida</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
