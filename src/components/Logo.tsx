import { Link } from 'react-router-dom'
import logoImg from '@/assets/logo-removebg-previewedited-593c6.jpg'

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      to="/#hero"
      onClick={(e) => {
        e.preventDefault()
        const el = document.querySelector('#hero')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }}
      className={className}
      aria-label="Condutiva Serviços - Página inicial"
    >
      <div className="flex flex-col items-start leading-none">
        <img src={logoImg} alt="Condutiva" className="h-16 w-auto object-contain" />
        <span className="text-[#4d7c0f] font-mono font-bold uppercase tracking-[0.25em] mt-0.5 text-[20px]">
          Serviços
        </span>
      </div>
    </Link>
  )
}
