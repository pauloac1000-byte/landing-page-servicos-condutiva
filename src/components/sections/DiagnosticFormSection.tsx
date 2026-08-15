import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { LeadFormData } from '@/types'
import { SECTORS, COMPANY_INFO } from '@/data/mockData'
import { Send, CheckCircle2, Sparkles, Phone, ShieldCheck } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface FormProps {
  initialService?: string
}

export function DiagnosticFormSection({ initialService }: FormProps) {
  const { toast } = useToast()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState<LeadFormData>({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    segment: '',
    equipmentCount: '1-5',
    mainChallenge: initialService ? `Interesse no serviço: ${initialService}` : '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.fullName || !formData.phone || !formData.email) {
      toast({
        title: 'Atenção',
        description: 'Por favor, preencha nome, e-mail e telefone para contato.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitted(true)
    toast({
      title: 'Diagnóstico Solicitado com Sucesso! 🚀',
      description: `Obrigado, ${formData.fullName}! Nosso engenheiro entrará em contato em breve no número ${formData.phone}.`,
    })
  }

  return (
    <section id="diagnostico-form" className="py-20 bg-white text-slate-900 relative">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#4d7c0f] bg-[#8CC63F]/10 px-3 py-1 rounded-full border border-[#8CC63F]/30">
              AGENDAMENTO DIRETO
            </span>

            <h2 className="text-3xl sm:text-4xl font-black font-display leading-tight text-slate-900">
              Solicite seu Diagnóstico Gratuito na Planta
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed">
              Preencha o formulário para que nossa equipe de engenharia analise seu segmento e
              prepare o roteiro técnico do seu **Health-Check industrial**.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3 text-xs text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-[#8CC63F]/15 text-[#8CC63F] flex items-center justify-center font-bold">
                  ✓
                </div>
                <span>Sem taxa de visita para indústrias da região</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-[#8CC63F]/15 text-[#8CC63F] flex items-center justify-center font-bold">
                  ✓
                </div>
                <span>Laudo técnico detalhado com score de saúde da planta</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-[#8CC63F]/15 text-[#8CC63F] flex items-center justify-center font-bold">
                  ✓
                </div>
                <span>Sigilo e proteção de dados industriais garantidos</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
              <span className="font-bold text-slate-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#8CC63F]" />
                Preferência por ligação telefônica direta?
              </span>
              <p>
                Ligue para {COMPANY_INFO.phoneLandline} ou WhatsApp {COMPANY_INFO.phoneWhatsapp}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-elevation relative">
              {isSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#8CC63F]/15 text-[#8CC63F] flex items-center justify-center mx-auto border border-[#8CC63F]/40">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Solicitação Recebida com Sucesso!
                  </h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto">
                    Nossa equipe técnica já recebeu seus dados e entrará em contato nas próximas 2
                    horas úteis para confirmar a data do diagnóstico na sua planta.
                  </p>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    className="border-slate-300 text-slate-600 hover:bg-slate-100"
                  >
                    Enviar nova solicitação
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-2">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#8CC63F]" />
                      Formulário de Diagnóstico Técnico
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Gratuito / Sem Tarifas
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-700 font-semibold mb-1.5 block">
                        Nome Completo *
                      </label>
                      <Input
                        required
                        placeholder="Ex: Carlos Silva"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#8CC63F]"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-700 font-semibold mb-1.5 block">
                        Empresa / Razão Social *
                      </label>
                      <Input
                        required
                        placeholder="Ex: Indústria Concreta S/A"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#8CC63F]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-700 font-semibold mb-1.5 block">
                        E-mail Corporativo *
                      </label>
                      <Input
                        required
                        type="email"
                        placeholder="carlos@empresa.com.br"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#8CC63F]"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-700 font-semibold mb-1.5 block">
                        Telefone / WhatsApp *
                      </label>
                      <Input
                        required
                        placeholder="(19) 99999-9999"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#8CC63F]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-700 font-semibold mb-1.5 block">
                        Segmento da Planta
                      </label>
                      <Select
                        value={formData.segment}
                        onValueChange={(val) => setFormData({ ...formData, segment: val })}
                      >
                        <SelectTrigger className="bg-white border-slate-300 text-slate-900">
                          <SelectValue placeholder="Selecione o setor" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-300 text-slate-900">
                          {SECTORS.map((s) => (
                            <SelectItem key={s.name} value={s.name}>
                              {s.name}
                            </SelectItem>
                          ))}
                          <SelectItem value="Outro Segmento">Outro Segmento Industrial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs text-slate-700 font-semibold mb-1.5 block">
                        Qtd. Balanças / Dosadores
                      </label>
                      <Select
                        value={formData.equipmentCount}
                        onValueChange={(val) => setFormData({ ...formData, equipmentCount: val })}
                      >
                        <SelectTrigger className="bg-white border-slate-300 text-slate-900">
                          <SelectValue placeholder="Selecione a quantidade" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-300 text-slate-900">
                          <SelectItem value="1-5">1 a 5 equipamentos</SelectItem>
                          <SelectItem value="6-15">6 a 15 equipamentos</SelectItem>
                          <SelectItem value="16-30">16 a 30 equipamentos</SelectItem>
                          <SelectItem value="30+">Mais de 30 equipamentos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-700 font-semibold mb-1.5 block">
                      Principal Desafio ou Necessidade
                    </label>
                    <Textarea
                      rows={3}
                      placeholder="Descreva resumidamente se precisa de calibração, manutenção emergencial de painel ou sistema preditivo..."
                      value={formData.mainChallenge}
                      onChange={(e) => setFormData({ ...formData, mainChallenge: e.target.value })}
                      className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#8CC63F]"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#8CC63F] hover:bg-[#7cb633] text-slate-950 font-black text-base py-6 rounded-xl shadow-xl shadow-[#8CC63F]/20 flex items-center justify-center gap-2 mt-4"
                  >
                    <Send className="w-5 h-5" />
                    SOLICITAR MEU DIAGNÓSTICO GRATUITO
                  </Button>

                  <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#8CC63F]" />
                    Seus dados estão protegidos sob a LGPD. Não enviamos spam.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
