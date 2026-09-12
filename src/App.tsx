import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import LeadsPage from './pages/Leads'
import ContractsPage from './pages/Contracts'
import CSATAccessPage from './pages/Avaliacao'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import { ClienteAuthProvider } from '@/contexts/ClienteAuthContext'

const App = () => (
  <ClienteAuthProvider>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/leads" element={<LeadsPage />} />
            <Route path="/contratos" element={<ContractsPage />} />
            <Route path="/avaliacao" element={<CSATAccessPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </ClienteAuthProvider>
)

export default App
