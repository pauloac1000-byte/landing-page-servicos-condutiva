import pb from '@/lib/pocketbase/client'
import type { OrdemServicoRecord, OrdemServicoFormData, ClienteRecord } from '@/types'

/**
 * Retorna a lista de todas as Ordens de Serviço cadastradas,
 * opcionalmente expandindo o contrato/cliente associado.
 */
export async function getOrdensServico(): Promise<OrdemServicoRecord[]> {
  return await pb.collection<OrdemServicoRecord>('ordens_servico').getFullList({
    sort: '-created',
    expand: 'contrato_id',
  })
}

/**
 * Retorna as Ordens de Serviço de um contrato específico (pelo ID do cliente/contrato).
 */
export async function getOrdensServicoByContratoId(
  contratoId: string,
): Promise<OrdemServicoRecord[]> {
  const safeId = contratoId.trim().replace(/'/g, "\\'")
  return await pb.collection<OrdemServicoRecord>('ordens_servico').getFullList({
    filter: `contrato_id = '${safeId}'`,
    sort: '-created',
    expand: 'contrato_id',
  })
}

/**
 * Retorna a lista de todos os contratos/clientes disponíveis para vincular OS.
 */
export async function getClientesContratos(): Promise<ClienteRecord[]> {
  return await pb.collection<ClienteRecord>('clientes').getFullList({
    sort: 'nome_cliente',
  })
}

/**
 * Busca uma OS pelo número para checar duplicidade.
 */
export async function findOrdemServicoByNumero(
  numeroOS: string,
): Promise<OrdemServicoRecord | null> {
  const clean = numeroOS.trim()
  if (!clean) return null
  const safe = clean.replace(/'/g, "\\'")
  try {
    const list = await pb.collection<OrdemServicoRecord>('ordens_servico').getList(1, 10, {
      filter: `numero_os ~ '${safe}'`,
    })
    const found = list.items.find(
      (item) => item.numero_os.trim().toLowerCase() === clean.toLowerCase(),
    )
    return found || null
  } catch (_) {
    return null
  }
}

/**
 * Cria uma nova Ordem de Serviço vinculada a um contrato de cliente, com suporte a upload de arquivo PDF.
 */
export async function createOrdemServico(data: OrdemServicoFormData): Promise<OrdemServicoRecord> {
  const hasFiles = data.arquivo instanceof File || data.relatorio_arquivo instanceof File

  if (hasFiles) {
    const formData = new FormData()
    formData.append('numero_os', data.numero_os.trim())
    formData.append('contrato_id', data.contrato_id)
    formData.append('avaliacao_realizada', 'false')
    if (data.data) {
      formData.append('data', data.data)
    }
    if (data.status) {
      formData.append('status', data.status)
    }
    if (data.observacoes) {
      formData.append('observacoes', data.observacoes.trim())
    }
    if (data.descricao_servico) {
      formData.append('descricao_servico', data.descricao_servico.trim())
    }
    if (data.tecnico_responsavel) {
      formData.append('tecnico_responsavel', data.tecnico_responsavel.trim())
    }
    if (data.relatorio_pdf_url !== undefined) {
      formData.append('relatorio_pdf_url', data.relatorio_pdf_url.trim())
    }
    if (data.arquivo instanceof File) {
      formData.append('arquivo', data.arquivo)
    }
    if (data.relatorio_arquivo instanceof File) {
      formData.append('relatorio_arquivo', data.relatorio_arquivo)
    }

    const created = await pb.collection<OrdemServicoRecord>('ordens_servico').create(formData, {
      expand: 'contrato_id',
    })

    // Se houve upload do relatório e não havia URL manual preenchida, sincroniza a relatorio_pdf_url pública
    if (created.relatorio_arquivo && (!data.relatorio_pdf_url || !data.relatorio_pdf_url.trim())) {
      const generatedRelatorioUrl = pb.files.getURL(created, created.relatorio_arquivo)
      if (generatedRelatorioUrl) {
        return await pb
          .collection<OrdemServicoRecord>('ordens_servico')
          .update(
            created.id,
            { relatorio_pdf_url: generatedRelatorioUrl },
            { expand: 'contrato_id' },
          )
      }
    }

    return created
  }

  const payload: Record<string, unknown> = {
    numero_os: data.numero_os.trim(),
    contrato_id: data.contrato_id,
    avaliacao_realizada: false,
  }
  if (data.data) payload.data = data.data
  if (data.status) payload.status = data.status
  if (data.observacoes) payload.observacoes = data.observacoes.trim()
  if (data.descricao_servico) payload.descricao_servico = data.descricao_servico.trim()
  if (data.tecnico_responsavel) payload.tecnico_responsavel = data.tecnico_responsavel.trim()
  if (data.relatorio_pdf_url !== undefined)
    payload.relatorio_pdf_url = data.relatorio_pdf_url.trim()

  return await pb.collection<OrdemServicoRecord>('ordens_servico').create(payload, {
    expand: 'contrato_id',
  })
}

/**
 * Atualiza uma Ordem de Serviço existente.
 */
export async function updateOrdemServico(
  id: string,
  data: Partial<OrdemServicoFormData>,
): Promise<OrdemServicoRecord> {
  const hasFiles = data.arquivo instanceof File || data.relatorio_arquivo instanceof File

  if (hasFiles) {
    const formData = new FormData()
    if (data.numero_os !== undefined) formData.append('numero_os', data.numero_os.trim())
    if (data.contrato_id !== undefined) formData.append('contrato_id', data.contrato_id)
    if (data.data !== undefined) formData.append('data', data.data)
    if (data.status !== undefined) formData.append('status', data.status)
    if (data.observacoes !== undefined) formData.append('observacoes', data.observacoes.trim())
    if (data.descricao_servico !== undefined)
      formData.append('descricao_servico', data.descricao_servico.trim())
    if (data.tecnico_responsavel !== undefined)
      formData.append('tecnico_responsavel', data.tecnico_responsavel.trim())
    if (data.relatorio_pdf_url !== undefined)
      formData.append('relatorio_pdf_url', data.relatorio_pdf_url.trim())
    if (data.arquivo instanceof File) {
      formData.append('arquivo', data.arquivo)
    }
    if (data.relatorio_arquivo instanceof File) {
      formData.append('relatorio_arquivo', data.relatorio_arquivo)
    }

    const updated = await pb.collection<OrdemServicoRecord>('ordens_servico').update(id, formData, {
      expand: 'contrato_id',
    })

    // Se houve upload do relatório, calcula a URL pública do arquivo no storage e salva em relatorio_pdf_url
    if (data.relatorio_arquivo instanceof File && updated.relatorio_arquivo) {
      const generatedRelatorioUrl = pb.files.getURL(updated, updated.relatorio_arquivo)
      if (
        generatedRelatorioUrl &&
        (!data.relatorio_pdf_url || data.relatorio_pdf_url === updated.relatorio_pdf_url)
      ) {
        return await pb
          .collection<OrdemServicoRecord>('ordens_servico')
          .update(
            updated.id,
            { relatorio_pdf_url: generatedRelatorioUrl },
            { expand: 'contrato_id' },
          )
      }
    }

    return updated
  }

  const payload: Record<string, unknown> = {}
  if (data.numero_os !== undefined) payload.numero_os = data.numero_os.trim()
  if (data.contrato_id !== undefined) payload.contrato_id = data.contrato_id
  if (data.data !== undefined) payload.data = data.data
  if (data.status !== undefined) payload.status = data.status
  if (data.observacoes !== undefined) payload.observacoes = data.observacoes.trim()
  if (data.descricao_servico !== undefined)
    payload.descricao_servico = data.descricao_servico.trim()
  if (data.tecnico_responsavel !== undefined)
    payload.tecnico_responsavel = data.tecnico_responsavel.trim()
  if (data.relatorio_pdf_url !== undefined)
    payload.relatorio_pdf_url = data.relatorio_pdf_url.trim()

  return await pb.collection<OrdemServicoRecord>('ordens_servico').update(id, payload, {
    expand: 'contrato_id',
  })
}

/**
 * Exclui uma Ordem de Serviço.
 */
export async function deleteOrdemServico(id: string): Promise<boolean> {
  return await pb.collection('ordens_servico').delete(id)
}

/**
 * Gera a URL do arquivo PDF da OS no PocketBase Storage.
 */
export function getOrdemServicoFileUrl(record: OrdemServicoRecord): string | null {
  if (!record.arquivo) return null
  return pb.files.getURL(record, record.arquivo)
}

/**
 * Gera a URL do Relatório de Atividades (seja por arquivo salvo no storage ou por URL manual).
 */
export function getOrdemServicoRelatorioUrl(record: OrdemServicoRecord): string | null {
  if (record.relatorio_arquivo) {
    return pb.files.getURL(record, record.relatorio_arquivo)
  }
  if (record.relatorio_pdf_url && record.relatorio_pdf_url.trim()) {
    return record.relatorio_pdf_url.trim()
  }
  return null
}

/**
 * Faz upload avulso do arquivo PDF do Relatório de Atividades para uma OS existente,
 * atualizando relatorio_arquivo e relatorio_pdf_url no banco de dados.
 */
export async function uploadRelatorioAtividadesOS(
  osId: string,
  arquivo: File,
): Promise<{ record: OrdemServicoRecord; fileUrl: string }> {
  const formData = new FormData()
  formData.append('relatorio_arquivo', arquivo)

  const updatedWithFile = await pb
    .collection<OrdemServicoRecord>('ordens_servico')
    .update(osId, formData, { expand: 'contrato_id' })

  const fileUrl = pb.files.getURL(updatedWithFile, updatedWithFile.relatorio_arquivo!)

  // Sincroniza a URL gerada no campo texto relatorio_pdf_url
  const finalRecord = await pb
    .collection<OrdemServicoRecord>('ordens_servico')
    .update(osId, { relatorio_pdf_url: fileUrl }, { expand: 'contrato_id' })

  return { record: finalRecord, fileUrl }
}

/**
 * Remove o relatório de atividades de uma OS (limpa arquivo e URL).
 */
export async function removeRelatorioAtividadesOS(osId: string): Promise<OrdemServicoRecord> {
  return await pb.collection<OrdemServicoRecord>('ordens_servico').update(
    osId,
    {
      relatorio_arquivo: null,
      relatorio_pdf_url: '',
    },
    { expand: 'contrato_id' },
  )
}
