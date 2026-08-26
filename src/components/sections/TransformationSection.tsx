import { TRANSFORMATION } from '@/data/mockData'
import { ArrowRight, Check, X } from 'lucide-react'

export function TransformationSection() {
  return (
    <section className="py-20 bg-slate-50 text-slate-900 relative border-t border-slate-200">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#4d7c0f] bg-[#8CC63F]/10 px-3 py-1 rounded-full border border-[#8CC63F]/30">
            A TRANSFORMAÇÃO CONDUTIVA
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900">
            A diferença entre apagar incêndios e ter controle operacional do seu chão de fábrica.
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Veja a evolução direta na rotina da sua equipe de engenharia e manutenção ao contratar
            nossos serviços.
          </p>
        </div>

        <div className="space-y-4 max-w-5xl mx-auto">
          {TRANSFORMATION.map((item, idx) => (
            <div
              key={item.topic}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition items-center shadow-subtle"
            >
              <div className="md:col-span-3 font-bold text-slate-900 text-base font-display flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#8CC63F]/15 text-[#4d7c0f] text-xs flex items-center justify-center font-mono">
                  {idx + 1}
                </span>
                {item.topic}
              </div>

              <div className="md:col-span-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-800 flex items-start gap-2.5">
                <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-mono uppercase text-red-500 block font-bold mb-0.5">
                    Sua fábrica HOJE
                  </span>
                  {item.de}
                </div>
              </div>

              <div className="hidden md:flex md:col-span-1 justify-center">
                <ArrowRight className="w-5 h-5 text-[#8CC63F]" />
              </div>

              <div className="md:col-span-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800 flex items-start gap-2.5 shadow-subtle">
                <Check className="w-4 h-4 text-[#8CC63F] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#4d7c0f] block font-bold mb-0.5">
                    Com a CONDUTIVA
                  </span>
                  {item.para}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
