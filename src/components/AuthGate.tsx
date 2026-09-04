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
      onAuthenticated?.()
    } catch (err: unknown) {
      console.error('Falha na autenticação:', err)
      setErrorMsg('E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const fillQuickTest = (testEmail: string) => {
    setEmail(testEmail)
    setPassword('Skip@Pass')
    setErrorMsg('')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-[#8CC63F] selection:text-slate-950 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#8CC63F]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Minimal header */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 group transition-opacity hover:opacity-90"
          title="Voltar à página inicial"
        >
          <div className="bg-white/95 rounded-lg p-1.5 shadow-md flex items-center justify-center border border-slate-700/50 group-hover:border-[#8CC63F]/50 transition-colors">
            <img
              src={logoImg}
              alt="Condutiva Tecnologia"
              className="h-8 md:h-9 w-auto object-contain"
            />
          </div>
          <span className="font-bold tracking-wider text-sm text-white hidden sm:inline-block">
            CONDUTIVA
          </span>
        </Link>
        <Link to="/">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white hover:bg-slate-900 text-xs gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            Voltar ao Site
          </Button>
        </Link>
      </header>

      {/* Center Login Box */}
      <main className="container mx-auto px-4 py-12 flex items-center justify-center relative z-10">
        <div className="w-full max-w-md">
          <Card className="bg-slate-900/90 border-slate-800 shadow-2xl backdrop-blur-xl">
            <CardHeader className="text-center pb-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#8CC63F]/20 to-[#8CC63F]/5 border border-[#8CC63F]/30 mx-auto flex items-center justify-center text-[#8CC63F] shadow-lg mb-3">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <CardTitle className="text-xl font-bold text-white tracking-tight">{title}</CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-1 leading-relaxed">
                {subtitle}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="auth-email-input"
                    className="text-xs font-medium text-slate-300 flex items-center justify-between"
                  >
                    <span>E-mail Corporativo</span>
                    <span className="text-[10px] text-slate-500 font-mono">{areaLabel}</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="auth-email-input"
                      type="email"
                      placeholder="usuario@condutiva.com.br"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (errorMsg) setErrorMsg('')
                      }}
                      autoFocus
                      className="pl-9 pr-3 bg-slate-950 border border-slate-800 focus-visible:ring-[#8CC63F] text-white placeholder:text-slate-600 text-sm h-11 rounded-xl"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="auth-password-input"
                    className="text-xs font-medium text-slate-300 flex items-center justify-between"
                  >
                    <span>Senha de Acesso</span>
                  </label>

                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="auth-password-input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Digite sua senha..."
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (errorMsg) setErrorMsg('')
                      }}
                      className="pl-9 pr-10 bg-slate-950 border border-slate-800 focus-visible:ring-[#8CC63F] text-white placeholder:text-slate-600 text-sm h-11 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                      title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {errorMsg && (
                    <div className="flex items-center gap-1.5 text-xs text-red-400 pt-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#8CC63F] hover:bg-[#7ab334] text-slate-950 font-bold h-11 rounded-xl shadow-lg shadow-[#8CC63F]/10 transition-all text-sm cursor-pointer"
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

              {/* Quick test credentials helpers for convenience */}
              <div className="mt-5 pt-4 border-t border-slate-800 text-left">
                <p className="text-[11px] text-slate-400 font-medium mb-1.5 flex items-center justify-between">
                  <span>Usuários cadastrados no sistema:</span>
                  <span className="text-[10px] text-[#8CC63F] font-mono">
                    Senha padrão: Skip@Pass
                  </span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => fillQuickTest('equipe@condutiva.com.br')}
                    className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition"
                    title="Preencher equipe@condutiva.com.br"
                  >
                    equipe@condutiva.com.br
                  </button>
                  <button
                    type="button"
                    onClick={() => fillQuickTest('liandra@condutiva.com.br')}
                    className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition"
                    title="Preencher liandra@condutiva.com.br"
                  >
                    liandra@condutiva.com.br
                  </button>
                  <button
                    type="button"
                    onClick={() => fillQuickTest('pauloac1000@gmail.com')}
                    className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition"
                    title="Preencher pauloac1000@gmail.com"
                  >
                    pauloac1000@gmail.com
                  </button>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-[11px] text-slate-500">
                  Acesso restrito exclusivamente a colaboradores autorizados da Condutiva
                  Tecnologia.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Condutiva Tecnologia — Todos os direitos reservados.
      </footer>
    </div>
  )
}
