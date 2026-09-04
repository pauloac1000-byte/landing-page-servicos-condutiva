migrate(
  (app) => {
    const collection = new Collection({
      name: 'contracts',
      type: 'base',
      // Public API rules (managed by password lock screen on frontend, same as leads)
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        { name: 'contract_number', type: 'text', required: true, min: 1, max: 100 },
        { name: 'service_order_number', type: 'text', required: true, min: 1, max: 100 },
        { name: 'client_name', type: 'text', required: true, min: 2, max: 200 },
        { name: 'client_email', type: 'email', required: true },
        { name: 'technician_name', type: 'text', required: true, min: 2, max: 200 },
        {
          name: 'questionnaire_status',
          type: 'select',
          required: true,
          values: ['pendente', 'respondido'],
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_contracts_created ON contracts (created)',
        'CREATE INDEX idx_contracts_contract_number ON contracts (contract_number)',
        'CREATE INDEX idx_contracts_so_number ON contracts (service_order_number)',
        'CREATE INDEX idx_contracts_client ON contracts (client_name)',
      ],
    })
    app.save(collection)

    // Seed sample industrial contracts and service orders
    const sampleContracts = [
      {
        contract_number: 'CTR-2025-0142',
        service_order_number: 'OS-8841',
        client_name: 'Usina São Martinho S/A (Unidade Pradópolis)',
        client_email: 'manutencao.instrumentacao@saomartinho.com.br',
        technician_name: 'Rafael Albuquerque',
        questionnaire_status: 'respondido',
      },
      {
        contract_number: 'CTR-2025-0189',
        service_order_number: 'OS-8920',
        client_name: 'Klabin Papel e Celulose (Monte Alegre)',
        client_email: 'automacao.montalegre@klabin.com.br',
        technician_name: 'Lucas Pinho',
        questionnaire_status: 'pendente',
      },
      {
        contract_number: 'CTR-2025-0204',
        service_order_number: 'OS-8975',
        client_name: 'Gerdau Aços Longos (Usina Araçariguama)',
        client_email: 'engenharia.manutencao@gerdau.com.br',
        technician_name: 'Carlos Mendes',
        questionnaire_status: 'respondido',
      },
      {
        contract_number: 'CTR-2025-0215',
        service_order_number: 'OS-9012',
        client_name: 'Bunge Alimentos (Complexo Portuário Santos)',
        client_email: 'supervisao.eletrica@bunge.com.br',
        technician_name: 'Thiago Faria',
        questionnaire_status: 'pendente',
      },
      {
        contract_number: 'CTR-2025-0230',
        service_order_number: 'OS-9088',
        client_name: 'Yara Fertilizantes (Unidade Paulínia)',
        client_email: 'instrumentacao.paulinia@yara.com',
        technician_name: 'Rafael Albuquerque',
        questionnaire_status: 'respondido',
      },
      {
        contract_number: 'CTR-2025-0248',
        service_order_number: 'OS-9134',
        client_name: 'Nestlé Brasil (Fábrica Araras)',
        client_email: 'facilities.qualidade@br.nestle.com',
        technician_name: 'Mateus Silveira',
        questionnaire_status: 'pendente',
      },
    ]

    for (const item of sampleContracts) {
      const record = new Record(collection)
      record.set('contract_number', item.contract_number)
      record.set('service_order_number', item.service_order_number)
      record.set('client_name', item.client_name)
      record.set('client_email', item.client_email)
      record.set('technician_name', item.technician_name)
      record.set('questionnaire_status', item.questionnaire_status)
      app.save(record)
    }
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('contracts')
    app.delete(collection)
  },
)
