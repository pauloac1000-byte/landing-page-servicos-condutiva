import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FloatingActions } from '@/components/FloatingActions'
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

export default function Index() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>(undefined)

  const handleOpenModal = (topic?: string) => {
    setSelectedTopic(topic)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-[#8CC63F] selection:text-white">
      <Header onOpenDiagnosticModal={() => handleOpenModal()} />

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
        <TestimonialsSection />
        <RiskReversalBanner
          onOpenDiagnosticModal={() => handleOpenModal('Diagnóstico Banner Risco Zero')}
        />
        <FaqSection />
        <DiagnosticFormSection initialService={selectedTopic} />
      </main>

      <Footer />

      <DiagnosticModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        preselectedTitle={selectedTopic}
      />
    </div>
  )
}
