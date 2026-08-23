import { Phone, MessageCircle } from 'lucide-react'
import { COMPANY_INFO } from '@/data/mockData'

export function FloatingActions() {
  // Uses WhatsApp click-to-chat URL with default phone number: 5519993413270
  const whatsappNumber = COMPANY_INFO.whatsappRaw || '5519993413270'
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Olá! Vim pelo site da Condutiva e gostaria de mais informações.',
  )}`

  return (
    <div
      className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end space-y-2.5 pointer-events-auto"
      style={{
        bottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))',
      }}
    >
      {/* Optional landline quick call for desktop / tablet */}
      <a
        href={`tel:${COMPANY_INFO.phoneLandline.replace(/\D/g, '')}`}
        className="hidden md:flex group items-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-white px-3 py-1.5 rounded-full border border-slate-700 shadow-lg backdrop-blur transition-all duration-300 hover:scale-105"
        title="Ligar para a Condutiva"
      >
        <span className="text-[11px] font-semibold max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap pl-1 text-slate-300">
          {COMPANY_INFO.phoneLandline}
        </span>
        <div className="w-7 h-7 rounded-full bg-slate-800 text-[#8CC63F] flex items-center justify-center shadow">
          <Phone className="w-3.5 h-3.5" />
        </div>
      </a>

      {/* WhatsApp Floating Button standard click-to-chat */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar conosco no WhatsApp"
        className="relative group flex items-center justify-center"
        title="Fale conosco no WhatsApp"
      >
        {/* Soft pulsing glow */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-60 animate-ping group-hover:opacity-100 duration-1000"></span>

        <div className="relative flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl transition-all duration-300 group-hover:scale-110 active:scale-95 border-2 border-white/20">
          {/* WhatsApp Custom SVG / Lucide Icon */}
          <svg
            className="w-6 h-6 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          <span className="text-xs font-black tracking-wide uppercase pr-1 hidden sm:inline select-none">
            Fale Conosco
          </span>
        </div>
      </a>
    </div>
  )
}
