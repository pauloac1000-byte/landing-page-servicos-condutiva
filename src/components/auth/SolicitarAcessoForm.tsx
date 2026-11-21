import { useState, type FormEvent } from 'react'
import { Mail, User, Phone, Briefcase, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cadastrarAcesso, mensagemDeErro } from '@/services/equipeAcesso'
import { validarEmail, validarObrigatorio, temErros, type Erros } from '@/components/auth/validacao'
import { AuthField } from '@/components/auth/AuthField'
import { AuthFeedback, AvisoAprovacao } from '@/components/auth/AuthFeedback'

interface SolicitarAcessoFormProps {
  onVoltar: () => void
}

/** Tela Solicitar acesso: pedido de conta pendente de aprovação do administrador. */
export function SolicitarAcessoForm({ onVoltar }: SolicitarAcessoFormProps) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [vinculo, setVinculo] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [erroGeral, setErroGeral] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [enviando, setEnviando] = useState(false)

  const limpar = (campo: string) => setErros((p) => ({ ...p, [campo]: '' }))

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    const novos: Erros = {
      nome: validarObrigatorio(nome, 'Informe seu nome completo.'),
      email: validarEmail(email),
    }
    setErros(novos)
    if (temErros(novos)) return

    setEnviando(true)
    setErroGeral('')
    setSucesso('')
    try {
      await cadastrarAcesso({
        nome: nome.trim(),
        email: email.trim(),
        telefone: telefone.trim(),
        vinculo: vinculo.trim(),
      })
      setSucesso(
        'Solicitação enviada com sucesso! Seu acesso será analisado pelo administrador da Condutiva e liberado em até 24 horas. Você receberá a confirmação no e-mail informado.',
      )
      setNome('')
      setEmail('')
      setTelefone('')
      setVinculo('')
    } catch (err) {
      setErroGeral(mensagemDeErro(err, 'Não foi possível enviar a solicitação. Tente novamente.'))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <AuthField
          id="solicitar-nome"
          label="Nome completo"
          icon={User}
          required
          placeholder="Seu nome completo"
          value={nome}
          onChange={(v) => {
            setNome(v)
            limpar('nome')
          }}
          error={erros.nome}
          autoComplete="name"
        />
        <AuthField
          id="solicitar-email"
          label="E-mail"
          icon={Mail}
          type="email"
          required
          placeholder="seu.email@condutiva.com.br"
          value={email}
          onChange={(v) => {
            setEmail(v)
            limpar('email')
          }}
          error={erros.email}
          autoComplete="email"
        />
        <AuthField
          id="solicitar-telefone"
          label="Telefone de contato"
          icon={Phone}
          type="tel"
          placeholder="(00) 00000-0000"
          value={telefone}
          onChange={setTelefone}
          autoComplete="tel"
        />
        <AuthField
          id="solicitar-vinculo"
          label="Vínculo"
          icon={Briefcase}
          placeholder="Ex.: Comercial, Técnico, Parceiro"
          value={vinculo}
          onChange={setVinculo}
        />

        <AvisoAprovacao />

        {erroGeral && <AuthFeedback tipo="erro" texto={erroGeral} />}
        {sucesso && <AuthFeedback tipo="sucesso" texto={sucesso} />}

        <Button
          type="submit"
          disabled={enviando}
          className="w-full bg-[#8BC34A] hover:bg-[#7CB342] text-[#1F2A16] font-bold h-11 rounded-xl shadow-md shadow-[#8BC34A]/20 text-sm disabled:opacity-50"
        >
          {enviando && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Enviar solicitação
        </Button>
      </form>

      <p className="mt-5 text-center text-xs">
        <button
          type="button"
          onClick={onVoltar}
          className="font-semibold text-[#689F38] hover:underline"
        >
          Voltar ao login
        </button>
      </p>
    </>
  )
}
