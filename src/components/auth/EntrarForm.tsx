import { useState, type FormEvent } from 'react'
import { Mail, Lock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { loginWithEmail } from '@/services/auth'
import { mensagemDeErro } from '@/services/equipeAcesso'
import { validarEmail, validarObrigatorio, temErros, type Erros } from '@/components/auth/validacao'
import { AuthField } from '@/components/auth/AuthField'
import { AuthFeedback } from '@/components/auth/AuthFeedback'
import { RecuperarSenhaModal } from '@/components/auth/RecuperarSenhaModal'

interface EntrarFormProps {
  onCriarConta: () => void
}

/** Aba Entrar: login de colaborador aprovado. Contas em análise recebem o aviso do backend. */
export function EntrarForm({ onCriarConta }: EntrarFormProps) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [erroGeral, setErroGeral] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [modalAberto, setModalAberto] = useState(false)

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    const novos: Erros = {
      email: validarEmail(email),
      senha: validarObrigatorio(senha, 'Informe a senha.'),
    }
    setErros(novos)
    if (temErros(novos)) return

    setEnviando(true)
    setErroGeral('')
    try {
      // Após o login, o hook useAuth da página detecta a sessão e libera o painel.
      await loginWithEmail(email.trim(), senha)
    } catch (err) {
      const msg = mensagemDeErro(err, '')
      setErroGeral(
        msg.toLowerCase().includes('análise')
          ? msg
          : 'E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.',
      )
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <AuthField
          id="login-email"
          label="E-mail corporativo"
          icon={Mail}
          type="email"
          required
          placeholder="seu.email@condutiva.com.br"
          value={email}
          onChange={(v) => {
            setEmail(v)
            setErros((p) => ({ ...p, email: '' }))
          }}
          error={erros.email}
          autoComplete="username"
          autoFocus
        />

        <AuthField
          id="login-senha"
          label="Senha"
          icon={Lock}
          type="password"
          required
          placeholder="Digite sua senha"
          value={senha}
          onChange={(v) => {
            setSenha(v)
            setErros((p) => ({ ...p, senha: '' }))
          }}
          error={erros.senha}
          autoComplete="current-password"
          labelAction={
            <button
              type="button"
              onClick={() => setModalAberto(true)}
              className="text-xs font-medium text-[#689F38] hover:underline"
            >
              Esqueceu a senha?
            </button>
          }
        />

        {erroGeral && <AuthFeedback tipo="erro" texto={erroGeral} />}

        <Button
          type="submit"
          disabled={enviando}
          className="w-full bg-[#8BC34A] hover:bg-[#7CB342] text-[#1F2A16] font-bold h-11 rounded-xl shadow-md shadow-[#8BC34A]/20 text-sm disabled:opacity-50"
        >
          {enviando && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Entrar no Sistema
        </Button>
      </form>

      <p className="mt-5 text-center text-xs text-[#6C757D]">
        Não possui uma conta?{' '}
        <button
          type="button"
          onClick={onCriarConta}
          className="font-semibold text-[#689F38] hover:underline"
        >
          Criar conta
        </button>
      </p>

      <RecuperarSenhaModal open={modalAberto} onOpenChange={setModalAberto} emailInicial={email} />
    </>
  )
}
