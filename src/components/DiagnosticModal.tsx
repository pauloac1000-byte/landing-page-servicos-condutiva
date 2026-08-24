import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { DiagnosticFormSection } from './sections/DiagnosticFormSection'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  preselectedTitle?: string
}

export function DiagnosticModal({ isOpen, onClose, preselectedTitle }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0b132b] border-slate-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="text-left mb-2">
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#8CC63F]"></span>
            Diagnóstico Técnico
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            {preselectedTitle
              ? `Serviço de interesse: ${preselectedTitle}. Preencha seus dados para que nossa engenharia prepare a avaliação.`
              : 'Agende uma avaliação técnica na sua planta. Nossa engenharia analisa o segmento e prepara um diagnóstico sob medida.'}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2">
          <DiagnosticFormSection initialService={preselectedTitle} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
