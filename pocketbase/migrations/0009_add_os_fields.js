migrate(
  (app) => {
    const ordensServico = app.findCollectionByNameOrId('ordens_servico')

    // 1. Campo: data (data da ordem de serviço)
    if (!ordensServico.fields.getByName('data')) {
      ordensServico.fields.add(
        new DateField({
          name: 'data',
          required: false,
        }),
      )
    }

    // 2. Campo: status (aberta ou executada)
    if (!ordensServico.fields.getByName('status')) {
      ordensServico.fields.add(
        new SelectField({
          name: 'status',
          required: false,
          values: ['aberta', 'executada'],
          maxSelect: 1,
        }),
      )
    }

    // 3. Campo: arquivo (upload do arquivo da OS em PDF)
    if (!ordensServico.fields.getByName('arquivo')) {
      ordensServico.fields.add(
        new FileField({
          name: 'arquivo',
          required: false,
          maxSelect: 1,
          maxSize: 10485760, // 10MB
          mimeTypes: ['application/pdf'],
        }),
      )
    }

    // 4. Campo: observacoes (anotações e observações adicionais da OS)
    if (!ordensServico.fields.getByName('observacoes')) {
      ordensServico.fields.add(
        new TextField({
          name: 'observacoes',
          required: false,
          max: 2000,
        }),
      )
    }

    app.save(ordensServico)
  },
  (app) => {
    try {
      const ordensServico = app.findCollectionByNameOrId('ordens_servico')
      if (ordensServico.fields.getByName('observacoes')) {
        ordensServico.fields.removeByName('observacoes')
      }
      if (ordensServico.fields.getByName('arquivo')) {
        ordensServico.fields.removeByName('arquivo')
      }
      if (ordensServico.fields.getByName('status')) {
        ordensServico.fields.removeByName('status')
      }
      if (ordensServico.fields.getByName('data')) {
        ordensServico.fields.removeByName('data')
      }
      app.save(ordensServico)
    } catch (_) {}
  },
)
