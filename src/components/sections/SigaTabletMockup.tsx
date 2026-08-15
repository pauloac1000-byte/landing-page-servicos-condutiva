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

  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
      <div className="absolute -inset-2 bg-gradient-to-r from-[#8CC63F]/10 via-sky-400/10 to-amber-400/10 rounded-3xl blur-2xl opacity-50 animate-pulse"></div>

      <div className="relative rounded-2xl border border-slate-200 bg-white shadow-elevation overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#8CC63F] flex items-center justify-center">
              <Cpu className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 leading-tight">SIGA Monitor</h4>
              <p className="text-[10px] text-slate-500">Sistema de Gestão & Automação</p>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-[#8CC63F] animate-pulse"></span>
            <span className="text-[10px] font-bold text-emerald-700">ONLINE</span>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 mb-1">
                <Activity className="w-3.5 h-3.5 text-[#8CC63F]" />
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                  Eficiência
                </span>
              </div>
              <span className="text-2xl font-black font-mono text-slate-900">{metricValue}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 mb-1">
                <BarChart2 className="w-3.5 h-3.5 text-sky-500" />
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                  Dosagem/min
                </span>
              </div>
              <span className="text-2xl font-black font-mono text-slate-900">{dosagemRate}</span>
            </div>
          </div>

          <div className="flex gap-2">
            {(['sensores', 'grafico', 'alertas'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wide rounded-lg transition ${
                  activeTab === tab
                    ? 'bg-[#8CC63F] text-slate-950'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {activeTab === 'sensores' && (
              <>
                {[
                  {
                    label: 'Sensor Célula 01',
                    value: 'Calibrado',
                    icon: ShieldCheck,
                    color: 'text-[#8CC63F]',
                  },
                  {
                    label: 'Sensor Célula 02',
                    value: 'Calibrado',
                    icon: ShieldCheck,
                    color: 'text-[#8CC63F]',
                  },
                  {
                    label: 'Sensor Fluxo 03',
                    value: 'Monitorando',
                    icon: Radio,
                    color: 'text-sky-500',
                  },
                ].map((s, i) => {
                  const Icon = s.icon
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${s.color}`} />
                        <span className="text-xs font-medium text-slate-700">{s.label}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">{s.value}</span>
                    </div>
                  )
                })}
              </>
            )}
            {activeTab === 'grafico' && (
              <div className="h-32 flex items-end justify-between gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                {[60, 75, 82, 90, 95, 88, 99, 97, 94, 99, 98, 99].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-gradient-to-t from-[#8CC63F] to-emerald-400"
                    style={{ height: `${h}%` }}
                  ></div>
                ))}
              </div>
            )}
            {activeTab === 'alertas' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="text-xs text-amber-800">
                    Calibração preventiva agendada em 7 dias
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-[#8CC63F]" />
                  <span className="text-xs text-emerald-800">
                    Todos os sistemas operando dentro do esperado
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
