// Área de equipe (Painel de Vendas): bloqueia o login de contas ainda não aprovadas pelo administrador.
// Só bloqueia com senha correta, para não revelar o status de contas com senha errada.
onRecordAuthWithPasswordRequest(function (e) {
  if (
    e.record &&
    e.record.get('status_acesso') === 'em_analise' &&
    e.record.validatePassword(e.password)
  ) {
    throw new BadRequestError(
      'Seu acesso está em análise. A liberação ocorre em até 24 horas e você receberá a confirmação no e-mail informado.',
    )
  }
  e.next()
}, 'users')
