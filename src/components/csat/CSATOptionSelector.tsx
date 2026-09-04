import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Clock,
  CheckCircle2,
  ListChecks,
  Zap,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  User,
} from 'lucide-react'
import type { ContractRecord, CSATFormVersion } from '@/types'

interface CSATOptionSelectorProps {
  contract: ContractRecord
  onSelectOption: (option: CSATFormVersion) => void
  onResetContract: () => void
}

export function CSATOptionSelector({
  contract,
  onSelectOption,
  onResetContract,
}: CSATOptionSelectorProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header with contract preview */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Acesso Validado com Sucesso</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 font-display tracking-tight">
          Escolha o Formato da Avaliação
        </h1>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
          Atendimento identificado para{' '}
          <strong className="text-slate-900">{contract.client_name}</strong>. Selecione abaixo a
          opção mais conveniente para registrar o seu retorno técnico.
        </p>
      </div>

      {/* Contract context banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-700">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#4d7c0f]" />
              <strong className="font-semibold text-slate-900">{contract.client_name}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-[#4d7c0f]" />
              Contrato:{' '}
              <span className="font-mono font-bold text-slate-900">
                {contract.contract_number}
              </span>{' '}
              | OS:{' '}
              <span className="font-mono font-bold text-slate-900">
                {contract.service_order_number}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#4d7c0f]" />
              Técnico:{' '}
              <span className="font-semibold text-slate-900">{contract.technician_name}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={onResetContract}
            className="text-xs text-slate-500 hover:text-slate-800 underline self-start sm:self-auto cursor-pointer"
          >
            Trocar contrato
          </button>
        </div>
      </div>

      {/* Cards of Choice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Opção 1: Formulário Completo (RECOMENDADO) */}
        <Card className="border-2 border-[#8CC63F] bg-white shadow-md hover:shadow-lg transition-all relative flex flex-col overflow-hidden group">
          <div className="bg-[#8CC63F] text-slate-950 px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              RECOMENDADO
            </span>
            <span className="text-[11px] font-mono font-bold">5 a 7 minutos</span>
          </div>

          <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-[#4d7c0f] transition-colors">
                    Formulário Completo
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Avaliação técnica estruturada em 7 seções especializadas.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#8CC63F]/15 flex items-center justify-center shrink-0">
                  <ListChecks className="w-5 h-5 text-[#4d7c0f]" />
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <p className="font-semibold text-slate-800">Seções inclusas:</p>
                <ul className="space-y-1.5 pl-1">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8CC63F]" />
                    <span>Identificação e vinculação do atendimento</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8CC63F]" />
                    <span>Satisfação geral com a entrega</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8CC63F]" />
                    <span>Execução técnica e conformidade</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8CC63F]" />
                    <span>Qualidade e postura do atendimento</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8CC63F]" />
                    <span>Valor percebido na operação industrial</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8CC63F]" />
                    <span>Lealdade (NPS 0 a 10) e intenção de renovação</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8CC63F]" />
                    <span>Perguntas abertas e direcionamento operacional</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Tempo estimado: 5 a 7 min
                </span>
                <Badge
                  variant="outline"
                  className="border-[#8CC63F] text-[#4d7c0f] bg-[#8CC63F]/10 text-[10px]"
                >
                  Diagnóstico aprofundado
                </Badge>
              </div>

              <Button
                type="button"
                onClick={() => onSelectOption('completo')}
                className="w-full bg-[#8CC63F] hover:bg-[#7cb633] text-slate-950 font-bold py-5 shadow-sm flex items-center justify-center gap-2"
              >
                <span>Preencher Formulário Completo</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Opção 2: Aplicação Rápida */}
        <Card className="border border-slate-200 bg-white hover:border-slate-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
          <div className="bg-slate-100 text-slate-700 px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-between border-b border-slate-200">
            <span className="flex items-center gap-1.5 text-slate-800">
              <Zap className="w-4 h-4 text-amber-600" />
              APLICAÇÃO RÁPIDA
            </span>
            <span className="text-[11px] font-mono text-slate-600 font-semibold">
              Cerca de 2 minutos
            </span>
          </div>

          <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
                    Versão Curta
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    5 perguntas essenciais para um retorno objetivo do atendimento.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-amber-600" />
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <p className="font-semibold text-slate-800">Perguntas inclusas:</p>
                <ul className="space-y-1.5 pl-1">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>Identificação do responsável pelo preenchimento</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>Resolução do problema ou solicitação técnica</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>Satisfação geral com o serviço realizado (nota 1 a 5)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>Recomendação da Condutiva / NPS (escala de 0 a 10)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>Comentário objetivo sobre a experiência</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Tempo estimado: cerca de 2 min
                </span>
                <Badge
                  variant="outline"
                  className="border-slate-300 text-slate-600 bg-slate-50 text-[10px]"
                >
                  Retorno prioritário
                </Badge>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => onSelectOption('curto')}
                className="w-full border-slate-300 hover:bg-slate-100 text-slate-800 font-bold py-5 flex items-center justify-center gap-2"
              >
                <span>Preencher Versão Curta</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
