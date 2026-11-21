import { useState, type FormEvent } from 'react'
import { Mail, Lock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { redefinirSenhaEquipe, mensagemDeErro } from '@/services/equipeAcesso'
import {
  validarEmail,
  validarObrigatorio,
  validarSenha,
  validarConfirmacao,
  temErros,
  type Erros,
} from '@/components/auth/validacao'
import { AuthField } from '@/components/auth/AuthField'
import { AuthFeedback } from '@/components/auth/AuthFeedback'

interface RedefinirFormProps {
  onVoltarAoLogin: () => void
}

/** Aba Redefinir: troca a senha informando e-mail, senha atual e nova senha. */
export function RedefinirForm({ onVoltarAoLogin }: RedefinirFormProps) {
  const [email, setEmail] = useState('')
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [erroGeral, setErroGeral] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [enviando, setEnviando] = useState(false)

  const limpar = (campo: string) => setErros((p) => ({ ...p, [campo]: '' }))

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    const novos: Erros = {
      email: validarEmail(email),
      senhaAtual: validarObrigatorio(senhaAtual, 'Informe a senha atual.'),
      novaSenha: validarSenha(novaSenha),
      confirmar: validarConfirmacao(confirmar, novaSenha),
    }
    setErros(novos)
    if (temErros(novos)) return

    setEnviando(true)
    setErroGeral('')
    setSucesso('')
    try {
      await redefinirSenhaEquipe(email.trim(), senhaAtual, novaSenha)
      setSucesso('Senha redefinida com sucesso! Use a nova senha para entrar no painel.')
      setSenhaAtual('')
      setNovaSenha('')
      setConfirmar('')
    } catch (err) {
      setErroGeral(mensagemDeErro(err, 'Não foi possível redefinir a senha. Tente novamente.'))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <AuthField
          id="redefinir-email"
          label="E-mail corporativo"
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
          autoComplete="username"
        />
        <AuthField
          id="redefinir-senha-atual"
          label="Senha atual"
          icon={Lock}
          type="password"
          required
          placeholder="Digite sua senha atual"
          value={senhaAtual}
          onChange={(v) => {
            setSenhaAtual(v)
            limpar('senhaAtual')
          }}
          error={erros.senhaAtual}
          autoComplete="current-password"
        />
        <AuthField
          id="redefinir-nova-senha"
          label="Nova senha"
          icon={Lock}
          type="password"
          required
          placeholder="Mínimo de 8 caracteres"
          value={novaSenha}
          onChange={(v) => {
            setNovaSenha(v)
            limpar('novaSenha')
          }}
          error={erros.novaSenha}
          autoComplete="new-password"
        />
        <AuthField
          id="redefinir-confirmar"
          label="Confirmar nova senha"
          icon={Lock}
          type="password"
          required
          placeholder="Repita a nova senha"
          value={confirmar}
          onChange={(v) => {
            setConfirmar(v)
            limpar('confirmar')
          }}
          error={erros.confirmar}
          autoComplete="new-password"
        />

        {erroGeral && <AuthFeedback tipo="erro" texto={erroGeral} />}
        {sucesso && <AuthFeedback tipo="sucesso" texto={sucesso} />}

        <Button
          type="submit"
          disabled={enviando}
          className="w-full bg-[#8BC34A] hover:bg-[#7CB342] text-[#1F2A16] font-bold h-11 rounded-xl shadow-md shadow-[#8BC34A]/20 text-sm disabled:opacity-50"
        >
          {enviando && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          salvar nova senha
        </Button>
      </form>

      <p className="mt-5 text-center text-xs">
        <button
          type="button"
          onClick={onVoltarAoLogin}
          className="font-semibold text-[#689F38] hover:underline"
        >
          Voltar ao login
        </button>
      </p>
    </>
  )
}
