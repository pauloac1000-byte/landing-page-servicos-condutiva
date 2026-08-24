import { Button } from '@/components/ui/button'
import { Sparkles, ArrowRight } from 'lucide-react'

interface AspirationalProps {
  onOpenDiagnosticModal: () => void
}

export function AspirationalSection({ onOpenDiagnosticModal }: AspirationalProps) {
  return (
    <section className="relative py-24 bg-gradient-to-r from-[#4d7c0f] via-[#5a9e1a] to-[#4d7c0f] overflow-hidden text-center">
      <div className="absolute inset-0 opacity-10">
        <img
          src="https://img.usecurling.com/p/1200/500?q=high%20tech%20factory%20automation&color=green"
          alt="Indústria do futuro"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-4xl space-y-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-mono font-bold border border-white/30">
          <Sparkles className="w-3.5 h-3.5" />
          INDÚSTRIA 4.0 NA PRÁTICA
        </span>

        <h2 className="text-3xl sm:text-5xl font-black text-white font-display leading-tight">
          Sua planta pronta para atingir a máxima eficiência com a tecnologia Condutiva.
        </h2>

        <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto">
          Não espere o próximo descarte de lote ou a próxima parada emergencial de linha. Agende
          agora o diagnóstico sem custos.
        </p>

        <div className="pt-4">
          <Button
            onClick={onOpenDiagnosticModal}
            className="bg-white hover:bg-slate-100 text-[#4d7c0f] font-black text-base px-10 py-6 rounded-xl shadow-2xl hover:scale-105 transition-all inline-flex items-center gap-3"
          >
            <span>AGENDAR DIAGNÓSTICO AGORA</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
