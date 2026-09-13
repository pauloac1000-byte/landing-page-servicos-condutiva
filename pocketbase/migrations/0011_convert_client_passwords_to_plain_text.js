migrate(
  (app) => {
    // Migração de senhas para texto puro legível pelo administrador
    // Mapeamento das senhas originais dos contratos seeded e cadastrados:
    // - CTR-2025-0142: teste1234 (solicitado explicitamente pelo usuário após teste)
    // - CTR-2025-0189: Klabin@2025
    // - CTR-2025-0204: Gerdau@2025
    // - CTR-2025-0215: Bunge@2025
    // - CTR-2025-0230: Yara@2025
    // - CTR-2025-0248: Nestle@2025

    const senhasContratos = {
      'CTR-2025-0142': 'teste1234',
      'CTR-2025-0189': 'Klabin@2025',
      'CTR-2025-0204': 'Gerdau@2025',
      'CTR-2025-0215': 'Bunge@2025',
      'CTR-2025-0230': 'Yara@2025',
      'CTR-2025-0248': 'Nestle@2025',
    }

    for (const [numeroContrato, senhaPlain] of Object.entries(senhasContratos)) {
      try {
        const cliente = app.findFirstRecordByData('clientes', 'numero_contrato', numeroContrato)
        cliente.set('senha', senhaPlain)
        app.save(cliente)
      } catch (err) {
        console.log(
          'Erro ao atualizar senha plain para ' + numeroContrato + ':',
          err ? err.message : err,
        )
      }
    }
  },
  (app) => {
    // down migration
  },
)
