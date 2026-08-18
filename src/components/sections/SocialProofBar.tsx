import { SECTORS } from '@/data/mockData'
import {
  Building2,
  Wheat,
  Beef,
  Pickaxe,
  FlaskConical,
  FileText,
  Utensils,
  Zap,
} from 'lucide-react'

const ICON_MAP: Record<string, any> = {
  Building2,
  Wheat,
  Beef,
  Pickaxe,
  FlaskConical,
  FileText,
  Utensils,
  Zap,
}

export function SocialProofBar() {
  return (
    <section className="bg-white border-y border-slate-200 py-8 relative">
      <div className="container mx-auto px-4">
        <p className="text-center text-xs font-semibold text-slate-500 uppercase tracking-widest mb-6">
          PRESTAÇÃO DE SERVIÇOS para os setores mais exigentes do Brasil
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {SECTORS.map((sector) => {
            const IconComponent = ICON_MAP[sector.icon] || Building2
            return (
              <div
                key={sector.id || sector.name}
                className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-4 text-center transition-colors hover:border-[#8CC63F]/50 hover:bg-[#8CC63F]/5"
              >
                <IconComponent className="h-6 w-6 text-[#8CC63F]" />
                <span className="text-xs font-medium text-slate-700 leading-tight">
                  {sector.name}
                </span>
              </div>
            )
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap justify-center gap-8 text-center text-slate-600 text-xs">
          <div>
            <span className="text-[#4d7c0f] font-bold">Confiabilidade:</span>Confiabilidade
            Calibração rigorosa sob normas vigentes.
          </div>
          <div className="hidden md:block text-slate-300">•</div>
          <div>
            <span className="text-[#4d7c0f] font-bold">SLA Prioritário:</span> Atendimento
            emergencial para contratantes.
          </div>
          <div className="hidden md:block text-slate-300">•</div>
          <div>
            <span className="text-[#4d7c0f] font-bold">Engenheiros e Técnicos Próprios:</span>{' '}
            Cobertura em +20 estados brasileiros.
          </div>
        </div>
      </div>
    </section>
  )
}
