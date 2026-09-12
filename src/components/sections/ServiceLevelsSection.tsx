import { Button } from '@/components/ui/button'
import { Check, Zap } from 'lucide-react'

interface ServiceLevelsProps {
  onSelectPlan: (planName: string) => void
}

export function ServiceLevelsSection({ onSelectPlan }: ServiceLevelsProps) {
  return (
    <section
      id="planos"
      className="py-24 sm:py-28 bg-[#fafbfc] text-slate-900 relative overflow-hidden"
    >
      {/* Background decorativo sutil para realçar as 3 colunas */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.05) 0%, rgba(34, 197, 94, 0.04) 35%, rgba(168, 85, 247, 0.04) 70%, transparent 100%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Cabeçalho da seção */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 sm:mb-20">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#4d7c0f] bg-[#8CC63F]/15 px-3.5 py-1.5 rounded-full border border-[#8CC63F]/35 shadow-xs">
            NÍVEIS DE SERVIÇO (SLA) &amp; CONTRATOS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold font-display text-slate-900 tracking-tight leading-tight">
            Planos de manutenção e calibração dimensionados para a sua demanda.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Elimine a incerteza de chamados avulsos e tenha prioridade de atendimento presencial em
            campo.
          </p>
        </div>

        {/* TABELA COMPARATIVA DE 3 COLUNAS - SEMÁFORO EVOLUTIVO (VERDE → DOURADO → ROXO) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 max-w-[1240px] mx-auto items-stretch pt-6">
          {/* =========================================================
              COLUNA 1: PLANO BÁSICO (SENTINELA PREVENTIVO) - VERDE
          ========================================================== */}
          <div
            className="group relative flex flex-col bg-white rounded-[20px] transition-all duration-300 hover:-translate-y-1"
            style={{
              boxShadow:
                '0 16px 40px -12px rgba(46, 125, 50, 0.12), 0 4px 12px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(46, 125, 50, 0.18)',
            }}
          >
            {/* Cabeçalho do Card com Gradiente Verde */}
            <div
              className="p-7 sm:p-9 rounded-t-[20px] relative overflow-hidden"
              style={{
                background:
                  'linear-gradient(180deg, #E8F5E9 0%, rgba(232, 245, 233, 0.35) 65%, #FFFFFF 100%)',
              }}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Ícone Glass-morphism 3D Verde */}
                <div
                  className="w-14 h-14 rounded-[16px] flex items-center justify-center shrink-0 relative overflow-hidden transition-transform duration-300 group-hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #43A047 0%, #2E7D32 60%, #1B5E20 100%)',
                    boxShadow:
                      '0 8px 20px -6px rgba(46, 125, 50, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.6), inset 0 -2px 4px rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                  }}
                >
                  {/* Brilho especular no topo */}
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent rounded-t-[15px] pointer-events-none" />
                  {/* Ícone SVG Escudo/Planta 3D */}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-7 h-7 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] relative z-10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path
                      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                      fill="rgba(255,255,255,0.18)"
                    />
                    <path d="M12 11c0-2.5 2-4.5 4.5-4.5 0 2.5-2 4.5-4.5 4.5z" fill="white" />
                    <path d="M12 11c0-2.5-2-4.5-4.5-4.5 0 2.5 2 4.5 4.5 4.5z" fill="white" />
                    <path d="M12 11v6" stroke="white" strokeWidth="2.2" />
                  </svg>
                </div>

                {/* Badge Sob Consulta */}
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-md shrink-0">
                  Sob consulta
                </span>
              </div>

              {/* Título & Descrição */}
              <div className="mt-4">
                <h3 className="text-[1.35rem] font-black text-slate-900 font-display leading-tight">
                  Plano Sentinela Preventivo
                </h3>
                <span className="text-sm font-bold text-slate-700 block mt-0.5">(Básico)</span>
                <p className="text-slate-600 text-xs mt-2 min-h-[34px] leading-relaxed">
                  Manutenção preventiva programada com cobertura essencial.
                </p>
              </div>

              {/* Slogan / Chamada com ícone raio */}
              <div
                className="mt-4 p-3 rounded-xl border flex items-center gap-2.5"
                style={{
                  backgroundColor: 'rgba(232, 245, 233, 0.55)',
                  borderColor: 'rgba(46, 125, 50, 0.22)',
                }}
              >
                <Zap className="w-4 h-4 text-emerald-600 shrink-0 fill-emerald-500/20" />
                <span className="text-[11px] font-medium text-slate-700 leading-snug">
                  Opera com previsibilidade sobre seus ativos.
                </span>
              </div>

              {/* Bloco de Preço com Gradiente Sólido Verde */}
              <div
                className="mt-5 rounded-2xl p-4 text-white text-center relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
                  boxShadow: '0 8px 20px -4px rgba(46, 125, 50, 0.35)',
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
                <span className="text-[11px] font-medium text-emerald-100 uppercase tracking-wider block">
                  por R$
                </span>
                <div className="text-3xl sm:text-[2.1rem] font-black tracking-tight leading-none mt-1">
                  1.490,00
                  <span className="text-base sm:text-lg font-bold text-emerald-100">/mês</span>
                </div>
                <span className="text-[11px] text-emerald-100/90 block mt-1 font-mono">
                  por equipamento
                </span>
              </div>
            </div>

            {/* Corpo: Itens Inclusos */}
            <div className="p-7 sm:p-9 pt-2 flex-grow space-y-5 bg-white">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block pb-1 border-b border-emerald-100">
                INCLUSO NO PACOTE:
              </span>

              <ul className="space-y-3.5 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 mt-0.5 text-white"
                    style={{ backgroundColor: '#2E7D32' }}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <div className="space-y-1.5 flex-1">
                    <span className="font-semibold text-slate-900">
                      1 visita bimestral técnica com as seguintes entregas:
                    </span>
                    <ul className="space-y-1 pl-3 text-slate-600 text-[11px] list-disc marker:text-emerald-600">
                      <li>Inspeção física do sensor e do seu ponto de montagem</li>
                      <li>Limpeza técnica</li>
                      <li>Teste funcional de conjunto (sensor + controle)</li>
                      <li>Registro de medição, análise de histórico desde a última visita</li>
                      <li>Entrega de parecer preventivo e relatório de condição do ativo.</li>
                    </ul>
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 mt-0.5 text-white"
                    style={{ backgroundColor: '#2E7D32' }}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <div className="space-y-1 flex-1">
                    <span className="font-semibold text-slate-900">
                      SICO Básico para clientes com CCS200
                    </span>
                    <ul className="space-y-1 pl-3 text-slate-600 text-[11px] list-disc marker:text-emerald-600">
                      <li>Monitoramento no subsistema do CCS200</li>
                      <li>Suporte remoto prioritário em horário comercial</li>
                    </ul>
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 mt-0.5 text-white"
                    style={{ backgroundColor: '#2E7D32' }}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <span className="text-slate-700">Desconto por sensor: 10/15/20% (2/3/4+)</span>
                </li>
              </ul>

              {/* Bloco 2 Motivos de Adesão */}
              <div
                className="mt-6 p-4 rounded-xl border space-y-2 relative"
                style={{
                  backgroundColor: '#F9FDF9',
                  borderColor: 'rgba(46, 125, 50, 0.22)',
                }}
              >
                <div className="inline-block -mt-6">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white border"
                    style={{
                      borderColor: 'rgba(46, 125, 50, 0.3)',
                      color: '#2E7D32',
                    }}
                  >
                    2 motivos de adesão
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Identificar desvios antes que eles comprometam a medição e prevenir retrabalho.
                </p>
                <ul className="space-y-1 pl-3 text-xs text-slate-600 list-disc marker:text-emerald-600">
                  <li>Parada não planejada evitada</li>
                  <li>Vida útil do sensor preservada</li>
                </ul>
              </div>

              {/* Ideal para */}
              <div className="pt-2 text-center text-xs text-slate-600 italic">
                <span className="font-semibold not-italic text-emerald-800">Ideal para:</span>{' '}
                início do monitoramento preventivo.
              </div>
            </div>

            {/* Botão CTA Verde Sólido */}
            <div className="p-7 sm:p-9 pt-0 bg-white rounded-b-[20px]">
              <Button
                onClick={() => onSelectPlan('Plano Sentinela Preventivo (Básico)')}
                className="w-full font-bold py-6 rounded-[12px] text-white text-sm transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #43A047 0%, #2E7D32 100%)',
                  boxShadow: '0 10px 24px -8px rgba(46, 125, 50, 0.4)',
                }}
              >
                Solicitar Proposta
              </Button>
            </div>
          </div>

          {/* =========================================================
              COLUNA 2: PLANO INTERMEDIÁRIO (CONTROLE OPERACIONAL SIGA)
              ÂNCORA VISUAL DE CONVERSÃO - DOURADO / ÂMBAR
          ========================================================== */}
          <div
            className="group relative flex flex-col bg-white rounded-[20px] transition-all duration-300 lg:-translate-y-2.5 lg:hover:-translate-y-4 hover:-translate-y-1 z-20"
            style={{
              boxShadow:
                '0 20px 48px -10px rgba(245, 127, 23, 0.22), 0 8px 18px rgba(0, 0, 0, 0.08)',
              border: '2px solid #FFB300',
            }}
          >
            {/* Badge MAIS ESCOLHIDO Sobreposta no Topo (Metade dentro / metade fora) */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30">
              <span
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-slate-950 font-black text-[11px] uppercase tracking-wider whitespace-nowrap shadow-md transition-transform hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #FFD54F 0%, #FFB300 50%, #FFA000 100%)',
                  boxShadow: '0 4px 14px rgba(245, 127, 23, 0.45)',
                  border: '1px solid rgba(255, 255, 255, 0.7)',
                }}
              >
                <span>👑</span> MAIS ESCOLHIDO
              </span>
            </div>

            {/* Cabeçalho do Card com Gradiente Dourado / Âmbar */}
            <div
              className="p-7 sm:p-9 pt-9 rounded-t-[20px] relative overflow-hidden"
              style={{
                background:
                  'linear-gradient(180deg, #FFF8E1 0%, rgba(255, 248, 225, 0.45) 65%, #FFFFFF 100%)',
              }}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Ícone Glass-morphism 3D Dourado */}
                <div
                  className="w-14 h-14 rounded-[16px] flex items-center justify-center shrink-0 relative overflow-hidden transition-transform duration-300 group-hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #FFCA28 0%, #FFA000 55%, #E65100 100%)',
                    boxShadow:
                      '0 8px 20px -6px rgba(245, 127, 23, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.7), inset 0 -2px 4px rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                  }}
                >
                  {/* Brilho especular no topo */}
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/45 to-transparent rounded-t-[15px] pointer-events-none" />
                  {/* Ícone SVG Gráfico/Escudo de Alta Performance 3D */}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-7 h-7 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] relative z-10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path
                      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                      fill="rgba(255,255,255,0.2)"
                    />
                    <path d="M8 15v-2" stroke="white" strokeWidth="2.5" />
                    <path d="M12 15v-5" stroke="white" strokeWidth="2.5" />
                    <path d="M16 15v-8" stroke="white" strokeWidth="2.5" />
                    <path d="M7 11l4-4 2 2 4-4" stroke="white" strokeWidth="1.8" />
                  </svg>
                </div>

                {/* Badge Sob Consulta */}
                <span className="text-[11px] font-semibold text-amber-900 bg-amber-50 border border-amber-200/90 px-2.5 py-1 rounded-md shrink-0">
                  Sob consulta
                </span>
              </div>

              {/* Título & Descrição */}
              <div className="mt-4">
                <h3 className="text-[1.35rem] font-black text-slate-900 font-display leading-tight">
                  Plano Controle Operacional SIGA
                </h3>
                <span className="text-sm font-bold text-amber-900 block mt-0.5">
                  (Intermediário)
                </span>
                <p className="text-slate-600 text-xs mt-2 min-h-[34px] leading-relaxed">
                  Gestão integrada com monitoramento e SLA prioritário.
                </p>
              </div>

              {/* Slogan / Chamada com ícone raio */}
              <div
                className="mt-4 p-3 rounded-xl border flex items-center gap-2.5"
                style={{
                  backgroundColor: 'rgba(255, 248, 225, 0.7)',
                  borderColor: 'rgba(245, 168, 37, 0.35)',
                }}
              >
                <Zap className="w-4 h-4 text-amber-600 shrink-0 fill-amber-500/20" />
                <span className="text-[11px] font-medium text-slate-700 leading-snug">
                  O equilíbrio entre investimento e controle operacional.
                </span>
              </div>

              {/* Bloco de Preço com Gradiente Sólido Dourado */}
              <div
                className="mt-5 rounded-2xl p-4 text-white text-center relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #F57F17 0%, #D84315 100%)',
                  boxShadow: '0 8px 24px -4px rgba(245, 127, 23, 0.45)',
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                <span className="text-[11px] font-medium text-amber-100 uppercase tracking-wider block">
                  por R$
                </span>
                <div className="text-3xl sm:text-[2.25rem] font-black tracking-tight leading-none mt-1">
                  1.990,00
                  <span className="text-base sm:text-lg font-bold text-amber-100">/mês</span>
                </div>
                <span className="text-[11px] text-amber-100/90 block mt-1 font-mono">
                  por equipamento
                </span>
              </div>
            </div>

            {/* Corpo: Itens Inclusos + Bônus */}
            <div className="p-7 sm:p-9 pt-2 flex-grow space-y-4 bg-white">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block pb-1 border-b border-amber-100">
                INCLUSO NO PACOTE:
              </span>

              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 mt-0.5 text-white"
                    style={{ backgroundColor: '#F57F17' }}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <span className="font-semibold text-slate-900">Tudo do Sentinela</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 mt-0.5 text-white"
                    style={{ backgroundColor: '#F57F17' }}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <span>+ 1 visita de sacrifício/ano incluída</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 mt-0.5 text-white"
                    style={{ backgroundColor: '#F57F17' }}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <span>
                    + 1 manutenção corretiva/ano com troca de conectores e borracha de vedação com
                    garantia estendida
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 mt-0.5 text-white"
                    style={{ backgroundColor: '#F57F17' }}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <span>+ Prioridade na agenda na atualização das evoluções de software</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 mt-0.5 text-white"
                    style={{ backgroundColor: '#F57F17' }}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <span>+ SICO Completo: causa raiz + análise de desempenho</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 mt-0.5 text-white"
                    style={{ backgroundColor: '#F57F17' }}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <span>+ Academia Condutiva de Treinamento</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 mt-0.5 text-white"
                    style={{ backgroundColor: '#F57F17' }}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <span>
                    + Acesso irrestrito à documentação técnica na sua área do cliente, com login e
                    senha exclusivos.
                  </span>
                </li>
              </ul>

              {/* BÔNUS Destacado */}
              <div
                className="mt-4 p-3.5 rounded-xl border space-y-1"
                style={{
                  backgroundColor: '#FFFDE7',
                  borderColor: 'rgba(245, 168, 37, 0.4)',
                }}
              >
                <div className="text-xs text-slate-800 leading-relaxed">
                  <strong className="text-amber-900 font-bold">
                    BONUS - Você manda no calendário:
                  </strong>{' '}
                  se a emergência aparecer, adiantamos a sua visita, resolvido na hora, dentro do
                  plano.
                </div>
              </div>

              {/* Bloco 2 Motivos de Adesão */}
              <div
                className="mt-4 p-4 rounded-xl border space-y-2 relative"
                style={{
                  backgroundColor: '#FFFDF0',
                  borderColor: 'rgba(245, 168, 37, 0.35)',
                }}
              >
                <div className="inline-block -mt-6">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white border"
                    style={{
                      borderColor: 'rgba(245, 168, 37, 0.4)',
                      color: '#D84315',
                    }}
                  >
                    2 motivos de adesão
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Além de prevenir falhas, entender por que elas acontecem, corrigir a origem do
                  problema e manter seus sensores operando com desempenho estável ao longo do tempo.
                </p>
                <ul className="space-y-1 pl-3 text-xs text-slate-600 list-disc marker:text-amber-600">
                  <li>Continuidade operacional</li>
                  <li>Produção protegida</li>
                </ul>
              </div>

              {/* Ideal para */}
              <div className="pt-2 text-center text-xs text-slate-600 italic">
                <span className="font-semibold not-italic text-amber-900">Ideal para:</span> máximas
                demandas e causa raiz recorrente.
              </div>
            </div>

            {/* Botão CTA Dourado Sólido */}
            <div className="p-7 sm:p-9 pt-0 bg-white rounded-b-[20px]">
              <Button
                onClick={() => onSelectPlan('Plano Controle Operacional SIGA (Intermediário)')}
                className="w-full font-black py-6 rounded-[12px] text-white text-sm transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #FFB300 0%, #F57F17 100%)',
                  boxShadow: '0 10px 24px -8px rgba(245, 127, 23, 0.5)',
                }}
              >
                Solicitar Proposta
              </Button>
            </div>
          </div>

          {/* =========================================================
              COLUNA 3: PLANO COMPLETO (MAESTRO ENGENHARIA) - ROXO
          ========================================================== */}
          <div
            className="group relative flex flex-col bg-white rounded-[20px] transition-all duration-300 hover:-translate-y-1"
            style={{
              boxShadow:
                '0 16px 40px -12px rgba(123, 31, 162, 0.12), 0 4px 12px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(123, 31, 162, 0.18)',
            }}
          >
            {/* Cabeçalho do Card com Gradiente Roxo */}
            <div
              className="p-7 sm:p-9 rounded-t-[20px] relative overflow-hidden"
              style={{
                background:
                  'linear-gradient(180deg, #F3E5F5 0%, rgba(243, 229, 245, 0.35) 65%, #FFFFFF 100%)',
              }}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Ícone Glass-morphism 3D Roxo */}
                <div
                  className="w-14 h-14 rounded-[16px] flex items-center justify-center shrink-0 relative overflow-hidden transition-transform duration-300 group-hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #8E24AA 0%, #7B1FA2 60%, #4A148C 100%)',
                    boxShadow:
                      '0 8px 20px -6px rgba(123, 31, 162, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.6), inset 0 -2px 4px rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                  }}
                >
                  {/* Brilho especular no topo */}
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent rounded-t-[15px] pointer-events-none" />
                  {/* Ícone SVG Engrenagem / Coroa de Engenharia 3D */}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-7 h-7 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] relative z-10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path
                      d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                      fill="rgba(255,255,255,0.25)"
                      stroke="white"
                    />
                    <path
                      d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"
                      stroke="white"
                    />
                  </svg>
                </div>

                {/* Badge Sob Consulta */}
                <span className="text-[11px] font-semibold text-purple-900 bg-purple-50 border border-purple-200/80 px-2.5 py-1 rounded-md shrink-0">
                  Sob consulta
                </span>
              </div>

              {/* Título & Descrição */}
              <div className="mt-4">
                <h3 className="text-[1.35rem] font-black text-slate-900 font-display leading-tight">
                  Plano Maestro Engenharia
                </h3>
                <span className="text-sm font-bold text-slate-700 block mt-0.5">(Completo)</span>
                <p className="text-slate-600 text-xs mt-2 min-h-[34px] leading-relaxed">
                  Engenharia dedicada com gestão completa de ativos.
                </p>
              </div>

              {/* Slogan / Chamada com ícone raio */}
              <div
                className="mt-4 p-3 rounded-xl border flex items-center gap-2.5"
                style={{
                  backgroundColor: 'rgba(243, 229, 245, 0.55)',
                  borderColor: 'rgba(123, 31, 162, 0.22)',
                }}
              >
                <Zap className="w-4 h-4 text-purple-600 shrink-0 fill-purple-500/20" />
                <span className="text-[11px] font-medium text-slate-700 leading-snug">
                  Onde o domínio do processo encontra a eficiência máxima.
                </span>
              </div>

              {/* Bloco de Preço com Gradiente Sólido Roxo */}
              <div
                className="mt-5 rounded-2xl p-4 text-white text-center relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #7B1FA2 0%, #4A148C 100%)',
                  boxShadow: '0 8px 20px -4px rgba(123, 31, 162, 0.35)',
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
                <span className="text-[11px] font-medium text-purple-100 uppercase tracking-wider block">
                  por R$
                </span>
                <div className="text-3xl sm:text-[2.1rem] font-black tracking-tight leading-none mt-1">
                  5.490,00
                  <span className="text-base sm:text-lg font-bold text-purple-100">/mês</span>
                </div>
                <span className="text-[11px] text-purple-100/90 block mt-1 font-mono">
                  por equipamento
                </span>
              </div>
            </div>

            {/* Corpo: Itens Inclusos */}
            <div className="p-7 sm:p-9 pt-2 flex-grow space-y-5 bg-white">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900 block pb-1 border-b border-purple-100">
                INCLUSO NO PACOTE:
              </span>

              <ul className="space-y-3.5 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 mt-0.5 text-white"
                    style={{ backgroundColor: '#7B1FA2' }}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <span className="font-semibold text-slate-900">
                    Tudo do Controle Operacional SIGA
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 mt-0.5 text-white"
                    style={{ backgroundColor: '#7B1FA2' }}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <span>Visita bimestral com engenheiro dedicado</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 mt-0.5 text-white"
                    style={{ backgroundColor: '#7B1FA2' }}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <span>Relatório executivo mensal (presencial)</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 mt-0.5 text-white"
                    style={{ backgroundColor: '#7B1FA2' }}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <span>KPI anual de reposição completo com desconto especial</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 mt-0.5 text-white"
                    style={{ backgroundColor: '#7B1FA2' }}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <span>Atendimento prioritário com dedicação integral</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 mt-0.5 text-white"
                    style={{ backgroundColor: '#7B1FA2' }}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <span>Coletórcio anual</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 mt-0.5 text-white"
                    style={{ backgroundColor: '#7B1FA2' }}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <span>Adesão mediante a disponibilidade de vagas do ciclo anual.</span>
                </li>
              </ul>

              {/* Bloco 2 Motivos de Adesão */}
              <div
                className="mt-6 p-4 rounded-xl border space-y-2 relative"
                style={{
                  backgroundColor: '#FAF5FC',
                  borderColor: 'rgba(123, 31, 162, 0.22)',
                }}
              >
                <div className="inline-block -mt-6">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white border"
                    style={{
                      borderColor: 'rgba(123, 31, 162, 0.3)',
                      color: '#7B1FA2',
                    }}
                  >
                    2 motivos de adesão
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Gestão técnica completa para proteger os ativos, acelerar decisões e garantir
                  confiabilidade e eficiência operacional.
                </p>
                <ul className="space-y-1 pl-3 text-xs text-slate-600 list-disc marker:text-purple-600">
                  <li>Maximização de resultados</li>
                  <li>Rastreabilidade total</li>
                </ul>
              </div>

              {/* Ideal para */}
              <div className="pt-2 text-center text-xs text-slate-600 italic">
                <span className="font-semibold not-italic text-purple-900">Ideal para:</span>{' '}
                prioridade máxima e terceirização avançada.
              </div>
            </div>

            {/* Botão CTA Roxo Sólido */}
            <div className="p-7 sm:p-9 pt-0 bg-white rounded-b-[20px]">
              <Button
                onClick={() => onSelectPlan('Plano Maestro Engenharia (Completo)')}
                className="w-full font-bold py-6 rounded-[12px] text-white text-sm transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #8E24AA 0%, #6A1B9A 100%)',
                  boxShadow: '0 10px 24px -8px rgba(123, 31, 162, 0.4)',
                }}
              >
                Solicitar Proposta
              </Button>
            </div>
          </div>
        </div>

        {/* Rodapé da seção */}
        <div className="mt-14 sm:mt-16 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <span>Todos os contratos possuem carência zero para o Diagnóstico Inicial.</span>
        </div>
      </div>
    </section>
  )
}
