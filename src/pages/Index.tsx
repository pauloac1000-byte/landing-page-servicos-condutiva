import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { HeroSection } from '@/components/sections/HeroSection'
import { SocialProofBar } from '@/components/sections/SocialProofBar'
import { PresentationSection } from '@/components/sections/PresentationSection'
import { PainPointsSection } from '@/components/sections/PainPointsSection'
import { TransformationSection } from '@/components/sections/TransformationSection'
import { ServiceCatalogSection } from '@/components/sections/ServiceCatalogSection'
import { ServiceLevelsSection } from '@/components/sections/ServiceLevelsSection'
import { DifferentiatorsSection } from '@/components/sections/DifferentiatorsSection'
import { CaseStudiesSection } from '@/components/sections/CaseStudiesSection'
import { BenefitsGridSection } from '@/components/sections/BenefitsGridSection'
import { HowItWorksSection } from '@/components/sections/HowItWorksSection'
import { AspirationalSection } from '@/components/sections/AspirationalSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { RiskReversalBanner } from '@/components/sections/RiskReversalBanner'
import { FaqSection } from '@/components/sections/FaqSection'
import { DiagnosticFormSection } from '@/components/sections/DiagnosticFormSection'
import { DiagnosticModal } from '@/components/DiagnosticModal'
import { ClienteLoginModal } from '@/components/cliente/ClienteLoginModal'
import { ClienteDashboardModal } from '@/components/cliente/ClienteDashboardModal'
import { useClienteAuth } from '@/contexts/ClienteAuthContext'

export default function Index() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>(undefined)
  const [isDashboardOpen, setIsDashboardOpen] = useState(false)
  const { isAuthenticated, openModal } = useClienteAuth()

  const handleOpenModal = (topic?: string) => {
    setSelectedTopic(topic)
    setIsModalOpen(true)
  }

  const handleOpenClienteArea = () => {
    if (isAuthenticated) {
      setIsDashboardOpen(true)
    } else {
      openModal('login')
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-[#8CC63F] selection:text-white">
      <Header
        onOpenDiagnosticModal={() => handleOpenModal()}
        onOpenClienteArea={handleOpenClienteArea}
      />

      <main className="flex-grow">
        <HeroSection onOpenDiagnosticModal={() => handleOpenModal('Diagnóstico Hero')} />
        <SocialProofBar />
        <PresentationSection />
        <PainPointsSection />
        <TransformationSection />
        <DifferentiatorsSection />
        <ServiceCatalogSection onSelectService={(title) => handleOpenModal(`Serviço: ${title}`)} />
        <ServiceLevelsSection onSelectPlan={(plan) => handleOpenModal(`Plano: ${plan}`)} />
        <CaseStudiesSection />
        <BenefitsGridSection />
        <HowItWorksSection />
        <AspirationalSection
          onOpenDiagnosticModal={() => handleOpenModal('Diagnóstico Banner Parallax')}
        />
        <TestimonialsSection onOpenClienteArea={handleOpenClienteArea} />
        <RiskReversalBanner
          onOpenDiagnosticModal={() => handleOpenModal('Diagnóstico Banner Risco Zero')}
        />
        <FaqSection />
        <DiagnosticFormSection initialService={selectedTopic} />
      </main>

      <Footer onOpenClienteArea={handleOpenClienteArea} />

      <DiagnosticModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        preselectedTitle={selectedTopic}
      />

      {/* Modais da Área do Cliente */}
      <ClienteLoginModal />
      <ClienteDashboardModal isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} />
    </div>
  )
}
