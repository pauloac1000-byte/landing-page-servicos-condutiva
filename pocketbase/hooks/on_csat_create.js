// Notifies the internal team by email whenever a new CSAT response is created.
// Uses an after-success hook so it fires only after the DB transaction commits:
// a failed email never blocks or rolls back the persisted CSAT record.
onRecordAfterCreateSuccess((e) => {
  const record = e.record

  // Configure SMTP settings from environment variables if SMTP_HOST is present
  // or SMTP_ENABLED is explicitly true (same pattern as on_lead_create).
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
    console.log('csat email: SMTP env config error:', err ? err.message : err)
  }

  // Same internal recipients as the diagnostic lead notification hook
  const recipients = [
    'comercial1@condutiva.com.br',
    'liandra@condutiva.com.br',
    'paulo@condutiva.com.br',
    'tadeu@condutiva.com.br',
    'joaovitor@condutiva.com.br',
  ]

  const esc = function (s) {
    if (s === null || s === undefined) return ''
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  const contractNumber = record.get('contract_number') || 'N/A'
  const serviceOrderNumber = record.get('service_order_number') || 'N/A'
  const clientName = record.get('client_name') || 'Cliente não informado'
  const formVersion = record.get('form_version') || 'completo'
  const respondentName = record.get('respondent_name') || ''
  const respondentRole = record.get('respondent_role') || ''
  const technicianName = record.get('technician_name') || 'Não informado'
  const serviceEvaluated = record.get('service_evaluated') || 'Não informado'
  const evaluationDate = record.get('evaluation_date') || ''

  const problemResolved = record.get('problem_resolved')
  let problemResolvedText = 'Não informado'
  if (problemResolved === 'sim') problemResolvedText = 'Sim'
  else if (problemResolved === 'nao') problemResolvedText = 'Não'
  else if (problemResolved === 'nao_se_aplica') problemResolvedText = 'Não se aplica'

  const npsScore = record.get('nps_score')
  const npsReason = record.get('nps_reason') || ''
  const npsImprovement = record.get('nps_improvement') || ''
  const renewalIntent = record.get('renewal_intent') || ''

  const scoreGeneral = record.get('score_general_satisfaction')
  const scoreTechnical = record.get('score_technical_execution')
  const scoreCustomer = record.get('score_customer_service')
  const scorePerceived = record.get('score_perceived_value')

  const positiveHighlights = record.get('positive_highlights') || ''
  const pointsToImprove = record.get('points_to_improve') || ''
  const additionalServices = record.get('additional_services_needed') || ''
  const finalComments = record.get('final_comments') || ''
  const contactAuthorized = Boolean(record.get('contact_authorized'))

  const subject =
    'Nova Avaliacao CSAT: ' +
    clientName +
    ' | Contrato ' +
    contractNumber +
    ' | OS ' +
    serviceOrderNumber

  // Determine NPS classification
  let npsClassification = 'Neutro'
  let npsColor = '#f59e0b' // amber
  if (npsScore !== null && npsScore !== undefined) {
    if (npsScore >= 9) {
      npsClassification = 'Promotor'
      npsColor = '#10b981' // emerald
    } else if (npsScore <= 6) {
      npsClassification = 'Detrator'
      npsColor = '#ef4444' // red
    }
  }

  const scoreLabel = function (v) {
    if (v === null || v === undefined || v === '') return 'Não informado'
    return String(v) + ' / 5'
  }

  const rows = [
    ['Empresa / Cliente', clientName],
    ['Contrato', contractNumber],
    ['Ordem de Serviço (OS)', serviceOrderNumber],
    ['Versão do Questionário', formVersion === 'completo' ? 'Formulário Completo' : 'Versão Curta'],
    [
      'Responsável pelo Feedback',
      respondentName + (respondentRole ? ' (' + respondentRole + ')' : ''),
    ],
    ['Técnico Responsável', technicianName],
    ['Serviço Avaliado', serviceEvaluated],
    ['Data do Preenchimento', evaluationDate],
    ['Problema Resolvido?', problemResolvedText],
    ['Satisfação com Atendimento', scoreLabel(scoreCustomer)],
    ['Satisfação com Execução Técnica', scoreLabel(scoreTechnical)],
  ]

  if (formVersion === 'completo') {
    rows.push(['Satisfação Geral com Resultado', scoreLabel(scoreGeneral)])
    rows.push(['Valor Percebido pela Operação', scoreLabel(scorePerceived)])
  }

  if (renewalIntent) {
    rows.push(['Pretende Renovar / Contratar Novamente?', renewalIntent])
  }

  var rowsHtml = ''
  for (var i = 0; i < rows.length; i++) {
    rowsHtml +=
      '<tr>' +
      '<td style="padding:8px 12px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:600;width:230px;vertical-align:top;color:#334155">' +
      esc(rows[i][0]) +
      '</td>' +
      '<td style="padding:8px 12px;border:1px solid #e2e8f0;vertical-align:top;color:#0f172a">' +
      esc(rows[i][1]) +
      '</td>' +
      '</tr>'
  }

  let textAnswersHtml = ''
  if (npsReason) {
    textAnswersHtml +=
      '<div style="margin-top:12px;padding:12px;background:#f8fafc;border-left:4px solid #8CC63F;border-radius:4px">' +
      '<strong style="color:#0f172a;font-size:13px">Motivo da nota NPS:</strong>' +
      '<p style="margin:4px 0 0;color:#334155;font-size:13px">' +
      esc(npsReason) +
      '</p></div>'
  }
  if (npsImprovement) {
    textAnswersHtml +=
      '<div style="margin-top:12px;padding:12px;background:#f8fafc;border-left:4px solid #8CC63F;border-radius:4px">' +
      '<strong style="color:#0f172a;font-size:13px">O que a Condutiva precisa fazer para nota maior:</strong>' +
      '<p style="margin:4px 0 0;color:#334155;font-size:13px">' +
      esc(npsImprovement) +
      '</p></div>'
  }
  if (positiveHighlights) {
    textAnswersHtml +=
      '<div style="margin-top:12px;padding:12px;background:#f8fafc;border-left:4px solid #10b981;border-radius:4px">' +
      '<strong style="color:#0f172a;font-size:13px">Destaques positivos:</strong>' +
      '<p style="margin:4px 0 0;color:#334155;font-size:13px">' +
      esc(positiveHighlights) +
      '</p></div>'
  }
  if (pointsToImprove) {
    textAnswersHtml +=
      '<div style="margin-top:12px;padding:12px;background:#f8fafc;border-left:4px solid #f59e0b;border-radius:4px">' +
      '<strong style="color:#0f172a;font-size:13px">Pontos a melhorar:</strong>' +
      '<p style="margin:4px 0 0;color:#334155;font-size:13px">' +
      esc(pointsToImprove) +
      '</p></div>'
  }
  if (additionalServices) {
    textAnswersHtml +=
      '<div style="margin-top:12px;padding:12px;background:#f8fafc;border-left:4px solid #0284c7;border-radius:4px">' +
      '<strong style="color:#0f172a;font-size:13px">Outros serviços de interesse:</strong>' +
      '<p style="margin:4px 0 0;color:#334155;font-size:13px">' +
      esc(additionalServices) +
      '</p></div>'
  }
  if (finalComments) {
    textAnswersHtml +=
      '<div style="margin-top:12px;padding:12px;background:#f8fafc;border-left:4px solid #64748b;border-radius:4px">' +
      '<strong style="color:#0f172a;font-size:13px">Comentários e observações finais:</strong>' +
      '<p style="margin:4px 0 0;color:#334155;font-size:13px">' +
      esc(finalComments) +
      '</p></div>'
  }

  const contactHtml = contactAuthorized
    ? '<div style="margin-top:16px;padding:10px 14px;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:6px;color:#065f46;font-size:13px font-weight:600">' +
      '✓ O cliente AUTORIZOU a equipe da Condutiva a entrar em contato para aprofundar este feedback.' +
      '</div>'
    : '<div style="margin-top:16px;padding:10px 14px;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:6px;color:#64748b;font-size:12px">' +
      'O cliente optou por não assinalar a autorização expressa para contato posterior.' +
      '</div>'

  const html =
    '<div style="font-family:Arial,Helvetica,sans-serif;color:#0f172a;max-width:680px;line-height:1.5">' +
    '<div style="background:#0f172a;padding:20px;border-radius:8px 8px 0 0;color:#ffffff">' +
    '<div style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#8CC63F;font-weight:700">Condutiva Serviços • Gestão da Qualidade</div>' +
    '<h1 style="margin:6px 0 0;font-size:20px;color:#ffffff">Nova Avaliação CSAT Recebida</h1>' +
    '<p style="margin:4px 0 0;color:#94a3b8;font-size:13px">Cliente: ' +
    esc(clientName) +
    ' • Contrato: ' +
    esc(contractNumber) +
    ' • OS: ' +
    esc(serviceOrderNumber) +
    '</p>' +
    '</div>' +
    '<div style="border:1px solid #e2e8f0;border-top:none;padding:24px;border-radius:0 0 8px 8px;background:#ffffff">' +
    // NPS Highlight Card
    '<div style="margin-bottom:20px;padding:16px;border:2px solid ' +
    npsColor +
    ';background:#fafafa;border-radius:8px;text-align:center">' +
    '<span style="display:block;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#64748b">Nota NPS (Recomendação)</span>' +
    '<span style="display:block;font-size:38px;font-weight:900;color:' +
    npsColor +
    ';line-height:1.1;margin:4px 0">' +
    (npsScore !== null && npsScore !== undefined ? String(npsScore) : 'N/A') +
    ' <span style="font-size:16px;color:#94a3b8;font-weight:600">/ 10</span></span>' +
    '<span style="display:inline-block;padding:2px 10px;border-radius:12px;background:' +
    npsColor +
    ';color:#ffffff;font-size:11px;font-weight:700;text-transform:uppercase">' +
    npsClassification +
    '</span>' +
    '</div>' +
    '<h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.5px;color:#475569;margin:0 0 10px">Resumo do Atendimento</h2>' +
    '<table style="border-collapse:collapse;width:100%;font-size:13px">' +
    rowsHtml +
    '</table>' +
    textAnswersHtml +
    contactHtml +
    '<div style="margin-top:24px;padding-top:16px;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:12px">' +
    'Registro salvo automaticamente na coleção <code>csat_responses</code> e status do contrato atualizado para <code>respondido</code>.' +
    '</div>' +
    '</div>' +
    '</div>'

  try {
    const senderAddr =
      $os.getenv('SMTP_SENDER_ADDRESS') ||
      $app.settings().meta.senderAddress ||
      'paulo@condutiva.com.br'
    const senderNm =
      $os.getenv('SMTP_SENDER_NAME') || $app.settings().meta.senderName || 'Condutiva Serviços'

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
    console.log('csat email: notification successfully queued/sent for contract', contractNumber)
  } catch (err) {
    console.log('csat email: failed to send notification:', err ? err.message : err)
  }

  e.next()
}, 'csat_responses')
