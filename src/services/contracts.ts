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
 * Searches for a contract record matching both contract_number and service_order_number.
 * Returns null if no match is found. Case-insensitive comparison with fallback.
 */
export async function findContractByNumbers(
  contractNumber: string,
  serviceOrderNumber: string,
): Promise<ContractRecord | null> {
  const cleanContract = contractNumber.trim()
  const cleanOS = serviceOrderNumber.trim()

  if (!cleanContract || !cleanOS) {
    return null
  }

  try {
    // Escape single quotes for PocketBase filter syntax
    const safeContract = cleanContract.replace(/'/g, "\\'")
    const safeOS = cleanOS.replace(/'/g, "\\'")

    // PocketBase '=' operator is case-insensitive for text fields in SQLite collation NOCASE,
    // but we can query with exact match or retrieve records to verify precisely.
    const records = await pb.collection<ContractRecord>('contracts').getList(1, 10, {
      filter: `contract_number ~ '${safeContract}' && service_order_number ~ '${safeOS}'`,
    })

    const found = records.items.find(
      (item) =>
        item.contract_number.trim().toLowerCase() === cleanContract.toLowerCase() &&
        item.service_order_number.trim().toLowerCase() === cleanOS.toLowerCase(),
    )

    return found || null
  } catch (err: unknown) {
    console.error('Error finding contract by numbers:', err)
    return null
  }
}

/**
 * Creates a new contract & service order record.
 */
export async function createContract(data: ContractFormData): Promise<ContractRecord> {
  const payload: Record<string, unknown> = {
    contract_number: data.contractNumber.trim(),
    service_order_number: data.serviceOrderNumber.trim(),
    client_name: data.clientName.trim(),
    client_email: data.clientEmail.trim().toLowerCase(),
    technician_name: data.technicianName.trim(),
    questionnaire_status: data.questionnaireStatus,
  }
  if (data.nivelContrato) {
    payload.nivel_contrato = data.nivelContrato
  }
  return await pb.collection<ContractRecord>('contracts').create(payload)
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
  if (data.nivelContrato !== undefined) payload.nivel_contrato = data.nivelContrato

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
