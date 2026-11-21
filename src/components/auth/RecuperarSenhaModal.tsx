import { useEffect, useState, type FormEvent } from 'react'
import { Lock, Mail, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { solicitarLinkRedefinicao, mensagemDeErro } from '@/services/equipeAcesso'
import { validarEmail } from '@/components/auth/validacao'
import { AuthField } from '@/components/auth/AuthField'
import { AuthFeedback } from '@/components/auth/AuthFeedback'

interface RecuperarSenhaModalProps {
  open: boolean
  onOpenChange: (aberto: boolean) => void
  emailInicial: string
}

/** Modal "Recuperar Senha" aberto pelo link "Esqueceu a senha?" da aba Entrar. */
export function RecuperarSenhaModal({
  open,
  onOpenChange,
  emailInicial,
}: RecuperarSenhaModalProps) {
  const [email, setEmail] = useState('')
  const [erroEmail, setErroEmail] = useState('')
  const [erroGeral, setErroGeral] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (open) {
      setEmail(emailInicial)
      setErroEmail('')
      setErroGeral('')
      setSucesso('')
    }
  }, [open, emailInicial])

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    const erro = validarEmail(email)
    setErroEmail(erro)
    if (erro) return

    setEnviando(true)
    setErroGeral('')
    setSucesso('')
    try {
      await solicitarLinkRedefinicao(email)
      setSucesso(
        'Se houver uma conta associada a este e-mail, você receberá um link para redefinir a senha.',
      )
    } catch (err) {
      setErroGeral(mensagemDeErro(err, 'Não foi possível enviar o link. Tente novamente.'))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border-[#E5E7EB] text-[#212529]">
        <DialogHeader className="items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#F1F8E9] border border-[#8BC34A]/40 flex items-center justify-center text-[#689F38] mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <DialogTitle className="text-lg font-bold text-[#212529]">Recuperar Senha</DialogTitle>
          <DialogDescription className="text-xs text-[#6C757D] leading-relaxed">
            Informe o e-mail corporativo cadastrado. Se houver uma conta associada a ele, enviaremos
            um link para redefinir a senha.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <AuthField
            id="recuperar-email"
            label="E-mail cadastrado"
            icon={Mail}
            type="email"
            required
            placeholder="seu.email@condutiva.com.br"
            value={email}
            onChange={(v) => {
              setEmail(v)
              setErroEmail('')
            }}
            error={erroEmail}
            autoComplete="username"
          />

          {erroGeral && <AuthFeedback tipo="erro" texto={erroGeral} />}
          {sucesso && <AuthFeedback tipo="sucesso" texto={sucesso} />}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-white border-[#E5E7EB] text-[#6C757D] hover:text-[#212529] hover:bg-[#F1F8E9]"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={enviando}
              className="bg-[#8BC34A] hover:bg-[#7CB342] text-[#1F2A16] font-bold rounded-xl disabled:opacity-50"
            >
              {enviando && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Enviar Link de Redefinição
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
