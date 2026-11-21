import { useState, type FormEvent } from 'react'
import { Mail, Lock, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cadastrarAcesso, mensagemDeErro } from '@/services/equipeAcesso'
import {
  validarEmail,
  validarObrigatorio,
  validarSenha,
  validarConfirmacao,
  temErros,
  type Erros,
} from '@/components/auth/validacao'
import { AuthField } from '@/components/auth/AuthField'
import { AuthFeedback, AvisoAprovacao } from '@/components/auth/AuthFeedback'

interface PrimeiroAcessoFormProps {
  onIrParaLogin: () => void
}

/** Aba Primeiro Acesso: cria a conta pendente, que só entra após aprovação do administrador. */
export function PrimeiroAcessoForm({ onIrParaLogin }: PrimeiroAcessoFormProps) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
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
      senha: validarSenha(senha),
      confirmar: validarConfirmacao(confirmar, senha),
    }
    setErros(novos)
    if (temErros(novos)) return

    setEnviando(true)
    setErroGeral('')
    setSucesso('')
    try {
      await cadastrarAcesso({ nome: nome.trim(), email: email.trim(), senha })
      setSucesso(
        'Cadastro realizado com sucesso! Seu acesso está em análise e será liberado em até 24 horas. Você receberá a confirmação no e-mail informado.',
      )
      setNome('')
      setEmail('')
      setSenha('')
      setConfirmar('')
    } catch (err) {
      setErroGeral(mensagemDeErro(err, 'Não foi possível concluir o cadastro. Tente novamente.'))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <AuthField
          id="cadastro-nome"
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
          id="cadastro-email"
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
          autoComplete="email"
        />
        <AuthField
          id="cadastro-senha"
          label="Senha"
          icon={Lock}
          type="password"
          required
          placeholder="Mínimo de 8 caracteres"
          value={senha}
          onChange={(v) => {
            setSenha(v)
            limpar('senha')
          }}
          error={erros.senha}
          autoComplete="new-password"
        />
        <AuthField
          id="cadastro-confirmar"
          label="Confirmar senha"
          icon={Lock}
          type="password"
          required
          placeholder="Repita a senha"
          value={confirmar}
          onChange={(v) => {
            setConfirmar(v)
            limpar('confirmar')
          }}
          error={erros.confirmar}
          autoComplete="new-password"
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
          cadastrar acesso
        </Button>
      </form>

      <p className="mt-5 text-center text-xs text-[#6C757D]">
        Já tem uma conta?{' '}
        <button
          type="button"
          onClick={onIrParaLogin}
          className="font-semibold text-[#689F38] hover:underline"
        >
          Faça Login
        </button>
      </p>
    </>
  )
}
