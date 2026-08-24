import { Link } from 'react-router-dom'
import { COMPANY_INFO } from '@/data/mockData'
import { Phone, Mail, MapPin, Lock, Users } from 'lucide-react'
import { Logo } from '@/components/Logo'

export function Footer() {
  return (
    <footer className="bg-slate-50 text-slate-600 border-t border-slate-200 pt-16 pb-32 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2 space-y-4">
            <Logo className="flex flex-col items-start" />
            <p className="text-sm text-slate-500 leading-relaxed max-w-md">
              Especialistas com mais de 20 anos de tradição em manutenção preventiva, calibração
              presencial e remota, automação industrial e manutenção preventiva para plantas
              operacionais exigentes.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-slate-900 font-bold text-sm uppercase tracking-wider border-b border-slate-200 pb-2">
              Soluções Técnicas
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#servicos" className="hover:text-[#4d7c0f] transition">
                  Calibração de Sensores de Umidade e medidores
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-[#4d7c0f] transition">
                  Manutenção Preventiva
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-[#4d7c0f] transition">
                  Programação e Integração CLP / IHM / Supervisório
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-[#4d7c0f] transition">
                  Diagnóstico de Redes e SIGA
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-[#4d7c0f] transition">
                  Retrofit & Modernização
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-slate-900 font-bold text-sm uppercase tracking-wider border-b border-slate-200 pb-2">
              Níveis de Serviço
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#planos" className="hover:text-[#4d7c0f] transition">
                  Plano Sentinela Preventivo
                </a>
              </li>
              <li>
                <a href="#planos" className="hover:text-[#4d7c0f] transition">
                  Plano Controle Total SIGA
                </a>
              </li>
              <li>
                <a href="#planos" className="hover:text-[#4d7c0f] transition">
                  Plano Maestro Engenharia
                </a>
              </li>
              <li>
                <a href="#diagnostico" className="hover:text-[#4d7c0f] transition">
                  Diagnóstico
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#4d7c0f] transition">
                  Perguntas Frequentes
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-slate-900 font-bold text-sm uppercase tracking-wider border-b border-slate-200 pb-2">
              Atendimento Comercial
            </h4>
            <div className="space-y-2.5 text-xs">
              <a
                href={`tel:${COMPANY_INFO.phoneLandline.replace(/\D/g, '')}`}
                className="flex items-center gap-2 text-slate-600 hover:text-[#4d7c0f] transition"
              >
                <Phone className="w-4 h-4 text-[#4d7c0f]" />
                <span>{COMPANY_INFO.phoneLandline}</span>
              </a>
              <a
                href={`https://wa.me/${COMPANY_INFO.whatsappRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition"
              >
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">
                  WA
                </span>
                <span>WhatsApp: {COMPANY_INFO.phoneWhatsapp}</span>
              </a>
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="flex items-center gap-2 text-slate-600 hover:text-[#4d7c0f] transition"
              >
                <Mail className="w-4 h-4 text-sky-500" />
                <span>{COMPANY_INFO.email}</span>
              </a>
              <div className="flex items-start gap-2 text-slate-500 pt-1">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.address}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <p className="text-center md:text-left">
            © 2026 Condutiva Tecnologia. Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2">
            <a href="#privacy" className="hover:text-slate-600 transition">
              Política de Privacidade
            </a>
            <a href="#terms" className="hover:text-slate-600 transition">
              Termos de Uso
            </a>
            <Link
              to="/leads"
              className="hover:text-[#4d7c0f] text-slate-400 transition flex items-center gap-1 font-medium"
              title="Acesso interno à gestão de leads comerciais"
            >
              <Users className="w-3 h-3 text-[#4d7c0f]" />
              Área da Equipe
            </Link>
            <span className="flex items-center gap-1 text-slate-500">
              <Lock className="w-3 h-3 text-[#4d7c0f]" />
              Conexão Segura SSL
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
