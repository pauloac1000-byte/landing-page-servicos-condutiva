import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  ArrowLeft,
  FileCheck,
  AlertCircle,
  HelpCircle,
  Clock,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Logo } from '@/components/Logo'
import { findContractByNumbers } from '@/services/contracts'
import { submitCSATResponse } from '@/services/csat'
import type {
  ContractRecord,
  CSATFormVersion,
  CSATResponseRecord,
  CSATSubmissionData,
} from '@/types'
import { COMPANY_INFO } from '@/data/mockData'
import { CSATOptionSelector } from '@/components/csat/CSATOptionSelector'
import { CSATFullForm } from '@/components/csat/CSATFullForm'
import { CSATShortForm } from '@/components/csat/CSATShortForm'
import { CSATSuccessScreen } from '@/components/csat/CSATSuccessScreen'

type PageStep = 'validate' | 'select_option' | 'form_full' | 'form_short' | 'success'

export default function CSATAccessPage() {
  const [contractNumber, setContractNumber] = useState('')
  const [serviceOrderNumber, setServiceOrderNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [validatedContract, setValidatedContract] = useState<ContractRecord | null>(null)
  const [currentStep, setCurrentStep] = useState<PageStep>('validate')
  const [submittedResponse, setSubmittedResponse] = useState<CSATResponseRecord | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    const trimmedContract = contractNumber.trim()
    const trimmedOS = serviceOrderNumber.trim()

    if (!trimmedContract || !trimmedOS) {
      setErrorMessage(
        'Não encontramos esse número de contrato ou de OS. Verifique os dados e tente novamente, ou entre em contato com o time comercial da Condutiva para obter ajuda.',
      )
      return
    }

    setIsLoading(true)

    try {
      const match = await findContractByNumbers(trimmedContract, trimmedOS)

      if (match) {
        setValidatedContract(match)
        setCurrentStep('select_option')
      } else {
        setErrorMessage(
          'Não encontramos esse número de contrato ou de OS. Verifique os dados e tente novamente, ou entre em contato com o time comercial da Condutiva para obter ajuda.',
        )
      }
    } catch (err: unknown) {
      console.error('Erro na validação do contrato:', err)
      setErrorMessage(
        'Não encontramos esse número de contrato ou de OS. Verifique os dados e tente novamente, ou entre em contato com o time comercial da Condutiva para obter ajuda.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setValidatedContract(null)
    setContractNumber('')
    setServiceOrderNumber('')
    setErrorMessage(null)
    setCurrentStep('validate')
    setSubmittedResponse(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSelectOption = (option: CSATFormVersion) => {
    if (option === 'completo') {
      setCurrentStep('form_full')
    } else {
      setCurrentStep('form_short')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCSATSubmit = async (data: CSATSubmissionData) => {
    setIsSubmitting(true)
    try {
      const response = await submitCSATResponse(data)
      setSubmittedResponse(response)
      if (validatedContract) {
        setValidatedContract({
          ...validatedContract,
          questionnaire_status: 'respondido',
        })
      }
      setCurrentStep('success')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      console.error('Erro ao enviar avaliação CSAT:', err)
      setErrorMessage('Ocorreu um erro ao registrar a avaliação. Por favor, tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Max width depends on current screen
  const containerMaxWidth =
    currentStep === 'form_full' || currentStep === 'select_option' || currentStep === 'form_short'
      ? 'max-w-3xl'
      : 'max-w-2xl'

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-[#8CC63F] selection:text-slate-950">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group" title="Voltar à página inicial">
            <Logo className="flex items-center" />
          </Link>

          <Link
            to="/"
            className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#4d7c0f] flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao site</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-12 md:py-16">
        <div className={`container mx-auto px-4 ${containerMaxWidth}`}>
          {currentStep === 'success' && submittedResponse ? (
            <CSATSuccessScreen responseRecord={submittedResponse} onReset={handleReset} />
          ) : currentStep === 'form_full' && validatedContract ? (
            <CSATFullForm
              contract={validatedContract}
              isSubmitting={isSubmitting}
              onSubmit={handleCSATSubmit}
              onBack={() => {
                setCurrentStep('select_option')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          ) : currentStep === 'form_short' && validatedContract ? (
            <CSATShortForm
              contract={validatedContract}
              isSubmitting={isSubmitting}
              onSubmit={handleCSATSubmit}
              onBack={() => {
                setCurrentStep('select_option')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          ) : currentStep === 'select_option' && validatedContract ? (
            <CSATOptionSelector
              contract={validatedContract}
              onSelectOption={handleSelectOption}
              onResetContract={handleReset}
            />
          ) : (
            /* Entry Form state */
            <div className="space-y-6">
              {/* Card Header Section */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8CC63F]/10 border border-[#8CC63F]/30 text-[#4d7c0f] text-xs font-semibold">
                  <FileCheck className="w-3.5 h-3.5 text-[#8CC63F]" />
                  <span>Unidade de Serviços Condutiva</span>
                </div>

                {/* Verbatim title requested by user */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 font-display tracking-tight">
                  Avaliação de Satisfação do Cliente
                </h1>

                {/* Verbatim intro text requested by user */}
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                  Sua opinião como cliente nos orienta a continuamente melhorar a Unidade de
                  Serviços da Condutiva. Leva de 2 a 7 minutos, conforme a versão escolhida.
                </p>
              </div>

              {/* Main Form Card */}
              <Card className="border border-slate-200 bg-white shadow-subtle">
                <CardContent className="p-6 sm:p-8 space-y-6">
                  {errorMessage && (
                    <Alert
                      variant="destructive"
                      className="border-red-300 bg-red-50 text-red-950 animate-in fade-in duration-200"
                    >
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertTitle className="text-xs font-bold uppercase tracking-wider text-red-700">
                        Atenção
                      </AlertTitle>
                      {/* Verbatim error text requested by user */}
                      <AlertDescription className="text-xs leading-relaxed text-red-900 mt-1">
                        {errorMessage}
                      </AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label
                        htmlFor="contractNumber"
                        className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2"
                      >
                        Número do contrato <span className="text-[#4d7c0f]">*</span>
                      </label>
                      <Input
                        id="contractNumber"
                        type="text"
                        required
                        value={contractNumber}
                        onChange={(e) => {
                          setContractNumber(e.target.value)
                          if (errorMessage) setErrorMessage(null)
                        }}
                        placeholder="Ex.: CTR-2025-0142"
                        className="bg-slate-50/70 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#8CC63F] focus:bg-white text-sm py-5 font-mono"
                      />
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        Consta na primeira página da sua proposta ou documento de contrato.
                      </span>
                    </div>

                    <div>
                      <label
                        htmlFor="serviceOrderNumber"
                        className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2"
                      >
                        Número da OS <span className="text-[#4d7c0f]">*</span>
                      </label>
                      <Input
                        id="serviceOrderNumber"
                        type="text"
                        required
                        value={serviceOrderNumber}
                        onChange={(e) => {
                          setServiceOrderNumber(e.target.value)
                          if (errorMessage) setErrorMessage(null)
                        }}
                        placeholder="Ex.: OS-8841"
                        className="bg-slate-50/70 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#8CC63F] focus:bg-white text-sm py-5 font-mono"
                      />
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        Consta no relatório de atendimento técnico ou laudo entregue em campo.
                      </span>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#8CC63F] hover:bg-[#7cb633] text-slate-950 font-black text-sm uppercase tracking-wide py-6 rounded-xl shadow-lg shadow-[#8CC63F]/20 transition-all disabled:opacity-60"
                    >
                      {isLoading ? 'Verificando dados...' : 'Acessar'}
                    </Button>
                  </form>

                  {/* Clarification Box */}
                  <div className="pt-4 border-t border-slate-200">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
                      <HelpCircle className="w-4 h-4 text-[#4d7c0f] shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="font-bold text-slate-800 block">
                          Dúvidas sobre o número do seu contrato ou OS?
                        </span>
                        <p className="leading-relaxed">
                          Entre em contato diretamente com o time comercial da Condutiva pelo
                          telefone{' '}
                          <a
                            href={`tel:${COMPANY_INFO.phoneLandline.replace(/\D/g, '')}`}
                            className="font-bold text-slate-800 hover:text-[#4d7c0f] underline"
                          >
                            {COMPANY_INFO.phoneLandline}
                          </a>{' '}
                          ou via{' '}
                          <a
                            href={`https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(
                              'Olá! Estou na página de Avaliação de Satisfação e preciso de ajuda para localizar meu número de contrato e OS.',
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-emerald-700 hover:text-emerald-800 underline inline-flex items-center gap-0.5"
                          >
                            WhatsApp ({COMPANY_INFO.phoneWhatsapp})
                            <ExternalLink className="w-3 h-3 inline ml-0.5" />
                          </a>
                          .
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security & Confidentiality Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-400 text-center">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#8CC63F]" />
                  Acesso protegido e vinculado à sua ordem de serviço
                </span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Preenchimento rápido (2 a 7 min)
                </span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Condutiva Tecnologia. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-slate-800 transition">
              Início
            </Link>
            <Link to="/contratos" className="hover:text-slate-800 transition">
              Área de Contratos & OS
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
