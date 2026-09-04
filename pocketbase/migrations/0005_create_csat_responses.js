migrate(
  (app) => {
    const contractsCol = app.findCollectionByNameOrId('contracts')

    const collection = new Collection({
      name: 'csat_responses',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        // Relation to contract
        {
          name: 'contract_id',
          type: 'relation',
          required: false,
          collectionId: contractsCol.id,
          cascadeDelete: false,
          maxSelect: 1,
        },
        { name: 'contract_number', type: 'text', required: true, min: 1, max: 100 },
        { name: 'service_order_number', type: 'text', required: true, min: 1, max: 100 },
        {
          name: 'form_version',
          type: 'select',
          required: true,
          values: ['completo', 'curto'],
          maxSelect: 1,
        },

        // Identificação
        { name: 'client_name', type: 'text', required: true, min: 1, max: 200 },
        { name: 'evaluation_date', type: 'text', required: true, min: 1, max: 50 },
        { name: 'respondent_name', type: 'text', required: true, min: 1, max: 200 },
        { name: 'respondent_role', type: 'text', required: true, min: 1, max: 200 },
        { name: 'service_evaluated', type: 'text', required: true, min: 1, max: 250 },
        { name: 'technician_name', type: 'text', required: true, min: 1, max: 200 },

        // Resolução do problema
        // Opções: "sim", "nao", "nao_se_aplica"
        {
          name: 'problem_resolved',
          type: 'select',
          required: true,
          values: ['sim', 'nao', 'nao_se_aplica'],
          maxSelect: 1,
        },

        // Seções de avaliação com notas 1 a 5
        // Satisfação Geral
        { name: 'score_general_satisfaction', type: 'number', min: 1, max: 5 },
        // Execução Técnica
        { name: 'score_technical_execution', type: 'number', min: 1, max: 5 },
        // Atendimento
        { name: 'score_customer_service', type: 'number', min: 1, max: 5 },
        // Valor Percebido
        { name: 'score_perceived_value', type: 'number', min: 1, max: 5 },

        // Lealdade (NPS 0 a 10)
        { name: 'nps_score', type: 'number', min: 0, max: 10 },
        { name: 'nps_reason', type: 'text', maxSize: 3000 },
        { name: 'nps_improvement', type: 'text', maxSize: 3000 },
        { name: 'renewal_intent', type: 'text', maxSize: 3000 },

        // Perguntas Abertas
        { name: 'positive_highlights', type: 'text', maxSize: 3000 },
        { name: 'points_to_improve', type: 'text', maxSize: 3000 },
        { name: 'additional_services_needed', type: 'text', maxSize: 3000 },
        { name: 'final_comments', type: 'text', maxSize: 3000 },

        // Checkbox autorização de contato
        { name: 'contact_authorized', type: 'bool' },

        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_csat_created ON csat_responses (created)',
        'CREATE INDEX idx_csat_contract ON csat_responses (contract_number)',
        'CREATE INDEX idx_csat_so ON csat_responses (service_order_number)',
        'CREATE INDEX idx_csat_version ON csat_responses (form_version)',
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('csat_responses')
    app.delete(collection)
  },
)
