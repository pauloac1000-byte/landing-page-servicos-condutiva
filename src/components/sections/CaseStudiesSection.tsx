import { useState } from 'react'
import { CASE_STUDIES } from '@/data/mockData'
import { Building, TrendingUp, Quote, MapPin, CheckCircle2 } from 'lucide-react'

export function CaseStudiesSection() {
  const [activeTab, setActiveTab] = useState(CASE_STUDIES[0].id)
  const currentCase = CASE_STUDIES.find((c) => c.id === activeTab) || CASE_STUDIES[0]

  return (
    <section id="casos" className="py-20 bg-slate-50 text-slate-900 relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#4d7c0f] bg-[#8CC63F]/10 px-3 py-1 rounded-full border border-[#8CC63F]/30">
            PROVA SOCIAL & RESULTADOS PRÁTICOS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900">
            Quem confia na Condutiva protege sua produção.
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Casos reais de empresas industriais líderes em seus segmentos.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {CASE_STUDIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveTab(c.id)}
              className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 flex items-center gap-2 ${
                activeTab === c.id
                  ? 'bg-[#8CC63F] text-slate-950 shadow-lg shadow-[#8CC63F]/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>{c.client}</span>
            </button>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 max-w-5xl mx-auto shadow-elevation">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl overflow-hidden border border-slate-200 relative h-56 sm:h-64 group">
                <img
                  src={currentCase.image}
                  alt={currentCase.client}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-xs font-bold text-[#8CC63F] uppercase tracking-wider block font-mono">
                    {currentCase.segment}
                  </span>
                  <h3 className="text-xl font-extrabold text-white">{currentCase.client}</h3>
                  <span className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    {currentCase.location}
                  </span>
                </div>
              </div>

              {currentCase.galleryImages && currentCase.galleryImages.length > 1 && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {currentCase.galleryImages.map((imgSrc, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl overflow-hidden border border-slate-200 h-24 sm:h-28 relative group shadow-xs"
                    >
                      <img
                        src={imgSrc}
                        alt={`${currentCase.client} ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-1 right-2 bg-slate-900/70 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md font-mono">
                        {idx === 0 ? 'Vista Aérea' : 'Plantação & Silos'}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                {currentCase.results.map((res, i) => null)}
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase text-red-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Desafio da Planta:
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">{currentCase.challenge}</p>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-mono font-bold uppercase text-[#4d7c0f] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8CC63F]" />
                  Solução Aplicada pela Condutiva:
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">{currentCase.solution}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 relative mt-4">
                <Quote className="w-8 h-8 text-[#8CC63F]/20 absolute top-2 right-3" />
                <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed relative z-10">
                  "{currentCase.quote}"
                </p>
                <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{currentCase.author}</span>
                  <span className="text-slate-500 text-[11px]">{currentCase.role}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
