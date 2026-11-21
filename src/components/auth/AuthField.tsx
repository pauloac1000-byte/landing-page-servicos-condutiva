import { useState, type ReactNode } from 'react'
import { Eye, EyeOff, type LucideIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface AuthFieldProps {
  id: string
  label: string
  icon: LucideIcon
  value: string
  onChange: (valor: string) => void
  type?: 'text' | 'email' | 'tel' | 'password'
  placeholder?: string
  required?: boolean
  error?: string
  autoComplete?: string
  labelAction?: ReactNode
  autoFocus?: boolean
}

/** Campo do fluxo de acesso da Área de equipe: ícone à esquerda, asterisco de obrigatório e olho nas senhas. */
export function AuthField({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
  error,
  autoComplete,
  labelAction,
  autoFocus,
}: AuthFieldProps) {
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const ehSenha = type === 'password'

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-xs font-medium text-[#212529]">
          {label}
          {required && <span className="text-red-600 ml-0.5">*</span>}
        </label>
        {labelAction}
      </div>
      <div className="relative">
        <Icon className="w-4 h-4 text-[#ADB5BD] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <Input
          id={id}
          type={ehSenha && mostrarSenha ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          aria-invalid={!!error}
          className={cn(
            'pl-9 bg-white border border-[#E5E7EB] focus-visible:ring-[#8BC34A] text-[#212529] placeholder:text-[#ADB5BD] text-sm h-11 rounded-xl',
            ehSenha ? 'pr-10' : 'pr-3',
            error && 'border-red-400',
          )}
        />
        {ehSenha && (
          <button
            type="button"
            onClick={() => setMostrarSenha((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6C757D] hover:text-[#212529] p-1"
            aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
            title={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  )
}
