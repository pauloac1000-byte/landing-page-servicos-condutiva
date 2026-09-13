// Endpoint customizado para recuperação de senha da Área do Cliente
// Gera uma senha provisória aleatória, envia por e-mail e atualiza o hash do cliente somente após o envio com sucesso.
// Regras Skip Cloud:
// - Toda a lógica deve ser inline no callback (scoping goja)
// - routerAdd("POST", "/backend/v1/recuperar-senha", (e) => { ... })

routerAdd('POST', '/backend/v1/recuperar-senha', (e) => {
  try {
    const data = e.requestInfo().body || {}
    const rawContrato = data.numero_contrato
    if (!rawContrato || typeof rawContrato !== 'string') {
      return e.json(200, { ok: false })
    }

    const cleanContrato = rawContrato.trim()
    if (!cleanContrato) {
      return e.json(200, { ok: false })
    }

    // 1. Buscar o registro do cliente por numero_contrato
    let clienteRecord = null
    try {
      clienteRecord = $app.findFirstRecordByData('clientes', 'numero_contrato', cleanContrato)
    } catch (_) {
      // Contrato não encontrado -> resposta genérica idêntica
      return e.json(200, { ok: false })
    }

    if (!clienteRecord) {
      return e.json(200, { ok: false })
    }

    const email = (clienteRecord.get('email') || '').trim()
    // Se não houver email cadastrado -> resposta genérica idêntica
    if (!email) {
      return e.json(200, { ok: false })
    }

    const nomeCliente = clienteRecord.get('nome_cliente') || 'Prezado(a) Cliente'

    // 2. Gerar senha provisória aleatória segura com NO MÁXIMO 10 caracteres
    // Exclui caracteres ambíguos ou que quebrem formatação e facilitem cópia incorreta:
    // Evitando: 0 (zero), O (o maiúsculo), o (o minúsculo), 1 (um), I (i maiúsculo), l (L minúsculo)
    // Caracteres limpos e fáceis de copiar sem confusão:
    const chars = '23456789abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ'
    let senhaProvisoria = ''
    for (let i = 0; i < 10; i++) {
      const idx = Math.floor(Math.random() * chars.length)
      senhaProvisoria += chars.charAt(idx)
    }
    senhaProvisoria = senhaProvisoria.trim().slice(0, 10)

    // 3. Configurar SMTP (mesmo padrão dos hooks on_lead_create e on_csat_create)
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
    } catch (smtpErr) {
      console.log('recuperar_senha: erro ao configurar SMTP:', smtpErr ? smtpErr.message : smtpErr)
    }

    // 4. Preparar e enviar o e-mail via MailerMessage
    const senderAddr =
      $os.getenv('SMTP_SENDER_ADDRESS') ||
      $app.settings().meta.senderAddress ||
      'paulo@condutiva.com.br'
    const senderNm =
      $os.getenv('SMTP_SENDER_NAME') || $app.settings().meta.senderName || 'Condutiva Serviços'

    const subject = 'Condutiva Serviços - Senha Provisória da Área do Cliente'

    const esc = function (s) {
      if (s === null || s === undefined) return ''
      return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    }

    const html =
      '<div style="font-family:Arial,Helvetica,sans-serif;color:#0f172a;max-width:600px;line-height:1.5">' +
      '<div style="background:#0f172a;padding:20px;border-radius:8px 8px 0 0;color:#ffffff">' +
      '<div style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#8CC63F;font-weight:700">Condutiva Serviços • Área do Cliente</div>' +
      '<h1 style="margin:6px 0 0;font-size:20px;color:#ffffff">Recuperação de Senha de Acesso</h1>' +
      '<p style="margin:4px 0 0;color:#94a3b8;font-size:13px">Contrato: ' +
      esc(cleanContrato) +
      '</p>' +
      '</div>' +
      '<div style="border:1px solid #e2e8f0;border-top:none;padding:24px;border-radius:0 0 8px 8px;background:#ffffff">' +
      '<p style="margin:0 0 16px;font-size:14px;color:#334155">Olá, <strong>' +
      esc(nomeCliente) +
      '</strong>.</p>' +
      '<p style="margin:0 0 16px;font-size:14px;color:#334155">Recebemos uma solicitação de recuperação de senha para o contrato <strong>' +
      esc(cleanContrato) +
      '</strong>. Abaixo está a sua senha provisória para acesso imediato:</p>' +
      '<div style="margin:20px 0;padding:16px;background:#f8fafc;border:2px dashed #8CC63F;border-radius:8px;text-align:center">' +
      '<span style="display:block;font-size:12px;font-weight:700;text-transform:uppercase;color:#64748b;letter-spacing:0.5px">Sua Senha Provisória</span>' +
      '<div style="margin-top:8px;">' +
      '<code style="display:inline-block;font-family:Consolas,Monaco,\'Courier New\',monospace;font-size:22px;font-weight:700;color:#0f172a;background:#ffffff;padding:10px 20px;border:1px solid #cbd5e1;border-radius:6px;user-select:all;-webkit-user-select:all;">' +
      esc(senhaProvisoria) +
      '</code>' +
      '</div>' +
      '<p style="margin:8px 0 0;font-size:11px;color:#64748b">Dica: dê um clique duplo na senha acima para selecioná-la e copie sem espaços extras.</p>' +
      '</div>' +
      '<div style="margin-top:18px;padding:12px 14px;background:#eff6ff;border-left:4px solid #3b82f6;border-radius:4px;color:#1e3a8a;font-size:13px;line-height:1.4">' +
      '<strong>Importante:</strong> Ao entrar na Área do Cliente utilizando esta senha provisória, recomendamos que você altere sua senha imediatamente acessando o menu <strong>"Minha conta"</strong>.' +
      '</div>' +
      '<p style="margin-top:20px;font-size:12px;color:#64748b">Se você não solicitou a redefinição desta senha, entre em contato imediatamente com o suporte técnico da Condutiva Serviços.</p>' +
      '</div>' +
      '</div>'

    try {
      const message = new MailerMessage({
        from: {
          address: senderAddr,
          name: senderNm,
        },
        to: [{ address: email }],
        subject: subject,
        html: html,
      })
      $app.newMailClient().send(message)
      console.log(
        'recuperar_senha: email enviado com sucesso para',
        email,
        'contrato',
        cleanContrato,
      )
    } catch (mailErr) {
      console.log('recuperar_senha: falha ao enviar email:', mailErr ? mailErr.message : mailErr)
      return e.json(200, { ok: false })
    }

    // 5. Atualizar senha na base SOMENTE após envio bem-sucedido
    // Conforme especificação, a senha é gravada em texto puro legível para o administrador
    const agora = new Date().toISOString()

    clienteRecord.set('senha', senhaProvisoria.trim())
    clienteRecord.set('senha_alterada_em', agora)
    $app.save(clienteRecord)

    return e.json(200, { ok: true })
  } catch (err) {
    console.log('recuperar_senha: erro interno:', err ? err.message : err)
    return e.json(200, { ok: false })
  }
})
