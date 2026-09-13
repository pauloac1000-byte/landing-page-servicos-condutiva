migrate(
  (app) => {
    // Buscar a coleção ordens_servico e o cliente CTR-2025-0142
    const osCol = app.findCollectionByNameOrId('ordens_servico')
    const cliente = app.findFirstRecordByData('clientes', 'numero_contrato', 'CTR-2025-0142')

    // Verificar se já existe a OS-8842 para evitar duplicações
    try {
      app.findFirstRecordByData('ordens_servico', 'numero_os', 'OS-8842')
    } catch (_) {
      const osRecord = new Record(osCol)
      osRecord.set('numero_os', 'OS-8842')
      osRecord.set('contrato_id', cliente.id)
      osRecord.set('avaliacao_realizada', false)
      osRecord.set('data', '2025-03-10')
      osRecord.set('status', 'executada')
      osRecord.set(
        'descricao_servico',
        'Manutenção preventiva e calibração periódica em analisadores de umidade e pH da linha de produção',
      )
      osRecord.set(
        'observacoes',
        'Equipamentos com conformidade metrológica comprovada e laudos técnicos anexos.',
      )
      osRecord.set('tecnico_responsavel', 'Rafael Albuquerque')
      app.save(osRecord)
    }
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData('ordens_servico', 'numero_os', 'OS-8842')
      app.delete(record)
    } catch (_) {}
  },
)
