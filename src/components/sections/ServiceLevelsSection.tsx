import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

interface ServiceLevelsProps {
  onSelectPlan: (planName: string) => void
}

export function ServiceLevelsSection({ onSelectPlan }: ServiceLevelsProps) {
  return (
    <section
      id="planos"
      className="py-24 sm:py-28 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60 text-slate-900 relative overflow-hidden"
    >
      {/* Elementos sutis de fundo/textura para valorizar o card em destaque */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 38%, rgba(140, 198, 63, 0.16) 0%, transparent 60%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)',
          backgroundSize: '24px 24px',
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

        {/* TABELA COMPARATIVA ÚNICA (3 COLUNAS COM EFEITO DECOY NO MEIO) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-0 max-w-6xl mx-auto items-stretch pt-4">
          {/* COLUNA 1: Plano Sentinela Preventiva (Básico) */}
          <div className="group relative flex flex-col bg-white border border-slate-200/90 lg:border-r-0 lg:rounded-l-3xl rounded-3xl lg:rounded-r-none overflow-hidden transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-slate-300">
            {/* Bloco Superior: Cabeçalho do Plano */}
            <div className="p-6 sm:p-7 border-b border-slate-100 bg-slate-50/40">
              <div className="h-7 mb-2" /> {/* Espaçador alinhado com o badge do meio */}
              <h3 className="text-xl font-bold text-slate-800 font-display">
                Plano Sentinela Preventivo (Básico)
              </h3>
              <p className="text-slate-500 text-xs italic mt-2 min-h-[32px]">
                Manutenção preventiva com cobertura essencial.
              </p>
              {/* Preço */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-400 line-through block font-mono">
                  De: R$ 1.490,00
                </span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xs font-semibold text-slate-500">por R$</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    1.490,00
                  </span>
                  <span className="text-xs font-normal text-slate-500">/mês</span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-1 font-mono">
                  por equipamento
                </span>
              </div>
            </div>

            {/* Bloco Superior: Lista de Itens Inclusos */}
            <div className="p-6 sm:p-7 flex-grow space-y-4 bg-white">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block pb-1 border-b border-slate-100">
                INCLUSO NO PACOTE:
              </span>

              <ul className="space-y-3.5 text-xs text-slate-600">
                <li className="flex items-start gap-2.5">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-500 shrink-0 mt-0.5 group-hover:bg-slate-200/70 transition-colors">
                    <Check className="w-3.5 h-3.5 stroke-[2.2]" />
                  </span>
                  <div className="space-y-1.5">
                    <span className="font-semibold text-slate-800">
                      1 visita bimestral técnica com as seguintes entregas:
                    </span>
                    <ul className="space-y-1 pl-3 text-slate-500 text-[11px] list-disc marker:text-slate-400">
                      <li>Inspeção física do sensor e do seu ponto de montagem</li>
                      <li>Limpeza técnica</li>
                      <li>Teste funcional de conjunto (sensor + controle)</li>
                      <li>Registro de medição, análise de histórico desde a última visita</li>
                      <li>Entrega de parecer preventivo e relatório de condição do ativo.</li>
                    </ul>
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-500 shrink-0 mt-0.5 group-hover:bg-slate-200/70 transition-colors">
                    <Check className="w-3.5 h-3.5 stroke-[2.2]" />
                  </span>
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-800">
                      SIGO Básico para clientes com o CC5200
                    </span>
                    <div>
                      <ul className="space-y-1 pl-3 text-slate-500 text-[11px] list-disc marker:text-slate-400">
                        <li>Monitoramento no subsistema do CS200</li>
                        <li>Suporte remoto prioritário em horário comercial</li>
                      </ul>
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-500 shrink-0 mt-0.5 group-hover:bg-slate-200/70 transition-colors">
                    <Check className="w-3.5 h-3.5 stroke-[2.2]" />
                  </span>
                  <span className="text-slate-600">
                    Desconto por sensor: 10 / 15 / 20% (2/3/4+)
                  </span>
                </li>
              </ul>
            </div>

            {/* Bloco Inferior: "O retorno na prática" */}
            <div className="p-6 sm:p-7 border-t border-slate-100 bg-slate-50/70 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 underline underline-offset-4 decoration-slate-300">
                O retorno na prática
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Identificar desvios antes que se comprometam a medida e o retrabalho.
              </p>

              <ul className="space-y-1.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                  <span>Parada não planejada evitada</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                  <span>Vida útil do sensor preservada</span>
                </li>
              </ul>

              <div className="pt-2 text-[11px] text-slate-500 italic">
                Ideal para: início do monitoramento preventivo.
              </div>

              {/* Botão CTA Outline */}
              <div className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => onSelectPlan('Plano Sentinela Preventiva (Básico)')}
                  className="w-full font-bold py-5 rounded-xl border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-100/90 hover:border-slate-400 transition-all duration-200"
                >
                  Solicitar Proposta
                </Button>
              </div>
            </div>
          </div>

          {/* COLUNA 2: Plano Controle Operacional (Intermediário) — DESTAQUE MÁXIMO & ANCHOR DECOY */}
          <div className="group relative flex flex-col bg-white border-2 border-[#8CC63F] rounded-3xl shadow-2xl shadow-[#8CC63F]/25 lg:scale-[1.06] lg:-translate-y-3 z-20 overflow-hidden ring-2 ring-[#8CC63F]/50 hover:ring-[#8CC63F]/80 hover:border-[#7cb633] hover:shadow-2xl hover:shadow-[#8CC63F]/40 lg:hover:scale-[1.075] lg:hover:-translate-y-4 transition-all duration-300">
            {/* Efeito Glow / Shine decorativo suave no topo */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-36 bg-[#8CC63F]/20 rounded-full blur-2xl pointer-events-none" />

            {/* Badge de destaque centralizado no topo com pulso suave */}
            <div className="pt-3.5 pb-2 text-center relative z-10 bg-gradient-to-b from-[#8CC63F]/15 via-[#8CC63F]/5 to-transparent">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#8CC63F] text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-md shadow-[#8CC63F]/40 border border-[#8CC63F] animate-pulse">
                ★ O MAIS ESCOLHIDO
              </span>
            </div>

            {/* Bloco Superior: Cabeçalho do Plano */}
            <div className="px-7 py-6 sm:px-8 sm:py-7 border-b border-slate-200/80 bg-gradient-to-b from-[#8CC63F]/12 via-[#8CC63F]/5 to-white relative">
              <div className="flex items-center justify-between">
                <h3 className="text-xl sm:text-[1.35rem] font-black text-slate-900 font-display">
                  Plano Controle Operacional (Intermediário)
                </h3>
              </div>
              <p className="text-slate-600 text-xs italic mt-2 min-h-[32px] font-medium">
                O equilíbrio entre investimento e controle operacional.
              </p>

              {/* Preço com maior destaque visual */}
              <div className="mt-5 pt-4 border-t border-[#8CC63F]/25 bg-white/60 -mx-7 -mb-6 px-7 pb-6 sm:-mx-8 sm:-mb-7 sm:px-8 sm:pb-7">
                <span className="text-xs text-slate-400 line-through block font-mono">
                  De: R$ 2.890,00
                </span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xs font-bold text-slate-600">por R$</span>
                  <span className="text-3xl sm:text-[2.6rem] font-black text-[#4d7c0f] tracking-tight">
                    1.990,00
                  </span>
                  <span className="text-xs font-semibold text-slate-600">/mês</span>
                </div>
                <span className="text-[11px] font-semibold text-[#4d7c0f] block mt-1 font-mono">
                  por equipamento
                </span>
              </div>
            </div>

            {/* Bloco Superior: Lista de Itens Inclusos com espaçamento generoso */}
            <div className="p-7 sm:p-8 flex-grow space-y-4 bg-white">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#8CC63F]/30">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#4d7c0f]">
                  INCLUSO NO PACOTE:
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4d7c0f] bg-[#8CC63F]/15 px-2 py-0.5 rounded">
                  Melhor Custo-Benefício
                </span>
              </div>

              <ul className="space-y-3 text-xs text-slate-800">
                <li className="flex items-start gap-2.5">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#8CC63F] text-slate-950 shrink-0 mt-0.5 shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                  <span className="font-bold text-slate-900">Tudo do Sentinela Preventivo</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#8CC63F]/20 text-[#4d7c0f] shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <span>1 ânodo de sacrifício/anual</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#8CC63F]/20 text-[#4d7c0f] shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <span>
                    1 manutenção corretiva com troca de conectores e borracha de vedação com
                    garantia estendida
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#8CC63F]/20 text-[#4d7c0f] shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <span>Prioridade na agenda na atualização das evoluções de software</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#8CC63F]/20 text-[#4d7c0f] shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <span>SIGO Completo: causa raiz + análise de tendências</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#8CC63F]/20 text-[#4d7c0f] shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <span>A Academia Condutiva de Treinamento</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#8CC63F]/20 text-[#4d7c0f] shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <span>
                    Acesso restrito à documentação técnica na plataforma web, com login e senha
                    exclusivos
                  </span>
                </li>

                <li className="flex items-start gap-2.5 pt-2 pb-1.5 px-3 bg-[#8CC63F]/15 rounded-xl border border-[#8CC63F]/40 shadow-xs">
                  <span className="text-[#4d7c0f] font-black text-xs shrink-0 mt-0.5">★</span>
                  <span className="text-slate-800 text-[11px] leading-relaxed">
                    <strong className="text-[#4d7c0f]">BÔNUS:</strong> Você manda no calendário: se
                    a emergência aparece, adiante com a sua própria equipe na hora, dentro do plano
                  </span>
                </li>
              </ul>
            </div>

            {/* Bloco Inferior: "O retorno na prática" */}
            <div className="p-7 sm:p-8 border-t border-[#8CC63F]/30 bg-gradient-to-b from-[#8CC63F]/10 to-slate-50 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#4d7c0f] underline underline-offset-4 decoration-[#8CC63F]">
                O retorno na prática
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Além de prevenir falhas, entender por que elas acontecem, corrigir a origem do
                problema e manter seus sensores operando com desempenho estável ao longo do tempo.
              </p>

              <ul className="space-y-1.5 text-xs text-slate-900">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8CC63F] ring-2 ring-[#8CC63F]/30 shrink-0" />
                  <span className="font-semibold">Continuidade operacional protegida</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8CC63F] ring-2 ring-[#8CC63F]/30 shrink-0" />
                  <span className="font-semibold">Produção protegida</span>
                </li>
              </ul>

              <div className="pt-2 text-[11px] text-slate-700 font-semibold italic">
                Ideal para: múltiplos sensores e causa raiz recorrente.
              </div>

              {/* Botão CTA Principal Destaque (Verde Preenchido #8CC63F com Glow e Hover) */}
              <div className="pt-2">
                <Button
                  onClick={() => onSelectPlan('Plano Controle Operacional (Intermediário)')}
                  className="w-full font-black py-5 sm:py-6 rounded-xl bg-[#8CC63F] hover:bg-[#7cb633] text-slate-950 text-sm sm:text-base shadow-lg shadow-[#8CC63F]/40 hover:shadow-xl hover:shadow-[#8CC63F]/50 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  Solicitar Proposta
                </Button>
              </div>
            </div>
          </div>

          {/* COLUNA 3: Plano Maestro Engenharia (Completo) */}
          <div className="group relative flex flex-col bg-white border border-slate-200/90 lg:border-l-0 lg:rounded-r-3xl rounded-3xl lg:rounded-l-none overflow-hidden transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-slate-300">
            {/* Bloco Superior: Cabeçalho do Plano */}
            <div className="p-6 sm:p-7 border-b border-slate-100 bg-slate-50/40">
              <div className="h-7 mb-2" /> {/* Espaçador alinhado com o badge do meio */}
              <h3 className="text-xl font-bold text-slate-800 font-display">
                Plano Maestro Engenharia (Completo)
              </h3>
              <p className="text-slate-500 text-xs italic mt-2 min-h-[32px]">
                Engenharia dedicada com gestão completa de ativos.
              </p>
              {/* Preço */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-400 line-through block font-mono">
                  De: R$ 6.900,00
                </span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xs font-semibold text-slate-500">por R$</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    5.490,00
                  </span>
                  <span className="text-xs font-normal text-slate-500">/mês</span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-1 font-mono">
                  por equipamento
                </span>
              </div>
            </div>

            {/* Bloco Superior: Lista de Itens Inclusos */}
            <div className="p-6 sm:p-7 flex-grow space-y-4 bg-white">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block pb-1 border-b border-slate-100">
                INCLUSO NO PACOTE:
              </span>

              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2.5">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-500 shrink-0 mt-0.5 group-hover:bg-slate-200/70 transition-colors">
                    <Check className="w-3.5 h-3.5 stroke-[2.2]" />
                  </span>
                  <span className="font-semibold text-slate-800">Tudo do Controle Operacional</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-500 shrink-0 mt-0.5 group-hover:bg-slate-200/70 transition-colors">
                    <Check className="w-3.5 h-3.5 stroke-[2.2]" />
                  </span>
                  <span>1 Visita bimestral com engenheiro dedicado</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-500 shrink-0 mt-0.5 group-hover:bg-slate-200/70 transition-colors">
                    <Check className="w-3.5 h-3.5 stroke-[2.2]" />
                  </span>
                  <span>Relatório executivo mensal presencial</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-500 shrink-0 mt-0.5 group-hover:bg-slate-200/70 transition-colors">
                    <Check className="w-3.5 h-3.5 stroke-[2.2]" />
                  </span>
                  <span>Kit anual de reposição completo com desconto especial</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-500 shrink-0 mt-0.5 group-hover:bg-slate-200/70 transition-colors">
                    <Check className="w-3.5 h-3.5 stroke-[2.2]" />
                  </span>
                  <span>Atendimento prioritário com dedicação integral</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-500 shrink-0 mt-0.5 group-hover:bg-slate-200/70 transition-colors">
                    <Check className="w-3.5 h-3.5 stroke-[2.2]" />
                  </span>
                  <span>Contrato anual</span>
                </li>

                <li className="pt-2 text-[11px] text-slate-500 italic">
                  Adesão mediante a disponibilidade de vagas do ciclo anual
                </li>
              </ul>
            </div>

            {/* Bloco Inferior: "O retorno na prática" */}
            <div className="p-6 sm:p-7 border-t border-slate-100 bg-slate-50/70 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 underline underline-offset-4 decoration-slate-300">
                O retorno na prática
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gestão técnica completa para proteger os ativos, acelerar decisões e garantir
                confiabilidade e eficácia operacional.
              </p>

              <ul className="space-y-1.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                  <span>Maximização de resultados</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                  <span>Rastreabilidade total</span>
                </li>
              </ul>

              <div className="pt-2 text-[11px] text-slate-500 italic">
                Ideal para: prioridade máxima e contrato anual.
              </div>

              {/* Botão CTA Outline */}
              <div className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => onSelectPlan('Plano Maestro Engenharia (Completo)')}
                  className="w-full font-bold py-5 rounded-xl border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-100/90 hover:border-slate-400 transition-all duration-200"
                >
                  Solicitar Proposta
                </Button>
              </div>
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
