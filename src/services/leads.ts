import pb from '@/lib/pocketbase/client'
import type { LeadFormData, LeadRecord } from '@/types'

/**
 * Persists a new diagnostic request (lead) in the `leads` collection.
 *
 * The collection allows public creates (no auth required) so anonymous
 * visitors can submit the diagnostic form. Validation constraints live on
 * the collection itself; the SDK throws a `ClientResponseError` carrying
 * field-level messages on failure.
 */
export async function createLead(data: LeadFormData): Promise<LeadRecord> {
  return await pb.collection<LeadRecord>('leads').create({
    full_name: data.fullName,
    company: data.company,
    email: data.email,
    phone: data.phone,
    segment: data.segment,
    city_state: data.cityState,
    equipment_count: data.equipmentCount,
    main_challenge: data.mainChallenge,
    lgpd_consent: data.lgpdConsent,
  })
}

/**
 * Fetches all registered leads sorted from newest to oldest.
 */
export async function getLeads(): Promise<LeadRecord[]> {
  return await pb.collection<LeadRecord>('leads').getFullList({
    sort: '-created',
  })
}

/**
 * Deletes a lead record by id.
 */
export async function deleteLead(id: string): Promise<boolean> {
  return await pb.collection('leads').delete(id)
}
