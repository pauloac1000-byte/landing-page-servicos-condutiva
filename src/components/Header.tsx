import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Menu, Phone, MessageCircle, ChevronRight, UserCheck, Lock } from 'lucide-react'
import { COMPANY_INFO } from '@/data/mockData'
import { useToast } from '@/hooks/use-toast'
import { Logo } from '@/components/Logo'
import { useClienteAuth } from '@/contexts/ClienteAuthContext'

interface HeaderProps {
  onOpenDiagnosticModal?: () => void
  onOpenClienteArea?: () => void
}

export function Header({ onOpenDiagnosticModal, onOpenClienteArea }: HeaderProps) {
  const [activeLang, setActiveLang] = useState<'PT' | 'EN' | 'ES'>('PT')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { toast } = useToast()
  const { isAuthenticated, openModal, cliente } = useClienteAuth()

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
            <span className="flex items-center gap-1.5 text-[#4d7c0f] font-medium text-xs">
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
                className={`px-2 py-0.5 text-[10px] font-bold rounded transition-all ${
                  activeLang === 'PT'
                    ? 'bg-[#8CC63F] text-slate-950 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Português"
              >
                PT 🇧🇷
              </button>
              <button
                onClick={() => handleLangChange('EN')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded transition-all ${
                  activeLang === 'EN'
                    ? 'bg-[#8CC63F] text-slate-950 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="English"
              >
                EN 🇺🇸
              </button>
              <button
                onClick={() => handleLangChange('ES')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded transition-all ${
                  activeLang === 'ES'
                    ? 'bg-[#8CC63F] text-slate-950 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Español"
              >
                ES 🇪🇸
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 h-24 flex items-center justify-between gap-6">
        {/* Logotipo */}
        <div className="shrink-0">
          <Logo className="flex items-center group" />
        </div>

        {/* Menu de Navegação Central */}
        <nav className="hidden lg:flex items-center justify-center space-x-8 text-sm font-medium flex-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-slate-700 hover:text-[#4d7c0f] font-semibold transition-colors py-1 relative group tracking-tight"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#8CC63F] transition-all duration-200 group-hover:w-full" />
            </button>
          ))}
        </nav>

        {/* Botão de Área do Cliente & Contatos à Direita */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (onOpenClienteArea) {
                onOpenClienteArea()
              } else {
                openModal('login')
              }
            }}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#8CC63F] bg-[#8CC63F] hover:bg-[#7cb633] text-slate-950 font-bold transition-all shadow-sm hover:shadow-md group"
            title="Área do Cliente Condutiva"
          >
            {isAuthenticated ? (
              <UserCheck className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
            ) : (
              <Lock className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
            )}
            <span className="text-xs font-black uppercase tracking-wider text-slate-950">
              {isAuthenticated ? 'Área do Cliente' : 'Área do Cliente'}
            </span>
          </button>

          {/* Telefone Fixo */}
          <a
            href={`tel:${COMPANY_INFO.phoneLandline.replace(/\D/g, '')}`}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-slate-200/80 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-300 transition-all group"
            title="Ligue para nossa central"
          >
            <div className="w-8 h-8 rounded-full bg-[#8CC63F]/15 flex items-center justify-center shrink-0 group-hover:bg-[#8CC63F]/25 transition-colors">
              <Phone className="w-4 h-4 text-[#4d7c0f] stroke-[2.2]" />
            </div>
            <div className="flex flex-col text-left leading-tight whitespace-nowrap">
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Telefone
              </span>
              <span className="text-xs font-bold text-slate-800 group-hover:text-[#4d7c0f] transition-colors">
                {COMPANY_INFO.phoneLandline}
              </span>
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(
              'Olá! Vim pelo site da Condutiva e gostaria de mais informações sobre a unidade de serviços de vocês.',
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-emerald-200/70 bg-emerald-50/50 hover:bg-emerald-100/70 hover:border-emerald-300 transition-all group"
            title="Fale conosco no WhatsApp"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/25 transition-colors">
              <MessageCircle className="w-4 h-4 text-emerald-600 stroke-[2.2]" />
            </div>
            <div className="flex flex-col text-left leading-tight whitespace-nowrap">
              <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-700">
                WhatsApp
              </span>
              <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                {COMPANY_INFO.phoneWhatsapp}
              </span>
            </div>
          </a>
        </div>

        {/* Menu Mobile / Drawer */}
        <div className="lg:hidden flex items-center gap-2">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-700 hover:bg-slate-100 h-10 w-10"
              >
                <Menu className="w-6 h-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-white border-slate-200 text-slate-900 w-[300px] flex flex-col justify-between"
            >
              <div>
                <SheetTitle className="text-left text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-[#8CC63F] flex items-center justify-center text-slate-950 font-black text-xs">
                    C
                  </div>
                  Condutiva Serviços
                </SheetTitle>
                <SheetDescription className="text-left text-xs text-slate-500 mb-6">
                  Navegação e canais de atendimento industrial.
                </SheetDescription>
                <div className="flex flex-col space-y-2">
                  {navLinks.map((link) => (
                    <button
                      key={link.href}
                      onClick={() => scrollTo(link.href)}
                      className="text-left py-2.5 px-3 text-slate-700 hover:bg-slate-100 hover:text-[#4d7c0f] rounded-lg font-medium text-sm flex items-center justify-between transition-colors"
                    >
                      <span>{link.label}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      if (onOpenClienteArea) {
                        onOpenClienteArea()
                      } else {
                        openModal('login')
                      }
                    }}
                    className="text-left py-2.5 px-3 bg-[#8CC63F] text-slate-950 rounded-lg font-black text-sm flex items-center justify-between transition-colors mt-2 shadow-sm"
                  >
                    <span className="flex items-center gap-2">
                      {isAuthenticated ? (
                        <UserCheck className="w-4 h-4 text-slate-950" />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-950" />
                      )}
                      Área do Cliente
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-950" />
                  </button>
                </div>{' '}
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-2.5 mb-2">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-1">
                  Canais de Atendimento
                </p>
                <a
                  href={`tel:${COMPANY_INFO.phoneLandline.replace(/\D/g, '')}`}
                  className="flex items-center gap-3 p-3 text-slate-800 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#8CC63F]/20 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[#4d7c0f]" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] text-slate-500 font-normal">Telefone Fixo</span>
                    <span className="font-bold">{COMPANY_INFO.phoneLandline}</span>
                  </div>
                </a>
                <a
                  href={`https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(
                    'Olá! Vim pelo site da Condutiva e gostaria de mais informações sobre a unidade de serviços de vocês.',
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 text-emerald-950 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs font-semibold hover:bg-emerald-100/70 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] text-emerald-700 font-normal">
                      WhatsApp Direto
                    </span>
                    <span className="font-bold">{COMPANY_INFO.phoneWhatsapp}</span>
                  </div>
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
