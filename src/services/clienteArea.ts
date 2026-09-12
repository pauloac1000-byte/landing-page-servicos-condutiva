import pb from '@/lib/pocketbase/client'
import type {
  ClienteRecord,
  OrdemServicoRecord,
  DocumentoTecnicoRecord,
  NivelContrato,
} from '@/types'

/**
 * Mensagem padrão de negação para clientes do plano Sentinela Preventivo
 * ao tentarem acessar Documentação Técnica restrita.
 */
export const MENSAGEM_NEGACAO_SENTINELA =
  'O plano Sentinela Preventivo não cobre a Documentação Técnica. Entre em contato com o time comercial da Condutiva para realizar um upgrade do seu contrato.'

/**
 * Ordem hierárquica de níveis de contrato
 * Sentinela Preventivo (1) < Controle Operacional (2) < Maestro Engenharia (3)
 */
export const HIERARQUIA_NIVEIS: Record<NivelContrato, number> = {
  'Sentinela Preventivo': 1,
  'Controle Operacional': 2,
  'Maestro Engenharia': 3,
}

/**
 * Verifica se um nível de contrato possui permissão para acessar um recurso
 * com determinado nível mínimo exigido.
 */
export function temAcessoNivel(nivelCliente: NivelContrato, nivelMinimo: NivelContrato): boolean {
  const pesoCliente = HIERARQUIA_NIVEIS[nivelCliente] || 0
  const pesoMinimo = HIERARQUIA_NIVEIS[nivelMinimo] || 0
  return pesoCliente >= pesoMinimo
}

/**
 * Valida se o cliente tem acesso à Documentação Técnica.
 * "Controle Operacional e Maestro Engenharia liberam a Documentação Técnica; Sentinela Preventivo não."
 */
export function temAcessoDocumentacaoTecnica(nivelCliente: NivelContrato): {
  permitido: boolean
  motivo?: string
} {
  if (nivelCliente === 'Controle Operacional' || nivelCliente === 'Maestro Engenharia') {
    return { permitido: true }
  }
  return {
    permitido: false,
    motivo: MENSAGEM_NEGACAO_SENTINELA,
  }
}

/**
 * Gera hash SHA-256 no client side compatível com o hash armazenado na migration
 */
export async function hashSenhaCliente(senhaRaw: string): Promise<string> {
  const salted = senhaRaw + ':condutiva_client_salt_2026'
  const encoder = new TextEncoder()
  const data = encoder.encode(salted)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Autentica o cliente na Área do Cliente utilizando número de contrato + senha.
 * Retorna o registro do cliente autenticado ou null se as credenciais forem inválidas.
 */
export async function autenticarCliente(
  numeroContrato: string,
  senhaRaw: string,
): Promise<ClienteRecord | null> {
  const cleanContrato = numeroContrato.trim()
  if (!cleanContrato || !senhaRaw) return null

  try {
    const safeContrato = cleanContrato.replace(/'/g, "\\'")
    const records = await pb.collection<ClienteRecord>('clientes').getList(1, 1, {
      filter: `numero_contrato = '${safeContrato}'`,
    })

    if (records.items.length === 0) {
      return null
    }

    const cliente = records.items[0]
    const hashCalculado = await hashSenhaCliente(senhaRaw)

    if (cliente.senha === hashCalculado) {
      return cliente
    }

    return null
  } catch (err) {
    console.error('Erro ao autenticar cliente:', err)
    return null
  }
}

/**
 * Busca dados do cliente pelo número de contrato.
 */
export async function buscarClientePorContrato(
  numeroContrato: string,
): Promise<ClienteRecord | null> {
  const cleanContrato = numeroContrato.trim()
  if (!cleanContrato) return null

  try {
    const safeContrato = cleanContrato.replace(/'/g, "\\'")
    const record = await pb
      .collection<ClienteRecord>('clientes')
      .getFirstListItem(`numero_contrato = '${safeContrato}'`)
    return record
  } catch (_) {
    return null
  }
}

/**
 * Cadastra a primeira senha ou altera senha existente (com registro de auditoria).
 */
export async function atualizarSenhaCliente(
  clienteId: string,
  novaSenhaRaw: string,
  primeiroAcesso = false,
): Promise<ClienteRecord> {
  const hash = await hashSenhaCliente(novaSenhaRaw)
  const agora = new Date().toISOString()

  const payload: Record<string, unknown> = {
    senha: hash,
    senha_alterada_em: agora,
  }

  if (primeiroAcesso) {
    payload.primeiro_acesso_em = agora
  }

  return await pb.collection<ClienteRecord>('clientes').update(clienteId, payload)
}

/**
 * Busca uma Ordem de Serviço pelo seu número (usado no fluxo "Avaliar Atendimento").
 * Permite validar se a OS existe e se a avaliação já foi realizada.
 */
export async function buscarOrdemServico(numeroOS: string): Promise<OrdemServicoRecord | null> {
  const cleanOS = numeroOS.trim()
  if (!cleanOS) return null

  try {
    const safeOS = cleanOS.replace(/'/g, "\\'")
    const record = await pb
      .collection<OrdemServicoRecord>('ordens_servico')
      .getFirstListItem(`numero_os = '${safeOS}'`, {
        expand: 'contrato_id',
      })
    return record
  } catch (_) {
    return null
  }
}

/**
 * Marca uma OS como já avaliada para impedir duplicidade de respostas.
 */
export async function marcarOSAvaliada(osId: string): Promise<OrdemServicoRecord> {
  return await pb.collection<OrdemServicoRecord>('ordens_servico').update(osId, {
    avaliacao_realizada: true,
  })
}

/**
 * Lista documentos técnicos disponíveis para o cliente com base no nível do contrato dele.
 * Filtra apenas documentos ativos e cujo nivel_minimo_acesso seja compatível.
 */
export async function listarDocumentosTecnicos(
  nivelCliente?: NivelContrato,
  apenasAtivos = true,
): Promise<DocumentoTecnicoRecord[]> {
  let filter = apenasAtivos ? 'ativo = true' : ''

  const records = await pb.collection<DocumentoTecnicoRecord>('documentos_tecnicos').getFullList({
    filter: filter || undefined,
    sort: 'tipo,nome',
  })

  if (!nivelCliente) {
    return records
  }

  // Filtrar documentos que o cliente tem permissão para visualizar/baixar
  return records.filter((doc) => temAcessoNivel(nivelCliente, doc.nivel_minimo_acesso))
}

/**
 * Cria ou atualiza documento técnico (gerenciado pelo administrador).
 */
export async function salvarDocumentoTecnico(
  doc: Partial<DocumentoTecnicoRecord> & {
    nome: string
    tipo: DocumentoTecnicoRecord['tipo']
    arquivo_url: string
    nivel_minimo_acesso: NivelContrato
  },
  id?: string,
): Promise<DocumentoTecnicoRecord> {
  if (id) {
    return await pb.collection<DocumentoTecnicoRecord>('documentos_tecnicos').update(id, doc)
  }
  return await pb.collection<DocumentoTecnicoRecord>('documentos_tecnicos').create({
    ...doc,
    ativo: doc.ativo ?? true,
    criado_em: doc.criado_em || new Date().toISOString(),
  })
}
