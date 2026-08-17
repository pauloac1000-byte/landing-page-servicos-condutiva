import { useState, useEffect } from 'react'
import { Activity, ShieldCheck, AlertTriangle, Cpu, BarChart2, Radio } from 'lucide-react'

export function SigaTabletMockup() {
  const [metricValue, setMetricValue] = useState(99.4)
  const [dosagemRate, setDosagemRate] = useState(1480)
  const [activeTab, setActiveTab] = useState<'sensores' | 'grafico' | 'alertas'>('sensores')

  useEffect(() => {
    const interval = setInterval(() => {
      setMetricValue((prev) => +(99.2 + Math.random() * 0.6).toFixed(2))
      setDosagemRate((prev) => Math.round(1470 + Math.random() * 25))
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const sensors = [
    { id: 'CL-01', name: 'Célula de Carga A1', value: '4.982 kg', status: 'ok' },
    { id: 'CL-02', name: 'Célula de Carga A2', value: '5.014 kg', status: 'ok' },
    { id: 'CL-03', name: 'Célula de Carga B1', value: '4.971 kg', status: 'warn' },
    { id: 'CL-04', name: 'Célula de Carga B2', value: '5.003 kg', status: 'ok' },
  ]

  const alerts = [
    {
      level: 'warn',
      icon: AlertTriangle,
      title: 'Tendência de desvio detectada',
      desc: 'Célula CL-03 apresentando deriva de 0,4% nas últimas 24h.',
      time: 'há 12 min',
    },
    {
      level: 'info',
      icon: ShieldCheck,
      title: 'Calibração rastreável válida',
      desc: 'Certificado RBC #2024-0892 dentro do prazo de validade.',
      time: 'há 2 h',
    },
    {
      level: 'info',
      icon: Activity,
      title: 'Health check concluído',
      desc: 'Painel elétrico 1 em conformidade NR-10, sem pontos quentes.',
      time: 'há 5 h',
    },
  ]

  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
      {/* Tablet frame */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[5/6] rounded-[2rem] bg-slate-900 p-2.5 shadow-2xl shadow-slate-900/40 ring-1 ring-slate-900/10">
        <div className="absolute top-1/2 -translate-y-1/2 -right-1 h-16 w-1 rounded-l-full bg-slate-800" />
        <div className="relative h-full w-full rounded-[1.6rem] overflow-hidden bg-slate-50 flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#8CC63F] flex items-center justify-center">
                <Cpu className="w-3.5 h-3.5 text-slate-950" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[11px] font-black text-slate-900 tracking-tight">SIGA</span>
                <span className="text-[8px] text-slate-400 font-medium">Dashboard Preditivo</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8CC63F] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#8CC63F]" />
              </span>
              <span className="text-[9px] font-semibold text-slate-500">Ao vivo</span>
            </div>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 border-b border-slate-200">
            <div className="rounded-xl bg-white border border-slate-200 p-2.5 flex flex-col gap-0.5">
              <span className="text-[8px] uppercase tracking-wide text-slate-400 font-semibold">
                Disponibilidade
              </span>
              <span className="text-base font-black font-mono text-[#4d7c0f] leading-tight">
                {metricValue}%
              </span>
              <span className="text-[8px] text-slate-400">24h</span>
            </div>
            <div className="rounded-xl bg-white border border-slate-200 p-2.5 flex flex-col gap-0.5">
              <span className="text-[8px] uppercase tracking-wide text-slate-400 font-semibold">
                Dosagem
              </span>
              <span className="text-base font-black font-mono text-slate-900 leading-tight">
                {dosagemRate}
              </span>
              <span className="text-[8px] text-slate-400">kg/h</span>
            </div>
            <div className="rounded-xl bg-white border border-slate-200 p-2.5 flex flex-col gap-0.5">
              <span className="text-[8px] uppercase tracking-wide text-slate-400 font-semibold">
                Alertas
              </span>
              <span className="text-base font-black font-mono text-amber-500 leading-tight">1</span>
              <span className="text-[8px] text-slate-400">ativos</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 px-3 pt-2 bg-slate-50">
            {(
              [
                { id: 'sensores', label: 'Sensores', icon: Radio },
                { id: 'grafico', label: 'Gráfico', icon: BarChart2 },
                { id: 'alertas', label: 'Alertas', icon: AlertTriangle },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-t-md text-[10px] font-bold transition ${
                    active
                      ? 'bg-white text-slate-900 border-x border-t border-slate-200'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-hidden bg-white border-x border-b border-slate-200 mx-3 mb-3 rounded-b-xl">
            {activeTab === 'sensores' && (
              <div className="divide-y divide-slate-100">
                {sensors.map((s) => (
                  <div key={s.id} className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          s.status === 'ok' ? 'bg-[#8CC63F]' : 'bg-amber-500'
                        }`}
                      />
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold text-slate-800 truncate">
                          {s.name}
                        </div>
                        <div className="text-[8px] text-slate-400 font-mono">{s.id}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-900 shrink-0">
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'grafico' && (
              <div className="p-3 h-full flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-700">Tendência de Carga</span>
                  <span className="text-[8px] text-slate-400 font-mono">7 dias</span>
                </div>
                <div className="flex-1 relative">
                  <svg
                    viewBox="0 0 320 160"
                    preserveAspectRatio="none"
                    className="w-full h-full"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="sigaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8CC63F" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#8CC63F" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {[0, 40, 80, 120].map((y) => (
                      <line
                        key={y}
                        x1="0"
                        y1={y}
                        x2="320"
                        y2={y}
                        stroke="#e2e8f0"
                        strokeWidth="1"
                        strokeDasharray="3 3"
                      />
                    ))}
                    <path
                      d="M0 110 L40 95 L80 100 L120 70 L160 80 L200 50 L240 60 L280 40 L320 45 L320 160 L0 160 Z"
                      fill="url(#sigaGrad)"
                    />
                    <path
                      d="M0 110 L40 95 L80 100 L120 70 L160 80 L200 50 L240 60 L280 40 L320 45"
                      fill="none"
                      stroke="#4d7c0f"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                    <circle cx="280" cy="40" r="4" fill="#8CC63F" stroke="#fff" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            )}

            {activeTab === 'alertas' && (
              <div className="divide-y divide-slate-100">
                {alerts.map((a, idx) => {
                  const Icon = a.icon
                  return (
                    <div key={idx} className="flex gap-2 px-3 py-2.5">
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                          a.level === 'warn'
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-[#8CC63F]/10 text-[#4d7c0f]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-slate-800 truncate">
                            {a.title}
                          </span>
                          <span className="text-[8px] text-slate-400 shrink-0">{a.time}</span>
                        </div>
                        <p className="text-[9px] text-slate-500 leading-snug mt-0.5">{a.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Bottom status */}
          <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900 text-white">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-[#8CC63F]" />
              <span className="text-[8px] font-semibold">Rastreável INMETRO · RBC</span>
            </div>
            <span className="text-[8px] text-slate-400 font-mono">SIGA v4.2</span>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -bottom-4 -left-3 sm:-left-5 bg-white rounded-xl shadow-xl shadow-slate-900/10 border border-slate-200 px-3 py-2 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-[#8CC63F]/10 flex items-center justify-center">
          <Activity className="w-4 h-4 text-[#4d7c0f]" />
        </div>
        <div className="leading-tight">
          <div className="text-[10px] font-black text-slate-900">Monitoramento 24/7</div>
          <div className="text-[8px] text-slate-500">Tempo real · IoT industrial</div>
        </div>
      </div>
    </div>
  )
}
