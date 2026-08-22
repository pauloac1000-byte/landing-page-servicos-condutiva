import pb from '@/lib/pocketbase/client'
import type { LeadFormData } from '@/types'

/**
 * Persists a new diagnostic request (lead) in the `leads` collection.
 *
 * The collection allows public creates (no auth required) so anonymous
 * visitors can submit the diagnostic form. Validation constraints live on
 * the collection itself; the SDK throws a `ClientResponseError` carrying
 * field-level messages on failure.
 */
export async function createLead(data: LeadFormData): Promise<void> {
  await pb.collection('leads').create({
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
