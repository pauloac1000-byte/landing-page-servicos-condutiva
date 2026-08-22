migrate(
  (app) => {
    const collection = new Collection({
      name: 'leads',
      type: 'base',
      // Public can create (anonymous diagnostic requests).
      // Reads/updates/deletes are superuser-only (commercial team via admin).
      listRule: null,
      viewRule: null,
      createRule: '',
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'full_name', type: 'text', required: true, min: 2, max: 200 },
        { name: 'company', type: 'text', required: true, min: 2, max: 200 },
        { name: 'email', type: 'email', required: true },
        { name: 'phone', type: 'text', required: true, min: 8, max: 30 },
        { name: 'segment', type: 'text', max: 100 },
        { name: 'city_state', type: 'text', max: 200 },
        { name: 'equipment_count', type: 'text', max: 50 },
        { name: 'main_challenge', type: 'text', max: 5000 },
        // LGPD consent must be explicitly true (required bool rejects false/missing).
        { name: 'lgpd_consent', type: 'bool', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_leads_created ON leads (created)',
        'CREATE INDEX idx_leads_email ON leads (email)',
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('leads')
    app.delete(collection)
  },
)
