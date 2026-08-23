// Notifies the commercial team by email whenever a new diagnostic lead is created.
// Uses an after-success hook so it fires only after the DB transaction commits:
// a failed email never blocks or rolls back the persisted lead record.
onRecordAfterCreateSuccess((e) => {
  const record = e.record

  // Configure SMTP settings from environment variables if SMTP_HOST is present
  // or SMTP_ENABLED is explicitly true.
  try {
    const host = $os.getenv('SMTP_HOST') || ''
    const smtpEnabled = $os.getenv('SMTP_ENABLED')
    if (host || smtpEnabled === 'true') {
      const settings = $app.settings()
      settings.smtp.enabled = true
      if (host) {
        settings.smtp.host = host
      }
      const portEnv = $os.getenv('SMTP_PORT') || '587'
      settings.smtp.port = parseInt(portEnv, 10) || 587
      settings.smtp.username = $os.getenv('SMTP_USERNAME') || ''
      settings.smtp.password = $os.getenv('SMTP_PASSWORD') || ''
      const senderAddress = $os.getenv('SMTP_SENDER_ADDRESS')
      const senderName = $os.getenv('SMTP_SENDER_NAME') || 'Condutiva'
      if (senderAddress) settings.meta.senderAddress = senderAddress
      if (senderName) settings.meta.senderName = senderName
    }
  } catch (err) {
    console.log('lead email: SMTP env config error:', err ? err.message : err)
  }

  const recipients = [
    'comercial1@condutiva.com.br',
    'liandra@condutiva.com.br',
    'paulo@condutiva.com.br',
  ]

  const fullName = record.get('full_name') || ''
  const company = record.get('company') || ''
  const email = record.get('email') || ''
  const phone = record.get('phone') || ''
  const segment = record.get('segment') || 'Não informado'
  const cityState = record.get('city_state') || 'Não informado'
  const equipmentCount = record.get('equipment_count') || 'Não informado'
  const mainChallenge = record.get('main_challenge') || 'Não informado'

  const esc = function (s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  const subject = 'Novo Lead - Solicitacao de Diagnostico' + (company ? ' | ' + company : '')

  const rows = [
    ['Nome do responsavel', fullName],
    ['Empresa', company],
    ['E-mail', email],
    ['Telefone / WhatsApp', phone],
    ['Segmento', segment],
    ['Cidade / Estado', cityState],
    ['Quantidade de equipamentos', equipmentCount],
    ['Desafio / necessidade', mainChallenge],
  ]

  var rowsHtml = ''
  for (var i = 0; i < rows.length; i++) {
    rowsHtml +=
      '<tr>' +
      '<td style="padding:8px 12px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:600;width:200px;vertical-align:top">' +
      esc(rows[i][0]) +
      '</td>' +
      '<td style="padding:8px 12px;border:1px solid #e2e8f0;vertical-align:top">' +
      esc(rows[i][1]) +
      '</td>' +
      '</tr>'
  }

  const html =
    '<div style="font-family:Arial,Helvetica,sans-serif;color:#0f172a;max-width:640px">' +
    '<h2 style="margin:0 0 8px;font-size:18px">Nova solicitacao de diagnostico tecnico</h2>' +
    '<p style="margin:0 0 16px;color:#475569;font-size:14px">Um novo lead foi registrado pelo site Condutiva. Entre em contato o quanto antes.</p>' +
    '<table style="border-collapse:collapse;width:100%;font-size:13px">' +
    rowsHtml +
    '</table>' +
    '<p style="margin-top:16px;color:#64748b;font-size:12px">Mensagem automatica enviada na criacao de um novo registro na colecao leads.</p>' +
    '</div>'

  try {
    const senderAddr =
      $os.getenv('SMTP_SENDER_ADDRESS') ||
      $app.settings().meta.senderAddress ||
      'paulo@condutiva.com.br'
    const senderNm =
      $os.getenv('SMTP_SENDER_NAME') || $app.settings().meta.senderName || 'Condutiva'

    const message = new MailerMessage({
      from: {
        address: senderAddr,
        name: senderNm,
      },
      to: recipients.map(function (addr) {
        return { address: addr }
      }),
      subject: subject,
      html: html,
    })
    $app.newMailClient().send(message)
  } catch (err) {
    console.log('lead email: failed to send notification:', err ? err.message : err)
  }

  e.next()
}, 'leads')
