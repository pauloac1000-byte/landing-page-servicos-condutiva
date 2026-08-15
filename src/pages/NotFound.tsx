import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'

const NotFound = () => {
  const location = useLocation()

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070b14] text-white p-4">
      <div className="text-center max-w-md space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#8CC63F] text-slate-950 flex items-center justify-center font-black text-2xl mx-auto">
          C
        </div>
        <h1 className="text-5xl font-black text-[#8CC63F]">404</h1>
        <p className="text-xl text-slate-300">Página não encontrada</p>
        <p className="text-xs text-slate-500">
          A rota <span className="font-mono text-amber-400">{location.pathname}</span> não existe no
          portal Condutiva Tecnologia.
        </p>
        <div className="pt-4">
          <a
            href="/"
            className="inline-block bg-[#8CC63F] text-slate-950 font-bold px-6 py-3 rounded-xl hover:bg-[#7cb633] transition"
          >
            Voltar para a Página Inicial
          </a>
        </div>
      </div>
    </div>
  )
}

export default NotFound
