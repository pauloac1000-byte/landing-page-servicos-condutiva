import { useState } from 'react'
import { Link } from 'react-router-dom'
import { COMPANY_INFO } from '@/data/mockData'
import { Phone, Mail, MapPin, Lock, Users, FileDown, Loader2 } from 'lucide-react'
import { downloadTrainingDocx } from '@/lib/trainingDocx'
import { useToast } from '@/hooks/use-toast'

export function Footer() {
  const [isDownloading, setIsDownloading] = useState(false)
  const { toast } = useToast()

  const handleDownloadDocx = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (isDownloading) return
    try {
      setIsDownloading(true)
      toast({
        title: 'Gerando Documento Word (.docx)',
        description: 'O treinamento completo da Condutiva Tecnologia está sendo formatado...',
      })
      await downloadTrainingDocx()
      toast({
        title: 'Download Concluído!',
        description: 'Treinamento_LandingPage_Condutiva.docx baixado com sucesso.',
      })
    } catch (err) {
      console.error('Erro ao gerar docx:', err)
      toast({
        variant: 'destructive',
        title: 'Erro no download',
        description: 'Não foi possível gerar o arquivo Word. Tente novamente.',
      })
    } finally {
      setIsDownloading(false)
    }
  }
  return (
    <footer className="bg-slate-50 text-slate-600 border-t border-slate-200 pt-16 pb-32 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8CC63F] flex items-center justify-center text-slate-950 font-black text-xl">
                C
              </div>
              <div>
                <span className="text-xl font-black text-slate-900 uppercase tracking-wider block font-display">
                  CONDUTIVA
                </span>
                <span className="text-xs text-[#4d7c0f] font-mono uppercase tracking-widest block">
                  Tecnologia & Serviços
                </span>
              </div>
            </div>
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
                  Calibração de Sensores de Umidade
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
                  Diagnóstico Gratuito
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
            <button
              onClick={handleDownloadDocx}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#8CC63F]/15 hover:bg-[#8CC63F]/25 text-[#4d7c0f] hover:text-[#36580a] font-semibold transition border border-[#8CC63F]/30 cursor-pointer disabled:opacity-60"
              title="Baixar apostila de treinamento completa em formato Word (.docx)"
            >
              {isDownloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#4d7c0f]" />
              ) : (
                <FileDown className="w-3.5 h-3.5 text-[#4d7c0f]" />
              )}
              <span>{isDownloading ? 'Gerando .docx...' : 'Baixar Treinamento (.docx)'}</span>
            </button>
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
