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
  equipmentCount: string
  mainChallenge: string
  preferredDate?: string
}
