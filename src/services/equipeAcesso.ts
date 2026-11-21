import pb from '@/lib/pocketbase/client'

export interface CadastroAcessoDados {
  nome: string
  email: string
  senha?: string
  telefone?: string
  vinculo?: string
}

/** Cria a conta pendente (Primeiro Acesso ou Solicitar acesso). A conta só entra após aprovação. */
export async function cadastrarAcesso(dados: CadastroAcessoDados): Promise<void> {
  await pb.send('/backend/v1/equipe/cadastrar', { method: 'POST', body: dados })
}

/** Redefine a senha informando e-mail, senha atual e nova senha. */
export async function redefinirSenhaEquipe(
  email: string,
  senhaAtual: string,
  novaSenha: string,
): Promise<void> {
  await pb.send('/backend/v1/equipe/redefinir-senha', {
    method: 'POST',
    body: { email, senha_atual: senhaAtual, nova_senha: novaSenha },
  })
}

/** Pede o link de redefinição de senha (e-mail enviado pelo PocketBase). Resposta genérica por segurança. */
export async function solicitarLinkRedefinicao(email: string): Promise<void> {
  await pb.collection('users').requestPasswordReset(email.trim())
}

/** Extrai a mensagem devolvida pelo backend; usa o texto padrão quando não houver. */
export function mensagemDeErro(err: unknown, fallback: string): string {
  const resposta = (err as { response?: { message?: string } } | null)?.response
  return resposta?.message || fallback
}
