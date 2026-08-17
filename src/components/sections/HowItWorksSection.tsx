import { FileSearch, ClipboardCheck, Rocket } from 'lucide-react'

export function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      icon: FileSearch,
      title: 'Solicitação Inicial & Mapeamento',
      desc: 'Preencha o formulário em 1 minuto informando o segmento da sua planta e a quantidade aproximada de equipamentos.',
    },
    {
      num: '02',
      icon: ClipboardCheck,
      title: 'Health-Check Técnico Gratuito',
      desc: 'Nossa engenharia realiza a avaliação dos sensores, calibradores e painéis elétricos sem qualquer cobrança.',
    },
    {
      num: '03',
      icon: Rocket,
      title: 'Plano Personalizado & Execução',
      desc: 'Entregamos um relatório detalhado com pontuação da planta e plano de ação sob medida para zerar paradas.',
    },
  ]

  return (
    <section id="diagnostico" className="py-20 bg-slate-50 text-slate-900 relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#4d7c0f] bg-[#8CC63F]/10 px-3 py-1 rounded-full border border-[#8CC63F]/30">
            JORNADA SIMPLES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900">
            Como funciona a solicitação do Diagnóstico Gratuito
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Sem burocracia. Do envio da mensagem ao plano de manutenção em 3 passos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={step.num}
                className="relative bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#8CC63F]/40 transition duration-300 shadow-subtle"
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-3xl font-black font-mono text-[#8CC63F]/30">
                      {step.num}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-[#8CC63F]/10 text-[#8CC63F] flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
