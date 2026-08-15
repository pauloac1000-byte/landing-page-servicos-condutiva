import { ShieldCheck, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RiskReversalProps {
  onOpenDiagnosticModal: () => void
}

export function RiskReversalBanner({ onOpenDiagnosticModal }: RiskReversalProps) {
  return (
    <section className="py-12 bg-gradient-to-r from-emerald-50 via-slate-50 to-emerald-50 text-slate-900 border-y border-emerald-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-2xl bg-white border border-emerald-200 shadow-subtle">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#8CC63F] text-slate-950 flex items-center justify-center shrink-0 font-black">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 font-display">
                Diagnóstico 100% Gratuito e Sem Compromisso Comercial
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                Nossos engenheiros inspecionam sua planta e fornecem o laudo de saúde dos
                equipamentos. Se optar por não contratar os serviços, o relatório continua sendo
                seu.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs text-[#4d7c0f] font-mono">
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Sem taxa de deslocamento
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Laudo entregue em 24h
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={onOpenDiagnosticModal}
            className="bg-[#8CC63F] hover:bg-[#7cb633] text-slate-950 font-extrabold text-sm px-8 py-6 rounded-xl shrink-0 shadow-lg"
          >
            SOLICITAR AGORA
          </Button>
        </div>
      </div>
    </section>
  )
}
