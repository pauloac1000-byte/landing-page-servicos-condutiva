migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('leads')
    col.listRule = ''
    col.viewRule = ''
    app.save(col)

    // Seed realistic leads if the collection is empty
    const count = app.countRecords('leads')
    if (count === 0) {
      const sampleLeads = [
        {
          full_name: 'Carlos Eduardo Silveira',
          company: 'AgroSul Cooperativa Agroindustrial',
          email: 'carlos.silveira@agrosul.coop.br',
          phone: '(19) 98765-4321',
          segment: 'Agronegócio',
          city_state: 'Ribeirão Preto, SP',
          equipment_count: '8 a 15',
          main_challenge:
            'Desvio de calibração frequente em balanças de fluxo e sensores de umidade nos silos de recebimento de grãos.',
          lgpd_consent: true,
        },
        {
          full_name: 'Mariana Guimarães',
          company: 'Laticínios Vale da Serra',
          email: 'mariana.guimaraes@valedaserra.ind.br',
          phone: '(35) 99812-3344',
          segment: 'Alimentos & Bebidas',
          city_state: 'Pouso Alegre, MG',
          equipment_count: '4 a 8',
          main_challenge:
            'Necessidade de integração CLP/IHM com supervisório centralizado e manutenção preventiva em painéis de envase.',
          lgpd_consent: true,
        },
        {
          full_name: 'Roberto Mendes',
          company: 'Mineração Serra Dourada S.A.',
          email: 'roberto.mendes@serradourada.com.br',
          phone: '(31) 99123-8877',
          segment: 'Mineração',
          city_state: 'Nova Lima, MG',
          equipment_count: 'Mais de 15',
          main_challenge:
            'Ambiente agressivo causando falhas elétricas em inversores e sensores. Precisamos de laudos rastreáveis e suporte com SLA prioritário.',
          lgpd_consent: true,
        },
        {
          full_name: 'Fernanda Rocha',
          company: 'Concrebras Pisos e Estruturas',
          email: 'fernanda.rocha@concrebras.com.br',
          phone: '(11) 97654-1122',
          segment: 'Construção',
          city_state: 'Campinas, SP',
          equipment_count: '1 a 3',
          main_challenge:
            'Variação na dosagem de água e agregados nas betoneiras industriais; buscamos calibração e diagnóstico do sistema de pesagem.',
          lgpd_consent: true,
        },
      ]

      for (const item of sampleLeads) {
        const record = new Record(col)
        record.set('full_name', item.full_name)
        record.set('company', item.company)
        record.set('email', item.email)
        record.set('phone', item.phone)
        record.set('segment', item.segment)
        record.set('city_state', item.city_state)
        record.set('equipment_count', item.equipment_count)
        record.set('main_challenge', item.main_challenge)
        record.set('lgpd_consent', item.lgpd_consent)
        app.save(record)
      }
    }
  },
  (app) => {
    const col = app.findCollectionByNameOrId('leads')
    col.listRule = null
    col.viewRule = null
    app.save(col)
  },
)
