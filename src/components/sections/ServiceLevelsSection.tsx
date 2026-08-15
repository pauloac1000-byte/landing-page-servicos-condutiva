import { PLANS } from '@/data/mockData'
import { Button } from '@/components/ui/button'
import { Check, Zap, Sparkles, ShieldCheck } from 'lucide-react'

interface ServiceLevelsProps {
  onSelectPlan: (planName: string) => void
}

export function ServiceLevelsSection({ onSelectPlan }: ServiceLevelsProps) {
  return (
    <section id="planos" className="py-20 bg-white text-slate-900 relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            NÍVEIS DE SERVIÇO (SLA) & CONTRATOS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900">
            Planos de manutenção e calibração dimensionados para a sua demanda.
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Elimine a incerteza de chamados avulsos e tenha prioridade absoluta de atendimento
            presencial em campo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {PLANS.map((plan) => {
            const isRec = plan.recommended
            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  isRec
                    ? 'bg-gradient-to-b from-white to-slate-50 border-2 border-[#8CC63F] shadow-elevation lg:-translate-y-2'
                    : 'bg-white border border-slate-200 hover:border-slate-300 shadow-subtle'
                }`}
              >
                {isRec && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#8CC63F] text-slate-950 font-black text-xs uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                    <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-display flex items-center justify-between">
                      <span>{plan.name}</span>
                      <span className="text-xs font-mono font-normal text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                        {plan.priceLabel}
                      </span>
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed mt-2">{plan.tagline}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-emerald-700 flex items-center gap-2 font-mono">
                    <Zap className="w-4 h-4 text-[#8CC63F] shrink-0" />
                    <span>{plan.responseSLA}</span>
                  </div>

                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      Incluso no pacote:
                    </span>
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <div className="w-4 h-4 rounded-full bg-[#8CC63F]/15 text-[#8CC63F] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 mt-6 border-t border-slate-200 space-y-4">
                  <div className="text-[11px] text-slate-500 italic">
                    <span className="font-semibold text-slate-700">Ideal para:</span>{' '}
                    {plan.idealFor}
                  </div>
                  <Button
                    onClick={() => onSelectPlan(plan.name)}
                    className={`w-full font-bold py-6 rounded-xl transition-all ${
                      isRec
                        ? 'bg-[#8CC63F] hover:bg-[#7cb633] text-slate-950 shadow-lg shadow-[#8CC63F]/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    Solicitar Proposta para {plan.name}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#8CC63F]" />
          <span>Todos os contratos possuem carência zero para o Diagnóstico Gratuito Inicial.</span>
        </div>
      </div>
    </section>
  )
}
