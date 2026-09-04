export interface ServiceItem {
  id: string
  title: string
  shortDesc: string
  fullDesc: string
  iconName: string
  category: string
  deliverables: string[]
  tags: string[]
}

export interface PlanItem {
  id: string
  name: string
  tagline: string
  recommended?: boolean
  badge?: string
  responseSLA: string
  features: string[]
  idealFor: string
  priceLabel: string
}

export interface CaseStudy {
  id: string
  client: string
  segment: string
  location: string
  challenge: string
  solution: string
  results: { label: string; value: string }[]
  quote: string
  author: string
  role: string
  image: string
  galleryImages?: string[]
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  segment: string
  text: string
  rating: number
  avatar: string
}

export interface FaqItem {
  question: string
  answer: string
  category: string
}

export interface LeadFormData {
  fullName: string
  company: string
  email: string
  phone: string
  segment: string
  cityState: string
  equipmentCount: string
  mainChallenge: string
  lgpdConsent: boolean
  preferredDate?: string
}

export interface LeadRecord {
  id: string
  collectionId: string
  collectionName: string
  created: string
  updated: string
  full_name: string
  company: string
  email: string
  phone: string
  segment?: string
  city_state?: string
  equipment_count?: string
  main_challenge?: string
  lgpd_consent?: boolean
}

export type QuestionnaireStatus = 'pendente' | 'respondido'

export interface ContractFormData {
  contractNumber: string
  serviceOrderNumber: string
  clientName: string
  clientEmail: string
  technicianName: string
  questionnaireStatus: QuestionnaireStatus
}

export interface ContractRecord {
  id: string
  collectionId: string
  collectionName: string
  created: string
  updated: string
  contract_number: string
  service_order_number: string
  client_name: string
  client_email: string
  technician_name: string
  questionnaire_status: QuestionnaireStatus
}
