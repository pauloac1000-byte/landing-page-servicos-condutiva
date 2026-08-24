import { PAIN_POINTS } from '@/data/mockData'
import { AlertOctagon, Scale, Clock, FileWarning } from 'lucide-react'

const ICONS = [AlertOctagon, Scale, Clock, FileWarning]

export function PainPointsSection() {
  return (
    <section className="py-20 bg-white text-slate-900 relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            DESAFIOS OPERACIONAIS REAIS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-900">
            Quanto está custando a falta de manutenção preventiva na sua fábrica hoje?
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Pequenos desvios de calibração e atrasos no diagnóstico silenciosamente absorvem a
            margem de lucro da sua operação.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PAIN_POINTS.map((item, index) => {
            const Icon = ICONS[index % ICONS.length]
            return (
              <div
                key={item.title}
                className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-elevation group flex flex-col"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mt-2 flex-1">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
                  <div className="text-xs font-mono font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-md inline-block border border-amber-200">
                    {item.impact}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
