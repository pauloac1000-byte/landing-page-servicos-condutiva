export const MIN_SENHA = 8

export type Erros = Record<string, string>

export function emailValido(valor: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim())
}

export function validarObrigatorio(valor: string, mensagem: string): string {
  return valor.trim() ? '' : mensagem
}

export function validarEmail(valor: string): string {
  if (!valor.trim()) return 'Informe o e-mail corporativo.'
  return emailValido(valor) ? '' : 'Informe um e-mail válido.'
}

export function validarSenha(valor: string): string {
  if (!valor) return 'Informe a senha.'
  return valor.length >= MIN_SENHA ? '' : `A senha deve ter pelo menos ${MIN_SENHA} caracteres.`
}

export function validarConfirmacao(valor: string, original: string): string {
  if (!valor) return 'Confirme a senha.'
  return valor === original ? '' : 'As senhas não coincidem.'
}

export function temErros(erros: Erros): boolean {
  return Object.values(erros).some(Boolean)
}
