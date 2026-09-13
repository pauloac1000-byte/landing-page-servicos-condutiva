import pb from '@/lib/pocketbase/client'
import type { CSATSubmissionData, CSATResponseRecord } from '@/types'
import { updateContractQuestionnaireStatus } from './contracts'

/**
 * Submits a CSAT questionnaire response and updates the associated contract status to 'respondido'.
 */
export async function submitCSATResponse(data: CSATSubmissionData): Promise<CSATResponseRecord> {
  const payload = {
    contract_id: data.contractId || undefined,
    contract_number: data.contractNumber.trim(),
    service_order_number: data.serviceOrderNumber.trim(),
    form_version: data.formVersion,

    // Identificação
    client_name: data.clientName.trim(),
    evaluation_date: data.evaluationDate.trim(),
    respondent_name: data.respondentName.trim(),
    respondent_role: data.respondentRole.trim(),
    service_evaluated: data.serviceEvaluated.trim(),
    technician_name: data.technicianName.trim(),

    // Resolução do problema
    problem_resolved: data.problemResolved,

    // Scores (1 to 5)
    score_general_satisfaction: data.scoreGeneralSatisfaction,
    score_technical_execution: data.scoreTechnicalExecution ?? null,
    score_customer_service: data.scoreCustomerService ?? null,
    score_perceived_value: data.scorePerceivedValue ?? null,

    // NPS (0 to 10)
    nps_score: data.npsScore,
    nps_reason: data.npsReason?.trim() || '',
    nps_improvement: data.npsImprovement?.trim() || '',
    renewal_intent: data.renewalIntent?.trim() || '',

    // Perguntas abertas
    positive_highlights: data.positiveHighlights?.trim() || '',
    points_to_improve: data.pointsToImprove?.trim() || '',
    additional_services_needed: data.additionalServicesNeeded?.trim() || '',
    final_comments: data.finalComments?.trim() || '',

    // Contato
    contact_authorized: Boolean(data.contactAuthorized),
  }

  const createdRecord = await pb.collection<CSATResponseRecord>('csat_responses').create(payload)

  // Update associated contract questionnaire_status if contractId or match is present
  if (data.contractId) {
    try {
      await updateContractQuestionnaireStatus(data.contractId, 'respondido')
    } catch (err) {
      console.warn('Could not auto-update contract status by ID:', err)
    }
  }

  // Se não atualizou por ID (ou se o ID pertencia a outra tabela como synthetic), tenta atualizar pelo contract_number
  try {
    const safeContract = data.contractNumber.trim().replace(/'/g, "\\'")
    const safeOS = data.serviceOrderNumber.trim().replace(/'/g, "\\'")
    const contractRec = await pb
      .collection('contracts')
      .getFirstListItem(`contract_number = '${safeContract}' && service_order_number = '${safeOS}'`)
    if (contractRec) {
      await updateContractQuestionnaireStatus(contractRec.id, 'respondido')
    }
  } catch {
    /* intentionally ignored */
  }

  // Sincronizar também com a coleção ordens_servico caso exista a OS correspondente
  try {
    const cleanOS = data.serviceOrderNumber.trim()
    const safeOS = cleanOS.replace(/'/g, "\\'")
    let osRec = null
    try {
      osRec = await pb.collection('ordens_servico').getFirstListItem(`numero_os = '${safeOS}'`)
    } catch (_) {
      const list = await pb.collection('ordens_servico').getList(1, 10, {
        filter: `numero_os ~ '${safeOS}'`,
      })
      osRec =
        list.items.find(
          (i) =>
            (i as unknown as { numero_os: string }).numero_os.trim().toLowerCase() ===
            cleanOS.toLowerCase(),
        ) || null
    }

    if (osRec) {
      await pb.collection('ordens_servico').update(osRec.id, {
        avaliacao_realizada: true,
      })
    }
  } catch (err) {
    console.warn('Erro ao atualizar avaliacao_realizada na coleção ordens_servico:', err)
  }
  return createdRecord
}

/**
 * Retrieves all CSAT responses with optional contract number filter.
 */
export async function getCSATResponses(contractNumber?: string): Promise<CSATResponseRecord[]> {
  const options: Record<string, unknown> = {
    sort: '-created',
  }
  if (contractNumber) {
    const safe = contractNumber.trim().replace(/'/g, "\\'")
    options.filter = `contract_number = '${safe}'`
  }
  return await pb.collection<CSATResponseRecord>('csat_responses').getFullList(options)
}

/**
 * Deletes a CSAT response record by id.
 */
export async function deleteCSATResponse(id: string): Promise<boolean> {
  return await pb.collection('csat_responses').delete(id)
}
