import type { ServiceItem, PlanItem, CaseStudy, Testimonial, FaqItem } from '@/types'
import combineHarvesterImg from '@/assets/image-d9327.png'
import amaggiCottonImg from '@/assets/image-730db.png'

export const COMPANY_INFO = {
  phoneLandline: '(19) 3032-1751',
  phoneWhatsapp: '(19) 99341-3270',
  whatsappRaw: '5519993413270',
  email: 'servicos@condutiva.com.br',
  address: 'Rua Condutiva, 500 - Distrito Industrial - Campinas/SP',
  experienceYears: 20,
  clientCount: 500,
  statesCovered: 20,
}

export const SECTORS = [
  { id: '1', name: 'Alimentos & Bebidas', icon: 'Utensils' },
  { id: '2', name: 'Agronegócio', icon: 'Wheat' },
  { id: '3', name: 'Carnes & Frigoríficos', icon: 'Beef' },
  { id: '4', name: 'Mineração', icon: 'Pickaxe' },
  { id: '5', name: 'Química & Farmacêutica', icon: 'FlaskConical' },
  { id: '6', name: 'Papel & Celulose', icon: 'FileText' },
  { id: '7', name: 'Construção', icon: 'Building2' },
  { id: '8', name: 'Energia', icon: 'Zap' },
]

export const SERVICES: ServiceItem[] = [
  {
    id: 'calibracao',
    title: 'Calibração de Sensores',
    shortDesc: 'Aferição rastreável com laudos e relatórios para balanças e dosadores industriais.',
    fullDesc: 'Serviço completo de calibração com laudos rastreáveis e relatórios de conformidade.',
    iconName: 'Scale',
    category: 'Calibração',
    deliverables: [
      'Laudos rastreáveis',
      'Relatório de desvios e tendências',
      'Ajuste de parâmetros e configurações',
      'Recomendação de recalibração',
    ],
    tags: ['Calibração', 'Laudos', 'Rastreável'],
  },
  {
    id: 'automacao',
    title: 'Programação CLP / IHM / SIGA / SICO',
    shortDesc:
      'Desenvolvimento e manutenção de programas de automação para CLPs, IHMs e sistemas de gestão com relatórios em nuvem.',
    fullDesc: 'Atuação completa em automação: CLPs, IHMs, Gestão e redes industriais.',
    iconName: 'Cpu',
    category: 'Automação',
    deliverables: [
      'Configuração e testes remotos.',
      'Sistema Integrado de Gestão',
      'Treinamento operacional on-site',
      'Suporte remoto pós-intervenção',
    ],
    tags: ['CLP', 'Gestão', 'IHM'],
  },
  {
    id: 'painel',
    title: 'Manutenção Preventiva',
    shortDesc: 'Diagnóstico e plano de reparo de painéis elétricos e equipamentos Condutiva',
    fullDesc: 'Manutenção preventiva e corretiva de painéis elétricos industriais.',
    iconName: 'Workflow',
    category: 'Manutenção',
    deliverables: [
      'Análise de causa raiz e diagnóstico.',
      'Plano de substituição de componentes e upgrade de versões de software.',
      'Relatório de conformidade.',
      'Teste de isolamento e continuidade',
    ],
    tags: ['Preventiva', 'Painéis', 'Corretiva'],
  },
  {
    id: 'preditivo',
    title: 'Suporte Técnico Remoto Prioritário',
    shortDesc: 'Canal dedicado de atendimento (linha direta / WhatsApp técnico)',
    fullDesc: 'Canal dedicado de suporte remoto com acesso a especialistas e base de conhecimento.',
    iconName: 'Activity',
    category: 'Suporte',
    deliverables: [
      'Base de conhecimento e documentação técnica',
      'Acesso a especialistas do time de Desenvolvimento',
      'Suporte remoto com resposta em prioritária definido em SLA',
      'Relatório de chamados e resolutividade',
    ],
    tags: ['Suporte', 'Remoto', 'SLA'],
  },
  {
    id: 'retrofit',
    title: 'Retrofit & Modernização',
    shortDesc: 'Modernização de equipamentos descontinuados preservando a mecânica existente.',
    fullDesc: 'Retrofit industrial que moderniza controle e instrumentação.',
    iconName: 'RefreshCw',
    category: 'Modernização',
    deliverables: [
      'Levantamento técnico do equipamento',
      'Projeto de modernização',
      'Integração com sistema existente',
      'Garantia de 12 meses',
    ],
    tags: ['Retrofit', 'Modernização', 'Upgrade'],
  },
  {
    id: 'treinamento',
    title: 'Treinamentos Operacionais',
    shortDesc: 'Capacitação de operadores e técnicos para uso eficiente dos sistemas Condutiva.',
    fullDesc: 'Treinamento customizado para operadores e técnicos de manutenção.',
    iconName: 'GraduationCap',
    category: 'Capacitação',
    deliverables: [
      'Material didático personalizado',
      'Treinamento prático no chão de fábrica',
      'Avaliação de aprendizagem',
      'Certificado de conclusão',
    ],
    tags: ['Treinamento', 'Capacitação', 'NR-10'],
  },
]

export const PLANS: PlanItem[] = [
  {
    id: 'sentinela',
    name: 'Plano Sentinela Preventivo',
    tagline: 'Manutenção preventiva programada com cobertura essencial.',
    responseSLA: 'Opere com previsibilidade sobre seus ativos.',
    features: [
      'Calibração remota programada (semestral)',
      'Suporte remoto com canal prioritário',
      'Preventiva + 2 health-check presencial / ano',
      '2 visitas presenciais de corretiva / ano',
      'Relatório de saúde da planta',
      'Valores sob consulta para pedidos avulsos',
    ],
    idealFor: 'Plantas com até 10 equipamentos críticos.',
    priceLabel: 'Sob consulta',
  },
  {
    id: 'controle-total',
    name: 'Plano Controle Total SIGA',
    tagline: 'Gestão integrada com monitoramento preditivo e SLA prioritário.',
    recommended: true,
    badge: 'Mais Escolhido',
    responseSLA: 'O equilíbrio entre investimento e controle total.',
    features: [
      '4 visitas preventivas trimestrais',
      'Calibração ilimitada',
      'Monitoramento remoto com dashboards',
      'Dashboards SIGA e SICO com acesso remoto',
      'Suporte 24/7',
      'Valores sob consulta para pedidos avulsos',
    ],
    idealFor: 'Plantas com operação contínua e múltiplas linhas.',
    priceLabel: 'Sob consulta',
  },
  {
    id: 'maestro',
    name: 'Plano Maestro Engenharia',
    tagline: 'Engenharia dedicada com gestão completa de ativos.',
    responseSLA: 'Onde o domínio do processo encontra a eficiência máxima.',
    features: [
      'Visitas mensais programadas',
      'Engenheiro dedicado',
      'Calibração e manutenção ilimitadas',
      'Gestão completa de ativos',
      'Treinamentos inclusos',
      'Prioridade absoluta',
    ],
    idealFor: 'Grandes plantas com automação 24/7.',
    priceLabel: 'Sob consulta',
  },
]

export const PAIN_POINTS = [
  {
    title: 'Paradas Não Planejadas',
    description:
      'Falhas súbitas em sensores, painéis elétricos ou CLPs interrompem a produção sem aviso, gerando perdas significativas de receita e atrasos no cronograma de entrega.',
    impact: 'Alto custo médio por hora de linha parada.',
  },
  {
    title: 'Desvios de Calibração Silenciosos',
    description:
      'Pequenos desvios na calibração comprometem a tomada de decisão durante o processo, gerando retrabalho, desperdício e não conformidades em auditorias.',
    impact: 'Perdas por erro de leitura e dosagem.',
  },
  {
    title: 'Tempo de Resposta Lento',
    description:
      'Sem contrato de SLA, o agendamento de técnicos para manutenção corretiva pode levar dias, prolongando a parada e multiplicando o impacto financeiro da falha.',
    impact: 'Espera média de até 48h úteis por atendimento técnico presencial.',
  },
  {
    title: 'Documentação Técnica Fragmentada',
    description:
      'Laudos, certificados e esquemas elétricos espalhados em pastas e e-mails dificultam auditorias, troubleshooting e o planejamento de manutenções preventivas.',
    impact: 'Risco de não conformidade em auditorias.',
  },
]

export const TRANSFORMATION = [
  {
    topic: 'Manutenção',
    de: 'Reativa: equipe apagando incêndios após a falha ocorrer, com paradas longas e imprevisíveis.',
    para: 'Preditiva: monitoramento contínuo identifica tendências de falha antes que aconteçam.',
  },
  {
    topic: 'Calibração',
    de: 'Eventual: calibração apenas quando há suspeita de erro ou demanda de auditoria.',
    para: 'Programada: cronograma rastreável com emissão de relatórios e laudos.',
  },
  {
    topic: 'Documentação',
    de: 'Fragmentada: laudos e esquemas espalhados em e-mails e planilhas difíceis de localizar.',
    para: 'Centralizada: dashboard SIGA com todo o histórico técnico em um só lugar.',
  },
  {
    topic: 'Atendimento',
    de: 'Sem SLA: aguardar dias por um técnico disponível, com custo de chamado avulso.',
    para: 'Contrato com SLA: técnico alocado e resposta acelerada para emergências.',
  },
]

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'alimentos',
    client: 'Grão Futura Armazéns',
    segment: 'Armazéns e Grãos',
    location: 'Três Corações, MG',
    challenge:
      'A falta de visibilidade da umidade e a baixa familiaridade com o sistema de relatórios impedem decisões precisas na secagem, mantendo a fornalha ativa por mais tempo e desperdiçando energia.',
    solution:
      'Atendimento remoto com o encarregado do armazém, treinamento operacional e calibrações presenciais programadas',
    results: [
      { label: 'Redução de paradas', value: '-87%' },
      { label: 'Lotes aprovados', value: '99.8%' },
      { label: 'ROI', value: '4 meses' },
    ],
    quote:
      'Com esses dados e com os relatórios do SIGA, controlo melhor o secador e economizo energia direta. Além disso, a solução tem potencial para operar sozinha, liberando o operador para tarefas de maior valor.',
    author: 'Paulo Sérgio',
    role: 'Proprietário',
    image: combineHarvesterImg,
  },
  {
    id: 'mineracao',
    client: 'Amaggi',
    segment: 'Algodoeira',
    location: 'Sapezal - MT',
    challenge:
      'A operação manual era imprecisa, demandava acompanhamento constante e comprometia a estabilidade do processo',
    solution:
      'Suporte presencial no ajuste do controle de umidade através do sensor com válvula proporcional',
    results: [
      { label: 'Falhas elétricas', value: '-92%' },
      { label: 'Disponibilidade', value: '99.5%' },
      { label: 'Economia anual', value: 'R$ 1.2M' },
    ],
    quote:
      'O sensor da Condutiva melhorou nosso processo com precisão e automação. O atendimento e o suporte presencial fizeram toda a diferença.',
    author: 'Sr Isaías',
    role: 'Encarregado Operação',
    image: amaggiCottonImg,
  },
  {
    id: 'farmaceutica',
    client: 'Fazenda Alta Vista',
    segment: 'Química & Farmacêutica',
    location: 'São Paulo, SP',
    challenge:
      'Necessidade de rastreabilidade total de calibração para ANVISA e FDA, com documentação manual dispersa e propensa a erros.',
    solution:
      'Plano Controle Total SIGA com calibração rastreável RBC, documentação centralizada e relatórios automáticos para auditoria.',
    results: [
      { label: 'Auditorias', value: '100%' },
      { label: 'Tempo auditoria', value: '-60%' },
      { label: 'Não conformid.', value: '0' },
    ],
    quote:
      'A rastreabilidade que a Condutiva trouxe foi decisiva para nossa certificação FDA. Tudo documentado, tudo auditável.',
    author: 'Carlos Eduardo Lima',
    role: 'Diretor de Qualidade',
    image: 'https://img.usecurling.com/p/800/500?q=pharmaceutical%20manufacturing&color=green',
  },
]

export const PRACTICAL_BENEFITS: string[] = [
  'Redução imediata de paradas não planejadas com diagnóstico técnico e resolução de problemas.',
  'Laudos de calibração rastreáveis e relatórios de conformidade',
  'Atendimento emergencial com SLA contratual.',
  'Dashboard SIGA e SICO com dados em nuvem e acesso remoto via internet',
  'Engenheiros e Técnicos especializados com DNA de fabricante',
  'Documentação técnica centralizada e sempre disponível para auditorias',
  'Treinamento operacional incluso para sua equipe de chão de fábrica',
  'Cobertura técnica em mais de 20 estados brasileiros',
]

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Paulo Sérgio',
    role: 'Proprietário',
    company: 'Grão Futura Armazéns',
    segment: 'Armazéns e Grãos',
    text: 'A Condutiva nos ajudou a entender melhor os relatórios do SIGA e a economizar energia na secagem. O suporte remoto é impecável.',
    rating: 5,
    avatar: 'https://img.usecurling.com/ppl/medium?gender=male&seed=10',
  },
  {
    id: '2',
    name: 'Sr Isaías',
    role: 'Encarregado Operação',
    company: 'Amaggi',
    segment: 'Algodoeira',
    text: 'O sensor da Condutiva melhorou nosso processo com precisão e automação. O atendimento e o suporte presencial fizeram toda a diferença.',
    rating: 5,
    avatar: 'https://img.usecurling.com/ppl/medium?gender=male&seed=20',
  },
  {
    id: '3',
    name: 'Carlos Eduardo Lima',
    role: 'Gerente de Produção',
    company: 'Fazenda Alta Vista',
    segment: 'Agronegócio',
    text: 'A rastreabilidade e a documentação que a Condutiva fornece foram fundamentais para a nossa operação no campo. Profissionalismo do início ao fim.',
    rating: 5,
    avatar: 'https://img.usecurling.com/ppl/medium?gender=male&seed=30',
  },
]

export const FAQS: FaqItem[] = [
  {
    question: 'O diagnóstico gratuito realmente não tem custo nenhum?',
    answer:
      'Sim. O diagnóstico técnico é 100% gratuito e sem compromisso. Nossos engenheiros avaliam sua planta, identificam pontos críticos e entregam um laudo. Se optar por não contratar, o relatório continua sendo seu.',
    category: 'Diagnóstico',
  },
  {
    question: 'Qual é o prazo de atendimento para emergências?',
    answer:
      'Para clientes com contrato de SLA, o atendimento varia de 2h a 8h úteis conforme o plano. O plano Maestro oferece prioridade absoluta com resposta em até 2h.',
    category: 'SLA',
  },
  {
    question: 'Os laudos de calibração são aceitos em auditorias?',
    answer:
      'Sim. Emitimos laudos rastreáveis e relatórios de conformidade aceitos em auditorias da ISO 9001 e demais normas de qualidade.',
    category: 'Calibração',
  },
  {
    question: 'Vocês atendem fora do estado de São Paulo?',
    answer:
      'Sim. A Condutiva possui cobertura em mais de 20 estados, com equipes técnicas equipadas para atendimento presencial. Deslocamento gratuito para clientes com contrato ativo.',
    category: 'Cobertura',
  },
  {
    question: 'O que está incluso no dashboard SIGA?',
    answer:
      'Monitoramento em tempo real de equipamentos e sistemas de automação. Inclui alertas, relatórios de tendências, histórico de calibrações e documentação centralizada.',
    category: 'Tecnologia',
  },
  {
    question: 'Como funciona o retrofit de equipamentos antigos?',
    answer:
      'O retrofit moderniza a eletrônica e o controle preservando a estrutura mecânica. Reduz custo comparado à substituição total e integra tecnologia atual de automação.',
    category: 'Modernização',
  },
  {
    question: 'Vocês oferecem treinamento para nossa equipe?',
    answer:
      'Sim. Treinamentos personalizados no chão de fábrica com material didático próprio, cobrindo operação, manutenção preventiva e diagnóstico de falhas.',
    category: 'Capacitação',
  },
  {
    question: 'Qual é a duração típica de uma visita de calibração?',
    answer:
      'Varia conforme o número de pontos. Para 5 a 10 balanças, a calibração leva de 4 a 8 horas. Visitas trimestrais do plano SIGA costumam ser concluídas em um dia.',
    category: 'Calibração',
  },
]
