import { Shield, Award, Wrench } from 'lucide-react'

export function PresentationSection() {
  return (
    <section className="py-20 bg-slate-50 text-slate-900 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-elevation">
              <img
                src="https://img.usecurling.com/p/800/500?q=industrial%20electrical%20engineers&color=blue"
                alt="Equipe técnica da Condutiva Tecnologia em centro de controle"
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80"></div>

              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/95 border border-slate-200 backdrop-blur-md flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#8CC63F] text-slate-950 flex items-center justify-center font-bold">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-900">
                      Unidade de Campo & Laboratório
                    </h5>
                    <p className="text-xs text-slate-500">Atendimento presencial e remoto</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-[#4d7c0f] bg-[#8CC63F]/10 px-2.5 py-1 rounded">
                  Horário Comercial
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#4d7c0f] block">
              QUEM SOMOS & DNA DE FABRICANTE
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display leading-tight">
              Sua fábrica merece o suporte técnico de quem de fato projeta e constrói a tecnologia.
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              A Condutiva Tecnologia não é uma prestadora de serviços comum. Nós fornecemos soluções
              integradas em medição, automação e gestão de processos produtivos para as maiores
              indústrias do Brasil e da América Latina.
            </p>

            <p className="text-slate-500 text-sm leading-relaxed">
              Isso significa que nossa equipe de campo conhece cada circuito, cada etapa do processo
              e cada gargalo mecânico. Nós atuamos na causa raiz para garantir a máxima eficiência
              da sua planta.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-3">
                <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Engenharia Própria</h4>
                  <p className="text-xs text-slate-500">
                    Suporte remoto direto com os engenheiros de desenvolvimento.
                  </p>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#8CC63F] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Técnicos Especializados</h4>
                  <p className="text-xs text-slate-500">Time técnico experiente e capacitado.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
