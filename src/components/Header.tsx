import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Menu, Phone, MessageCircle, Sparkles, ChevronRight } from 'lucide-react'
import { COMPANY_INFO } from '@/data/mockData'
import { useToast } from '@/hooks/use-toast'
import { Logo } from '@/components/Logo'

interface HeaderProps {
  onOpenDiagnosticModal: () => void
}

export function Header({ onOpenDiagnosticModal }: HeaderProps) {
  const [activeLang, setActiveLang] = useState<'PT' | 'EN' | 'ES'>('PT')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { toast } = useToast()

  const handleLangChange = (lang: 'PT' | 'EN' | 'ES') => {
    setActiveLang(lang)
    const messages = {
      PT: 'Idioma alterado para Português (BR)',
      EN: 'Language changed to English',
      ES: 'Idioma cambiado a Español',
    }
    toast({
      title: 'Condutiva Internacional',
      description: messages[lang],
    })
  }

  const navLinks = [
    { label: 'Início', href: '#hero' },
    { label: 'Soluções', href: '#servicos' },
    { label: 'Diagnóstico', href: '#diagnostico' },
    { label: 'Planos', href: '#planos' },
    { label: 'Casos Reais', href: '#casos' },
    { label: 'FAQ', href: '#faq' },
  ]

  const scrollTo = (href: string) => {
    setIsMobileMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/95 border-b border-slate-200 shadow-sm transition-all">
      <div className="bg-slate-50 text-xs py-1.5 px-4 text-slate-600 border-b border-slate-200">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1 text-[#4d7c0f] font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8CC63F] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8CC63F]"></span>
              </span>
              Plantão de Atendimento Industrial em Todo o Brasil
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-slate-400 text-[11px] hidden sm:inline">Idioma:</span>
            <div className="flex items-center bg-slate-100 rounded-md p-0.5 border border-slate-200">
              <button
                onClick={() => handleLangChange('PT')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded ${activeLang === 'PT' ? 'bg-[#8CC63F] text-slate-950 shadow' : 'text-slate-500 hover:text-slate-800'}`}
                title="Português"
              >
                PT 🇧🇷
              </button>
              <button
                onClick={() => handleLangChange('EN')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded ${activeLang === 'EN' ? 'bg-[#8CC63F] text-slate-950 shadow' : 'text-slate-500 hover:text-slate-800'}`}
                title="English"
              >
                EN 🇺🇸
              </button>
              <button
                onClick={() => handleLangChange('ES')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded ${activeLang === 'ES' ? 'bg-[#8CC63F] text-slate-950 shadow' : 'text-slate-500 hover:text-slate-800'}`}
                title="Español"
              >
                ES 🇪🇸
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Logo className="flex items-center group" />

        <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-slate-600 hover:text-[#4d7c0f] transition-colors py-1 relative group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#8CC63F] transition-all group-hover:w-full" />
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-6">
          {/* Telefone Fixo */}
          <a
            href={`tel:${COMPANY_INFO.phoneLandline.replace(/\D/g, '')}`}
            className="flex items-center gap-2.5 group hover:opacity-90 transition-opacity"
          >
            <div className="w-7 h-7 rounded-full bg-[#8CC63F]/15 flex items-center justify-center shrink-0">
              <Phone className="w-3.5 h-3.5 text-[#8CC63F] stroke-[2]" />
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[10px] font-normal text-slate-500">Telefone</span>
              <span className="text-xs font-semibold text-slate-700 group-hover:text-[#4d7c0f] transition-colors">
                {COMPANY_INFO.phoneLandline}
              </span>
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${COMPANY_INFO.whatsappRaw}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 group hover:opacity-90 transition-opacity"
          >
            <div className="w-7 h-7 rounded-full bg-[#8CC63F]/15 flex items-center justify-center shrink-0">
              <MessageCircle className="w-3.5 h-3.5 text-[#8CC63F] stroke-[2]" />
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[10px] font-normal text-slate-500">Fale no WhatsApp</span>
              <span className="text-xs font-semibold text-slate-700 group-hover:text-[#4d7c0f] transition-colors">
                {COMPANY_INFO.phoneWhatsapp}
              </span>
            </div>
          </a>

          <Button
            onClick={onOpenDiagnosticModal}
            className="hidden lg:flex bg-[#8CC63F] hover:bg-[#7cb633] text-slate-950 font-bold px-5 py-2.5 rounded-lg shadow-lg shadow-[#8CC63F]/25 hover:shadow-[#8CC63F]/40 transition-all items-center gap-2 group transform hover:-translate-y-0.5 ml-2"
          >
            <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950 animate-pulse" />
            <span>Diagnóstico Gratuito</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="lg:hidden flex items-center gap-2">
          <Button
            onClick={onOpenDiagnosticModal}
            size="sm"
            className="bg-[#8CC63F] text-slate-950 font-bold text-xs px-3"
          >
            Diagnóstico
          </Button>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-700 hover:bg-slate-100">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-white border-slate-200 text-slate-900 w-[300px]"
            >
              <SheetTitle className="text-left text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-[#8CC63F] flex items-center justify-center text-slate-950 font-black text-xs">
                  C
                </div>
                Condutiva Tecnologia
              </SheetTitle>
              <SheetDescription className="text-left text-xs text-slate-500 mb-6">
                Navegação e atendimento industrial rápido.
              </SheetDescription>
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => scrollTo(link.href)}
                    className="text-left py-2 px-3 text-slate-700 hover:bg-slate-100 rounded-md font-medium text-sm flex items-center justify-between"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <Button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      onOpenDiagnosticModal()
                    }}
                    className="w-full bg-[#8CC63F] text-slate-950 font-bold py-3"
                  >
                    Solicitar Diagnóstico
                  </Button>
                  <div className="grid grid-cols-1 gap-2 pt-2">
                    <a
                      href={`tel:${COMPANY_INFO.phoneLandline.replace(/\D/g, '')}`}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 text-slate-800 border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
                    >
                      <Phone className="w-4 h-4 text-[#8CC63F]" />
                      <span>Telefone: {COMPANY_INFO.phoneLandline}</span>
                    </a>
                    <a
                      href={`https://wa.me/${COMPANY_INFO.whatsappRaw}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-2.5 px-3 text-slate-800 border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-[#8CC63F]" />
                      <span>WhatsApp: {COMPANY_INFO.phoneWhatsapp}</span>
                    </a>
                  </div>{' '}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
