import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Lock,
  FileText,
  UserCheck,
  KeyRound,
  ShieldAlert,
} from 'lucide-react'
import { useClienteAuth } from '@/contexts/ClienteAuthContext'
import {
  autenticarClienteComDetalhe,
  buscarClientePorContrato,
  atualizarSenhaCliente,
  recuperarSenhaCliente,
  redefinirSenhaClienteComValidacao,
} from '@/services/clienteArea'

export function ClienteLoginModal() {
  const { isModalOpen, closeModal, setSession, activeModalTab, setActiveModalTab } =
    useClienteAuth()

  // Tab 1: Login
  const [loginContrato, setLoginContrato] = useState('')
  const [loginSenha, setLoginSenha] = useState('')
  const [showLoginSenha, setShowLoginSenha] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Tab 2: Primeiro Acesso
  const [cadastroContrato, setCadastroContrato] = useState('')
  const [cadastroSenha, setCadastroSenha] = useState('')
  const [cadastroConfirmSenha, setCadastroConfirmSenha] = useState('')
  const [showCadastroSenha, setShowCadastroSenha] = useState(false)
  const [cadastroError, setCadastroError] = useState<string | null>(null)
  const [cadastroSuccess, setCadastroSuccess] = useState<string | null>(null)
  const [isCadastrando, setIsCadastrando] = useState(false)

  // Tab 3: Redefinir / Esqueci minha senha
  const [esqueciContrato, setEsqueciContrato] = useState('')
  const [redefinirSenhaAtual, setRedefinirSenhaAtual] = useState('')
  const [redefinirNovaSenha, setRedefinirNovaSenha] = useState('')
  const [redefinirConfirmSenha, setRedefinirConfirmSenha] = useState('')
  const [showRedefinirSenhaAtual, setShowRedefinirSenhaAtual] = useState(false)
  const [showRedefinirNovaSenha, setShowRedefinirNovaSenha] = useState(false)
  const [esqueciError, setEsqueciError] = useState<string | null>(null)
  const [esqueciSuccess, setEsqueciSuccess] = useState<string | null>(null)
  const [provisoriaFeedback, setProvisoriaFeedback] = useState<{
    tipo: 'success' | 'error'
    mensagem: string
  } | null>(null)
  const [isEnviandoProvisoria, setIsEnviandoProvisoria] = useState(false)
  const [isRedefinindo, setIsRedefinindo] = useState(false)

  // Clear fields / errors when modal opens or closes
  useEffect(() => {
    if (isModalOpen) {
      setLoginError(null)
      setCadastroError(null)
      setCadastroSuccess(null)
      setEsqueciError(null)
      setEsqueciSuccess(null)
      setProvisoriaFeedback(null)
    }
  }, [isModalOpen])

  // Login handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)

    const contrato = loginContrato.trim()
    if (!contrato || !loginSenha) {
      setLoginError('Informe o número do contrato e sua senha.')
      return
    }

    setIsLoggingIn(true)
    try {
      const result = await autenticarClienteComDetalhe(contrato, loginSenha)

      if (result.success === true) {
        setSession(result.cliente)
        closeModal()
        // Limpar campos
        setLoginContrato('')
        setLoginSenha('')
      } else {
        if (result.reason === 'not_found' || result.reason === 'corrupted') {
          // Mensagem exata solicitada pelo usuário
          setLoginError(
            'Não encontramos este contrato. Entre em contato com a assistência técnica ou com o time comercial da Condutiva para regularizar.',
          )
        } else {
          // Mensagem exata solicitada pelo usuário para invalid_password
          setLoginError(
            "Senha incorreta. Verifique e tente novamente ou use 'Esqueci minha senha'.",
          )
        }
      }
    } catch (err) {
      console.error('Erro no login:', err)
      setLoginError(
        'Não encontramos este contrato. Entre em contato com a assistência técnica ou com o time comercial da Condutiva para regularizar.',
      )
    } finally {
      setIsLoggingIn(false)
    }
  }

  // Primeiro Acesso handler
  const handleCadastroSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCadastroError(null)
    setCadastroSuccess(null)

    const contrato = cadastroContrato.trim()
    if (!contrato) {
      setCadastroError('Informe o número do contrato.')
      return
    }

    if (cadastroSenha.length < 8) {
      setCadastroError('A senha deve ter no mínimo 8 caracteres.')
      return
    }

    if (cadastroSenha !== cadastroConfirmSenha) {
      setCadastroError('A confirmação da senha não confere com a senha digitada.')
      return
    }

    setIsCadastrando(true)
    try {
      const clienteExistente = await buscarClientePorContrato(contrato)

      if (!clienteExistente) {
        // Mensagem exata solicitada pelo usuário
        setCadastroError(
          'Contrato não encontrado ou com inconsistência. Procure a assistência técnica ou o time comercial da Condutiva para sanar a situação.',
        )
        return
      }

      // Atualiza senha e define primeiro_acesso_em
      const atualizado = await atualizarSenhaCliente(clienteExistente.id, cadastroSenha, true)

      setCadastroSuccess('Acesso cadastrado com sucesso! Entrando na Área do Cliente...')

      // Login automático
      setTimeout(() => {
        setSession(atualizado)
        closeModal()
        setCadastroContrato('')
        setCadastroSenha('')
        setCadastroConfirmSenha('')
        setCadastroSuccess(null)
      }, 900)
    } catch (err) {
      console.error('Erro no primeiro acesso:', err)
      setCadastroError(
        'Contrato não encontrado ou com inconsistência. Procure a assistência técnica ou o time comercial da Condutiva para sanar a situação.',
      )
    } finally {
      setIsCadastrando(false)
    }
  }

  // Solicitar envio de senha provisória por e-mail (fluxo existente preservado)
  const handleSolicitarSenhaProvisoria = async () => {
    setProvisoriaFeedback(null)
    setEsqueciError(null)

    const contrato = esqueciContrato.trim()
    if (!contrato) {
      setProvisoriaFeedback({
        tipo: 'error',
        mensagem: 'Informe o número do contrato para receber a senha provisória.',
      })
      return
    }

    setIsEnviandoProvisoria(true)
    try {
      const res = await recuperarSenhaCliente(contrato)
      if (res && res.ok === true) {
        setProvisoriaFeedback({
          tipo: 'success',
          mensagem:
            'Senha provisória enviada para o e-mail cadastrado no contrato. Digite-a no campo "Senha atual" abaixo.',
        })
      } else {
        setProvisoriaFeedback({
          tipo: 'error',
          mensagem:
            'Não foi possível concluir a recuperação. Verifique o número do contrato ou entre em contato com o suporte técnico.',
        })
      }
    } catch (err) {
      console.error('Erro ao recuperar senha:', err)
      setProvisoriaFeedback({
        tipo: 'error',
        mensagem:
          'Não foi possível concluir a recuperação. Entre em contato com o suporte técnico.',
      })
    } finally {
      setIsEnviandoProvisoria(false)
    }
  }

  // Redefinir senha com validação da Senha Atual / Provisória
  const handleRedefinirSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEsqueciError(null)
    setEsqueciSuccess(null)

    const contrato = esqueciContrato.trim()
    if (!contrato) {
      setEsqueciError('Informe o número do contrato.')
      return
    }

    if (!redefinirSenhaAtual) {
      setEsqueciError('Informe a senha atual ou provisória recebida por e-mail.')
      return
    }

    if (redefinirNovaSenha.length < 8) {
      setEsqueciError('A nova senha deve ter no mínimo 8 caracteres.')
      return
    }

    if (redefinirNovaSenha !== redefinirConfirmSenha) {
      setEsqueciError('A confirmação da nova senha não confere.')
      return
    }

    setIsRedefinindo(true)
    try {
      const result = await redefinirSenhaClienteComValidacao(
        contrato,
        redefinirSenhaAtual,
        redefinirNovaSenha,
      )

      if (result.success === true) {
        setEsqueciSuccess('Senha redefinida com sucesso! Você já pode entrar com a nova senha.')
        setLoginContrato(contrato)
        setLoginSenha('')
        setRedefinirSenhaAtual('')
        setRedefinirNovaSenha('')
        setRedefinirConfirmSenha('')
        setProvisoriaFeedback(null)
      } else {
        if (result.reason === 'senha_atual_invalida') {
          setEsqueciError(
            'Senha atual ou provisória incorreta. Verifique o valor digitado ou solicite uma nova senha provisória.',
          )
        } else if (result.reason === 'contrato_nao_encontrado') {
          setEsqueciError(
            'Contrato não encontrado. Verifique o número informado ou contate a assistência técnica.',
          )
        } else {
          setEsqueciError('Ocorreu um erro ao redefinir a senha. Tente novamente mais tarde.')
        }
      }
    } catch (err) {
      console.error('Erro ao redefinir senha:', err)
      setEsqueciError('Ocorreu um erro ao redefinir a senha. Tente novamente mais tarde.')
    } finally {
      setIsRedefinindo(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => (!open ? closeModal() : null)}>
      <DialogContent className="bg-[#0b132b] border border-slate-800 text-white max-w-lg max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl">
        <DialogHeader className="text-left mb-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8CC63F] shadow-[0_0_8px_#8CC63F]"></span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#8CC63F] font-bold">
              Base Instalada Condutiva
            </span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-black text-white font-display tracking-tight flex items-center justify-between">
            <span>Área do Cliente</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Acesso exclusivo para clientes com contrato ativo de manutenção, automação e calibração.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeModalTab}
          onValueChange={(val) => {
            setActiveModalTab(val as 'login' | 'primeiro_acesso' | 'esqueci_senha')
            setLoginError(null)
            setCadastroError(null)
            setCadastroSuccess(null)
            setEsqueciError(null)
            setEsqueciSuccess(null)
          }}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 bg-slate-900/90 border border-slate-800 p-1 mb-5 rounded-xl">
            <TabsTrigger
              value="login"
              className="text-xs font-semibold data-[state=active]:bg-[#8CC63F] data-[state=active]:text-slate-950 transition-all rounded-lg"
            >
              Entrar
            </TabsTrigger>
            <TabsTrigger
              value="primeiro_acesso"
              className="text-xs font-semibold data-[state=active]:bg-[#8CC63F] data-[state=active]:text-slate-950 transition-all rounded-lg"
            >
              Primeiro Acesso
            </TabsTrigger>
            <TabsTrigger
              value="esqueci_senha"
              className="text-xs font-semibold data-[state=active]:bg-[#8CC63F] data-[state=active]:text-slate-950 transition-all rounded-lg"
            >
              Redefinir
            </TabsTrigger>
          </TabsList>

          {/* ================= ABA 1: LOGIN ================= */}
          <TabsContent value="login" className="space-y-4 focus-visible:outline-none">
            {loginError && (
              <Alert
                variant="destructive"
                className="border-red-500/40 bg-red-950/40 text-red-200 animate-in fade-in"
              >
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                <div className="ml-2">
                  <AlertTitle className="text-xs font-bold uppercase tracking-wider text-red-300">
                    Acesso não autorizado
                  </AlertTitle>
                  <AlertDescription className="text-xs leading-relaxed text-red-200 mt-0.5">
                    {loginError}
                  </AlertDescription>
                </div>
              </Alert>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="login-contrato"
                  className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5"
                >
                  Número do Contrato <span className="text-[#8CC63F]">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="login-contrato"
                    type="text"
                    required
                    value={loginContrato}
                    onChange={(e) => {
                      setLoginContrato(e.target.value)
                      if (loginError) setLoginError(null)
                    }}
                    placeholder="Ex.: CTR-2025-0142"
                    className="bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-[#8CC63F] focus:ring-1 focus:ring-[#8CC63F] font-mono text-sm py-5 pr-10"
                  />
                  <FileText className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Identificador alfanumérico do seu contrato de serviços Condutiva.
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="login-senha"
                    className="text-xs font-bold uppercase tracking-wider text-slate-300 block"
                  >
                    Senha <span className="text-[#8CC63F]">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveModalTab('esqueci_senha')}
                    className="text-xs text-[#8CC63F] hover:underline font-medium"
                  >
                    Esqueci minha senha
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="login-senha"
                    type={showLoginSenha ? 'text' : 'password'}
                    required
                    value={loginSenha}
                    onChange={(e) => {
                      setLoginSenha(e.target.value)
                      if (loginError) setLoginError(null)
                    }}
                    placeholder="Sua senha de acesso"
                    className="bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-[#8CC63F] focus:ring-1 focus:ring-[#8CC63F] text-sm py-5 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginSenha(!showLoginSenha)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                    title={showLoginSenha ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showLoginSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-[#8CC63F] hover:bg-[#7cb633] text-slate-950 font-black text-sm uppercase tracking-wide py-6 rounded-xl shadow-lg shadow-[#8CC63F]/20 transition-all disabled:opacity-60 mt-2"
              >
                {isLoggingIn ? 'Autenticando...' : 'Entrar na Área do Cliente'}
              </Button>
            </form>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Primeiro acesso com seu contrato?</span>
              <button
                type="button"
                onClick={() => setActiveModalTab('primeiro_acesso')}
                className="font-bold text-[#8CC63F] hover:underline flex items-center gap-1"
              >
                <KeyRound className="w-3.5 h-3.5" />
                Cadastrar acesso
              </button>
            </div>
          </TabsContent>

          {/* ================= ABA 2: PRIMEIRO ACESSO ================= */}
          <TabsContent value="primeiro_acesso" className="space-y-4 focus-visible:outline-none">
            {cadastroError && (
              <Alert
                variant="destructive"
                className="border-red-500/40 bg-red-950/40 text-red-200 animate-in fade-in"
              >
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                <div className="ml-2">
                  <AlertTitle className="text-xs font-bold uppercase tracking-wider text-red-300">
                    Atenção
                  </AlertTitle>
                  <AlertDescription className="text-xs leading-relaxed text-red-200 mt-0.5">
                    {cadastroError}
                  </AlertDescription>
                </div>
              </Alert>
            )}

            {cadastroSuccess && (
              <Alert className="border-[#8CC63F]/50 bg-emerald-950/40 text-emerald-200 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 text-[#8CC63F] shrink-0" />
                <div className="ml-2">
                  <AlertTitle className="text-xs font-bold uppercase tracking-wider text-[#8CC63F]">
                    Sucesso
                  </AlertTitle>
                  <AlertDescription className="text-xs leading-relaxed text-emerald-100 mt-0.5">
                    {cadastroSuccess}
                  </AlertDescription>
                </div>
              </Alert>
            )}

            <form onSubmit={handleCadastroSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="cadastro-contrato"
                  className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5"
                >
                  Número do Contrato <span className="text-[#8CC63F]">*</span>
                </label>
                <Input
                  id="cadastro-contrato"
                  type="text"
                  required
                  value={cadastroContrato}
                  onChange={(e) => {
                    setCadastroContrato(e.target.value)
                    if (cadastroError) setCadastroError(null)
                  }}
                  placeholder="Ex.: CTR-2025-0142"
                  className="bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-[#8CC63F] focus:ring-1 focus:ring-[#8CC63F] font-mono text-sm py-5"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Informe o número do contrato ativo constante em sua proposta ou termo de adesão.
                </span>
              </div>

              <div>
                <label
                  htmlFor="cadastro-senha"
                  className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5"
                >
                  Definir Senha <span className="text-[#8CC63F]">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="cadastro-senha"
                    type={showCadastroSenha ? 'text' : 'password'}
                    required
                    value={cadastroSenha}
                    onChange={(e) => {
                      setCadastroSenha(e.target.value)
                      if (cadastroError) setCadastroError(null)
                    }}
                    placeholder="Mínimo 8 caracteres"
                    className="bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-[#8CC63F] focus:ring-1 focus:ring-[#8CC63F] text-sm py-5 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCadastroSenha(!showCadastroSenha)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showCadastroSenha ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="cadastro-confirm-senha"
                  className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5"
                >
                  Confirmar Senha <span className="text-[#8CC63F]">*</span>
                </label>
                <Input
                  id="cadastro-confirm-senha"
                  type={showCadastroSenha ? 'text' : 'password'}
                  required
                  value={cadastroConfirmSenha}
                  onChange={(e) => {
                    setCadastroConfirmSenha(e.target.value)
                    if (cadastroError) setCadastroError(null)
                  }}
                  placeholder="Repita a senha definida"
                  className="bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-[#8CC63F] focus:ring-1 focus:ring-[#8CC63F] text-sm py-5"
                />
              </div>

              <Button
                type="submit"
                disabled={isCadastrando}
                className="w-full bg-[#8CC63F] hover:bg-[#7cb633] text-slate-950 font-black text-sm uppercase tracking-wide py-6 rounded-xl shadow-lg shadow-[#8CC63F]/20 transition-all disabled:opacity-60"
              >
                {isCadastrando ? 'Cadastrando...' : 'Cadastrar Acesso e Entrar'}
              </Button>
            </form>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Já possui senha cadastrada?</span>
              <button
                type="button"
                onClick={() => setActiveModalTab('login')}
                className="font-bold text-[#8CC63F] hover:underline"
              >
                Fazer login
              </button>
            </div>
          </TabsContent>

          {/* ================= ABA 3: REDEFINIR SENHA ================= */}
          <TabsContent value="esqueci_senha" className="space-y-4 focus-visible:outline-none">
            {esqueciError && (
              <Alert
                variant="destructive"
                className="border-red-500/40 bg-red-950/40 text-red-200 animate-in fade-in"
              >
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                <div className="ml-2">
                  <AlertTitle className="text-xs font-bold uppercase tracking-wider text-red-300">
                    Atenção
                  </AlertTitle>
                  <AlertDescription className="text-xs leading-relaxed text-red-200 mt-0.5">
                    {esqueciError}
                  </AlertDescription>
                </div>
              </Alert>
            )}

            {provisoriaFeedback && (
              <Alert
                className={`animate-in fade-in ${
                  provisoriaFeedback.tipo === 'success'
                    ? 'border-[#8CC63F]/50 bg-emerald-950/40 text-emerald-200'
                    : 'border-red-500/40 bg-red-950/40 text-red-200'
                }`}
              >
                {provisoriaFeedback.tipo === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 text-[#8CC63F] shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                )}
                <div className="ml-2">
                  <AlertTitle
                    className={`text-xs font-bold uppercase tracking-wider ${
                      provisoriaFeedback.tipo === 'success' ? 'text-[#8CC63F]' : 'text-red-300'
                    }`}
                  >
                    {provisoriaFeedback.tipo === 'success' ? 'Senha Provisória' : 'Atenção'}
                  </AlertTitle>
                  <AlertDescription
                    className={`text-xs leading-relaxed mt-0.5 ${
                      provisoriaFeedback.tipo === 'success' ? 'text-emerald-100' : 'text-red-200'
                    }`}
                  >
                    {provisoriaFeedback.mensagem}
                  </AlertDescription>
                </div>
              </Alert>
            )}

            {esqueciSuccess ? (
              <div className="space-y-4 animate-in fade-in">
                <Alert className="border-[#8CC63F]/50 bg-emerald-950/40 text-emerald-200">
                  <CheckCircle2 className="h-4 w-4 text-[#8CC63F] shrink-0" />
                  <div className="ml-2">
                    <AlertTitle className="text-xs font-bold uppercase tracking-wider text-[#8CC63F]">
                      Sucesso
                    </AlertTitle>
                    <AlertDescription className="text-xs leading-relaxed text-emerald-100 mt-0.5">
                      {esqueciSuccess}
                    </AlertDescription>
                  </div>
                </Alert>

                <Button
                  type="button"
                  onClick={() => {
                    setActiveModalTab('login')
                    setEsqueciSuccess(null)
                  }}
                  className="w-full bg-[#8CC63F] hover:bg-[#7cb633] text-slate-950 font-black text-sm uppercase tracking-wide py-6 rounded-xl shadow-lg shadow-[#8CC63F]/20 transition-all"
                >
                  Ir para o Login com a Nova Senha
                </Button>
              </div>
            ) : (
              <form onSubmit={handleRedefinirSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="esqueci-contrato"
                      className="text-xs font-bold uppercase tracking-wider text-slate-300 block"
                    >
                      Número do Contrato <span className="text-[#8CC63F]">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleSolicitarSenhaProvisoria}
                      disabled={isEnviandoProvisoria || !esqueciContrato.trim()}
                      className="text-xs text-[#8CC63F] hover:underline font-medium disabled:opacity-50 disabled:no-underline"
                    >
                      {isEnviandoProvisoria ? 'Enviando...' : 'Enviar senha provisória por e-mail'}
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="esqueci-contrato"
                      type="text"
                      required
                      value={esqueciContrato}
                      onChange={(e) => {
                        setEsqueciContrato(e.target.value)
                        if (esqueciError) setEsqueciError(null)
                      }}
                      placeholder="Ex.: CTR-2025-0142"
                      className="bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-[#8CC63F] focus:ring-1 focus:ring-[#8CC63F] font-mono text-sm py-5 pr-10"
                    />
                    <FileText className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Não lembra sua senha atual? Clique acima para receber uma senha provisória por
                    e-mail.
                  </span>
                </div>

                <div>
                  <label
                    htmlFor="redefinir-senha-atual"
                    className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5"
                  >
                    Senha atual <span className="text-[#8CC63F]">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="redefinir-senha-atual"
                      type={showRedefinirSenhaAtual ? 'text' : 'password'}
                      required
                      value={redefinirSenhaAtual}
                      onChange={(e) => {
                        setRedefinirSenhaAtual(e.target.value)
                        if (esqueciError) setEsqueciError(null)
                      }}
                      placeholder="Senha atual ou senha provisória recebida por e-mail"
                      className="bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-[#8CC63F] focus:ring-1 focus:ring-[#8CC63F] text-sm py-5 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRedefinirSenhaAtual(!showRedefinirSenhaAtual)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                      title={showRedefinirSenhaAtual ? 'Ocultar senha' : 'Exibir senha'}
                    >
                      {showRedefinirSenhaAtual ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Aceita a sua senha atual ou a senha provisória enviada para seu e-mail.
                  </span>
                </div>

                <div>
                  <label
                    htmlFor="redefinir-nova-senha"
                    className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5"
                  >
                    Nova senha <span className="text-[#8CC63F]">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="redefinir-nova-senha"
                      type={showRedefinirNovaSenha ? 'text' : 'password'}
                      required
                      value={redefinirNovaSenha}
                      onChange={(e) => {
                        setRedefinirNovaSenha(e.target.value)
                        if (esqueciError) setEsqueciError(null)
                      }}
                      placeholder="Mínimo 8 caracteres"
                      className="bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-[#8CC63F] focus:ring-1 focus:ring-[#8CC63F] text-sm py-5 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRedefinirNovaSenha(!showRedefinirNovaSenha)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                      title={showRedefinirNovaSenha ? 'Ocultar senha' : 'Exibir senha'}
                    >
                      {showRedefinirNovaSenha ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="redefinir-confirm-senha"
                    className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5"
                  >
                    Confirmar nova senha <span className="text-[#8CC63F]">*</span>
                  </label>
                  <Input
                    id="redefinir-confirm-senha"
                    type={showRedefinirNovaSenha ? 'text' : 'password'}
                    required
                    value={redefinirConfirmSenha}
                    onChange={(e) => {
                      setRedefinirConfirmSenha(e.target.value)
                      if (esqueciError) setEsqueciError(null)
                    }}
                    placeholder="Repita a nova senha definida"
                    className="bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-[#8CC63F] focus:ring-1 focus:ring-[#8CC63F] text-sm py-5"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isRedefinindo}
                  className="w-full bg-[#8CC63F] hover:bg-[#7cb633] text-slate-950 font-black text-sm uppercase tracking-wide py-6 rounded-xl shadow-lg shadow-[#8CC63F]/20 transition-all disabled:opacity-60"
                >
                  {isRedefinindo ? 'Salvando...' : 'Salvar nova senha'}
                </Button>
              </form>
            )}

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Lembrou sua senha?</span>
              <button
                type="button"
                onClick={() => setActiveModalTab('login')}
                className="font-bold text-[#8CC63F] hover:underline"
              >
                Voltar ao login
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
