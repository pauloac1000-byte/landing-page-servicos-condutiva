import { useState, useEffect } from 'react'
import { Activity, ShieldCheck, AlertTriangle, Cpu, BarChart2, Radio } from 'lucide-react'

export function SigaTabletMockup() {
  const [metricValue, setMetricValue] = useState(99.4)
  const [dosagemRate, setDosagemRate] = useState(1480)
  const [activeTab, setActiveTab] = useState<'sensores' | 'grafico' | 'alertas'>('sensores')

  useEffect(() => {
    const interval = setInterval(() => {
      setMetricValue((prev) => +(99.2 + Math.random() * 0.6).toFixed(2))
      setDosagemRate((prev) => Math.round(1470 + Math.random() * 25))
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return <div className="relative mx-auto w-full max-w-lg lg:max-w-none"></div>
}
