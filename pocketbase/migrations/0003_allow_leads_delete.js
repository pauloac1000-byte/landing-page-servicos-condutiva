migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('leads')
    col.deleteRule = ''
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('leads')
    col.deleteRule = null
    app.save(col)
  },
)
