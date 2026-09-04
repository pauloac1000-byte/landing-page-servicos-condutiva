import pb from '@/lib/pocketbase/client'
import type { ContractFormData, ContractRecord, QuestionnaireStatus } from '@/types'

/**
 * Fetches all contract & service order records sorted from newest to oldest.
 */
export async function getContracts(): Promise<ContractRecord[]> {
  return await pb.collection<ContractRecord>('contracts').getFullList({
    sort: '-created',
  })
}

/**
 * Creates a new contract & service order record.
 */
export async function createContract(data: ContractFormData): Promise<ContractRecord> {
  return await pb.collection<ContractRecord>('contracts').create({
    contract_number: data.contractNumber.trim(),
    service_order_number: data.serviceOrderNumber.trim(),
    client_name: data.clientName.trim(),
    client_email: data.clientEmail.trim().toLowerCase(),
    technician_name: data.technicianName.trim(),
    questionnaire_status: data.questionnaireStatus,
  })
}

/**
 * Updates an existing contract & service order record.
 */
export async function updateContract(
  id: string,
  data: Partial<ContractFormData>,
): Promise<ContractRecord> {
  const payload: Record<string, unknown> = {}
  if (data.contractNumber !== undefined) payload.contract_number = data.contractNumber.trim()
  if (data.serviceOrderNumber !== undefined)
    payload.service_order_number = data.serviceOrderNumber.trim()
  if (data.clientName !== undefined) payload.client_name = data.clientName.trim()
  if (data.clientEmail !== undefined) payload.client_email = data.clientEmail.trim().toLowerCase()
  if (data.technicianName !== undefined) payload.technician_name = data.technicianName.trim()
  if (data.questionnaireStatus !== undefined)
    payload.questionnaire_status = data.questionnaireStatus

  return await pb.collection<ContractRecord>('contracts').update(id, payload)
}

/**
 * Quick status update for questionnaire status.
 */
export async function updateContractQuestionnaireStatus(
  id: string,
  status: QuestionnaireStatus,
): Promise<ContractRecord> {
  return await pb.collection<ContractRecord>('contracts').update(id, {
    questionnaire_status: status,
  })
}

/**
 * Deletes a contract & service order record by ID.
 */
export async function deleteContract(id: string): Promise<boolean> {
  return await pb.collection('contracts').delete(id)
}
