import { AlertCircle, CheckCircle } from 'lucide-react'

interface AuthFeedbackProps {
  tipo: 'erro' | 'sucesso'
  texto: string
}

/** Mensagem de erro ou sucesso exibida dentro dos formulários de acesso. */
export function AuthFeedback({ tipo, texto }: AuthFeedbackProps) {
  const ehErro = tipo === 'erro'
  return (
    <div
      role={ehErro ? 'alert' : 'status'}
      className={
        ehErro
          ? 'flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium'
          : 'flex items-start gap-2 rounded-xl border border-[#8BC34A]/50 bg-[#F1F8E9] p-3 text-xs text-[#33691E] font-medium'
      }
    >
      {ehErro ? (
        <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
      ) : (
        <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
      )}
      <span>{texto}</span>
    </div>
  )
}

/** Caixa amarela com a regra de liberação do acesso pelo administrador. */
export function AvisoAprovacao() {
  return (
    <div className="rounded-xl border border-[#FFE082] bg-[#FFF8E1] p-3 text-xs text-[#5D4037] leading-relaxed">
      A liberação do seu acesso passa pela avaliação do administrador da Condutiva e ocorre em até
      24 horas. Você receberá a confirmação no e-mail informado.
    </div>
  )
}
