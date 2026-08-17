import type { ServiceItem, PlanItem, CaseStudy, Testimonial, FaqItem } from '@/types'

export const COMPANY_INFO = {
  phoneLandline: '(19) 3901-2000',
  phoneWhatsapp: '(19) 99876-5432',
  whatsappRaw: '5519998765432',
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
    title: 'Calibração de Células de Carga',
    shortDesc:
      'Aferição rastreável Inmetro com pesos padrão certificados para balanças e dosadores industriais.',
    fullDesc: 'Serviço completo de calibração com pesos padrão rastreáveis ao Inmetro.',
    iconName: 'Scale',
    category: 'Calibração',
    deliverables: [
      'Certificado RBC rastreável',
      'Relatório de desvios e tendências',
      'Ajuste fino de sensibilidade',
      'Recomendação de recalibração',
    ],
    tags: ['Inmetro', 'RBC', 'Rastreável'],
  },
  {
    id: 'automacao',
    title: 'Programação CLP / IHM / SCADA',
    shortDesc:
      'Desenvolvimento e manutenção de programas de automação para CLPs, IHMs e sistemas SCADA.',
    fullDesc: 'Atuação completa em automação: CLPs, IHMs, SCADA e redes industriais.',
    iconName: 'Cpu',
    category: 'Automação',
    deliverables: [
      'Código fonte documentado',
      'Backup de programa aplicado',
      'Treinamento operacional on-site',
      'Suporte remoto pós-intervenção',
    ],
    tags: ['CLP', 'SCADA', 'IHM'],
  },
  {
    id: 'painel',
    title: 'Manutenção de Painéis Elétricos',
    shortDesc:
      'Diagnóstico e reparo de painéis de comando e força com técnicos certificados NR-10.',
    fullDesc: 'Manutenção preventiva e corretiva de painéis elétricos industriais.',
    iconName: 'Workflow',
    category: 'Elétrica',
    deliverables: [
      'Diagnóstico termográfico',
      'Substituição de componentes',
      'Relatório de conformidade NR-10',
      'Teste de isolamento e continuidade',
    ],
    tags: ['NR-10', 'Termografia', 'Painel'],
  },
  {
    id: 'preditivo',
    title: 'Sensoriamento Preditivo',
    shortDesc: 'Sensores IoT para monitoramento contínuo e detecção antecipada de falhas.',
    fullDesc: 'Sistema de sensoriamento preditivo com IoT industrial em tempo real.',
    iconName: 'Activity',
    category: 'IoT',
    deliverables: [
      'Instalação de sensores industriais',
      'Dashboard de monitoramento',
      'Alertas configuráveis por limite',
      'Relatório de tendências e anomalias',
    ],
    tags: ['IoT', 'Preditivo', 'Dashboard'],
  },
  {
    id: 'retrofit',
    title: 'Retrofit & Modernização',
    shortDesc: 'Modernização de equipamentos obsoletos preservando a mecânica existente.',
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
    responseSLA: 'Atendimento em até 8h úteis',
    features: [
      '2 visitas preventivas semestrais',
      'Calibração de até 10 pontos',
      'Relatório de saúde da planta',
      'Suporte remoto por telefone',
      '15% de desconto em avulsos',
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
    responseSLA: 'Atendimento em até 4h úteis',
    features: [
      '4 visitas preventivas trimestrais',
      'Calibração ilimitada',
      'Monitoramento preditivo IoT',
      'Dashboard SIGA em tempo real',
      'Suporte 24/7',
      '30% de desconto em avulsos',
    ],
    idealFor: 'Plantas com operação contínua e múltiplas linhas.',
    priceLabel: 'Sob consulta',
  },
  {
    id: 'maestro',
    name: 'Plano Maestro Engenharia',
    tagline: 'Engenharia dedicada com gestão completa de ativos.',
    responseSLA: 'Atendimento em até 2h úteis',
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
      'Pequenos desvios na calibração comprometem a qualidade do produto final, gerando retrabalho, desperdício e não conformidades em auditorias.',
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
    para: 'Contrato com SLA: técnico alocado e resposta de até 2h para emergências.',
  },
]

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'alimentos',
    client: 'Indústria de Alimentos Beta',
    segment: 'Alimentos & Bebidas',
    location: 'Campinas, SP',
    challenge:
      'Desvios recorrentes de pesagem em linha de dosação causavam reprovação de lotes e perdas de matéria-prima, com paradas não planejadas de até 6h por semana.',
    solution:
      'Calibração trimestral rastreável Inmetro, sensores preditivos nas células de carga e dashboard SIGA para monitoramento em tempo real.',
    results: [
      { label: 'Redução de paradas', value: '-87%' },
      { label: 'Lotes aprovados', value: '99.8%' },
      { label: 'ROI', value: '4 meses' },
    ],
    quote:
      'Depois da Condutiva, conseguimos prever falhas antes que aconteçam. O dashboard SIGA mudou nossa rotina de manutenção completamente.',
    author: 'Roberto Mendes',
    role: 'Gerente de Manutenção',
    image: 'https://img.usecurling.com/p/800/500?q=food%20processing%20factory&color=blue',
  },
  {
    id: 'mineracao',
    client: 'Mineração Delta Sul',
    segment: 'Mineração',
    location: 'Parauapebas, PA',
    challenge:
      'Painéis elétricos de britagem sofriam falhas termográficas frequentes, causando paradas com custo elevadíssimo por hora de interrupção.',
    solution:
      'Manutenção preventiva trimestral com termografia, retrofit de componentes obsoletos e treinamento da equipe para diagnóstico precoce.',
    results: [
      { label: 'Falhas elétricas', value: '-92%' },
      { label: 'Disponibilidade', value: '99.5%' },
      { label: 'Economia anual', value: 'R$ 1.2M' },
    ],
    quote:
      'A equipe da Condutiva conhece cada componente do nosso painel como ninguém. O suporte remoto resolve 80% dos chamados sem deslocamento.',
    author: 'Ana Paula Costa',
    role: 'Engenheira de Automação',
    image: 'https://img.usecurling.com/p/800/500?q=mining%20industrial%20plant&color=orange',
  },
  {
    id: 'farmaceutica',
    client: 'Pharma Alpha Indústria',
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
  'Redução imediata de paradas não planejadas com diagnóstico técnico gratuito',
  'Certificados de calibração rastreáveis Inmetro aceitos em auditorias ANVISA e FDA',
  'Atendimento emergencial com SLA contratual garantido em até 2h',
  'Dashboard SIGA com monitoramento em tempo real de equipamentos críticos',
  'Engenheiros próprios com DNA de fabricante, sem intermediários',
  'Documentação técnica centralizada e sempre disponível para auditorias',
  'Treinamento operacional incluso para sua equipe de chão de fábrica',
  'Cobertura técnica em mais de 20 estados brasileiros',
]

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Roberto Mendes',
    role: 'Gerente de Manutenção',
    company: 'Indústria de Alimentos Beta',
    segment: 'Alimentos',
    text: 'A Condutiva transformou nossa manutenção de reativa para preditiva. Reduzimos paradas em 87% em apenas 6 meses. O suporte remoto é impecável.',
    rating: 5,
    avatar: 'https://img.usecurling.com/ppl/medium?gender=male&seed=10',
  },
  {
    id: '2',
    name: 'Ana Paula Costa',
    role: 'Engenheira de Automação',
    company: 'Mineração Delta Sul',
    segment: 'Mineração',
    text: 'Equipe extremamente técnica. Resolveram um problema de painel elétrico que três empresas anteriores não conseguiram diagnosticar.',
    rating: 5,
    avatar: 'https://img.usecurling.com/ppl/medium?gender=female&seed=20',
  },
  {
    id: '3',
    name: 'Carlos Eduardo Lima',
    role: 'Diretor de Qualidade',
    company: 'Pharma Alpha Indústria',
    segment: 'Farmacêutica',
    text: 'A rastreabilidade e a documentação que a Condutiva fornece foram fundamentais para nossa certificação FDA. Profissionalismo do início ao fim.',
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
    question: 'Os certificados de calibração são aceitos em auditorias?',
    answer:
      'Sim. Todos os certificados são rastreáveis ao Inmetro e seguem padrões RBC. São aceitos em auditorias da ANVISA, FDA, ISO 9001 e demais normas.',
    category: 'Calibração',
  },
  {
    question: 'Vocês atendem fora do estado de São Paulo?',
    answer:
      'Sim. A Condutiva possui cobertura em mais de 20 estados, com equipes equipadas com pesos padrão certificados. Deslocamento gratuito para clientes com contrato ativo.',
    category: 'Cobertura',
  },
  {
    question: 'O que está incluso no dashboard SIGA?',
    answer:
      'Monitoramento em tempo real de células de carga, painéis elétricos e automação. Inclui alertas, relatórios de tendências, histórico de calibrações e documentação centralizada.',
    category: 'Tecnologia',
  },
  {
    question: 'Como funciona o retrofit de equipamentos antigos?',
    answer:
      'O retrofit moderniza a eletrônica e o controle preservando a estrutura mecânica. Reduz custo comparado à substituição total e integra tecnologia atual como IoT.',
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
