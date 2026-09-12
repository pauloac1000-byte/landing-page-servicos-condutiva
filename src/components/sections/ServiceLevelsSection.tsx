import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

interface ServiceLevelsProps {
  onSelectPlan: (planName: string) => void
}

export function ServiceLevelsSection({ onSelectPlan }: ServiceLevelsProps) {
  return (
    <section id="planos" className="py-20 bg-slate-950 text-white relative">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Cabeçalho da seção */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#8CC63F] bg-[#8CC63F]/10 px-3 py-1 rounded-full border border-[#8CC63F]/30">
            NÍVEIS DE SERVIÇO (SLA) &amp; CONTRATOS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
            Planos de manutenção e calibração dimensionados para a sua demanda.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Elimine a incerteza de chamados avulsos e tenha prioridade absoluta de atendimento
            presencial em campo.
          </p>
        </div>

        {/* TABELA COMPARATIVA ÚNICA (3 COLUNAS) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-0 max-w-6xl mx-auto items-stretch">
          {/* COLUNA 1: Plano Sentinela Preventiva (Básico) */}
          <div className="flex flex-col bg-slate-900 border border-slate-800 lg:border-r-0 lg:rounded-l-2xl rounded-2xl lg:rounded-r-none overflow-hidden transition-all duration-300">
            {/* Bloco Superior: Cabeçalho do Plano */}
            <div className="p-6 sm:p-7 border-b border-slate-800 bg-slate-900/90">
              <div className="h-6 mb-2" /> {/* Espaçador alinhado com o badge da coluna 2 */}
              <h3 className="text-xl font-bold text-white font-display">
                Plano Sentinela Preventiva (Básico)
              </h3>
              <p className="text-slate-400 text-xs italic mt-2 min-h-[32px]">
                Manutenção preventiva com cobertura essencial.
              </p>
              {/* Preço */}
              <div className="mt-5 pt-4 border-t border-slate-800/80">
                <span className="text-xs text-slate-500 line-through block font-mono">
                  De: R$ 1.490,00
                </span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xs font-semibold text-slate-400">por R$</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    1.490,00
                  </span>
                  <span className="text-xs font-normal text-slate-400">/mês</span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-1 font-mono">
                  por equipamento
                </span>
              </div>
            </div>

            {/* Bloco Superior: Lista de Itens Inclusos */}
            <div className="p-6 sm:p-7 flex-grow space-y-4 bg-slate-900/50">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block pb-1 border-b border-slate-800/60">
                INCLUSO NO PACOTE:
              </span>

              <ul className="space-y-3.5 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div className="space-y-1.5">
                    <span className="font-semibold text-slate-200">
                      1 visita bimestral técnica com as seguintes entregas:
                    </span>
                    <ul className="space-y-1 pl-3 text-slate-400 text-[11px] list-disc marker:text-slate-600">
                      <li>Inspeção física do sensor e do seu ponto de montagem</li>
                      <li>Limpeza técnica</li>
                      <li>Teste funcional de conjunto (sensor + controle)</li>
                      <li>Registro de medição, análise de histórico desde a última visita</li>
                      <li>Entrega de parecer preventivo e relatório de condição do ativo.</li>
                    </ul>
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-200">
                      SIGO Básico para clientes com o CC5200
                    </span>
                    <div>
                      <ul className="space-y-1 pl-3 text-slate-400 text-[11px] list-disc marker:text-slate-600">
                        <li>Monitoramento no subsistema do CS200</li>
                        <li>Suporte remoto prioritário em horário comercial</li>
                      </ul>
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300">
                    Desconto por sensor: 10 / 15 / 20% (2/3/4+)
                  </span>
                </li>
              </ul>
            </div>

            {/* Bloco Inferior: "O retorno na prática" */}
            <div className="p-6 sm:p-7 border-t border-slate-800 bg-slate-950/70 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 underline underline-offset-4 decoration-slate-600">
                O retorno na prática
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Identificar desvios antes que se comprometam a medida e o retrabalho.
              </p>

              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
                  <span>Parada não planejada evitada</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
                  <span>Vida útil do sensor preservada</span>
                </li>
              </ul>

              <div className="pt-2 text-[11px] text-slate-400 italic">
                Ideal para: início do monitoramento preventivo.
              </div>

              {/* Botão CTA */}
              <div className="pt-2">
                <Button
                  onClick={() => onSelectPlan('Plano Sentinela Preventiva (Básico)')}
                  className="w-full font-bold py-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all duration-200"
                >
                  Solicitar Proposta
                </Button>
              </div>
            </div>
          </div>

          {/* COLUNA 2: Plano Controle Operacional (Intermediário) — DESTAQUE MÁXIMO */}
          <div className="relative flex flex-col bg-slate-900 border-2 border-[#8CC63F] rounded-2xl shadow-2xl shadow-[#8CC63F]/20 lg:scale-[1.03] z-10 overflow-hidden ring-1 ring-[#8CC63F]/30">
            {/* Badge PLANO RECOMENDADO */}
            <div className="bg-[#8CC63F] text-slate-950 font-black text-[11px] uppercase tracking-wider py-1.5 text-center shadow-md">
              ★ PLANO RECOMENDADO
            </div>

            {/* Bloco Superior: Cabeçalho do Plano */}
            <div className="p-6 sm:p-7 border-b border-slate-800 bg-slate-900/95 relative">
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#8CC63F]/10 to-transparent pointer-events-none" />
              <h3 className="text-xl font-extrabold text-white font-display flex items-center justify-between relative">
                <span>Plano Controle Operacional (Intermediário)</span>
              </h3>
              <p className="text-slate-300 text-xs italic mt-2 min-h-[32px] relative">
                O equilíbrio entre investimento e controle operacional.
              </p>

              {/* Preço */}
              <div className="mt-5 pt-4 border-t border-slate-800/90 relative">
                <span className="text-xs text-slate-500 line-through block font-mono">
                  De: R$ 2.890,00
                </span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xs font-semibold text-slate-300">por R$</span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#8CC63F] tracking-tight">
                    1.990,00
                  </span>
                  <span className="text-xs font-normal text-slate-300">/mês</span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-1 font-mono">
                  por equipamento
                </span>
              </div>
            </div>

            {/* Bloco Superior: Lista de Itens Inclusos */}
            <div className="p-6 sm:p-7 flex-grow space-y-4 bg-slate-900/70">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8CC63F] block pb-1 border-b border-slate-800">
                INCLUSO NO PACOTE:
              </span>

              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#8CC63F] shrink-0 mt-0.5 font-bold" />
                  <span className="font-semibold text-white">Tudo do Sentinela Preventivo</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#8CC63F] shrink-0 mt-0.5" />
                  <span>1 ânodo de sacrifício/anual</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#8CC63F] shrink-0 mt-0.5" />
                  <span>
                    1 manutenção corretiva com troca de conectores e borracha de vedação com
                    garantia estendida
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#8CC63F] shrink-0 mt-0.5" />
                  <span>Prioridade na agenda na atualização das evoluções de software</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#8CC63F] shrink-0 mt-0.5" />
                  <span>SIGO Completo: causa raiz + análise de tendências</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#8CC63F] shrink-0 mt-0.5" />
                  <span>A Academia Condutiva de Treinamento</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#8CC63F] shrink-0 mt-0.5" />
                  <span>
                    Acesso restrito à documentação técnica na plataforma web, com login e senha
                    exclusivos
                  </span>
                </li>

                <li className="flex items-start gap-2.5 pt-1.5 pb-1 px-2.5 bg-[#8CC63F]/10 rounded-lg border border-[#8CC63F]/25">
                  <span className="text-[#8CC63F] font-bold text-xs shrink-0 mt-0.5">★</span>
                  <span className="text-slate-200 text-[11px] leading-relaxed">
                    <strong className="text-[#8CC63F]">BÔNUS:</strong> Você manda no calendário: se
                    a emergência aparece, adiante com a sua própria equipe na hora, dentro do plano
                  </span>
                </li>
              </ul>
            </div>

            {/* Bloco Inferior: "O retorno na prática" */}
            <div className="p-6 sm:p-7 border-t border-slate-800 bg-slate-950/80 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8CC63F] underline underline-offset-4 decoration-[#8CC63F]/50">
                O retorno na prática
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Além de prevenir falhas, entender por que elas acontecem, corrigir a origem do
                problema e manter seus sensores operando com desempenho estável ao longo do tempo.
              </p>

              <ul className="space-y-1.5 text-xs text-white">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8CC63F] shrink-0" />
                  <span className="font-medium">Continuidade operacional protegida</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8CC63F] shrink-0" />
                  <span className="font-medium">Produção protegida</span>
                </li>
              </ul>

              <div className="pt-2 text-[11px] text-slate-300 italic">
                Ideal para: múltiplos sensores e causa raiz recorrente.
              </div>

              {/* Botão CTA Destaque */}
              <div className="pt-2">
                <Button
                  onClick={() => onSelectPlan('Plano Controle Operacional (Intermediário)')}
                  className="w-full font-extrabold py-5 rounded-xl bg-[#8CC63F] hover:bg-[#7cb633] text-slate-950 shadow-lg shadow-[#8CC63F]/30 transition-all duration-200"
                >
                  Solicitar Proposta
                </Button>
              </div>
            </div>
          </div>

          {/* COLUNA 3: Plano Maestro Engenharia (Completo) */}
          <div className="flex flex-col bg-slate-900 border border-slate-800 lg:border-l-0 lg:rounded-r-2xl rounded-2xl lg:rounded-l-none overflow-hidden transition-all duration-300">
            {/* Bloco Superior: Cabeçalho do Plano */}
            <div className="p-6 sm:p-7 border-b border-slate-800 bg-slate-900/90">
              <div className="h-6 mb-2" /> {/* Espaçador alinhado com o badge da coluna 2 */}
              <h3 className="text-xl font-bold text-white font-display">
                Plano Maestro Engenharia (Completo)
              </h3>
              <p className="text-slate-400 text-xs italic mt-2 min-h-[32px]">
                Engenharia dedicada com gestão completa de ativos.
              </p>
              {/* Preço */}
              <div className="mt-5 pt-4 border-t border-slate-800/80">
                <span className="text-xs text-slate-500 line-through block font-mono">
                  De: R$ 6.900,00
                </span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xs font-semibold text-slate-400">por R$</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    5.490,00
                  </span>
                  <span className="text-xs font-normal text-slate-400">/mês</span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-1 font-mono">
                  por equipamento
                </span>
              </div>
            </div>

            {/* Bloco Superior: Lista de Itens Inclusos */}
            <div className="p-6 sm:p-7 flex-grow space-y-4 bg-slate-900/50">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block pb-1 border-b border-slate-800/60">
                INCLUSO NO PACOTE:
              </span>

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-slate-400 shrink-0 mt-0.5 font-semibold" />
                  <span className="font-semibold text-slate-200">Tudo do Controle Operacional</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>1 Visita bimestral com engenheiro dedicado</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>Relatório executivo mensal presencial</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>Kit anual de reposição completo com desconto especial</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>Atendimento prioritário com dedicação integral</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>Contrato anual</span>
                </li>

                <li className="pt-2 text-[11px] text-slate-400 italic">
                  Adesão mediante a disponibilidade de vagas do ciclo anual
                </li>
              </ul>
            </div>

            {/* Bloco Inferior: "O retorno na prática" */}
            <div className="p-6 sm:p-7 border-t border-slate-800 bg-slate-950/70 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 underline underline-offset-4 decoration-slate-600">
                O retorno na prática
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gestão técnica completa para proteger os ativos, acelerar decisões e garantir
                confiabilidade e eficácia operacional.
              </p>

              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
                  <span>Maximização de resultados</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
                  <span>Rastreabilidade total</span>
                </li>
              </ul>

              <div className="pt-2 text-[11px] text-slate-400 italic">
                Ideal para: prioridade máxima e contrato anual.
              </div>

              {/* Botão CTA */}
              <div className="pt-2">
                <Button
                  onClick={() => onSelectPlan('Plano Maestro Engenharia (Completo)')}
                  className="w-full font-bold py-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all duration-200"
                >
                  Solicitar Proposta
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé da seção */}
        <div className="mt-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <span>Todos os contratos possuem carência zero para o Diagnóstico Inicial.</span>
        </div>
      </div>
    </section>
  )
}
