import { useState } from 'react'
import { Link } from 'react-router-dom'
import logoImg from '@/assets/logo-removebg-previewedited-24401.jpg'
import { Lock, Mail, AlertCircle, Eye, EyeOff, Home, Loader2, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { loginWithEmail } from '@/services/auth'

interface AuthGateProps {
  title?: string
  subtitle?: string
  areaLabel?: string
  onAuthenticated?: () => void
}

export function AuthGate({
  title = 'Acesso Restrito à Equipe Condutiva',
  subtitle = 'Painel Interno de Gestão da Condutiva Tecnologia. Faça login com seu e-mail e senha corporativos.',
  areaLabel = 'Área Restrita',
  onAuthenticated,
}: AuthGateProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const resetFormState = () => {
    setEmail('')
    setPassword('')
    setErrorMsg('')
    setShowPassword(false)
  }

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!email.trim()) {
      setErrorMsg('Informe o e-mail cadastrado.')
      return
    }
    if (!password) {
      setErrorMsg('Informe a senha.')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')

    try {
      const user = await loginWithEmail(email.trim(), password)
      toast({
        title: 'Acesso liberado',
        description: `Bem-vindo(a), ${user.name || user.email}!`,
      })
      resetFormState()
      onAuthenticated?.()
    } catch (err: unknown) {
      console.error('Falha na autenticação:', err)
      setErrorMsg('E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#212529] flex flex-col justify-between selection:bg-[#8BC34A] selection:text-[#1F2A16] relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#8BC34A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Minimal header */}
      <header className="border-b border-[#E5E7EB] bg-white/80 backdrop-blur px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 group transition-opacity hover:opacity-90"
          title="Voltar à página inicial"
        >
          <div className="bg-white rounded-lg p-1.5 shadow-sm flex items-center justify-center border border-[#E5E7EB] group-hover:border-[#8BC34A]/60 transition-colors">
            <img
              src={logoImg}
              alt="Condutiva Tecnologia"
              className="h-8 md:h-9 w-auto object-contain"
            />
          </div>
          <span className="font-bold tracking-wider text-sm text-[#212529] hidden sm:inline-block">
            CONDUTIVA
          </span>
        </Link>
        <Link to="/">
          <Button
            variant="ghost"
            size="sm"
            className="text-[#6C757D] hover:text-[#212529] hover:bg-[#F1F8E9] text-xs gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            Voltar ao Site
          </Button>
        </Link>
      </header>

      {/* Center Login Box */}
      <main className="container mx-auto px-4 py-12 flex items-center justify-center relative z-10">
        <div className="w-full max-w-md">
          <Card className="bg-white border-[#E5E7EB] shadow-md">
            <CardHeader className="text-center pb-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#F1F8E9] to-white border border-[#8BC34A]/40 mx-auto flex items-center justify-center text-[#689F38] shadow-sm mb-3">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <CardTitle className="text-xl font-bold text-[#212529] tracking-tight">
                {title}
              </CardTitle>
              <CardDescription className="text-xs text-[#6C757D] mt-1 leading-relaxed">
                {subtitle}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
              <form onSubmit={handleLogin} autoComplete="off" className="space-y-4">
                {/* Email field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="auth-email-input"
                    className="text-xs font-medium text-[#212529] flex items-center justify-between"
                  >
                    <span>E-mail Corporativo</span>
                    <span className="text-[10px] text-[#6C757D] font-mono">{areaLabel}</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#ADB5BD] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="auth-email-input"
                      type="email"
                      placeholder="usuario@condutiva.com.br"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (errorMsg) setErrorMsg('')
                      }}
                      autoComplete="off"
                      autoFocus
                      className="pl-9 pr-3 bg-white border border-[#E5E7EB] focus-visible:ring-[#8BC34A] text-[#212529] placeholder:text-[#ADB5BD] text-sm h-11 rounded-xl"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="auth-password-input"
                    className="text-xs font-medium text-[#212529] flex items-center justify-between"
                  >
                    <span>Senha de Acesso</span>
                  </label>

                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#ADB5BD] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="auth-password-input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Digite sua senha..."
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (errorMsg) setErrorMsg('')
                      }}
                      autoComplete="new-password"
                      className="pl-9 pr-10 bg-white border border-[#E5E7EB] focus-visible:ring-[#8BC34A] text-[#212529] placeholder:text-[#ADB5BD] text-sm h-11 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6C757D] hover:text-[#212529] p-1"
                      title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {errorMsg && (
                    <div className="flex items-center gap-1.5 text-xs text-red-600 pt-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#8BC34A] hover:bg-[#7CB342] text-[#1F2A16] font-bold h-11 rounded-xl shadow-md shadow-[#8BC34A]/20 transition-all text-sm cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Autenticando...
                    </>
                  ) : (
                    'Entrar no Painel'
                  )}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-[11px] text-[#6C757D]">
                  Acesso restrito exclusivamente a colaboradores autorizados da Condutiva
                  Tecnologia.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="border-t border-[#E5E7EB] bg-white py-4 px-6 text-center text-xs text-[#6C757D]">
        © {new Date().getFullYear()} Condutiva Tecnologia — Todos os direitos reservados.
      </footer>
    </div>
  )
}
