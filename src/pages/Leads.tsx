import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Search,
  RefreshCw,
  Calendar,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileSpreadsheet,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Home,
  MessageSquare,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  KeyRound,
} from 'lucide-react'
import { getLeads } from '@/services/leads'
import { useRealtime } from '@/hooks/use-realtime'
import type { LeadRecord } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

const SESSION_AUTH_KEY = 'condutiva_leads_authenticated'
const EXPECTED_PASSWORD =
  (import.meta.env.VITE_LEADS_PASSWORD as string | undefined) || 'condutiva01'

export default function LeadsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(SESSION_AUTH_KEY) === 'true'
  })
  const [inputPassword, setInputPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [leads, setLeads] = useState<LeadRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [segmentFilter, setSegmentFilter] = useState<string>('all')
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null)
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table')
  const { toast } = useToast()

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (inputPassword === EXPECTED_PASSWORD) {
      sessionStorage.setItem(SESSION_AUTH_KEY, 'true')
      setIsAuthenticated(true)
      setPasswordError('')
      toast({
        title: 'Acesso liberado',
        description: 'Bem-vindo ao Painel Comercial da Condutiva.',
      })
    } else {
      setPasswordError('Senha incorreta. Verifique os caracteres e tente novamente.')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_AUTH_KEY)
    setIsAuthenticated(false)
    setInputPassword('')
    setPasswordError('')
    toast({
      title: 'Sessão encerrada',
      description: 'Você saiu da área restrita de leads.',
    })
  }

  const loadData = async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const data = await getLeads()
      setLeads(data)
    } catch (err: unknown) {
      console.error('Error fetching leads:', err)
      toast({
        title: 'Erro ao carregar leads',
        description: 'Não foi possível buscar a lista de solicitações.',
        variant: 'destructive',
      })
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])

  // Realtime updates for new leads
  useRealtime<LeadRecord>('leads', () => {
    if (isAuthenticated) {
      loadData(true)
    }
  })

  // Extract unique segments for filtering
  const segments = useMemo(() => {
    const set = new Set<string>()
    leads.forEach((l) => {
      if (l.segment && l.segment.trim()) {
        set.add(l.segment.trim())
      }
    })
    return Array.from(set)
  }, [leads])

  // Filtered and sorted leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        lead.full_name.toLowerCase().includes(q) ||
        lead.company.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q) ||
        (lead.city_state && lead.city_state.toLowerCase().includes(q)) ||
        (lead.segment && lead.segment.toLowerCase().includes(q)) ||
        (lead.main_challenge && lead.main_challenge.toLowerCase().includes(q))

      const matchesSegment = segmentFilter === 'all' || lead.segment === segmentFilter

      return matchesSearch && matchesSegment
    })
  }, [leads, search, segmentFilter])

  // Export leads to CSV
  const handleExportCSV = () => {
    if (filteredLeads.length === 0) {
      toast({
        title: 'Sem dados para exportar',
        description: 'Nenhum lead encontrado com os filtros atuais.',
      })
      return
    }

    const headers = [
      'Data/Hora',
      'Nome Completo',
      'Empresa',
      'E-mail',
      'Telefone',
      'Segmento',
      'Cidade/Estado',
      'Qtd Equipamentos',
      'Desafio Principal',
      'Consentimento LGPD',
    ]

    const csvRows = [
      headers.join(';'),
      ...filteredLeads.map((l) =>
        [
          `"${new Date(l.created).toLocaleString('pt-BR')}"`,
          `"${(l.full_name || '').replace(/"/g, '""')}"`,
          `"${(l.company || '').replace(/"/g, '""')}"`,
          `"${(l.email || '').replace(/"/g, '""')}"`,
          `"${(l.phone || '').replace(/"/g, '""')}"`,
          `"${(l.segment || '').replace(/"/g, '""')}"`,
          `"${(l.city_state || '').replace(/"/g, '""')}"`,
          `"${(l.equipment_count || '').replace(/"/g, '""')}"`,
          `"${(l.main_challenge || '').replace(/"/g, '""')}"`,
          `"${l.lgpd_consent ? 'Sim' : 'Não'}"`,
        ].join(';'),
      ),
    ]

    const blob = new Blob(['\uFEFF' + csvRows.join('\n')], {
      type: 'text/csv;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `leads-condutiva-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Format date helper
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateStr
    }
  }

  const cleanPhone = (phone: string) => phone.replace(/\D/g, '')

  // Password Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-[#8CC63F] selection:text-slate-950 relative overflow-hidden">
        {/* Background ambient accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#8CC63F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-10 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Minimal header */}
        <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#8CC63F] flex items-center justify-center text-slate-950 font-black text-sm">
              C
            </div>
            <span className="font-bold tracking-wider text-sm text-white">CONDUTIVA</span>
          </Link>
          <Link to="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white hover:bg-slate-900 text-xs gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              Voltar ao Site
            </Button>
          </Link>
        </header>

        {/* Center Lock Box */}
        <main className="container mx-auto px-4 py-12 flex items-center justify-center relative z-10">
          <div className="w-full max-w-md">
            <Card className="bg-slate-900/90 border-slate-800 shadow-2xl backdrop-blur-xl">
              <CardHeader className="text-center pb-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#8CC63F]/20 to-[#8CC63F]/5 border border-[#8CC63F]/30 mx-auto flex items-center justify-center text-[#8CC63F] shadow-lg mb-3">
                  <Lock className="w-7 h-7" />
                </div>
                <CardTitle className="text-xl font-bold text-white tracking-tight">
                  Acesso Restrito
                </CardTitle>
                <CardDescription className="text-xs text-slate-400 mt-1">
                  Painel de Gestão de Leads e Diagnósticos Técnicos da Condutiva. Digite a senha
                  para continuar.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="password-input"
                      className="text-xs font-medium text-slate-300 flex items-center justify-between"
                    >
                      <span>Senha de Acesso</span>
                      <span className="text-[10px] text-slate-500 font-mono">Área Comercial</span>
                    </label>

                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <Input
                        id="password-input"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Digite a senha..."
                        value={inputPassword}
                        onChange={(e) => {
                          setInputPassword(e.target.value)
                          if (passwordError) setPasswordError('')
                        }}
                        autoFocus
                        className={`pl-9 pr-10 bg-slate-950 border ${
                          passwordError
                            ? 'border-red-500 focus-visible:ring-red-500'
                            : 'border-slate-800 focus-visible:ring-[#8CC63F]'
                        } text-white placeholder:text-slate-600 text-sm h-11 rounded-xl`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                        title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {passwordError && (
                      <div className="flex items-center gap-1.5 text-xs text-red-400 pt-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{passwordError}</span>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#8CC63F] hover:bg-[#7ab334] text-slate-950 font-bold h-11 rounded-xl shadow-lg shadow-[#8CC63F]/10 transition-all text-sm cursor-pointer"
                  >
                    Acessar Painel
                  </Button>
                </form>

                <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
                  <p className="text-[11px] text-slate-500">
                    Acesso restrito a colaboradores e equipe técnica autorizada da Condutiva.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Minimal footer */}
        <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Condutiva Tecnologia — Todos os direitos reservados.
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-[#8CC63F] selection:text-slate-950">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 group transition"
              title="Voltar à página inicial"
            >
              <div className="w-9 h-9 rounded-xl bg-[#8CC63F] flex items-center justify-center text-slate-950 font-black text-lg shadow-md group-hover:scale-105 transition-transform">
                C
              </div>
              <div>
                <span className="text-lg font-black tracking-wider block text-white font-display uppercase">
                  CONDUTIVA
                </span>
                <span className="text-[10px] text-[#8CC63F] font-mono uppercase tracking-widest block">
                  Painel Comercial
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <Link to="/">
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs"
              >
                <Home className="w-3.5 h-3.5 mr-1.5" />
                Landing Page
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadData()}
              disabled={loading}
              className="bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button
              size="sm"
              onClick={handleExportCSV}
              className="bg-[#8CC63F] hover:bg-[#7ab334] text-slate-950 font-bold text-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" />
              Exportar CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="bg-slate-900 border-slate-700 text-red-400 hover:text-red-300 hover:bg-red-950/30 hover:border-red-900 text-xs ml-1"
              title="Sair do painel restrito"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1 text-xs font-mono text-[#8CC63F] uppercase tracking-wider">
                <Users className="w-4 h-4" />
                <span>Gestão de Leads & Diagnósticos</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Solicitações de Diagnóstico Técnico
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Acompanhe em tempo real todos os contatos gerados através dos formulários da landing
                page.
              </p>
            </div>

            {/* Quick KPI Stats */}
            <div className="flex items-center gap-3">
              <div className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#8CC63F]/10 border border-[#8CC63F]/20 flex items-center justify-center text-[#8CC63F]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Total de Leads</div>
                  <div className="text-xl font-black text-white">{leads.length}</div>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Com LGPD Ativo</div>
                  <div className="text-xl font-black text-white">
                    {leads.filter((l) => l.lgpd_consent).length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 mb-6 backdrop-blur">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Buscar por nome, empresa, e-mail, cidade..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 text-sm h-10 rounded-xl focus-visible:ring-[#8CC63F]"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Segment Filter & View Toggle */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Filter className="w-3.5 h-3.5" />
                <span>Segmento:</span>
              </div>
              <select
                value={segmentFilter}
                onChange={(e) => setSegmentFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8CC63F]"
              >
                <option value="all">Todos os segmentos ({leads.length})</option>
                {segments.map((s) => (
                  <option key={s} value={s}>
                    {s} ({leads.filter((l) => l.segment === s).length})
                  </option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                    viewMode === 'table'
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Tabela
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                    viewMode === 'cards'
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Cards
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Listing */}
        {loading ? (
          <div className="py-24 text-center">
            <RefreshCw className="w-8 h-8 text-[#8CC63F] animate-spin mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Carregando lista de leads...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <Card className="bg-slate-950/60 border-slate-800 text-center py-16">
            <CardContent className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Nenhum lead encontrado</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {search || segmentFilter !== 'all'
                  ? 'Nenhum registro corresponde aos filtros selecionados. Tente limpar os filtros.'
                  : 'Nenhuma solicitação de diagnóstico foi registrada ainda no sistema.'}
              </p>
              {(search || segmentFilter !== 'all') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearch('')
                    setSegmentFilter('all')
                  }}
                  className="bg-slate-900 border-slate-700 text-xs"
                >
                  Redefinir Filtros
                </Button>
              )}
            </CardContent>
          </Card>
        ) : viewMode === 'table' ? (
          /* Table View */
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Data / Hora</th>
                    <th className="py-3.5 px-4">Lead / Contato</th>
                    <th className="py-3.5 px-4">Empresa / Cidade</th>
                    <th className="py-3.5 px-4">Segmento</th>
                    <th className="py-3.5 px-4">Equipamentos</th>
                    <th className="py-3.5 px-4">Desafio Principal</th>
                    <th className="py-3.5 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-900/50 transition-colors group cursor-pointer"
                      onClick={() => setSelectedLead(lead)}
                    >
                      {/* Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-[#8CC63F]" />
                          <span>{formatDate(lead.created)}</span>
                        </div>
                      </td>

                      {/* Lead / Contact */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white group-hover:text-[#8CC63F] transition-colors flex items-center gap-1.5">
                          <span>{lead.full_name}</span>
                        </div>
                        <div className="text-slate-400 text-[11px] flex items-center gap-2 mt-0.5">
                          <a
                            href={`mailto:${lead.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-sky-400 transition flex items-center gap-1"
                            title="Enviar E-mail"
                          >
                            <Mail className="w-3 h-3" />
                            <span>{lead.email}</span>
                          </a>
                          <span>•</span>
                          <a
                            href={`https://wa.me/55${cleanPhone(lead.phone)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-emerald-400 transition flex items-center gap-1 text-emerald-400/90 font-mono"
                            title="Conversar no WhatsApp"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{lead.phone}</span>
                          </a>
                        </div>
                      </td>

                      {/* Company / City */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span>{lead.company}</span>
                        </div>
                        {lead.city_state && (
                          <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-amber-500/70" />
                            <span>{lead.city_state}</span>
                          </div>
                        )}
                      </td>

                      {/* Segment */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {lead.segment ? (
                          <Badge
                            variant="outline"
                            className="bg-slate-900 border-slate-700 text-slate-300 text-[10px] font-normal"
                          >
                            {lead.segment}
                          </Badge>
                        ) : (
                          <span className="text-slate-500 italic text-[11px]">-</span>
                        )}
                      </td>

                      {/* Equipment count */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {lead.equipment_count ? (
                          <span className="font-mono text-slate-300 text-[11px] bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                            {lead.equipment_count} un.
                          </span>
                        ) : (
                          <span className="text-slate-500 italic text-[11px]">-</span>
                        )}
                      </td>

                      {/* Challenge */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p
                          className="text-slate-300 truncate text-[11px]"
                          title={lead.main_challenge}
                        >
                          {lead.main_challenge || (
                            <span className="text-slate-500 italic">Não informado</span>
                          )}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedLead(lead)
                          }}
                          className="text-[#8CC63F] hover:text-[#8CC63F] hover:bg-[#8CC63F]/10 text-xs h-7 px-2"
                        >
                          Detalhes
                          <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-slate-900/60 px-4 py-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>
                Exibindo <strong>{filteredLeads.length}</strong> de <strong>{leads.length}</strong>{' '}
                solicitações
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Ordenado do mais recente para o mais antigo
              </span>
            </div>
          </div>
        ) : (
          /* Cards View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLeads.map((lead) => (
              <Card
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className="bg-slate-950 border-slate-800 hover:border-[#8CC63F]/50 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge
                      variant="outline"
                      className="bg-slate-900 border-slate-800 text-[#8CC63F] font-mono text-[10px]"
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(lead.created)}
                    </Badge>
                    {lead.segment && (
                      <Badge
                        variant="secondary"
                        className="bg-slate-900 text-slate-300 text-[10px]"
                      >
                        {lead.segment}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base text-white group-hover:text-[#8CC63F] transition-colors mt-2">
                    {lead.full_name}
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs flex items-center gap-1.5 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{lead.company}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 text-xs text-slate-300 pt-0">
                  <div className="space-y-1.5 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span className="truncate">{lead.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300 font-mono">
                      <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{lead.phone}</span>
                    </div>
                    {lead.city_state && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{lead.city_state}</span>
                      </div>
                    )}
                  </div>

                  {lead.main_challenge && (
                    <div className="text-slate-400 line-clamp-2 text-[11px] italic bg-slate-900/30 p-2 rounded border border-slate-800/40">
                      "{lead.main_challenge}"
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px]">
                    <span className="text-slate-400">
                      Equipamentos:{' '}
                      <strong className="text-slate-200">{lead.equipment_count || 'N/I'}</strong>
                    </span>
                    <span className="text-[#8CC63F] font-semibold flex items-center gap-0.5">
                      Ver detalhes
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Lead Detail Modal */}
      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="bg-slate-950 border-slate-800 text-slate-100 max-w-2xl">
          {selectedLead && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 font-mono text-xs text-[#8CC63F] uppercase tracking-wider mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Cadastrado em {formatDate(selectedLead.created)}</span>
                </div>
                <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <span>{selectedLead.full_name}</span>
                </DialogTitle>
                <DialogDescription className="text-slate-400 text-sm flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <span className="font-semibold text-slate-300">{selectedLead.company}</span>
                  {selectedLead.city_state && (
                    <>
                      <span>•</span>
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      <span>{selectedLead.city_state}</span>
                    </>
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 my-2 text-xs">
                {/* Contact Actions Box */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                      Canais Diretos de Contato
                    </div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <span>{selectedLead.phone}</span>
                    </div>
                    <div className="text-slate-400 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-sky-400" />
                      <span>{selectedLead.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/55${cleanPhone(selectedLead.phone)}?text=${encodeURIComponent(
                        `Olá ${selectedLead.full_name}, sou da equipe comercial da Condutiva Tecnologia. Recebemos sua solicitação de diagnóstico técnico para a ${selectedLead.company}.`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg"
                      >
                        <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                        Chamar no WhatsApp
                      </Button>
                    </a>
                    <a href={`mailto:${selectedLead.email}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-800 border-slate-700 text-slate-200 hover:text-white text-xs"
                      >
                        <Mail className="w-3.5 h-3.5 mr-1.5" />
                        E-mail
                      </Button>
                    </a>
                  </div>
                </div>

                {/* Technical Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[11px] block mb-1">
                      Segmento de Atuação
                    </span>
                    <span className="font-semibold text-white text-sm">
                      {selectedLead.segment || 'Não informado'}
                    </span>
                  </div>
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[11px] block mb-1">
                      Quantidade de Equipamentos
                    </span>
                    <span className="font-semibold text-white text-sm font-mono">
                      {selectedLead.equipment_count || 'Não informado'}
                    </span>
                  </div>
                </div>

                {/* Main Challenge Box */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-slate-400 text-[11px] font-mono uppercase tracking-wider block">
                    Desafio Principal / Necessidade Relatada
                  </span>
                  <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedLead.main_challenge ||
                      'Nenhuma descrição detalhada informada no formulário.'}
                  </p>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                  <span className="font-mono">ID: {selectedLead.id}</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    Consentimento LGPD confirmado
                  </span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
