migrate(
  (app) => {
    const ordensServico = app.findCollectionByNameOrId('ordens_servico')

    // Adiciona campo relatorio_arquivo como FileField para armazenar o PDF do relatório
    if (!ordensServico.fields.getByName('relatorio_arquivo')) {
      ordensServico.fields.add(
        new FileField({
          name: 'relatorio_arquivo',
          required: false,
          maxSelect: 1,
          maxSize: 15728640, // 15MB
          mimeTypes: ['application/pdf'],
        }),
      )
    }

    app.save(ordensServico)
  },
  (app) => {
    try {
      const ordensServico = app.findCollectionByNameOrId('ordens_servico')
      if (ordensServico.fields.getByName('relatorio_arquivo')) {
        ordensServico.fields.removeByName('relatorio_arquivo')
      }
      app.save(ordensServico)
    } catch (_) {}
  },
)
