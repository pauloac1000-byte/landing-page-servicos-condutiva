import { SERVICES } from '@/data/mockData'
import {
  Scale,
  Cpu,
  Workflow,
  Activity,
  RefreshCw,
  GraduationCap,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react'

const ICON_MAP: Record<string, any> = {
  Scale,
  Cpu,
  Workflow,
  Activity,
  RefreshCw,
  GraduationCap,
}

interface ServiceCatalogProps {
  onSelectService: (serviceTitle: string) => void
}

export function ServiceCatalogSection({ onSelectService }: ServiceCatalogProps) {
  return (
    <section id="servicos" className="py-20 bg-slate-50 text-slate-900 relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#4d7c0f] bg-[#8CC63F]/10 px-3 py-1 rounded-full border border-[#8CC63F]/30">
            CATÁLOGO DE SERVIÇOS TÉCNICOS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900">
            Portifólio de soluções para manter sua linha operacional em capacidade máxima.
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Do sensor de umidade à automação global do painel de comando.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => {
            const Icon = ICON_MAP[service.iconName] || Scale
            return (
              <div
                key={service.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#8CC63F]/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-elevation flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="w-12 h-12 rounded-xl bg-[#8CC63F]/10 border border-[#8CC63F]/30 text-[#8CC63F] flex items-center justify-center group-hover:bg-[#8CC63F] group-hover:text-slate-950 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-bold border border-slate-200">
                      {service.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#4d7c0f] transition-colors mb-2">
                      {service.title}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      {service.shortDesc}
                    </p>
                  </div>

                  <div className="pt-2 space-y-1.5 border-t border-slate-200">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      O que entregamos:
                    </span>
                    {service.deliverables.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#8CC63F] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {service.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => onSelectService(service.title)}
                    className="text-xs font-bold text-[#4d7c0f] hover:text-[#8CC63F] flex items-center gap-1 group/btn"
                  >
                    <span>Cotar Serviço</span>
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
