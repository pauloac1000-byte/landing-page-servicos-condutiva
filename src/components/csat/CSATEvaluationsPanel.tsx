import { useState, useMemo } from 'react'
import {
  Star,
  TrendingUp,
  FileCheck2,
  Calendar,
  Building2,
  UserCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Search,
  Filter,
  FileSpreadsheet,
  ChevronRight,
  Eye,
  Check,
  X,
  PhoneCall,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  Info,
  Layers,
  ArrowUpDown,
  RefreshCw,
  Loader2,
  ExternalLink,
} from 'lucide-react'
import type { CSATResponseRecord, CSATFormVersion, ProblemResolvedOption } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

interface CSATPanelProps {
  responses: CSATResponseRecord[]
  loading: boolean
  onRefresh: () => void
}

/**
 * Calculates average of valid numeric values (1 to 5)
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

export function CSATEvaluationsPanel({ responses, loading, onRefresh }: CSATPanelProps) {
  const [search, setSearch] = useState('')
  const [versionFilter, setVersionFilter] = useState<'all' | CSATFormVersion>('all')
  const [resolvedFilter, setResolvedFilter] = useState<'all' | ProblemResolvedOption>('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [selectedResponse, setSelectedResponse] = useState<CSATResponseRecord | null>(null)

  const { toast } = useToast()

  // Filtered responses
  const filteredResponses = useMemo(() => {
    return responses.filter((item) => {
      // Search
      const q = search.toLowerCase().trim()
      const matchesSearch =
        !q ||
        item.contract_number.toLowerCase().includes(q) ||
        item.service_order_number.toLowerCase().includes(q) ||
        item.client_name.toLowerCase().includes(q) ||
        item.technician_name.toLowerCase().includes(q) ||
        item.respondent_name.toLowerCase().includes(q) ||
        (item.service_evaluated && item.service_evaluated.toLowerCase().includes(q))

      // Version filter
      const matchesVersion = versionFilter === 'all' || item.form_version === versionFilter

      // Problem resolved filter
      const matchesResolved = resolvedFilter === 'all' || item.problem_resolved === resolvedFilter

      // Date range filter (supports evaluation_date or created date)
      let matchesDate = true
      const itemDateStr = item.evaluation_date || item.created?.slice(0, 10)
      if (startDate && itemDateStr) {
        matchesDate = matchesDate && itemDateStr >= startDate
      }
      if (endDate && itemDateStr) {
        matchesDate = matchesDate && itemDateStr <= endDate
      }

      return matchesSearch && matchesVersion && matchesResolved && matchesDate
    })
  }, [responses, search, versionFilter, resolvedFilter, startDate, endDate])

  // KPIs calculations
  const stats = useMemo(() => {
    const total = responses.length
    if (total === 0) {
      return {
        total: 0,
        avgSatisfaction: 0,
        npsAverage: 0,
        npsPromoters: 0,
        npsPassives: 0,
        npsDetractors: 0,
        npsScoreIndex: 0,
        problemResolvedPct: 0,
        fullCount: 0,
        shortCount: 0,
      }
    }

    let satSum = 0
    let satCount = 0
    let npsSum = 0
    let promoters = 0
    let passives = 0
    let detractors = 0
    let resolvedSim = 0

    responses.forEach((r) => {
      const avg = calculateAverageSatisfaction(r)
      if (avg > 0) {
        satSum += avg
        satCount++
      }

      const nps = typeof r.nps_score === 'number' ? r.nps_score : null
      if (nps !== null) {
        npsSum += nps
        if (nps >= 9) promoters++
        else if (nps >= 7) passives++
        else detractors++
      }

      if (r.problem_resolved === 'sim') {
        resolvedSim++
      }
    })

    const avgSatisfaction = satCount > 0 ? satSum / satCount : 0
    const npsAverage = total > 0 ? npsSum / total : 0
    // Standard NPS index: % Promotores (9-10) - % Detratores (0-6) -> range -100 to +100
    const npsScoreIndex = Math.round(((promoters - detractors) / total) * 100)
    const problemResolvedPct = Math.round((resolvedSim / total) * 100)

    const fullCount = responses.filter((r) => r.form_version === 'completo').length
    const shortCount = responses.filter((r) => r.form_version === 'curto').length

    return {
      total,
      avgSatisfaction,
      npsAverage,
      npsPromoters: promoters,
      npsPassives: passives,
      npsDetractors: detractors,
      npsScoreIndex,
      problemResolvedPct,
      fullCount,
      shortCount,
    }
  }, [responses])

  // Format date helper
  const formatDateDisplay = (dateStr?: string) => {
    if (!dateStr) return '-'
    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [y, m, d] = dateStr.split('-')
        return `${d}/${m}/${y}`
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

  // Export CSV
  const handleExportCSV = () => {
    if (filteredResponses.length === 0) {
      toast({
        title: 'Sem dados para exportar',
        description: 'Nenhuma avaliação encontrada com os filtros atuais.',
      })
      return
    }

    const headers = [
      'Data da Avaliação',
      'Nº Contrato',
      'Nº OS',
      'Cliente / Empresa',
      'Versão',
      'Respondente',
      'Cargo',
      'Técnico',
      'Serviço Avaliado',
      'Problema Resolvido',
      'Média Satisfação (1-5)',
      'Satisfação Geral',
      'Execução Técnica',
      'Atendimento',
      'Valor Percebido',
      'Nota NPS (0-10)',
      'Motivo da Nota NPS',
      'O que faria ser maior',
      'Intenção Renovação',
      'Pontos Fortes',
      'Pontos a Melhorar',
      'Outros Serviços',
      'Comentários Finais',
      'Autorizou Contato',
    ]

    const csvRows = [
      headers.join(';'),
      ...filteredResponses.map((r) => {
        const avgSat = calculateAverageSatisfaction(r).toFixed(2)
        const resolvedText =
          r.problem_resolved === 'sim'
            ? 'Sim'
            : r.problem_resolved === 'nao'
              ? 'Não'
              : 'Não se aplica'
        const versionText =
          r.form_version === 'completo' ? 'Formulário Completo' : 'Aplicação Rápida'
        const clean = (val?: string | number | boolean | null) =>
          `"${String(val ?? '').replace(/"/g, '""')}"`

        return [
          clean(formatDateDisplay(r.evaluation_date || r.created)),
          clean(r.contract_number),
          clean(r.service_order_number),
          clean(r.client_name),
          clean(versionText),
          clean(r.respondent_name),
          clean(r.respondent_role),
          clean(r.technician_name),
          clean(r.service_evaluated),
          clean(resolvedText),
          clean(avgSat),
          clean(r.score_general_satisfaction),
          clean(r.score_technical_execution ?? ''),
          clean(r.score_customer_service ?? ''),
          clean(r.score_perceived_value ?? ''),
          clean(r.nps_score),
          clean(r.nps_reason ?? ''),
          clean(r.nps_improvement ?? ''),
          clean(r.renewal_intent ?? ''),
          clean(r.positive_highlights ?? ''),
          clean(r.points_to_improve ?? ''),
          clean(r.additional_services_needed ?? ''),
          clean(r.final_comments ?? ''),
          clean(r.contact_authorized ? 'Sim' : 'Não'),
        ].join(';')
      }),
    ]

    const blob = new Blob(['\uFEFF' + csvRows.join('\n')], {
      type: 'text/csv;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute(
      'download',
      `avaliacoes-csat-condutiva-${new Date().toISOString().slice(0, 10)}.csv`,
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const clearFilters = () => {
    setSearch('')
    setVersionFilter('all')
    setResolvedFilter('all')
    setStartDate('')
    setEndDate('')
  }

  const hasActiveFilters =
    Boolean(search) ||
    versionFilter !== 'all' ||
    resolvedFilter !== 'all' ||
    Boolean(startDate) ||
    Boolean(endDate)

  return (
    <div className="space-y-6">
      {/* Resumo no Topo (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total de Avaliações */}
        <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Total de Avaliações
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#8CC63F]/10 border border-[#8CC63F]/20 flex items-center justify-center text-[#8CC63F]">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.total}</span>
            <span className="text-[11px] text-slate-400">respostas</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>
              Completo: <strong className="text-slate-200">{stats.fullCount}</strong>
            </span>
            <span>
              Rápido: <strong className="text-slate-200">{stats.shortCount}</strong>
            </span>
          </div>
        </div>

        {/* KPI 2: Média Geral de Satisfação */}
        <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Satisfação Média
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">
              {stats.avgSatisfaction > 0 ? stats.avgSatisfaction.toFixed(1) : '—'}
            </span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center gap-1.5 text-[11px] text-slate-400">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.round(stats.avgSatisfaction)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-slate-400 ml-1">Média das notas 1 a 5</span>
          </div>
        </div>

        {/* KPI 3: NPS Médio e Índice NPS */}
        <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              NPS Médio (0 a 10)
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#8CC63F]/10 border border-[#8CC63F]/20 flex items-center justify-center text-[#8CC63F]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-3xl font-black text-[#8CC63F]">
              {stats.total > 0 ? stats.npsAverage.toFixed(1) : '—'}
            </span>
            <div className="text-[11px] font-mono">
              <span className="text-slate-400">Índice: </span>
              <span
                className={`font-bold ${stats.npsScoreIndex >= 50 ? 'text-emerald-400' : 'text-amber-400'}`}
              >
                {stats.total > 0
                  ? stats.npsScoreIndex > 0
                    ? `+${stats.npsScoreIndex}`
                    : stats.npsScoreIndex
                  : '—'}
              </span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-medium">Promotores: {stats.npsPromoters}</span>
            <span className="text-amber-400 font-medium">Neutros: {stats.npsPassives}</span>
            <span className="text-rose-400 font-medium">Detratores: {stats.npsDetractors}</span>
          </div>
        </div>

        {/* KPI 4: Taxa de Resolução */}
        <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Problema Resolvido
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">
              {stats.total > 0 ? `${stats.problemResolvedPct}%` : '—'}
            </span>
            <span className="text-[11px] text-slate-400">de eficácia</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
            Resolução completa no primeiro atendimento
          </div>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 backdrop-blur space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Busca por cliente, contrato, OS, técnico */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              placeholder="Buscar por cliente, empresa, contrato, OS ou técnico..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 text-xs h-10 rounded-xl focus-visible:ring-[#8CC63F]"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filtros: Versão, Resolução, Período */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Versão do questionário */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
              <span className="text-[11px] font-mono text-slate-400 px-2 hidden sm:inline">
                Versão:
              </span>
              <button
                type="button"
                onClick={() => setVersionFilter('all')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                  versionFilter === 'all'
                    ? 'bg-[#8CC63F] text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Todas ({responses.length})
              </button>
              <button
                type="button"
                onClick={() => setVersionFilter('completo')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                  versionFilter === 'completo'
                    ? 'bg-sky-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Completo ({stats.fullCount})
              </button>
              <button
                type="button"
                onClick={() => setVersionFilter('curto')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                  versionFilter === 'curto'
                    ? 'bg-purple-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Rápido ({stats.shortCount})
              </button>
            </div>

            {/* Resolução */}
            <select
              value={resolvedFilter}
              onChange={(e) => setResolvedFilter(e.target.value as 'all' | ProblemResolvedOption)}
              className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8CC63F] h-10"
            >
              <option value="all">Todas Resoluções</option>
              <option value="sim">Resolvido (Sim)</option>
              <option value="nao">Não Resolvido</option>
              <option value="nao_se_aplica">Não se aplica</option>
            </select>

            {/* Alternar Tabela / Cards */}
            <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 h-10">
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
              className="bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs h-10 rounded-xl"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-[#8CC63F]" />
              Exportar CSV
            </Button>
          </div>
        </div>

        {/* Linha secundária de filtro por período */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-mono text-[11px] text-slate-400">Filtrar por Período:</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500">De</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#8CC63F]"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500">Até</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#8CC63F]"
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs text-slate-400 hover:text-white h-7 px-2 ml-auto"
            >
              <X className="w-3 h-3 mr-1" />
              Limpar filtros
            </Button>
          )}
        </div>
      </div>

      {/* Lista de Avaliações */}
      {loading ? (
        <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-16 text-center">
          <Loader2 className="w-8 h-8 text-[#8CC63F] animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400">Carregando avaliações CSAT...</p>
        </div>
      ) : filteredResponses.length === 0 ? (
        <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-12 text-center">
          <FileCheck2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">Nenhuma avaliação encontrada</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            {hasActiveFilters
              ? 'Nenhuma resposta corresponde aos filtros aplicados. Tente ajustar o período ou a busca.'
              : 'Ainda não foram registradas avaliações CSAT no sistema.'}
          </p>
          {hasActiveFilters && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="bg-slate-900 border-slate-700 text-xs"
              >
                Limpar Todos os Filtros
              </Button>
            </div>
          )}
        </div>
      ) : viewMode === 'table' ? (
        /* Visualização em Tabela */
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase tracking-wider font-mono text-[11px]">
                  <th className="py-3.5 px-4 font-semibold">Contrato / OS</th>
                  <th className="py-3.5 px-4 font-semibold">Cliente / Empresa</th>
                  <th className="py-3.5 px-4 font-semibold">Data</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Versão</th>
                  <th className="py-3.5 px-4 font-semibold text-center">NPS</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Média Satisfação</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Problema Resolvido</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredResponses.map((item) => {
                  const avgSat = calculateAverageSatisfaction(item)
                  const nps = item.nps_score

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedResponse(item)}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    >
                      {/* Contrato e OS */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-white font-mono text-sm flex items-center gap-1.5 group-hover:text-[#8CC63F] transition-colors">
                            <span className="w-2 h-2 rounded-full bg-[#8CC63F]" />
                            {item.contract_number}
                          </span>
                          <span className="text-slate-400 font-mono text-[11px] pl-3.5">
                            OS:{' '}
                            <strong className="text-slate-200">{item.service_order_number}</strong>
                          </span>
                        </div>
                      </td>

                      {/* Cliente / Empresa */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-2 max-w-xs">
                          <Building2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-slate-200 text-sm block">
                              {item.client_name}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {item.respondent_name}{' '}
                              {item.respondent_role ? `• ${item.respondent_role}` : ''}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Data da Avaliação */}
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#8CC63F]" />
                          <span>{formatDateDisplay(item.evaluation_date || item.created)}</span>
                        </div>
                      </td>

                      {/* Versão (Completo ou Curto) */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {item.form_version === 'completo' ? (
                          <Badge className="bg-sky-500/15 text-sky-400 border border-sky-500/30 font-medium text-[10px] py-0.5 px-2">
                            Formulário Completo
                          </Badge>
                        ) : (
                          <Badge className="bg-purple-500/15 text-purple-400 border border-purple-500/30 font-medium text-[10px] py-0.5 px-2">
                            Aplicação Rápida
                          </Badge>
                        )}
                      </td>

                      {/* Nota NPS (0 a 10) */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center justify-center font-bold font-mono text-xs px-2.5 py-1 rounded-lg border ${
                            nps >= 9
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : nps >= 7
                                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {nps} / 10
                        </span>
                      </td>

                      {/* Média das notas de satisfação (1 a 5) */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-white text-xs">{avgSat.toFixed(1)}</span>
                          <span className="text-[10px] text-slate-500">/ 5</span>
                        </div>
                      </td>

                      {/* Problema resolvido */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {item.problem_resolved === 'sim' ? (
                          <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 gap-1 text-[11px] py-0.5 px-2">
                            <CheckCircle2 className="w-3 h-3" />
                            Sim
                          </Badge>
                        ) : item.problem_resolved === 'nao' ? (
                          <Badge className="bg-rose-500/15 text-rose-400 border border-rose-500/30 gap-1 text-[11px] py-0.5 px-2">
                            <XCircle className="w-3 h-3" />
                            Não
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-800 text-slate-400 border border-slate-700 gap-1 text-[11px] py-0.5 px-2">
                            <HelpCircle className="w-3 h-3" />
                            Não se aplica
                          </Badge>
                        )}
                      </td>

                      {/* Ações */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedResponse(item)
                          }}
                          className="h-8 px-2.5 text-[#8CC63F] hover:text-[#8CC63F] hover:bg-[#8CC63F]/10 text-xs font-semibold gap-1"
                        >
                          <span>Ver Respostas</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-slate-800 bg-slate-950/90 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
            <span>
              Exibindo <strong className="text-white">{filteredResponses.length}</strong> de{' '}
              <strong className="text-white">{responses.length}</strong> avaliações registradas
            </span>
            <span className="text-[11px] text-slate-500">
              Clique em qualquer linha para abrir o detalhe completo com perguntas abertas e
              autorização.
            </span>
          </div>
        </div>
      ) : (
        /* Visualização em Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResponses.map((item) => {
            const avgSat = calculateAverageSatisfaction(item)
            const nps = item.nps_score

            return (
              <Card
                key={item.id}
                onClick={() => setSelectedResponse(item)}
                className="bg-slate-950/80 border-slate-800 hover:border-[#8CC63F]/50 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
              >
                <div
                  className={`h-1.5 w-full ${
                    nps >= 9 ? 'bg-[#8CC63F]' : nps >= 7 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                />
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-mono text-[#8CC63F] font-bold">
                        {item.contract_number}
                      </div>
                      <div className="text-sm font-semibold text-white mt-0.5 group-hover:text-[#8CC63F] transition-colors">
                        {item.client_name}
                      </div>
                    </div>
                    {item.form_version === 'completo' ? (
                      <Badge className="bg-sky-500/15 text-sky-400 border border-sky-500/30 text-[10px] py-0.5 px-2">
                        Completo
                      </Badge>
                    ) : (
                      <Badge className="bg-purple-500/15 text-purple-400 border border-purple-500/30 text-[10px] py-0.5 px-2">
                        Rápido
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-900/70 p-2.5 rounded-xl border border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">Nota NPS</span>
                      <span
                        className={`font-bold font-mono text-sm ${
                          nps >= 9
                            ? 'text-emerald-400'
                            : nps >= 7
                              ? 'text-amber-400'
                              : 'text-rose-400'
                        }`}
                      >
                        {nps} / 10
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        Satisfação Média
                      </span>
                      <span className="font-bold text-white text-sm flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {avgSat.toFixed(1)} / 5
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Ordem de Serviço:</span>
                      <span className="font-mono text-white font-bold">
                        {item.service_order_number}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Problema Resolvido:</span>
                      {item.problem_resolved === 'sim' ? (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Sim
                        </span>
                      ) : item.problem_resolved === 'nao' ? (
                        <span className="text-rose-400 font-semibold flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Não
                        </span>
                      ) : (
                        <span className="text-slate-400">Não se aplica</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Técnico:</span>
                      <span className="text-slate-200">{item.technician_name}</span>
                    </div>
                  </div>

                  {item.positive_highlights && (
                    <div className="text-[11px] text-slate-300 line-clamp-2 italic bg-slate-900/40 p-2 rounded-lg border border-slate-800/60">
                      "{item.positive_highlights}"
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{formatDateDisplay(item.evaluation_date || item.created)}</span>
                    <span className="text-[#8CC63F] font-semibold flex items-center gap-0.5">
                      Ver detalhe
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Modal com Detalhe Completo da Avaliação */}
      <Dialog
        open={!!selectedResponse}
        onOpenChange={(open) => {
          if (!open) setSelectedResponse(null)
        }}
      >
        <DialogContent className="bg-slate-950 border-slate-800 text-slate-100 max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
          {selectedResponse && (
            <>
              <DialogHeader>
                <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#8CC63F] uppercase tracking-wider">
                      {selectedResponse.contract_number}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="font-mono text-xs text-slate-400">
                      OS:{' '}
                      <strong className="text-slate-200">
                        {selectedResponse.service_order_number}
                      </strong>
                    </span>
                  </div>

                  {selectedResponse.form_version === 'completo' ? (
                    <Badge className="bg-sky-500/15 text-sky-400 border border-sky-500/30 text-xs">
                      Formulário Completo
                    </Badge>
                  ) : (
                    <Badge className="bg-purple-500/15 text-purple-400 border border-purple-500/30 text-xs">
                      Aplicação Rápida
                    </Badge>
                  )}
                </div>

                <DialogTitle className="text-xl font-bold text-white pt-2">
                  {selectedResponse.client_name}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-400 flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#8CC63F]" />
                    Avaliação em{' '}
                    {formatDateDisplay(
                      selectedResponse.evaluation_date || selectedResponse.created,
                    )}
                  </span>
                  <span>•</span>
                  <span>
                    Respondente:{' '}
                    <strong className="text-slate-300">{selectedResponse.respondent_name}</strong> (
                    {selectedResponse.respondent_role})
                  </span>
                  <span>•</span>
                  <span>
                    Técnico:{' '}
                    <strong className="text-slate-300">{selectedResponse.technician_name}</strong>
                  </span>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 pt-3 text-xs">
                {/* Serviço Avaliado */}
                <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    Serviço Avaliado
                  </span>
                  <p className="text-sm font-semibold text-white">
                    {selectedResponse.service_evaluated ||
                      'Serviços técnicos especializados Condutiva'}
                  </p>
                </div>

                {/* Bloco de Indicadores Centrais: Problema Resolvido, NPS e Média */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Resolução */}
                  <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                      Problema Resolvido?
                    </span>
                    <div className="mt-1">
                      {selectedResponse.problem_resolved === 'sim' ? (
                        <div className="inline-flex items-center gap-1.5 text-emerald-400 font-bold text-sm bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                          <CheckCircle2 className="w-4 h-4" />
                          Sim, resolvido
                        </div>
                      ) : selectedResponse.problem_resolved === 'nao' ? (
                        <div className="inline-flex items-center gap-1.5 text-rose-400 font-bold text-sm bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 rounded-lg">
                          <XCircle className="w-4 h-4" />
                          Não resolvido
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-slate-400 font-bold text-sm bg-slate-800 px-2.5 py-1 rounded-lg">
                          <HelpCircle className="w-4 h-4" />
                          Não se aplica
                        </div>
                      )}
                    </div>
                  </div>

                  {/* NPS */}
                  <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                      Nota NPS (0 a 10)
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span
                        className={`text-2xl font-black font-mono ${
                          selectedResponse.nps_score >= 9
                            ? 'text-emerald-400'
                            : selectedResponse.nps_score >= 7
                              ? 'text-amber-400'
                              : 'text-rose-400'
                        }`}
                      >
                        {selectedResponse.nps_score}
                      </span>
                      <span className="text-slate-400 text-xs">
                        {selectedResponse.nps_score >= 9
                          ? 'Promotor'
                          : selectedResponse.nps_score >= 7
                            ? 'Neutro'
                            : 'Detrator'}
                      </span>
                    </div>
                  </div>

                  {/* Satisfação Média */}
                  <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                      Média de Satisfação
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-white">
                        {calculateAverageSatisfaction(selectedResponse).toFixed(1)}
                      </span>
                      <span className="text-slate-400 text-xs">/ 5.0</span>
                    </div>
                  </div>
                </div>

                {/* Grade de Notas Detalhadas (1 a 5) */}
                <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl space-y-3">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                    Notas de Satisfação por Dimensão (Escala 1 a 5)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-[11px] block">Satisfação Geral</span>
                      <span className="text-lg font-bold text-white flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        {selectedResponse.score_general_satisfaction}
                      </span>
                    </div>

                    <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-[11px] block">Execução Técnica</span>
                      <span className="text-lg font-bold text-white flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        {selectedResponse.score_technical_execution ?? '—'}
                      </span>
                    </div>

                    <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-[11px] block">Atendimento</span>
                      <span className="text-lg font-bold text-white flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        {selectedResponse.score_customer_service ?? '—'}
                      </span>
                    </div>

                    <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-[11px] block">Valor Percebido</span>
                      <span className="text-lg font-bold text-white flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        {selectedResponse.score_perceived_value ?? '—'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Justificativas do NPS */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#8CC63F]">
                    Fundamentação do NPS & Renovação
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedResponse.nps_reason && (
                      <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                        <span className="text-[11px] font-mono text-slate-400 block mb-1">
                          Principal motivo da nota NPS:
                        </span>
                        <p className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
                          "{selectedResponse.nps_reason}"
                        </p>
                      </div>
                    )}
                    {selectedResponse.nps_improvement && (
                      <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                        <span className="text-[11px] font-mono text-slate-400 block mb-1">
                          O que faria a nota ser mais alta:
                        </span>
                        <p className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
                          "{selectedResponse.nps_improvement}"
                        </p>
                      </div>
                    )}
                    {selectedResponse.renewal_intent && (
                      <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 md:col-span-2">
                        <span className="text-[11px] font-mono text-slate-400 block mb-1">
                          Intenção de renovação ou contratação futura:
                        </span>
                        <p className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
                          "{selectedResponse.renewal_intent}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Perguntas Abertas e Considerações */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#8CC63F]">
                    Considerações Abertas do Cliente
                  </h4>
                  <div className="space-y-3">
                    {selectedResponse.positive_highlights ? (
                      <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                        <span className="text-[11px] font-mono text-emerald-400 block mb-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Pontos Positivos & Destaques:
                        </span>
                        <p className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
                          {selectedResponse.positive_highlights}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-slate-900/30 p-2.5 rounded-xl border border-slate-800/50 text-slate-500 italic text-[11px]">
                        Nenhum ponto positivo descrito.
                      </div>
                    )}

                    {selectedResponse.points_to_improve ? (
                      <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                        <span className="text-[11px] font-mono text-amber-400 block mb-1 flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5" />
                          Oportunidades de Melhoria:
                        </span>
                        <p className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
                          {selectedResponse.points_to_improve}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-slate-900/30 p-2.5 rounded-xl border border-slate-800/50 text-slate-500 italic text-[11px]">
                        Nenhuma melhoria sugerida.
                      </div>
                    )}

                    {selectedResponse.additional_services_needed && (
                      <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                        <span className="text-[11px] font-mono text-sky-400 block mb-1 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          Outros Serviços ou Necessidades Futuras:
                        </span>
                        <p className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
                          {selectedResponse.additional_services_needed}
                        </p>
                      </div>
                    )}

                    {selectedResponse.final_comments && (
                      <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                        <span className="text-[11px] font-mono text-slate-400 block mb-1 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5" />
                          Comentários Finais:
                        </span>
                        <p className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
                          {selectedResponse.final_comments}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Autorização de Contato */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                      Autorização para Contato Posterior
                    </span>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {selectedResponse.contact_authorized
                        ? 'O cliente autorizou a equipe da Condutiva a entrar em contato sobre esta avaliação.'
                        : 'O cliente optou por NÃO receber contato posterior sobre esta avaliação.'}
                    </p>
                  </div>
                  <div>
                    {selectedResponse.contact_authorized ? (
                      <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs px-3 py-1 gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Autorizado
                      </Badge>
                    ) : (
                      <Badge className="bg-slate-800 text-slate-400 border border-slate-700 text-xs px-3 py-1 gap-1">
                        <X className="w-3.5 h-3.5" />
                        Não autorizado
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
