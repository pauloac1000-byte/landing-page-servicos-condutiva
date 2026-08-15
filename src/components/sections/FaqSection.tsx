import { FAQS } from '@/data/mockData'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

export function FaqSection() {
  return (
    <section id="faq" className="py-20 bg-slate-50 text-slate-900">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center space-y-4 mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#4d7c0f] bg-[#8CC63F]/10 px-3 py-1 rounded-full border border-[#8CC63F]/30">
            DÚVIDAS FREQUENTES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900">
            Perguntas mais comuns sobre nossos serviços
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {FAQS.map((faq, idx) => (
            <AccordionItem
              key={idx}
              value={`item-${idx}`}
              className="bg-white border border-slate-200 rounded-2xl px-6 py-2 text-left shadow-subtle"
            >
              <AccordionTrigger className="text-base font-bold text-slate-800 hover:text-[#4d7c0f] hover:no-underline transition">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
