import pb from '@/lib/pocketbase/client'
import type { CSATSubmissionData, CSATResponseRecord } from '@/types'
import { updateContractQuestionnaireStatus } from './contracts'

/**
 * Submits a CSAT questionnaire response and updates the associated contract status to 'respondido'.
 */
export async function submitCSATResponse(data: CSATSubmissionData): Promise<CSATResponseRecord> {
  const payload = {
    contract_id: data.contractId || null,
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

  return createdRecord
}

/**
 * Retrieves CSAT responses, optionally filtered by contract number.
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
