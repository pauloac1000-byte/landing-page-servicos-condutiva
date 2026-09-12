migrate(
  (app) => {
    // 1. Coleção: clientes (cadastro de clientes com acesso à Área do Cliente)
    const clientes = new Collection({
      name: 'clientes',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '@request.auth.id != ""',
      updateRule: '',
      deleteRule: '@request.auth.id != ""',
      fields: [
        {
          name: 'numero_contrato',
          type: 'text',
          required: true,
          min: 1,
          max: 100,
        },
        {
          name: 'nome_cliente',
          type: 'text',
          required: true,
          min: 2,
          max: 200,
        },
        {
          name: 'email',
          type: 'email',
          required: false,
        },
        {
          name: 'senha',
          type: 'text',
          required: true,
          min: 6,
          max: 255,
        },
        {
          name: 'nivel_contrato',
          type: 'select',
          required: true,
          values: ['Sentinela Preventivo', 'Controle Operacional', 'Maestro Engenharia'],
          maxSelect: 1,
        },
        {
          name: 'senha_alterada_em',
          type: 'date',
          required: false,
        },
        {
          name: 'primeiro_acesso_em',
          type: 'date',
          required: false,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_clientes_numero_contrato ON clientes (numero_contrato)',
        'CREATE INDEX idx_clientes_nivel ON clientes (nivel_contrato)',
        'CREATE INDEX idx_clientes_created ON clientes (created)',
      ],
    })
    app.save(clientes)

    // 2. Coleção: ordens_servico (ordens de serviço vinculadas ao contrato do cliente)
    const ordensServico = new Collection({
      name: 'ordens_servico',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '@request.auth.id != ""',
      updateRule: '',
      deleteRule: '@request.auth.id != ""',
      fields: [
        {
          name: 'numero_os',
          type: 'text',
          required: true,
          min: 1,
          max: 100,
        },
        {
          name: 'contrato_id',
          type: 'relation',
          required: true,
          collectionId: clientes.id,
          cascadeDelete: false,
          maxSelect: 1,
        },
        {
          name: 'avaliacao_realizada',
          type: 'bool',
          required: false,
        },
        {
          name: 'descricao_servico',
          type: 'text',
          required: false,
          max: 500,
        },
        {
          name: 'tecnico_responsavel',
          type: 'text',
          required: false,
          max: 200,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_os_numero ON ordens_servico (numero_os)',
        'CREATE INDEX idx_os_contrato ON ordens_servico (contrato_id)',
        'CREATE INDEX idx_os_avaliacao ON ordens_servico (avaliacao_realizada)',
      ],
    })
    app.save(ordensServico)

    // 3. Coleção: documentos_tecnicos (biblioteca de manuais, esquemas, datasheets e certificados)
    const documentosTecnicos = new Collection({
      name: 'documentos_tecnicos',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      fields: [
        {
          name: 'nome',
          type: 'text',
          required: true,
          min: 2,
          max: 250,
        },
        {
          name: 'tipo',
          type: 'select',
          required: true,
          values: ['Manual', 'Esquema', 'Datasheet', 'Certificado'],
          maxSelect: 1,
        },
        {
          name: 'arquivo_url',
          type: 'text',
          required: true,
          max: 1000,
        },
        {
          name: 'nivel_minimo_acesso',
          type: 'select',
          required: true,
          values: ['Sentinela Preventivo', 'Controle Operacional', 'Maestro Engenharia'],
          maxSelect: 1,
        },
        {
          name: 'ativo',
          type: 'bool',
          required: false,
        },
        {
          name: 'criado_em',
          type: 'date',
          required: false,
        },
        {
          name: 'descricao',
          type: 'text',
          required: false,
          max: 1000,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_docs_tipo ON documentos_tecnicos (tipo)',
        'CREATE INDEX idx_docs_nivel ON documentos_tecnicos (nivel_minimo_acesso)',
        'CREATE INDEX idx_docs_ativo ON documentos_tecnicos (ativo)',
      ],
    })
    app.save(documentosTecnicos)

    // 4. Estender a coleção contracts existente adicionando nivel_contrato de forma retrocompatível
    const contractsCol = app.findCollectionByNameOrId('contracts')
    if (!contractsCol.fields.getByName('nivel_contrato')) {
      contractsCol.fields.add(
        new SelectField({
          name: 'nivel_contrato',
          required: false,
          values: ['Sentinela Preventivo', 'Controle Operacional', 'Maestro Engenharia'],
          maxSelect: 1,
        }),
      )
      app.save(contractsCol)
    }
  },
  (app) => {
    try {
      const docs = app.findCollectionByNameOrId('documentos_tecnicos')
      app.delete(docs)
    } catch (_) {}

    try {
      const os = app.findCollectionByNameOrId('ordens_servico')
      app.delete(os)
    } catch (_) {}

    try {
      const clientes = app.findCollectionByNameOrId('clientes')
      app.delete(clientes)
    } catch (_) {}
  },
)
