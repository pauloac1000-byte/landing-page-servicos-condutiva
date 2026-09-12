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

export type NivelContrato = 'Sentinela Preventivo' | 'Controle Operacional' | 'Maestro Engenharia'

export interface ContractFormData {
  contractNumber: string
  serviceOrderNumber: string
  clientName: string
  clientEmail: string
  technicianName: string
  questionnaireStatus: QuestionnaireStatus
  nivelContrato?: NivelContrato
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
  nivel_contrato?: NivelContrato
}

export interface ClienteRecord {
  id: string
  collectionId: string
  collectionName: string
  created: string
  updated: string
  numero_contrato: string
  nome_cliente: string
  email?: string
  senha: string
  nivel_contrato: NivelContrato
  senha_alterada_em?: string
  primeiro_acesso_em?: string
}

export interface OrdemServicoRecord {
  id: string
  collectionId: string
  collectionName: string
  created: string
  updated: string
  numero_os: string
  contrato_id: string
  avaliacao_realizada?: boolean
  descricao_servico?: string
  tecnico_responsavel?: string
  expand?: {
    contrato_id?: ClienteRecord
  }
}

export type TipoDocumentoTecnico = 'Manual' | 'Esquema' | 'Datasheet' | 'Certificado'

export interface DocumentoTecnicoRecord {
  id: string
  collectionId: string
  collectionName: string
  created: string
  updated: string
  nome: string
  tipo: TipoDocumentoTecnico
  arquivo_url: string
  nivel_minimo_acesso: NivelContrato
  ativo?: boolean
  criado_em?: string
  descricao?: string
}

export type CSATFormVersion = 'completo' | 'curto'

export type ProblemResolvedOption = 'sim' | 'nao' | 'nao_se_aplica'

export interface CSATSubmissionData {
  contractId?: string
  contractNumber: string
  serviceOrderNumber: string
  formVersion: CSATFormVersion

  // Identificação
  clientName: string
  evaluationDate: string
  respondentName: string
  respondentRole: string
  serviceEvaluated: string
  technicianName: string

  // Perguntas centrais
  problemResolved: ProblemResolvedOption

  // Notas 1 a 5
  scoreGeneralSatisfaction: number
  scoreTechnicalExecution?: number
  scoreCustomerService?: number
  scorePerceivedValue?: number

  // NPS 0 a 10
  npsScore: number
  npsReason?: string
  npsImprovement?: string
  renewalIntent?: string

  // Abertas
  positiveHighlights?: string
  pointsToImprove?: string
  additionalServicesNeeded?: string
  finalComments?: string

  // Autorização
  contactAuthorized: boolean
}

export interface CSATResponseRecord {
  id: string
  collectionId: string
  collectionName: string
  created: string
  updated: string

  contract_id?: string
  contract_number: string
  service_order_number: string
  form_version: CSATFormVersion

  client_name: string
  evaluation_date: string
  respondent_name: string
  respondent_role: string
  service_evaluated: string
  technician_name: string

  problem_resolved: ProblemResolvedOption

  score_general_satisfaction: number
  score_technical_execution?: number
  score_customer_service?: number
  score_perceived_value?: number

  nps_score: number
  nps_reason?: string
  nps_improvement?: string
  renewal_intent?: string

  positive_highlights?: string
  points_to_improve?: string
  additional_services_needed?: string
  final_comments?: string

  contact_authorized?: boolean
}
