import { PRACTICAL_BENEFITS } from '@/data/mockData'
import { CheckCircle } from 'lucide-react'

export function BenefitsGridSection() {
  return (
    <section className="py-16 bg-white text-slate-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-slate-50 border border-slate-200">
          <h3 className="text-2xl font-bold font-display text-center text-slate-900 mb-8">
            Benefícios práticos imediatos ao contar com a Unidade de Serviços Condutiva
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRACTICAL_BENEFITS.map((benefit, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200"
              >
                <CheckCircle className="w-5 h-5 text-[#8CC63F] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
