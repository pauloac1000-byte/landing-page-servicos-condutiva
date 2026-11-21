// Área de equipe (Painel de Vendas): cadastro/solicitação de acesso e redefinição de senha.
// Regras Skip Cloud: toda a lógica inline nos callbacks (scoping goja).
// Remetente e padrão de texto iguais aos hooks recuperar_senha e on_lead_create.

routerAdd('POST', '/backend/v1/equipe/cadastrar', function (e) {
  var data = e.requestInfo().body || {}
  var nome = String(data.nome || '').trim()
  var email = String(data.email || '')
    .trim()
    .toLowerCase()
  var telefone = String(data.telefone || '').trim()
  var vinculo = String(data.vinculo || '').trim()
  var senha = typeof data.senha === 'string' ? data.senha : ''
  var confirmar = typeof data.confirmar === 'string' ? data.confirmar : ''

  if (!nome || !email || email.indexOf('@') < 1) {
    return e.json(400, { message: 'Informe nome e um e-mail válido.' })
  }
  if (senha && (senha.length < 8 || senha !== confirmar)) {
    return e.json(400, {
      message: 'A senha deve ter pelo menos 8 caracteres e ser confirmada corretamente.',
    })
  }

  var existente = null
  try {
    existente = $app.findAuthRecordByEmail('users', email)
  } catch (_) {}
  if (existente) {
    return e.json(409, { message: 'Já existe uma conta cadastrada com este e-mail.' })
  }

  var semSenha = !senha
  var senhaFinal =
    senha || Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + 'Aa1'

  var rec = new Record($app.findCollectionByNameOrId('users'))
  rec.set('name', nome)
  rec.set('email', email)
  rec.set('telefone', telefone)
  rec.set('vinculo', vinculo)
  rec.set('status_acesso', 'em_analise')
  rec.set('senha_pendente', semSenha)
  rec.setPassword(senhaFinal)
  $app.save(rec)

  // E-mail de confirmação de cadastro (não bloqueia o cadastro se o envio falhar)
  try {
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

    var esc = function (s) {
      if (s === null || s === undefined) return ''
      return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    }

    var html =
      '<div style="font-family:Arial,Helvetica,sans-serif;color:#212529;max-width:600px;line-height:1.5">' +
      '<div style="background:#ffffff;padding:20px;border:1px solid #E5E7EB;border-radius:8px 8px 0 0">' +
      '<div style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#689F38;font-weight:700">Condutiva Serviços • Painel de Vendas</div>' +
      '<h1 style="margin:6px 0 0;font-size:20px;color:#212529">Confirmação de cadastro</h1>' +
      '</div>' +
      '<div style="border:1px solid #E5E7EB;border-top:none;padding:24px;border-radius:0 0 8px 8px;background:#ffffff">' +
      '<p style="margin:0 0 16px;font-size:14px;color:#343A40">Olá, <strong>' +
      esc(nome) +
      '</strong>.</p>' +
      '<p style="margin:0 0 16px;font-size:14px;color:#343A40">Recebemos o seu cadastro de acesso ao Painel de Vendas de Serviços da Condutiva. A liberação do seu acesso passa pela avaliação do administrador da Condutiva e ocorre em até 24 horas.</p>' +
      '<div style="margin-top:18px;padding:12px 14px;background:#FFF8E1;border-left:4px solid #FFC107;border-radius:4px;color:#5D4037;font-size:13px;line-height:1.4">' +
      'Você receberá a confirmação neste mesmo e-mail assim que o seu acesso for liberado.' +
      '</div>' +
      '<p style="margin-top:20px;font-size:12px;color:#6C757D">Se você não solicitou este cadastro, desconsidere esta mensagem.</p>' +
      '</div>' +
      '</div>'

    var message = new MailerMessage({
      from: { address: senderAddr, name: senderNm },
      to: [{ address: email }],
      subject: 'Condutiva Serviços - Confirmação de cadastro no Painel de Vendas',
      html: html,
    })
    $app.newMailClient().send(message)
  } catch (mailErr) {
    console.log('equipe_acesso: falha ao enviar confirmação:', mailErr ? mailErr.message : mailErr)
  }

  return e.json(200, { ok: true })
})

routerAdd('POST', '/backend/v1/equipe/redefinir-senha', function (e) {
  var data = e.requestInfo().body || {}
  var email = String(data.email || '')
    .trim()
    .toLowerCase()
  var atual = typeof data.senha_atual === 'string' ? data.senha_atual : ''
  var nova = typeof data.nova_senha === 'string' ? data.nova_senha : ''
  var confirmar = typeof data.confirmar === 'string' ? data.confirmar : ''

  if (!email || !atual) {
    return e.json(400, { message: 'Informe o e-mail e a senha atual.' })
  }
  if (nova.length < 8 || nova !== confirmar) {
    return e.json(400, {
      message: 'A nova senha deve ter pelo menos 8 caracteres e ser confirmada corretamente.',
    })
  }

  var rec = null
  try {
    rec = $app.findAuthRecordByEmail('users', email)
  } catch (_) {}
  if (!rec || !rec.validatePassword(atual)) {
    return e.json(400, { message: 'E-mail ou senha atual incorretos.' })
  }

  rec.setPassword(nova)
  rec.set('senha_pendente', false)
  $app.save(rec)
  return e.json(200, { ok: true })
})
