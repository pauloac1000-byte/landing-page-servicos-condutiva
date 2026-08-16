import { Button } from '@/components/ui/button'
import { Sparkles, ShieldCheck, CheckCircle2, Clock, Building, ArrowRight } from 'lucide-react'
import { COMPANY_INFO } from '@/data/mockData'
import { SigaTabletMockup } from './SigaTabletMockup'

interface HeroSectionProps {
  onOpenDiagnosticModal: () => void
}

export function HeroSection({ onOpenDiagnosticModal }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative pt-8 pb-16 lg:pt-16 lg:pb-24 overflow-hidden bg-gradient-to-b from-slate-50 to-white"
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-stretch">
          <div className="flex flex-col justify-between gap-6 lg:h-full text-left w-full">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8CC63F]/10 border border-[#8CC63F]/30 text-[#4d7c0f] text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#8CC63F]" />
              <span>Unidade de Serviços & Engenharia Preditiva</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-slate-900 leading-tight font-display tracking-tight">
              Transforme paradas não planejadas em{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4d7c0f] via-[#8CC63F] to-emerald-500">
                previsibilidade total
              </span>
              .
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed w-full font-normal">
              Serviços especializados de alta precisão em atendimento remoto prioritário, manutenção
              preventiva, calibração presencial, treinamentos operacionais, health check e solução
              de problemas&nbsp; para plantas industriais que desejam converter tecnologia em
              eficácia e competitividade.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8CC63F] shrink-0" />
                <span>Atendimento emergencial com SLA em contrato</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8CC63F] shrink-0" />
                <span>DNA de fabricante de equipamentos industriais</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8CC63F] shrink-0" />
                <span>Laudos e certificados 100% auditáveis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8CC63F] shrink-0" />
                <span>Técnicos certificados NR-10 e NR-35</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Button
                onClick={onOpenDiagnosticModal}
                className="bg-[#8CC63F] hover:bg-[#7cb633] text-slate-950 font-black text-base px-8 py-6 rounded-xl shadow-xl shadow-[#8CC63F]/25 hover:shadow-[#8CC63F]/40 transition-all flex items-center justify-center gap-3 group"
              >
                <span>SOLICITAR DIAGNÓSTICO GRATUITO</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <a
                href="#planos"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold text-sm transition bg-white hover:bg-slate-50"
              >
                Conhecer Planos de Manutenção
              </a>
            </div>

            <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 text-slate-600">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#8CC63F]" />
                  <span className="font-extrabold text-slate-900 text-lg font-mono">
                    +{COMPANY_INFO.experienceYears} Anos
                  </span>
                </div>
                <span className="text-xs text-slate-500">Tradição de Mercado</span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-sky-500" />
                  <span className="font-extrabold text-slate-900 text-lg font-mono">
                    {COMPANY_INFO.clientCount}+
                  </span>
                </div>
                <span className="text-xs text-slate-500">Clientes Atendidos</span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span className="font-extrabold text-slate-900 text-lg font-mono">
                    {COMPANY_INFO.statesCovered} Estados
                  </span>
                </div>
                <span className="text-xs text-slate-500">Presença em Campo</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center lg:h-full w-full">
            <SigaTabletMockup />
          </div>
        </div>
      </div>
    </section>
  )
}
