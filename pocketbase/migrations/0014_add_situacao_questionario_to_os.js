migrate(
  (app) => {
    const ordensServico = app.findCollectionByNameOrId('ordens_servico')

    // Adiciona campo situacao_questionario na coleção ordens_servico
    if (!ordensServico.fields.getByName('situacao_questionario')) {
      ordensServico.fields.add(
        new SelectField({
          name: 'situacao_questionario',
          required: false,
          values: ['pendente', 'respondido'],
          maxSelect: 1,
        }),
      )
    }

    app.save(ordensServico)

    // Preenche registros existentes: se avaliacao_realizada for true => 'respondido', senão 'pendente'
    try {
      app
        .db()
        .newQuery(
          "UPDATE ordens_servico SET situacao_questionario = CASE WHEN avaliacao_realizada = 1 THEN 'respondido' ELSE 'pendente' END WHERE situacao_questionario IS NULL OR situacao_questionario = ''",
        )
        .execute()
    } catch (err) {
      console.log('Aviso ao sincronizar situacao_questionario inicial:', err ? err.message : err)
    }

    // Permite que o campo service_order_number na coleção contracts seja opcional / preenchido automaticamente
    try {
      const contractsCol = app.findCollectionByNameOrId('contracts')
      const soField = contractsCol.fields.getByName('service_order_number')
      if (soField) {
        soField.required = false
        app.save(contractsCol)
      }
    } catch (err) {
      console.log('Aviso ao atualizar service_order_number em contracts:', err ? err.message : err)
    }
  },
  (app) => {
    try {
      const ordensServico = app.findCollectionByNameOrId('ordens_servico')
      if (ordensServico.fields.getByName('situacao_questionario')) {
        ordensServico.fields.removeByName('situacao_questionario')
      }
      app.save(ordensServico)
    } catch (_) {}
  },
)
