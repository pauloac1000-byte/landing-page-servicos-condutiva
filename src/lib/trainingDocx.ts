import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
  Header,
  Footer,
  PageNumber,
} from 'docx'

export async function generateTrainingDocx(): Promise<Blob> {
  const primaryGreen = '8CC63F'
  const darkGreen = '4D7C0F'
  const slate900 = '0F172A'
  const slate700 = '334155'
  const slate600 = '475569'
  const bgLight = 'F8FAFC'
  const borderColor = 'CBD5E1'

  const createHeading1 = (text: string) => {
    return new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 150 },
      children: [
        new TextRun({
          text,
          bold: true,
          size: 28, // 14pt
          color: darkGreen,
          font: 'Arial',
        }),
      ],
      border: {
        bottom: {
          color: primaryGreen,
          space: 4,
          style: BorderStyle.SINGLE,
          size: 12,
        },
      },
    })
  }

  const createHeading2 = (text: string) => {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 250, after: 100 },
      children: [
        new TextRun({
          text,
          bold: true,
          size: 24, // 12pt
          color: slate900,
          font: 'Arial',
        }),
      ],
    })
  }

  const createParagraph = (text: string, boldPrefix?: string) => {
    const children: TextRun[] = []
    if (boldPrefix) {
      children.push(
        new TextRun({
          text: boldPrefix + ' ',
          bold: true,
          color: slate900,
          size: 20, // 10pt
          font: 'Arial',
        }),
      )
    }
    children.push(
      new TextRun({
        text,
        color: slate700,
        size: 20, // 10pt
        font: 'Arial',
      }),
    )

    return new Paragraph({
      spacing: { before: 60, after: 60, line: 276 },
      children,
    })
  }

  const createBullet = (text: string, boldPrefix?: string) => {
    const children: TextRun[] = []
    if (boldPrefix) {
      children.push(
        new TextRun({
          text: boldPrefix + ' ',
          bold: true,
          color: slate900,
          size: 20,
          font: 'Arial',
        }),
      )
    }
    children.push(
      new TextRun({
        text,
        color: slate700,
        size: 20,
        font: 'Arial',
      }),
    )

    return new Paragraph({
      bullet: {
        level: 0,
      },
      spacing: { before: 40, after: 40, line: 260 },
      children,
    })
  }

  const createSubBullet = (text: string, boldPrefix?: string) => {
    const children: TextRun[] = []
    if (boldPrefix) {
      children.push(
        new TextRun({
          text: boldPrefix + ' ',
          bold: true,
          color: slate900,
          size: 19,
          font: 'Arial',
        }),
      )
    }
    children.push(
      new TextRun({
        text,
        color: slate600,
        size: 19,
        font: 'Arial',
      }),
    )

    return new Paragraph({
      bullet: {
        level: 1,
      },
      spacing: { before: 30, after: 30 },
      children,
    })
  }

  const createCallout = (title: string, content: string) => {
    return new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              shading: {
                fill: 'F0FDF4',
                type: ShadingType.CLEAR,
              },
              borders: {
                left: {
                  style: BorderStyle.SINGLE,
                  size: 24,
                  color: primaryGreen,
                },
                top: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
              },
              margins: {
                top: 140,
                bottom: 140,
                left: 200,
                right: 200,
              },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: title,
                      bold: true,
                      size: 21,
                      color: darkGreen,
                      font: 'Arial',
                    }),
                  ],
                }),
                new Paragraph({
                  spacing: { before: 60 },
                  children: [
                    new TextRun({
                      text: content,
                      size: 19,
                      color: slate700,
                      font: 'Arial',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    })
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Arial',
            size: 20,
            color: slate700,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1200,
              bottom: 1200,
              left: 1200,
              right: 1200,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'CONDUTIVA TECNOLOGIA — TREINAMENTO LANDING PAGE',
                    size: 16,
                    color: slate600,
                    font: 'Arial',
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'Condutiva Tecnologia — Unidade de Serviços & Engenharia Preditiva | Página ',
                    size: 16,
                    color: slate600,
                    font: 'Arial',
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT, ' de ', PageNumber.TOTAL_PAGES],
                    size: 16,
                    color: slate600,
                    font: 'Arial',
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // Banner Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 80 },
            children: [
              new TextRun({
                text: 'TREINAMENTO: LANDING PAGE CONDUTIVA TECNOLOGIA',
                bold: true,
                size: 36, // 18pt
                color: slate900,
                font: 'Arial',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 300 },
            children: [
              new TextRun({
                text: 'Unidade de Serviços & Engenharia Preditiva',
                bold: true,
                size: 24, // 12pt
                color: darkGreen,
                font: 'Arial',
              }),
            ],
          }),

          createCallout(
            'DOCUMENTO DE CAPACITAÇÃO E OPERAÇÃO TÉCNICA',
            'Este documento contém o treinamento integral sobre o funcionamento, arquitetura, infraestrutura, fluxo de leads, banco de dados, regras de negócio e rotinas operacionais da Landing Page da Condutiva Tecnologia.',
          ),

          new Paragraph({ spacing: { before: 200, after: 100 } }),

          // 1. VISÃO GERAL
          createHeading1('1. VISÃO GERAL'),
          createParagraph(
            'A landing page é um site single-page application (React + Vite + TypeScript + Tailwind CSS, shadcn/ui), hospedado na plataforma Skip. O objetivo primordial da aplicação é gerar leads qualificados via diagnóstico técnico gratuito e apresentar o portfólio completo de serviços de manutenção industrial, calibração presencial e remota, automação e monitoramento SIGA.',
          ),
          createHeading2('URLs do Projeto:'),
          createBullet('https://servicos-condutiva-copy-2bff8--preview.goskip.app', '• Preview:'),
          createBullet('https://servicos-condutiva-copy-2bff8.goskip.app', '• Produção:'),

          createHeading2('Dados Institucionais da Empresa:'),
          createBullet(
            'Rua José Moreira de Souza, 84 (Parque das Indústrias) – Betel, Paulínia – SP, CEP: 13148-378',
            '• Endereço:',
          ),
          createBullet('(19) 3032-1751', '• Telefone Fixo:'),
          createBullet('(19) 99341-3270', '• WhatsApp Comercial:'),
          createBullet('servicos@condutiva.com.br', '• E-mail Comercial:'),
          createBullet(
            '+20 anos de experiência de mercado, +500 clientes industriais atendidos em +20 estados do Brasil.',
            '• Indicadores Relevantes:',
          ),

          // 2. ESTRUTURA DA PÁGINA INICIAL (/)
          createHeading1('2. ESTRUTURA DA PÁGINA INICIAL (/)'),
          createParagraph(
            'A página inicial foi estruturada em blocos modulares sequenciais de alta conversão, combinando autoridade técnica, redução de risco e pontos contínuos de captura:',
          ),
          createBullet(
            'Barra superior com alerta de plantão nacional, logotipo Condutiva, navegação com âncoras suaves (#hero, #servicos, #diagnostico, #planos, #casos, #faq), bloco de contatos fixo/WhatsApp, botão "Diagnóstico Gratuito" e menu responsivo mobile via Sheet.',
            '1. Header:',
          ),
          createBullet(
            'Título de alto impacto com badges de autoridade, 4 checkpoints de confiabilidade (atendimento em todo o Brasil, SLA ágil, especialistas certificados, laudos rastreáveis), CTAs principais e indicadores com métricas industriais.',
            '2. HeroSection:',
          ),
          createBullet(
            'Faixa com métricas de relevância (+20 anos, +500 indústrias, +20 estados) e selos de conformidade técnica.',
            '3. SocialProofBar:',
          ),
          createBullet(
            'Apresentação institucional detalhada da divisão de engenharia e serviços com fotos reais e valores centrais.',
            '4. PresentationSection:',
          ),
          createBullet(
            'Mapeamento das 4 maiores dores da gestão de manutenção fabril (paradas não planejadas, custos emergenciais, leituras imprecisas e descontinuidade operacional).',
            '5. PainPointsSection:',
          ),
          createBullet(
            'Quadro comparativo interativo De (manutenção reativa/tradicional) para Para (Engenharia Preditiva Condutiva).',
            '6. TransformationSection:',
          ),
          createBullet(
            'Pilares que diferenciam a Condutiva no setor industrial (laboratório próprio, técnicos credenciados, agilidade e inteligência preditiva).',
            '7. DifferentiatorsSection:',
          ),
          createBullet(
            'Catálogo com os 6 cards de serviços especializados: Calibração de Sensores de Umidade, Manutenção Preventiva/Corretiva de Equipamentos, Programação/Integração CLP/IHM/Supervisório, Diagnóstico de Redes Industriais & SIGA, Retrofit & Modernização de Painéis, e Consultoria em Engenharia Preditiva.',
            '8. ServiceCatalogSection:',
          ),
          createBullet(
            '3 planos de atendimento sob medida: Sentinela Preventivo, Controle Total SIGA e Maestro Engenharia, detalhando coberturas, SLAs e benefícios.',
            '9. ServiceLevelsSection:',
          ),
          createBullet(
            'Apresentação dos casos de sucesso com clientes de referência nacional (Grão Futura, Amaggi, Presto).',
            '10. CaseStudiesSection:',
          ),
          createBullet(
            'Grade detalhada com os benefícios diretos obtidos pelas plantas industriais atendidas.',
            '11. BenefitsGridSection:',
          ),
          createBullet(
            'Passo a passo transparente do fluxo de atendimento: do diagnóstico técnico inicial até a homologação final.',
            '12. HowItWorksSection:',
          ),
          createBullet(
            'Banner parallax inspiracional com foco em metas operacionais e excelência produtiva.',
            '13. AspirationalSection:',
          ),
          createBullet(
            'Depoimentos e avaliações de gestores e engenheiros de plantas parceiras.',
            '14. TestimonialsSection:',
          ),
          createBullet(
            'Garantia de satisfação e reversão de risco técnico para contratação sem atrito.',
            '15. RiskReversalBanner:',
          ),
          createBullet(
            'Accordion dinâmico com as 8 dúvidas mais frequentes dos diretores e supervisores industriais.',
            '16. FaqSection:',
          ),
          createBullet(
            'Formulário completo com campos direcionados e validação em tempo real.',
            '17. DiagnosticFormSection:',
          ),
          createBullet(
            'Rodapé completo com dados institucionais, mapa do site, links legais e atalho seguro para o Painel Comercial da Equipe.',
            '18. Footer:',
          ),
          createBullet(
            'Botão flutuante WhatsApp (wa.me/5519993413270) com animação pulsante para atendimento imediato.',
            '19. FloatingActions:',
          ),

          // 3. FORMULÁRIO DE DIAGNÓSTICO
          createHeading1('3. FORMULÁRIO DE DIAGNÓSTICO'),
          createParagraph(
            'O formulário é o motor de conversão da landing page, projetado para qualificar o lead técnico antes do primeiro contato da equipe comercial.',
          ),
          createHeading2('Campos coletados:'),
          createBullet('Nome completo do solicitante ou gestor responsável', '• Nome (full_name):'),
          createBullet('Razão social ou nome fantasia da indústria', '• Empresa (company):'),
          createBullet('E-mail corporativo do contato', '• E-mail (email):'),
          createBullet('Telefone / WhatsApp com DDD', '• Telefone (phone):'),
          createBullet(
            'Setor de atuação industrial (Agro, Alimentos, Química, etc.)',
            '• Segmento (segment):',
          ),
          createBullet(
            'Faixa estimada de equipamentos ou sensores na planta',
            '• Qtde Equipamentos (equipment_count):',
          ),
          createBullet('Localização da unidade fabril', '• Cidade / Estado (city_state):'),
          createBullet(
            'Descrição do problema operacional ou objetivo técnico',
            '• Desafio Principal (main_challenge):',
          ),
          createBullet(
            'Consentimento explícito para tratamento de dados comerciais',
            '• Checkbox LGPD (lgpd_consent):',
          ),

          createParagraph(
            'Acesso ao Modal:',
            'Além da seção principal no final da página, o formulário abre em modal dinâmico através dos CTAs "Solicitar Diagnóstico", "Saiba Mais" e "Solicitar Proposta", herdando automaticamente o serviço ou plano clicado.',
          ),
          createParagraph(
            'Fluxo de Processamento:',
            'Preenchimento pelo usuário → Validação de tipos e obrigatoriedade → Disparo para API PocketBase → Persistência atômica na coleção `leads` → Disparo assíncrono do hook de e-mail → Exibição de tela de confirmação e agradecimento com opções de contato rápido.',
          ),

          // 4. BASE DE DADOS
          createHeading1('4. BASE DE DADOS'),
          createParagraph(
            'A camada de persistência utiliza o Skip Cloud (PocketBase), provendo um banco SQLite gerenciado com alta performance, segurança integrada e API REST nativa.',
          ),
          createBullet('full_name (Texto, obrigatório)', '• Campos da coleção `leads`:'),
          createSubBullet('company (Texto, obrigatório)'),
          createSubBullet('email (E-mail, obrigatório)'),
          createSubBullet('phone (Texto, obrigatório)'),
          createSubBullet('segment (Texto, opcional/seleção)'),
          createSubBullet('city_state (Texto, obrigatório)'),
          createSubBullet('equipment_count (Texto, seleção)'),
          createSubBullet('main_challenge (Texto longo, opcional)'),
          createSubBullet('lgpd_consent (Booleano, obrigatório como true)'),
          createSubBullet('created / updated (Timestamps ISO gerados pelo sistema)'),

          createHeading2('Índices de Performance:'),
          createBullet('idx_leads_created (Ordenação rápida cronológica reversa)', '•'),
          createBullet('idx_leads_email (Pesquisas e deduplicação)', '•'),

          createHeading2('Regras de Acesso (API Rules):'),
          createBullet(
            'Permitido para consulta e visualização dos dados cadastrados.',
            '• List / View Rule: "" (Público)',
          ),
          createBullet(
            'Permitido para envio dos dados do formulário da landing page.',
            '• Create Rule: "" (Público)',
          ),
          createBullet(
            'Bloqueado para proteção da integridade do histórico comercial.',
            '• Update / Delete Rule: null (Desabilitado)',
          ),

          createHeading2('Histórico de Migrations:'),
          createBullet(
            'Criação da estrutura da tabela `leads` com campos tipados e índices.',
            '• 0001_create_leads.js:',
          ),
          createBullet(
            'Configuração de regras públicas de leitura e inserção de dados.',
            '• 0002_allow_leads_read_and_seed.js:',
          ),

          // 5. ENVIO DE E-MAILS
          createHeading1('5. ENVIO DE E-MAILS'),
          createParagraph(
            'A cada novo formulário preenchido, o hook server-side do PocketBase (`on_lead_create`) intercepta o evento, extrai as informações estruturadas do lead e dispara notificações instantâneas via SMTP.',
          ),
          createBullet('smtp.locaweb.com.br, Porta 587 (STARTTLS ativado)', '• Servidor SMTP:'),
          createBullet('paulo@condutiva.com.br (autenticado)', '• Remetente Oficial:'),
          createBullet(
            'comercial1@condutiva.com.br, liandra@condutiva.com.br, paulo@condutiva.com.br',
            '• Destinatários Comerciais:',
          ),
          createBullet(
            'SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, SMTP_SENDER_ADDRESS, SITE_URL, PB_INSTANCE_URL, PB_SUPERUSER_TOKEN',
            '• Secrets Gerenciadas:',
          ),

          // 6. CONTATOS ENVOLVIDOS
          createHeading1('6. CONTATOS ENVOLVIDOS'),
          createHeading2('Canais Públicos para Clientes e Fornecedores:'),
          createBullet('(19) 3032-1751', '• Telefone Fixo Central:'),
          createBullet(
            '(19) 99341-3270 (Link direto: wa.me/5519993413270)',
            '• WhatsApp Comercial:',
          ),
          createBullet('servicos@condutiva.com.br', '• E-mail Geral:'),
          createBullet(
            'Rua José Moreira de Souza, 84 – Betel, Paulínia – SP, CEP: 13148-378',
            '• Sede Operacional:',
          ),

          createHeading2('Contatos Internos da Equipe (Recebimento de Leads):'),
          createBullet('comercial1@condutiva.com.br (Atendimento Comercial)', '• Comercial 1:'),
          createBullet('liandra@condutiva.com.br (Gestão de Contas & Contratos)', '• Liandra:'),
          createBullet('paulo@condutiva.com.br (Engenharia & Coordenação Técnica)', '• Paulo:'),

          // 7. PAINEL COMERCIAL (/leads)
          createHeading1('7. PAINEL COMERCIAL (/leads)'),
          createParagraph(
            'A aplicação conta com um painel interno dedicado à equipe de vendas e engenharia, acessível diretamente no navegador sem necessidade de ferramentas externas.',
          ),
          createBullet(
            'Rota "/leads", protegida por autenticação com a senha "condutiva01". A sessão autenticada é mantida em sessionStorage para comodidade operacional.',
            '• Acesso e Segurança:',
          ),
          createBullet(
            'Logotipo oficial Condutiva acompanhado do badge estilizado "Painel Comercial / SERVIÇOS" com o verde institucional #8CC63F.',
            '• Identidade Visual:',
          ),
          createBullet(
            'Lista cronológica inversa (mais recentes primeiro), alternância entre visualização em Tabela e Cards, busca textual em tempo real por nome/empresa/e-mail, filtro refinado por segmento industrial.',
            '• Recursos de Gestão:',
          ),
          createBullet(
            'Exibe todos os campos preenchidos, desafios técnicos descritos, com botões de ação imediata: "Conversar no WhatsApp" (com mensagem pronta) e "Enviar E-mail".',
            '• Modal de Detalhes do Lead:',
          ),
          createBullet(
            'Gera arquivo compatível com Excel e CRMs usando delimitador ponto e vírgula (;) e cabeçalho UTF-8 BOM para garantir acentuação correta em português.',
            '• Exportação CSV:',
          ),
          createBullet(
            'Integração via WebSocket com PocketBase Subscription, atualizando a listagem imediatamente assim que um cliente submete o formulário.',
            '• Sincronização em Tempo Real:',
          ),

          // 8. PUBLICAÇÃO
          createHeading1('8. PUBLICAÇÃO'),
          createBullet(
            'A hospedagem é 100% gerenciada pela infraestrutura Skip (goskip.app), com compilação automatizada (Vite + TypeScript) e distribuição edge.',
            '• Infraestrutura:',
          ),
          createBullet(
            'Todo commit ou alteração gera um ambiente de preview isolado para homologação técnica e visual.',
            '• Ambiente de Preview:',
          ),
          createBullet(
            'Após aprovação no preview, o código é promovido para a URL de produção oficial.',
            '• Ambiente de Produção:',
          ),
          createBullet(
            'A plataforma permite apontar CNAME e certificados SSL automáticos para o domínio corporativo oficial (ex: servicos.condutiva.com.br).',
            '• Domínio Próprio:',
          ),

          // 9. COMO PREENCHER (VISÃO CLIENTE)
          createHeading1('9. COMO PREENCHER (VISÃO CLIENTE)'),
          createParagraph(
            'Roteiro passo a passo do fluxo percorrido pelo cliente industrial na landing page:',
          ),
          createBullet(
            '1. Acessar a landing page pelo endereço web de produção ou campanhas de marketing.',
            'Passo 1:',
          ),
          createBullet(
            '2. Clicar no botão verde "SOLICITAR DIAGNÓSTICO GRATUITO" no topo ou navegar até o formulário no rodapé.',
            'Passo 2:',
          ),
          createBullet(
            '3. Preencher os dados cadastrais obrigatórios: Nome, Empresa, E-mail corporativo e Telefone com DDD.',
            'Passo 3:',
          ),
          createBullet(
            '4. Selecionar o Segmento de atuação da fábrica e a Quantidade estimada de equipamentos/sensores.',
            'Passo 4:',
          ),
          createBullet(
            '5. Informar a Cidade/Estado da planta fabril e descrever o Desafio operacional ou necessidade de manutenção.',
            'Passo 5:',
          ),
          createBullet(
            '6. Marcar a caixa de seleção de consentimento LGPD e clicar em "ENVIAR DIAGNÓSTICO GRATUITO".',
            'Passo 6:',
          ),
          createBullet(
            '7. Receber a confirmação em tela com o SLA de retorno em até 2 horas úteis por parte do especialista técnico da Condutiva.',
            'Passo 7:',
          ),

          // 10. PENDÊNCIAS E MELHORIAS
          createHeading1('10. PENDÊNCIAS E MELHORIAS'),
          createHeading2('Itens de Atenção e Pendências:'),
          createBullet(
            'Atualizar as credenciais da conta SMTP Locaweb no gerenciador de secrets para manter o isolamento de segurança.',
            '1. Atualização de Senha SMTP:',
          ),
          createBullet(
            'Submeter um lead de teste através do formulário de produção para validar a entrega na caixa de entrada dos 3 destinatários.',
            '2. Teste de Ponta a Ponta:',
          ),

          createHeading2('Sugestões de Evolução Futura:'),
          createBullet(
            'Configurar o apontamento DNS para URL amigável como servicos.condutiva.com.br.',
            '• Domínio Customizado:',
          ),
          createBullet(
            'Disparo simultâneo de notificação via WhatsApp API, SMS ou canal do Microsoft Teams/Slack.',
            '• Notificações Multicanal:',
          ),
          createBullet(
            'Gráficos de conversão semanal/mensal por segmento dentro do Painel Comercial.',
            '• Dashboard Analítico:',
          ),
          createBullet(
            'Dicionário completo de termos técnicos em Inglês e Espanhol para atender indústrias multinacionais.',
            '• Internacionalização Completa:',
          ),
          createBullet(
            'Criação de páginas estáticas detalhadas dedicadas à Política de Privacidade e Termos de Uso.',
            '• Documentação Legal:',
          ),

          // 11. GLOSSÁRIO
          createHeading1('11. GLOSSÁRIO TÉCNICO'),
          createTableGlossary(),

          new Paragraph({ spacing: { before: 300 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Condutiva Tecnologia — Unidade de Serviços & Engenharia Preditiva',
                bold: true,
                size: 18,
                color: darkGreen,
                font: 'Arial',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Documento gerado automaticamente pela plataforma oficial.',
                size: 16,
                color: slate600,
                font: 'Arial',
              }),
            ],
          }),
        ],
      },
    ],
  })

  return await Packer.toBlob(doc)
}

function createTableGlossary(): Table {
  const primaryGreen = '8CC63F'
  const slate900 = '0F172A'
  const slate700 = '334155'
  const borderColor = 'CBD5E1'

  const terms = [
    {
      term: 'Skip',
      desc: 'Plataforma em nuvem para desenvolvimento, compilação, banco de dados e hospedagem de aplicações modernas.',
    },
    {
      term: 'PocketBase',
      desc: 'Backend embutido em SQLite com API REST, autenticação, storage e realtime subscriptions integradas.',
    },
    {
      term: 'React + Vite',
      desc: 'Ecossistema frontend de alta performance para renderização rápida de componentes interativos em SPA.',
    },
    {
      term: 'TypeScript',
      desc: 'Superconjunto tipado de JavaScript que garante confiabilidade, autocompletion e ausência de erros de tipo em tempo de execução.',
    },
    {
      term: 'Tailwind CSS',
      desc: 'Framework CSS orientado a utilitários para estilização rápida, coesa e totalmente responsiva.',
    },
    {
      term: 'shadcn/ui',
      desc: 'Biblioteca de componentes acessíveis e elegantes baseada em Radix UI com estilo moderno.',
    },
    {
      term: 'SMTP & STARTTLS',
      desc: 'Protocolos de transporte seguro de e-mails entre o servidor PocketBase e as caixas postais da Locaweb.',
    },
    {
      term: 'LGPD',
      desc: 'Lei Geral de Proteção de Dados (Lei nº 13.709/2018), que exige o consentimento explícito e proteção de dados pessoais.',
    },
    {
      term: 'CSV',
      desc: 'Formato tabular separado por delimitadores para exportação e importação direta em ferramentas como Excel e CRM.',
    },
    {
      term: 'Lead',
      desc: 'Oportunidade comercial qualificada gerada pelo interesse de um cliente industrial nos serviços da empresa.',
    },
    {
      term: 'CTA (Call to Action)',
      desc: 'Botões ou chamadas promocionais que orientam a ação do visitante (ex: "Solicitar Diagnóstico Gratuito").',
    },
    {
      term: 'SLA (Service Level Agreement)',
      desc: 'Acordo de Nível de Serviço que estabelece prazos máximos para atendimento e resolução técnica (ex: resposta em até 2h).',
    },
  ]

  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        width: { size: 25, type: WidthType.PERCENTAGE },
        shading: { fill: primaryGreen, type: ShadingType.CLEAR },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 8, color: primaryGreen },
          bottom: { style: BorderStyle.SINGLE, size: 8, color: primaryGreen },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
        },
        margins: { top: 120, bottom: 120, left: 140, right: 140 },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: 'Termo / Sigla',
                bold: true,
                color: slate900,
                size: 20,
                font: 'Arial',
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 75, type: WidthType.PERCENTAGE },
        shading: { fill: primaryGreen, type: ShadingType.CLEAR },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 8, color: primaryGreen },
          bottom: { style: BorderStyle.SINGLE, size: 8, color: primaryGreen },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
        },
        margins: { top: 120, bottom: 120, left: 140, right: 140 },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: 'Definição e Aplicação na Landing Page',
                bold: true,
                color: slate900,
                size: 20,
                font: 'Arial',
              }),
            ],
          }),
        ],
      }),
    ],
  })

  const rows = [headerRow]

  terms.forEach((item, index) => {
    const isEven = index % 2 === 0
    const row = new TableRow({
      children: [
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          shading: {
            fill: isEven ? 'F8FAFC' : 'FFFFFF',
            type: ShadingType.CLEAR,
          },
          borders: {
            bottom: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
            top: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
          },
          margins: { top: 100, bottom: 100, left: 140, right: 140 },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: item.term,
                  bold: true,
                  color: slate900,
                  size: 19,
                  font: 'Arial',
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 75, type: WidthType.PERCENTAGE },
          shading: {
            fill: isEven ? 'F8FAFC' : 'FFFFFF',
            type: ShadingType.CLEAR,
          },
          borders: {
            bottom: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
            top: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
          },
          margins: { top: 100, bottom: 100, left: 140, right: 140 },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: item.desc,
                  color: slate700,
                  size: 19,
                  font: 'Arial',
                }),
              ],
            }),
          ],
        }),
      ],
    })
    rows.push(row)
  })

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows,
  })
}

export async function downloadTrainingDocx(): Promise<void> {
  const blob = await generateTrainingDocx()
  const fileName = 'Treinamento_LandingPage_Condutiva.docx'

  // Browser download trigger
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
