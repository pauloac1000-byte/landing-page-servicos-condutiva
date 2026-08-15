import { Factory, Truck, Settings2 } from 'lucide-react'

export function DifferentiatorsSection() {
  const diffs = [
    {
      icon: Factory,
      title: 'DNA de Fabricante',
      desc: 'Não somos intermediários. Desenvolvemos soluções completas de hardware e software, permitindo intervenções diretas sem dependência de terceiros.',
    },
    {
      icon: Truck,
      title: 'Presença e Mobilidade em Campo',
      desc: 'Veículos técnicos equipados com pesos padrão certificados Inmetro para aferição presencial imediata no seu parque fabril.',
    },
    {
      icon: Settings2,
      title: 'Customização Total para o seu Processo',
      desc: 'Seja dosagem de aditivos em gramas ou pesagem de carretas de 80 toneladas: moldamos o protocolo ao seu fluxo de engenharia.',
    },
  ]

  return (
    <section className="py-16 bg-white text-slate-900 border-y border-slate-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {diffs.map((d) => {
            const Icon = d.icon
            return (
              <div
                key={d.title}
                className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200"
              >
                <div className="w-12 h-12 rounded-xl bg-[#8CC63F]/10 text-[#8CC63F] flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 mb-1">{d.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{d.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
