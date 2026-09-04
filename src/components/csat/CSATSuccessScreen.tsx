import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2,
  FileCheck,
  ArrowLeft,
  Home,
  Building2,
  User,
  FileSpreadsheet,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import type { CSATResponseRecord } from '@/types'

interface CSATSuccessScreenProps {
  responseRecord: CSATResponseRecord
  onReset: () => void
}

export function CSATSuccessScreen({ responseRecord, onReset }: CSATSuccessScreenProps) {
  const formattedDate = new Date(responseRecord.created || Date.now()).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      <Card className="border border-emerald-200 bg-white shadow-elevation overflow-hidden">
        {/* Banner header */}
        <div className="bg-emerald-600 text-white px-6 py-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-100 bg-white/10 px-2 py-0.5 rounded inline-block mb-1">
              Avaliação Registrada com Sucesso
            </span>
            <h1 className="text-xl sm:text-2xl font-bold leading-tight">
              Obrigado! Sua avaliação foi registrada e ajuda a Condutiva a melhorar continuamente
              seus serviços.
            </h1>
            <p className="text-xs text-emerald-100 mt-1">
              Suas considerações foram vinculadas ao contrato e encaminhadas à coordenação técnica
              da Condutiva.
            </p>
          </div>
        </div>

        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="space-y-3 border-b border-slate-100 pb-5">
            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl text-emerald-950">
              <p className="text-sm sm:text-base font-bold leading-snug">
                &ldquo;Obrigado! Sua avaliação foi registrada e ajuda a Condutiva a melhorar
                continuamente seus serviços.&rdquo;
              </p>
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 font-mono pt-1">
              Comprovante de Envio
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              O feedback referente ao atendimento técnico da empresa{' '}
              <strong className="text-slate-900">{responseRecord.client_name}</strong> foi
              registrado com sucesso. A situação do contrato foi atualizada para{' '}
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                respondido
              </span>
              .
            </p>
          </div>

          {/* Details summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Contrato / Ordem de Serviço
                </span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {responseRecord.contract_number} / {responseRecord.service_order_number}
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Formato Escolhido
                </span>
                <span className="font-semibold text-slate-900 text-sm capitalize">
                  {responseRecord.form_version === 'completo'
                    ? 'Formulário Completo'
                    : 'Versão Curta'}
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Responsável pelo Preenchimento
                </span>
                <span className="font-semibold text-slate-800">
                  {responseRecord.respondent_name} ({responseRecord.respondent_role})
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Técnico Responsável
                </span>
                <span className="font-semibold text-slate-800">
                  {responseRecord.technician_name}
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Problema Resolvido
                </span>
                <span className="font-semibold text-slate-800 uppercase">
                  {responseRecord.problem_resolved === 'sim'
                    ? 'Sim'
                    : responseRecord.problem_resolved === 'nao'
                      ? 'Não'
                      : 'Não se aplica'}
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Data e Hora do Registro
                </span>
                <span className="font-semibold text-slate-800">{formattedDate}</span>
              </div>
            </div>

            {responseRecord.contact_authorized && (
              <div className="p-3 bg-white border border-slate-200 rounded-lg text-slate-700">
                <span className="text-[#4d7c0f] font-semibold">✓ Autorização confirmada:</span> A
                Condutiva está autorizada a entrar em contato para aprofundar este feedback.
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              className="border-slate-300 text-slate-700 hover:bg-slate-100 flex-1 py-5"
            >
              Consultar outro contrato
            </Button>
            <Button
              asChild
              className="bg-[#8CC63F] hover:bg-[#7cb633] text-slate-950 font-bold flex-1 py-5 shadow-sm"
            >
              <Link to="/">Concluir e voltar ao início</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
