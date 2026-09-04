import { useState } from 'react'
import { Link } from 'react-router-dom'
import logoImg from '@/assets/logo-removebg-previewedited-24401.jpg'
import { Lock, KeyRound, AlertCircle, Eye, EyeOff, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

export const CONDUTIVA_SESSION_AUTH_KEY = 'condutiva_leads_authenticated'
export const CONDUTIVA_EXPECTED_PASSWORD =
  (import.meta.env.VITE_LEADS_PASSWORD as string | undefined) || 'condutiva01'

interface PasswordGateProps {
  title?: string
  subtitle?: string
  areaLabel?: string
  onAuthenticated: () => void
}

export function PasswordGate({
  title = 'Acesso Restrito',
  subtitle = 'Painel de Gestão da Condutiva Tecnologia. Digite a senha para continuar.',
  areaLabel = 'Área Restrita',
  onAuthenticated,
}: PasswordGateProps) {
  const [inputPassword, setInputPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (inputPassword === CONDUTIVA_EXPECTED_PASSWORD) {
      sessionStorage.setItem(CONDUTIVA_SESSION_AUTH_KEY, 'true')
      setPasswordError('')
      onAuthenticated()
      toast({
        title: 'Acesso liberado',
        description: 'Bem-vindo ao ambiente interno da Condutiva.',
      })
    } else {
      setPasswordError('Senha incorreta. Verifique os caracteres e tente novamente.')
    }
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

      {/* Center Lock Box */}
      <main className="container mx-auto px-4 py-12 flex items-center justify-center relative z-10">
        <div className="w-full max-w-md">
          <Card className="bg-slate-900/90 border-slate-800 shadow-2xl backdrop-blur-xl">
            <CardHeader className="text-center pb-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#8CC63F]/20 to-[#8CC63F]/5 border border-[#8CC63F]/30 mx-auto flex items-center justify-center text-[#8CC63F] shadow-lg mb-3">
                <Lock className="w-7 h-7" />
              </div>
              <CardTitle className="text-xl font-bold text-white tracking-tight">{title}</CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-1 leading-relaxed">
                {subtitle}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="gate-password-input"
                    className="text-xs font-medium text-slate-300 flex items-center justify-between"
                  >
                    <span>Senha de Acesso</span>
                    <span className="text-[10px] text-slate-500 font-mono">{areaLabel}</span>
                  </label>

                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="gate-password-input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Digite a senha..."
                      value={inputPassword}
                      onChange={(e) => {
                        setInputPassword(e.target.value)
                        if (passwordError) setPasswordError('')
                      }}
                      autoFocus
                      className={`pl-9 pr-10 bg-slate-950 border ${
                        passwordError
                          ? 'border-red-500 focus-visible:ring-red-500'
                          : 'border-slate-800 focus-visible:ring-[#8CC63F]'
                      } text-white placeholder:text-slate-600 text-sm h-11 rounded-xl`}
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

                  {passwordError && (
                    <div className="flex items-center gap-1.5 text-xs text-red-400 pt-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{passwordError}</span>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#8CC63F] hover:bg-[#7ab334] text-slate-950 font-bold h-11 rounded-xl shadow-lg shadow-[#8CC63F]/10 transition-all text-sm cursor-pointer"
                >
                  Acessar Painel
                </Button>
              </form>

              <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
                <p className="text-[11px] text-slate-500">
                  Acesso restrito a colaboradores e equipe técnica autorizada da Condutiva.
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
