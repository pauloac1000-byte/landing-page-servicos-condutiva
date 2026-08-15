import { Phone, MessageCircle } from 'lucide-react'
import { COMPANY_INFO } from '@/data/mockData'

export function FloatingActions() {
  const whatsappUrl = `https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(
    'Olá! Vim pelo site da Condutiva e gostaria de agendar um Diagnóstico Gratuito na nossa planta industrial.',
  )}`

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3 pointer-events-auto">
      {/* Phone Call Float */}
      <a
        href={`tel:${COMPANY_INFO.phoneLandline.replace(/\D/g, '')}`}
        className="group flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-white px-3 py-2 rounded-full border border-slate-700 shadow-xl backdrop-blur transition-all duration-300 hover:scale-105"
        title="Ligar para suporte técnico"
      >
        <span className="text-xs font-semibold max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap pl-1">
          {COMPANY_INFO.phoneLandline}
        </span>
        <div className="w-9 h-9 rounded-full bg-slate-800 text-[#8CC63F] flex items-center justify-center shadow">
          <Phone className="w-4 h-4" />
        </div>
      </a>

      {/* WhatsApp Main Pulsing Float */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group flex items-center justify-center"
        title="Falar no WhatsApp"
      >
        <span className="absolute -inset-1 rounded-full bg-emerald-500 opacity-75 animate-ping group-hover:opacity-100"></span>
        <div className="relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 group-hover:scale-105">
          <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
          <span className="text-xs font-black tracking-wide uppercase pr-1 hidden sm:inline">
            Falar no WhatsApp
          </span>
        </div>
      </a>
    </div>
  )
}
