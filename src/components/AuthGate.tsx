import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { lerSinalSessaoEncerrada, limparSinalSessaoEncerrada } from '@/services/auth'
import logoImg from '@/assets/logo-condutiva-servicos-389e5.png'
import { Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { EntrarForm } from '@/components/auth/EntrarForm'
import { PrimeiroAcessoForm } from '@/components/auth/PrimeiroAcessoForm'
import { RedefinirForm } from '@/components/auth/RedefinirForm'
import { SolicitarAcessoForm } from '@/components/auth/SolicitarAcessoForm'

type AbaAcesso = 'entrar' | 'primeiro' | 'redefinir'
type Tela = AbaAcesso | 'solicitar'

const ABAS: { id: AbaAcesso; label: string }[] = [
  { id: 'entrar', label: 'Entrar' },
  { id: 'primeiro', label: 'Primeiro Acesso' },
  { id: 'redefinir', label: 'Redefinir' },
]

interface AuthGateProps {
  title?: string
}

/**
 * Login da Área de equipe (Painel de Vendas e Painel de Contratos), no mesmo padrão do CRM:
 * abas Entrar / Primeiro Acesso / Redefinir, solicitação de acesso e recuperação de senha.
 */
export function AuthGate({ title = 'Acesso Restrito à Equipe Condutiva' }: AuthGateProps) {
  const [tela, setTela] = useState<Tela>('entrar')
  const [ajudaAberta, setAjudaAberta] = useState(false)
  const [sessaoEncerrada, setSessaoEncerrada] = useState(false)

  // Sinal efêmero gravado no logout automático (saída da área restrita, fechamento
  // de aba/navegador, restauração de cache do navegador): exibe o aviso de sessão
  // encerrada por segurança e é limpo em seguida, para não reaparecer sem nova saída.
  useEffect(() => {
    if (lerSinalSessaoEncerrada()) {
      setSessaoEncerrada(true)
      limparSinalSessaoEncerrada()
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#212529] flex flex-col justify-between selection:bg-[#8BC34A] selection:text-[#1F2A16] relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#8BC34A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Cabeçalho: links do topo */}
      <header className="border-b border-[#E5E7EB] bg-white/80 backdrop-blur px-4 md:px-6 py-3 flex flex-wrap items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-3 group transition-opacity hover:opacity-90">
          <img src={logoImg} alt="Condutiva Tecnologia" className="h-8 w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTela('solicitar')}
            className="text-[#6C757D] hover:text-[#212529] hover:bg-[#F1F8E9] text-xs"
          >
            Solicitar acesso
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAjudaAberta(true)}
            className="text-[#6C757D] hover:text-[#212529] hover:bg-[#F1F8E9] text-xs"
          >
            Ajuda
          </Button>
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
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 flex items-center justify-center relative z-10">
        <div className="w-full max-w-md">
          <Card className="bg-white border-[#E5E7EB] shadow-md">
            <CardHeader className="text-center pb-2">
              <div className="bg-white rounded-xl p-2 mx-auto mb-3 border border-[#E5E7EB] w-fit">
                <img src={logoImg} alt="Condutiva" className="h-10 w-auto object-contain" />
              </div>
              <h1 className="text-xl font-bold text-[#212529] tracking-tight">
                {title === 'Gestão de Leads & Diagnósticos Técnicos'
                  ? 'Painel Comercial Serviços'
                  : title}
              </h1>
              <p className="text-[11px] font-semibold tracking-widest text-[#689F38] mt-1">
                ACESSE SUA CONTA PARA CONTINUAR
              </p>
            </CardHeader>

            <CardContent className="pt-4">
              {sessaoEncerrada && (
                <div
                  role="alert"
                  className="mb-4 flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-3 text-left"
                >
                  <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
                  <div>
                    <p className="text-xs font-semibold text-amber-800">
                      Sessão encerrada por segurança
                    </p>
                    <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                      Você saiu da área restrita e sua sessão foi encerrada automaticamente. Informe
                      usuário e senha novamente para continuar.
                    </p>
                  </div>
                </div>
              )}
              {tela === 'solicitar' ? (
                <SolicitarAcessoForm onVoltar={() => setTela('entrar')} />
              ) : (
                <>
                  <div
                    role="tablist"
                    className="grid grid-cols-3 gap-1 bg-[#F1F3F5] p-1 rounded-xl mb-5"
                  >
                    {ABAS.map((aba) => (
                      <button
                        key={aba.id}
                        type="button"
                        role="tab"
                        aria-selected={tela === aba.id}
                        onClick={() => setTela(aba.id)}
                        className={cn(
                          'h-9 rounded-lg text-xs font-semibold transition-colors',
                          tela === aba.id
                            ? 'bg-[#8BC34A] text-[#1F2A16] shadow-sm'
                            : 'text-[#6C757D] hover:text-[#212529]',
                        )}
                      >
                        {aba.label}
                      </button>
                    ))}
                  </div>

                  {tela === 'entrar' && <EntrarForm onCriarConta={() => setTela('primeiro')} />}
                  {tela === 'primeiro' && (
                    <PrimeiroAcessoForm onIrParaLogin={() => setTela('entrar')} />
                  )}
                  {tela === 'redefinir' && (
                    <RedefinirForm onVoltarAoLogin={() => setTela('entrar')} />
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t border-[#E5E7EB] bg-white py-4 px-6 text-center text-xs text-[#6C757D]">
        © {new Date().getFullYear()} Condutiva Tecnologia — Todos os direitos reservados.
      </footer>

      <Dialog open={ajudaAberta} onOpenChange={setAjudaAberta}>
        <DialogContent className="sm:max-w-md bg-white border-[#E5E7EB] text-[#212529]">
          <DialogHeader>
            <DialogTitle>Ajuda</DialogTitle>
            <DialogDescription className="text-xs text-[#6C757D] leading-relaxed">
              Já tem conta? Use a aba Entrar. Ainda não tem acesso? Use Primeiro Acesso ou Solicitar
              acesso: a liberação passa pela avaliação do administrador da Condutiva e ocorre em até
              24 horas. Esqueceu a senha? Use o link "Esqueceu a senha?" ou a aba Redefinir.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
