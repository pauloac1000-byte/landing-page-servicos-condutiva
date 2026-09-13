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
  'O plano Sentinela Preventivo não inclui a Documentação Técnica. Para acessar manuais e esquemas, entre em contato com o time comercial da Condutiva e faça um upgrade do seu contrato.'

/** Mensagens exatas da especificação de Avaliar Atendimento */
export const MENSAGEM_OS_NAO_ENCONTRADA =
  'Não localizamos esta Ordem de Serviço. Confira o número e tente novamente ou contate a assistência técnica.'
export const MENSAGEM_OS_JA_AVALIADA =
  'Esta Ordem de Serviço já foi avaliada. Obrigado pelo retorno.'
export const MENSAGEM_AVALIACAO_SUCESSO =
  'Avaliação enviada com sucesso. Obrigado por ajudar a Condutiva a melhorar cada vez mais.'

/** Mensagem única para qualquer falha nos fluxos de recuperação e redefinição de senha */
export const MENSAGEM_ERRO_RECUPERACAO_REDEFINICAO =
  'Não foi possível concluir o processo. Entre em contato com o suporte técnico.'

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
 * Valida se o cliente tem acesso ao Relatório de Atividades em PDF da OS.
 * Segue a mesma distinção de planos da Documentação Técnica:
 * "Apenas clientes cujo plano dá direito ao relatório de atividades conseguem ver e baixar o PDF
 * (Controle Operacional e Maestro Engenharia); para planos sem esse direito (Sentinela Preventivo),
 * o bloco não deve aparecer."
 */
export function temAcessoRelatorioAtividades(nivelCliente: NivelContrato): boolean {
  return nivelCliente === 'Controle Operacional' || nivelCliente === 'Maestro Engenharia'
}

/**
 * Conforme requisito do administrador, as senhas são armazenadas em texto puro legível no banco de dados.
 * Função utilitária mantida para compatibilidade com eventuais imports.
 */
export async function hashSenhaCliente(senhaRaw: string): Promise<string> {
  return senhaRaw.trim()
}

/**
 * Verifica se a string tem formato de hash SHA-256 (64 hex).
 * Mantida para retrocompatibilidade caso ainda exista algum hash legado durante a transição.
 */
export function isHashSha256Hex(str: string): boolean {
  if (!str || typeof str !== 'string') return false
  return /^[0-9a-fA-F]{64}$/.test(str.trim())
}

/**
 * Valida a senha informada pelo usuário contra a senha em texto puro armazenada no banco.
 * Tolerante a espaços nas extremidades e eventuais aspas acidentais.
 * Sempre retorna precisaNormalizarParaHash = false, pois não há geração de hash.
 */
export async function conferirSenhaCliente(
  senhaArmazenada: string,
  senhaInformadaRaw: string,
): Promise<{ confere: boolean; precisaNormalizarParaHash: boolean }> {
  if (!senhaArmazenada || !senhaInformadaRaw) {
    return { confere: false, precisaNormalizarParaHash: false }
  }

  const stored = senhaArmazenada.trim()
  const cleanInput = senhaInformadaRaw.trim()
  const semAspasInput = cleanInput.replace(/^["'`]|["'`]$/g, '').trim()
  const storedSemAspas = stored.replace(/^["'`]|["'`]$/g, '').trim()

  const confereTextoPuro =
    stored === senhaInformadaRaw ||
    stored === cleanInput ||
    storedSemAspas === cleanInput ||
    storedSemAspas === semAspasInput

  if (confereTextoPuro) {
    return { confere: true, precisaNormalizarParaHash: false }
  }

  return { confere: false, precisaNormalizarParaHash: false }
}

/**
 * Autentica o cliente na Área do Cliente utilizando número de contrato + senha.
 * Retorna o registro do cliente autenticado ou null se as credenciais forem inválidas.
 */
export type AuthClienteResult =
  | { success: true; cliente: ClienteRecord }
  | { success: false; reason: 'not_found' | 'invalid_password' | 'corrupted' }

/**
 * Autentica o cliente na Área do Cliente utilizando número de contrato + senha.
 * Retorna resultado tipado detalhando sucesso ou a razão da falha para mensagens exatas.
 */
export async function autenticarCliente(
  numeroContrato: string,
  senhaRaw: string,
): Promise<ClienteRecord | null> {
  const res = await autenticarClienteComDetalhe(numeroContrato, senhaRaw)
  return res.success ? res.cliente : null
}

export async function autenticarClienteComDetalhe(
  numeroContrato: string,
  senhaRaw: string,
): Promise<AuthClienteResult> {
  const cleanContrato = numeroContrato.trim()
  if (!cleanContrato) return { success: false, reason: 'not_found' }
  if (!senhaRaw) return { success: false, reason: 'invalid_password' }

  try {
    const safeContrato = cleanContrato.replace(/'/g, "\\'")
    const records = await pb.collection<ClienteRecord>('clientes').getList(1, 1, {
      filter: `numero_contrato = '${safeContrato}'`,
    })

    if (records.items.length === 0) {
      return { success: false, reason: 'not_found' }
    }

    let cliente = records.items[0]
    if (!cliente.senha) {
      return { success: false, reason: 'corrupted' }
    }

    const { confere } = await conferirSenhaCliente(cliente.senha, senhaRaw)

    if (confere) {
      return { success: true, cliente }
    }

    return { success: false, reason: 'invalid_password' }
  } catch (err) {
    console.error('Erro ao autenticar cliente:', err)
    return { success: false, reason: 'not_found' }
  }
}

/**
 * Solicita a recuperação de senha provisória para o contrato informado.
 * Dispara e-mail via backend Skip Cloud se o contrato existir e possuir e-mail.
 */
export async function recuperarSenhaCliente(numeroContrato: string): Promise<{ ok: boolean }> {
  const cleanContrato = numeroContrato.trim()
  if (!cleanContrato) return { ok: false }

  try {
    const res = await pb.send<{ ok: boolean }>('/backend/v1/recuperar-senha', {
      method: 'POST',
      body: { numero_contrato: cleanContrato },
    })
    return res && typeof res.ok === 'boolean' ? res : { ok: false }
  } catch (err) {
    console.error('Erro na rota de recuperação de senha:', err)
    return { ok: false }
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
 * A senha é gravada SEMPRE em texto puro com trim, conforme requisito de administração.
 */
export async function atualizarSenhaCliente(
  clienteId: string,
  novaSenhaRaw: string,
  primeiroAcesso = false,
): Promise<ClienteRecord> {
  const cleanSenha = novaSenhaRaw.trim()
  const agora = new Date().toISOString()

  const payload: Record<string, unknown> = {
    senha: cleanSenha,
    senha_alterada_em: agora,
  }

  if (primeiroAcesso) {
    payload.primeiro_acesso_em = agora
  }

  return await pb.collection<ClienteRecord>('clientes').update(clienteId, payload)
}

export type RedefinirSenhaResult =
  | { success: true; cliente: ClienteRecord }
  | { success: false; reason: 'contrato_nao_encontrado' | 'senha_atual_invalida' | 'erro_interno' }

/**
 * Redefine a senha do cliente a partir do Número do Contrato e da Senha Atual
 * (que pode ser a senha atual em uso ou a senha provisória gerada por e-mail).
 * Valida a senha informada contra o hash armazenado no contrato antes de atualizar.
 * Se correta, grava a nova senha com o mesmo hash SHA-256(senha + salt) e atualiza senha_alterada_em.
 */
export async function redefinirSenhaClienteComValidacao(
  numeroContrato: string,
  senhaAtualRaw: string,
  novaSenhaRaw: string,
): Promise<RedefinirSenhaResult> {
  const cleanContrato = numeroContrato.trim()
  if (!cleanContrato) {
    return { success: false, reason: 'contrato_nao_encontrado' }
  }

  // Sanitiza a senha atual informada: remove espaços no início/fim e caracteres invisíveis comuns de cópia/cola
  const cleanSenhaAtual = senhaAtualRaw.trim()
  const cleanNovaSenha = novaSenhaRaw.trim()

  if (!cleanSenhaAtual) {
    return { success: false, reason: 'senha_atual_invalida' }
  }

  if (cleanNovaSenha.length < 8) {
    return { success: false, reason: 'erro_interno' }
  }

  try {
    const cliente = await buscarClientePorContrato(cleanContrato)
    if (!cliente) {
      return { success: false, reason: 'contrato_nao_encontrado' }
    }

    if (!cliente.senha) {
      return { success: false, reason: 'erro_interno' }
    }

    const { confere } = await conferirSenhaCliente(cliente.senha, senhaAtualRaw)

    if (!confere) {
      return { success: false, reason: 'senha_atual_invalida' }
    }

    const atualizado = await atualizarSenhaCliente(cliente.id, cleanNovaSenha, false)
    return { success: true, cliente: atualizado }
  } catch (err) {
    console.error('Erro ao redefinir senha do cliente com validação:', err)
    return { success: false, reason: 'erro_interno' }
  }
}

/**
 * Busca uma Ordem de Serviço pelo seu número (usado no fluxo "Avaliar Atendimento").
 * Permite validar se a OS existe e se a avaliação já foi realizada.
 * Suporta busca case-insensitive para comodidade do usuário (ex: "os-8920" ou "OS-8920").
 */
export async function buscarOrdemServico(numeroOS: string): Promise<OrdemServicoRecord | null> {
  const cleanOS = numeroOS.trim()
  if (!cleanOS) return null

  try {
    const safeOS = cleanOS.replace(/'/g, "\\'")
    // Tenta correspondência exata primeiro
    try {
      const record = await pb
        .collection<OrdemServicoRecord>('ordens_servico')
        .getFirstListItem(`numero_os = '${safeOS}'`, {
          expand: 'contrato_id',
        })
      if (record) return record
    } catch (_) {
      // Ignora e tenta busca por like/contains case-insensitive
    }

    const records = await pb.collection<OrdemServicoRecord>('ordens_servico').getList(1, 10, {
      filter: `numero_os ~ '${safeOS}'`,
      expand: 'contrato_id',
    })

    const found = records.items.find(
      (item) => item.numero_os.trim().toLowerCase() === cleanOS.toLowerCase(),
    )

    return found || null
  } catch (_) {
    return null
  }
}

export type ValidacaoOSResultado =
  | {
      valido: true
      os: OrdemServicoRecord
      contract: import('@/types').ContractRecord
      motivo?: undefined
      mensagem?: undefined
    }
  | {
      valido: false
      os?: undefined
      contract?: undefined
      motivo: 'nao_encontrada' | 'ja_avaliada' | 'contrato_divergente'
      mensagem: string
    }

/**
 * Valida uma Ordem de Serviço para iniciar a avaliação CSAT.
 * Quando clienteId ou numeroContrato é fornecido (Área do Cliente autenticada):
 * - Confirma se a OS pertence ao contrato do cliente logado.
 * - Confirma se a OS já foi avaliada.
 * - Obtém ou sintetiza os dados do ContractRecord para reaproveitar integralmente os componentes CSAT.
 */
export async function validarOSParaAvaliacao(
  numeroOS: string,
  clienteLogado?: ClienteRecord | null,
): Promise<ValidacaoOSResultado> {
  const cleanOS = numeroOS.trim()
  if (!cleanOS) {
    return {
      valido: false,
      motivo: 'nao_encontrada',
      mensagem: MENSAGEM_OS_NAO_ENCONTRADA,
    }
  }

  // 1. Busca na coleção ordens_servico
  const osRecord = await buscarOrdemServico(cleanOS)
  // 2. Se não achou em ordens_servico, tenta buscar na coleção contracts por service_order_number
  let contractRecord: import('@/types').ContractRecord | null = null

  try {
    const safeOS = cleanOS.replace(/'/g, "\\'")
    const contracts = await pb
      .collection<import('@/types').ContractRecord>('contracts')
      .getList(1, 10, {
        filter: `service_order_number ~ '${safeOS}'`,
      })
    const foundContract = contracts.items.find(
      (c) => c.service_order_number.trim().toLowerCase() === cleanOS.toLowerCase(),
    )
    if (foundContract) {
      contractRecord = foundContract
    }
  } catch {
    /* intentionally ignored */
  }

  // Se não encontrou nem em ordens_servico nem em contracts:
  if (!osRecord && !contractRecord) {
    return {
      valido: false,
      motivo: 'nao_encontrada',
      mensagem: MENSAGEM_OS_NAO_ENCONTRADA,
    }
  }

  // Se o cliente está autenticado na Área do Cliente, verificar se a OS pertence ao contrato do cliente logado
  if (clienteLogado) {
    let pertence = false

    if (osRecord) {
      // osRecord.contrato_id pode ser o ID do registro em clientes, ou se expandido
      if (osRecord.contrato_id === clienteLogado.id) {
        pertence = true
      } else if (osRecord.expand?.contrato_id?.numero_contrato === clienteLogado.numero_contrato) {
        pertence = true
      }
    }

    if (contractRecord) {
      if (
        contractRecord.contract_number.trim().toLowerCase() ===
        clienteLogado.numero_contrato.trim().toLowerCase()
      ) {
        pertence = true
      }
    }

    if (!pertence) {
      // OS não pertence ao contrato do cliente logado: usar mensagem de não localizada
      return {
        valido: false,
        motivo: 'contrato_divergente',
        mensagem: MENSAGEM_OS_NAO_ENCONTRADA,
      }
    }
  }

  // Observação: Conforme nova regra de negócio, avaliações já realizadas NÃO bloqueiam o acesso.
  // O cliente pode acessar e responder novamente; o registro continua sendo gravado no banco.

  // Garantir um ContractRecord consistente para alimentar o questionário CSAT
  const contractFinal: import('@/types').ContractRecord = contractRecord || {
    id: osRecord?.id || 'synthetic-os',
    collectionId: 'contracts',
    collectionName: 'contracts',
    created: osRecord?.created || new Date().toISOString(),
    updated: osRecord?.updated || new Date().toISOString(),
    contract_number:
      clienteLogado?.numero_contrato ||
      osRecord?.expand?.contrato_id?.numero_contrato ||
      'CTR-CONDUTIVA',
    service_order_number: osRecord?.numero_os || cleanOS,
    client_name:
      clienteLogado?.nome_cliente ||
      osRecord?.expand?.contrato_id?.nome_cliente ||
      'Cliente Condutiva',
    client_email: clienteLogado?.email || '',
    technician_name: osRecord?.tecnico_responsavel || 'Equipe Técnica Condutiva',
    questionnaire_status: 'pendente',
    nivel_contrato:
      clienteLogado?.nivel_contrato ||
      osRecord?.expand?.contrato_id?.nivel_contrato ||
      'Controle Operacional',
  }

  // Se não temos osRecord mas temos contractRecord, cria osRecord sintético compatível
  const osFinal: OrdemServicoRecord = osRecord || {
    id: contractRecord ? contractRecord.id : 'synthetic-os',
    collectionId: 'ordens_servico',
    collectionName: 'ordens_servico',
    created: contractRecord ? contractRecord.created : new Date().toISOString(),
    updated: contractRecord ? contractRecord.updated : new Date().toISOString(),
    numero_os: contractRecord ? contractRecord.service_order_number : cleanOS,
    contrato_id: clienteLogado?.id || '',
    avaliacao_realizada: false,
    tecnico_responsavel: contractRecord
      ? contractRecord.technician_name
      : 'Equipe Técnica Condutiva',
  }

  return {
    valido: true,
    os: osFinal,
    contract: contractFinal,
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
