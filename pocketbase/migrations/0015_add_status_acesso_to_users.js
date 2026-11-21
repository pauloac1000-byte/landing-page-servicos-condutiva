// Área de equipe (Painel de Vendas): campos de aprovação de acesso na coleção users.
// status_acesso: 'em_analise' (aguardando o administrador) | 'aprovado'.
// Contas já existentes são consideradas aprovadas.
migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('users')

    if (!users.fields.getByName('status_acesso')) {
      users.fields.add(
        new SelectField({
          name: 'status_acesso',
          required: false,
          values: ['em_analise', 'aprovado'],
          maxSelect: 1,
        }),
      )
    }
    if (!users.fields.getByName('telefone')) {
      users.fields.add(new TextField({ name: 'telefone', required: false, max: 40 }))
    }
    if (!users.fields.getByName('vinculo')) {
      users.fields.add(new TextField({ name: 'vinculo', required: false, max: 120 }))
    }
    if (!users.fields.getByName('senha_pendente')) {
      users.fields.add(new BoolField({ name: 'senha_pendente', required: false }))
    }

    app.save(users)

    try {
      app
        .db()
        .newQuery(
          "UPDATE users SET status_acesso = 'aprovado' WHERE status_acesso IS NULL OR status_acesso = ''",
        )
        .execute()
    } catch (err) {
      console.log('Aviso ao preencher status_acesso inicial:', err ? err.message : err)
    }
  },
  (app) => {
    try {
      const users = app.findCollectionByNameOrId('users')
      ;['status_acesso', 'telefone', 'vinculo', 'senha_pendente'].forEach((nome) => {
        if (users.fields.getByName(nome)) users.fields.removeByName(nome)
      })
      app.save(users)
    } catch (_) {}
  },
)
