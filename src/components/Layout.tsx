import { Outlet } from 'react-router-dom'
import { FloatingActions } from '@/components/FloatingActions'

export default function Layout() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <Outlet />
      <FloatingActions />
    </div>
  )
}
