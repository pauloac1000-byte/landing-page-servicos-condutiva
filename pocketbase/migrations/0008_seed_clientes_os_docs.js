migrate(
  (app) => {
    const clientesCol = app.findCollectionByNameOrId('clientes')
    const osCol = app.findCollectionByNameOrId('ordens_servico')
    const docsCol = app.findCollectionByNameOrId('documentos_tecnicos')
    const contractsCol = app.findCollectionByNameOrId('contracts')

    // Helper: hash de senha usando SHA-256 via $security.sha256
    // Em caso de verificação no frontend/backend: $security.sha256(senhaDigitada + ":condutiva_salt")
    const hashSenha = (raw) => {
      return $security.sha256(raw + ':condutiva_client_salt_2026')
    }

    // 1. Clientes com contratos de exemplo e níveis variados
    const seedClientes = [
      {
        numero_contrato: 'CTR-2025-0142',
        nome_cliente: 'Usina São Martinho S/A (Unidade Pradópolis)',
        email: 'manutencao.instrumentacao@saomartinho.com.br',
        senha_raw: 'Martin@2025',
        nivel_contrato: 'Controle Operacional',
        primeiro_acesso_em: '2025-01-15 08:30:00.000Z',
        senha_alterada_em: '2025-01-15 08:30:00.000Z',
        os_list: [
          {
            numero_os: 'OS-8841',
            avaliacao_realizada: true,
            descricao_servico:
              'Calibração RBC e manutenção em transmissores de vazão mássica na moenda',
            tecnico_responsavel: 'Rafael Albuquerque',
          },
        ],
      },
      {
        numero_contrato: 'CTR-2025-0189',
        nome_cliente: 'Klabin Papel e Celulose (Monte Alegre)',
        email: 'automacao.montalegre@klabin.com.br',
        senha_raw: 'Klabin@2025',
        nivel_contrato: 'Sentinela Preventivo', // Testar negação da Documentação Técnica!
        primeiro_acesso_em: '2025-02-01 10:00:00.000Z',
        senha_alterada_em: '2025-02-01 10:00:00.000Z',
        os_list: [
          {
            numero_os: 'OS-8920',
            avaliacao_realizada: false,
            descricao_servico: 'Inspeção periódica de malha de controle e termografia preventiva',
            tecnico_responsavel: 'Lucas Pinho',
          },
        ],
      },
      {
        numero_contrato: 'CTR-2025-0204',
        nome_cliente: 'Gerdau Aços Longos (Usina Araçariguama)',
        email: 'engenharia.manutencao@gerdau.com.br',
        senha_raw: 'Gerdau@2025',
        nivel_contrato: 'Maestro Engenharia', // Plano completo
        primeiro_acesso_em: '2025-02-10 14:15:00.000Z',
        senha_alterada_em: '2025-02-10 14:15:00.000Z',
        os_list: [
          {
            numero_os: 'OS-8975',
            avaliacao_realizada: true,
            descricao_servico:
              'Manutenção corretiva e ajuste em sensores de temperatura do forno de laminação',
            tecnico_responsavel: 'Carlos Mendes',
          },
        ],
      },
      {
        numero_contrato: 'CTR-2025-0215',
        nome_cliente: 'Bunge Alimentos (Complexo Portuário Santos)',
        email: 'supervisao.eletrica@bunge.com.br',
        senha_raw: 'Bunge@2025',
        nivel_contrato: 'Sentinela Preventivo',
        primeiro_acesso_em: '2025-02-12 09:40:00.000Z',
        senha_alterada_em: '2025-02-12 09:40:00.000Z',
        os_list: [
          {
            numero_os: 'OS-9012',
            avaliacao_realizada: false,
            descricao_servico:
              'Manutenção preventiva em transmissores de nível ultrassônicos dos silos de grãos',
            tecnico_responsavel: 'Thiago Faria',
          },
        ],
      },
      {
        numero_contrato: 'CTR-2025-0230',
        nome_cliente: 'Yara Fertilizantes (Unidade Paulínia)',
        email: 'instrumentacao.paulinia@yara.com',
        senha_raw: 'Yara@2025',
        nivel_contrato: 'Controle Operacional',
        primeiro_acesso_em: '2025-02-20 11:20:00.000Z',
        senha_alterada_em: '2025-02-20 11:20:00.000Z',
        os_list: [
          {
            numero_os: 'OS-9088',
            avaliacao_realizada: true,
            descricao_servico:
              'Verificação periódica e laudo de conformidade em balanças integradoras e medidores de pH',
            tecnico_responsavel: 'Rafael Albuquerque',
          },
        ],
      },
      {
        numero_contrato: 'CTR-2025-0248',
        nome_cliente: 'Nestlé Brasil (Fábrica Araras)',
        email: 'facilities.qualidade@br.nestle.com',
        senha_raw: 'Nestle@2025',
        nivel_contrato: 'Maestro Engenharia',
        primeiro_acesso_em: '2025-03-01 16:00:00.000Z',
        senha_alterada_em: '2025-03-01 16:00:00.000Z',
        os_list: [
          {
            numero_os: 'OS-9134',
            avaliacao_realizada: false,
            descricao_servico:
              'Comissionamento e calibração de malha crítica de vapor e esterilização',
            tecnico_responsavel: 'Mateus Silveira',
          },
        ],
      },
    ]

    for (const c of seedClientes) {
      let clienteRecord = null
      try {
        clienteRecord = app.findFirstRecordByData('clientes', 'numero_contrato', c.numero_contrato)
      } catch (_) {
        clienteRecord = new Record(clientesCol)
        clienteRecord.set('numero_contrato', c.numero_contrato)
        clienteRecord.set('nome_cliente', c.nome_cliente)
        clienteRecord.set('email', c.email)
        clienteRecord.set('senha', hashSenha(c.senha_raw))
        clienteRecord.set('nivel_contrato', c.nivel_contrato)
        clienteRecord.set('primeiro_acesso_em', c.primeiro_acesso_em)
        clienteRecord.set('senha_alterada_em', c.senha_alterada_em)
        app.save(clienteRecord)
      }

      // Sincronizar campo nivel_contrato no registro de contracts já existente
      try {
        const contractRec = app.findFirstRecordByData(
          'contracts',
          'contract_number',
          c.numero_contrato,
        )
        if (contractRec) {
          contractRec.set('nivel_contrato', c.nivel_contrato)
          app.save(contractRec)
        }
      } catch (_) {}

      // Cadastrar Ordens de Serviço vinculadas ao cliente
      for (const osItem of c.os_list) {
        try {
          app.findFirstRecordByData('ordens_servico', 'numero_os', osItem.numero_os)
        } catch (_) {
          const osRecord = new Record(osCol)
          osRecord.set('numero_os', osItem.numero_os)
          osRecord.set('contrato_id', clienteRecord.id)
          osRecord.set('avaliacao_realizada', osItem.avaliacao_realizada)
          osRecord.set('descricao_servico', osItem.descricao_servico)
          osRecord.set('tecnico_responsavel', osItem.tecnico_responsavel)
          app.save(osRecord)
        }
      }
    }

    // 2. Biblioteca de Documentos Técnicos de Exemplo
    const seedDocs = [
      {
        nome: 'Manual de Operação e Instalação CC5200',
        tipo: 'Manual',
        arquivo_url:
          'https://servicos-condutiva-copy-2bff8.shrd00.internal.goskip.dev/docs/manual-cc5200-v2.pdf',
        nivel_minimo_acesso: 'Controle Operacional',
        ativo: true,
        criado_em: '2025-01-10 10:00:00.000Z',
        descricao:
          'Guia completo de comissionamento, parametrização 4-20mA/HART e diagnóstico em campo do transmissor inteligente CC5200.',
      },
      {
        nome: 'Esquema Elétrico e Diagrama de Conexões CC5200',
        tipo: 'Esquema',
        arquivo_url:
          'https://servicos-condutiva-copy-2bff8.shrd00.internal.goskip.dev/docs/esquema-eletrico-cc5200.pdf',
        nivel_minimo_acesso: 'Controle Operacional',
        ativo: true,
        criado_em: '2025-01-12 14:30:00.000Z',
        descricao:
          'Diagramas de ligação unifilar, alimentação 24Vdc, proteção contra surtos e barreira intrinsecamente segura Ex-ia.',
      },
      {
        nome: 'Datasheet de Especificações Técnicas CC5200',
        tipo: 'Datasheet',
        arquivo_url:
          'https://servicos-condutiva-copy-2bff8.shrd00.internal.goskip.dev/docs/datasheet-cc5200-rev4.pdf',
        nivel_minimo_acesso: 'Sentinela Preventivo', // Acessível a todos os planos
        ativo: true,
        criado_em: '2025-01-15 09:00:00.000Z',
        descricao:
          'Tabela de exatidão metrológica, limites operacionais de temperatura/pressão, grau de proteção IP67 e materiais construtivos.',
      },
      {
        nome: 'Certificado Padrão de Calibração Metrológica RBC',
        tipo: 'Certificado',
        arquivo_url:
          'https://servicos-condutiva-copy-2bff8.shrd00.internal.goskip.dev/docs/modelo-certificado-rbc-condutiva.pdf',
        nivel_minimo_acesso: 'Maestro Engenharia', // Exclusivo plano avançado
        ativo: true,
        criado_em: '2025-01-20 11:00:00.000Z',
        descricao:
          'Modelo e diretrizes de rastreabilidade RBC/Inmetro para auditorias ISO 9001, com estimativa de incerteza e curva de histerese.',
      },
      {
        nome: 'Guia de Engenharia de Aplicação e Otimização de Malhas',
        tipo: 'Manual',
        arquivo_url:
          'https://servicos-condutiva-copy-2bff8.shrd00.internal.goskip.dev/docs/guia-engenharia-aplicacao.pdf',
        nivel_minimo_acesso: 'Maestro Engenharia',
        ativo: true,
        criado_em: '2025-02-05 15:45:00.000Z',
        descricao:
          'Metodologia avançada Condutiva de sintonia PID, modelagem matemática de malhas complexas e controle preditivo multivariável.',
      },
    ]

    for (const d of seedDocs) {
      try {
        app.findFirstRecordByData('documentos_tecnicos', 'nome', d.nome)
      } catch (_) {
        const docRecord = new Record(docsCol)
        docRecord.set('nome', d.nome)
        docRecord.set('tipo', d.tipo)
        docRecord.set('arquivo_url', d.arquivo_url)
        docRecord.set('nivel_minimo_acesso', d.nivel_minimo_acesso)
        docRecord.set('ativo', d.ativo)
        docRecord.set('criado_em', d.criado_em)
        docRecord.set('descricao', d.descricao)
        app.save(docRecord)
      }
    }
  },
  (app) => {
    // down migration
  },
)
