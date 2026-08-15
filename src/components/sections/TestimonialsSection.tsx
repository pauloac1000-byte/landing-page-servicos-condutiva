import { TESTIMONIALS } from '@/data/mockData'
import { Star, Quote } from 'lucide-react'

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-white text-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#4d7c0f] bg-[#8CC63F]/10 px-3 py-1 rounded-full border border-[#8CC63F]/30">
            DEPOIMENTOS DE QUEM OPERA
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900">
            A opinião de gestores e engenheiros no chão de fábrica.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between relative space-y-4"
            >
              <Quote className="w-8 h-8 text-[#8CC63F]/20 absolute top-4 right-4" />

              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
                  "{t.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{t.name}</h4>
                  <p className="text-[11px] text-slate-500">
                    {t.role} | <span className="text-[#4d7c0f]">{t.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
