migrate(
  (app) => {
    const ordensServico = app.findCollectionByNameOrId('ordens_servico')

    // Adiciona campo relatorio_pdf_url na coleção ordens_servico
    if (!ordensServico.fields.getByName('relatorio_pdf_url')) {
      ordensServico.fields.add(
        new TextField({
          name: 'relatorio_pdf_url',
          required: false,
        }),
      )
    }

    app.save(ordensServico)
  },
  (app) => {
    try {
      const ordensServico = app.findCollectionByNameOrId('ordens_servico')
      if (ordensServico.fields.getByName('relatorio_pdf_url')) {
        ordensServico.fields.removeByName('relatorio_pdf_url')
      }
      app.save(ordensServico)
    } catch (_) {}
  },
)
