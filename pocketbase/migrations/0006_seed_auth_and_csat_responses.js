migrate(
  (app) => {
    // 1. Seed internal test user for Condutiva team
    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')

    const seedUsers = [
      {
        email: 'pauloac1000@gmail.com',
        name: 'Paulo Condutiva (Admin)',
        password: 'Skip@Pass',
      },
      {
        email: 'equipe@condutiva.com.br',
        name: 'Equipe Condutiva',
        password: 'Skip@Pass',
      },
    ]

    for (const u of seedUsers) {
      try {
        app.findAuthRecordByEmail('_pb_users_auth_', u.email)
      } catch (_) {
        const userRec = new Record(usersCol)
        userRec.setEmail(u.email)
        userRec.setPassword(u.password)
        userRec.setVerified(true)
        userRec.set('name', u.name)
        app.save(userRec)
      }
    }

    // 2. Seed representative CSAT responses linked to contracts
    const csatCol = app.findCollectionByNameOrId('csat_responses')
    const contractsCol = app.findCollectionByNameOrId('contracts')

    // Find contracts to link
    let saoMartinhoId = null
    let gerdauId = null
    let yaraId = null

    try {
      const c1 = app.findFirstRecordByData('contracts', 'contract_number', 'CTR-2025-0142')
      saoMartinhoId = c1.id
    } catch (_) {}

    try {
      const c2 = app.findFirstRecordByData('contracts', 'contract_number', 'CTR-2025-0204')
      gerdauId = c2.id
    } catch (_) {}

    try {
      const c3 = app.findFirstRecordByData('contracts', 'contract_number', 'CTR-2025-0230')
      yaraId = c3.id
    } catch (_) {}

    const sampleResponses = [
      {
        contract_id: saoMartinhoId,
        contract_number: 'CTR-2025-0142',
        service_order_number: 'OS-8841',
        form_version: 'completo',
        client_name: 'Usina São Martinho S/A (Unidade Pradópolis)',
        evaluation_date: '2025-02-18',
        respondent_name: 'Carlos Eduardo Nogueira',
        respondent_role: 'Coordenador de Instrumentação e Elétrica',
        service_evaluated:
          'Calibração RBC e manutenção em transmissores de vazão mássica na moenda',
        technician_name: 'Rafael Albuquerque',
        problem_resolved: 'sim',
        score_general_satisfaction: 5,
        score_technical_execution: 5,
        score_customer_service: 5,
        score_perceived_value: 5,
        nps_score: 10,
        nps_reason:
          'Pontualidade impecável na parada de moenda e relatórios técnicos emitidos no mesmo dia com rastreabilidade RBC.',
        nps_improvement:
          'Manter a mesma equipe técnica alocada nas próximas manutenções programadas.',
        renewal_intent:
          'Sim, pretendemos estender o contrato para todo o parque de medição da unidade.',
        positive_highlights:
          'Excelente postura do técnico Rafael Albuquerque, domínio técnico profundo dos padrões e cumprimento rigoroso das normas NR-10 e NR-33.',
        points_to_improve:
          'Disponibilizar os certificados em PDF compactados em arquivo zip único no portal.',
        additional_services_needed:
          'Auditoria e comissionamento da malha de controle do gerador 03.',
        final_comments:
          'Trabalho de alto padrão industrial, recomendo a qualquer usina sucroalcooleira.',
        contact_authorized: true,
      },
      {
        contract_id: gerdauId,
        contract_number: 'CTR-2025-0204',
        service_order_number: 'OS-8975',
        form_version: 'curto',
        client_name: 'Gerdau Aços Longos (Usina Araçariguama)',
        evaluation_date: '2025-02-22',
        respondent_name: 'Fernando Guimarães',
        respondent_role: 'Engenheiro de Manutenção Predial e Industrial',
        service_evaluated:
          'Manutenção corretiva e ajuste em sensores de temperatura do forno de laminação',
        technician_name: 'Carlos Mendes',
        problem_resolved: 'sim',
        score_general_satisfaction: 4,
        score_technical_execution: 5,
        score_customer_service: 4,
        score_perceived_value: 4,
        nps_score: 9,
        nps_reason:
          'Atendimento ágil no chamado emergencial e identificação rápida da falha na malha 4-20mA.',
        nps_improvement: 'Reduzir o tempo de envio da cotação de peças sobressalentes.',
        renewal_intent: 'Provável renovação no próximo ciclo contratual.',
        positive_highlights:
          'Diagnóstico rápido e seguro, sem necessidade de parada estendida da linha.',
        points_to_improve: 'Agilidade na emissão do relatório preliminar de OS.',
        additional_services_needed: 'Termografia em painéis elétricos da subestação.',
        final_comments: 'Parceria muito sólida. Atendimento exemplar.',
        contact_authorized: true,
      },
      {
        contract_id: yaraId,
        contract_number: 'CTR-2025-0230',
        service_order_number: 'OS-9088',
        form_version: 'completo',
        client_name: 'Yara Fertilizantes (Unidade Paulínia)',
        evaluation_date: '2025-02-28',
        respondent_name: 'Mariana Azevedo',
        respondent_role: 'Supervisora de Qualidade e Processos',
        service_evaluated:
          'Verificação periódica e laudo de conformidade em balanças integradoras e medidores de pH',
        technician_name: 'Rafael Albuquerque',
        problem_resolved: 'sim',
        score_general_satisfaction: 5,
        score_technical_execution: 5,
        score_customer_service: 4,
        score_perceived_value: 5,
        nps_score: 10,
        nps_reason:
          'A precisão metrológica dos laudos atendeu 100% à auditoria externa da ISO 9001 e ISO 14001.',
        nps_improvement:
          'Alinhamento prévio do horário exato de chegada na portaria para agilizar liberação de crachá.',
        renewal_intent: 'Contrato já renovado automaticamente para o próximo exercício.',
        positive_highlights:
          'Conhecimento normativo do técnico e clareza nas explicações aos operadores.',
        points_to_improve: 'Avisar com 48h de antecedência os documentos de integração da equipe.',
        additional_services_needed: 'Treinamento operacional para operadores do turno noturno.',
        final_comments: 'Muito satisfeitos com o suporte prestado pela Condutiva.',
        contact_authorized: false,
      },
      {
        contract_id: null,
        contract_number: 'CTR-2025-0199',
        service_order_number: 'OS-8940',
        form_version: 'curto',
        client_name: 'Ambev (Cervejaria Agudos)',
        evaluation_date: '2025-03-01',
        respondent_name: 'Rodrigo Santoro Peixoto',
        respondent_role: 'Líder de Utilidades',
        service_evaluated:
          'Calibração em linha de transmissores de pressão na central de refrigeração amônia',
        technician_name: 'Mateus Silveira',
        problem_resolved: 'sim',
        score_general_satisfaction: 4,
        score_technical_execution: 4,
        score_customer_service: 5,
        score_perceived_value: 4,
        nps_score: 8,
        nps_reason: 'Equipe respeitou todas as exigências de segurança em área classificada.',
        nps_improvement: 'Melhorar a formatação do sumário executivo.',
        renewal_intent: 'Sim, pretendemos cotar novos serviços preventivos.',
        positive_highlights: 'Cuidado redobrado com segurança do trabalho.',
        points_to_improve: 'Envio de laudos com assinatura digital direta.',
        additional_services_needed: 'Manutenção de válvulas reguladoras.',
        final_comments: 'Serviço prestado de forma consistente.',
        contact_authorized: true,
      },
    ]

    for (const item of sampleResponses) {
      try {
        app.findFirstRecordByData(
          'csat_responses',
          'service_order_number',
          item.service_order_number,
        )
      } catch (_) {
        const record = new Record(csatCol)
        for (const [key, val] of Object.entries(item)) {
          record.set(key, val)
        }
        app.save(record)
      }
    }
  },
  (app) => {
    // down migration
    try {
      const u1 = app.findAuthRecordByEmail('_pb_users_auth_', 'equipe@condutiva.com.br')
      app.delete(u1)
    } catch (_) {}
  },
)
