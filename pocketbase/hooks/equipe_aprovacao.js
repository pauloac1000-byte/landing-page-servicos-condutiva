// Área de equipe (Painel de Vendas): e-mail de aprovação de acesso.
// Disparado quando o administrador muda status_acesso de 'em_analise' para 'aprovado' no painel do banco.
// Regras Skip Cloud: toda a lógica inline no callback (scoping goja).

onRecordAfterUpdateSuccess(function (e) {
  e.next()
  try {
    var antes = e.record.original().get('status_acesso')
    var agora = e.record.get('status_acesso')
    if (antes !== 'em_analise' || agora !== 'aprovado') return

    var host = $os.getenv('SMTP_HOST') || ''
    var smtpEnabled = $os.getenv('SMTP_ENABLED')
    if (host || smtpEnabled === 'true') {
      var settings = $app.settings()
      settings.smtp.enabled = true
      if (host) settings.smtp.host = host
      settings.smtp.port = parseInt($os.getenv('SMTP_PORT') || '587', 10) || 587
      settings.smtp.username = $os.getenv('SMTP_USERNAME') || ''
      settings.smtp.password = $os.getenv('SMTP_PASSWORD') || ''
      var senderAddressCfg = $os.getenv('SMTP_SENDER_ADDRESS')
      var senderNameCfg = $os.getenv('SMTP_SENDER_NAME') || 'Condutiva'
      if (senderAddressCfg) settings.meta.senderAddress = senderAddressCfg
      if (senderNameCfg) settings.meta.senderName = senderNameCfg
    }

    var senderAddr =
      $os.getenv('SMTP_SENDER_ADDRESS') ||
      $app.settings().meta.senderAddress ||
      'paulo@condutiva.com.br'
    var senderNm =
      $os.getenv('SMTP_SENDER_NAME') || $app.settings().meta.senderName || 'Condutiva Serviços'

    var nome = e.record.get('name') || 'Colaborador(a)'
    var email = e.record.get('email')
    var html =
      '<div style="font-family:Arial,Helvetica,sans-serif;color:#212529;max-width:600px;line-height:1.5">' +
      '<div style="background:#ffffff;padding:20px;border:1px solid #E5E7EB;border-radius:8px 8px 0 0">' +
      '<div style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#689F38;font-weight:700">Condutiva Serviços • Painel de Vendas</div>' +
      '<h1 style="margin:6px 0 0;font-size:20px;color:#212529">Acesso aprovado</h1>' +
      '</div>' +
      '<div style="border:1px solid #E5E7EB;border-top:none;padding:24px;border-radius:0 0 8px 8px;background:#ffffff">' +
      '<p style="margin:0 0 16px;font-size:14px;color:#343A40">Olá, <strong>' +
      nome +
      '</strong>.</p>' +
      '<p style="margin:0 0 16px;font-size:14px;color:#343A40">Seu acesso ao Painel de Vendas de Serviços da Condutiva foi aprovado. Você já pode entrar no painel com o seu e-mail e senha.</p>' +
      '</div>' +
      '</div>'

    var message = new MailerMessage({
      from: { address: senderAddr, name: senderNm },
      to: [{ address: email }],
      subject: 'Condutiva Serviços - Acesso ao Painel de Vendas aprovado',
      html: html,
    })
    $app.newMailClient().send(message)
  } catch (err) {
    console.log('equipe_aprovacao: falha ao enviar aprovação:', err ? err.message : err)
  }
}, 'users')
