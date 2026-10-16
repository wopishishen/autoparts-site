// 联系表单提交：反垃圾检测 → QQ 邮箱 SMTP 发信（cloudflare:sockets）
// 部署后在 Cloudflare Pages 后台设置环境变量（测试阶段已内置默认值）：
//   SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS / SMTP_FROM / SMTP_FROM_NAME / SMTP_TO

import { connect } from 'cloudflare:sockets'

const DEFAULTS = {
  smtpHost: 'smtp.qq.com',
  smtpPort: 465,
  smtpUser: '591115601@qq.com',
  smtpPass: 'qmescsxmiaiabfei',
  fromEmail: '591115601@qq.com',
  fromName: 'Autoparts Inquiry',
  toEmail: '591115601@qq.com',
}

// —— 反垃圾：内容关键词过滤（命中则静默丢弃） ——
const SPAM_PATTERNS = [
  /\b(viagra|casino|cialis|pharmacy|rolex|loan\s+offer|profit\s+investment)\b/i,
  /(crypto|bitcoin|investment).{0,30}(guaranteed|double|profit)/i,
  /\b(nigerian|prince|inheritance|lottery\s+winner)\b/i,
]

function isSpam({ email, message, website, formLoadedAt }) {
  if (website && website.trim()) return true
  if (formLoadedAt) {
    const elapsed = Date.now() - Number(formLoadedAt)
    if (!Number.isNaN(elapsed) && elapsed < 3000) return true
  }
  const urlCount = (message.match(/https?:\/\//gi) || []).length
  if (urlCount > 3) return true
  const text = `${email} ${message}`
  if (SPAM_PATTERNS.some((re) => re.test(text))) return true
  return false
}

function buildHtml({ email, phone, country, product, message, fingerprint, ip, userAgent }) {
  const row = (label, value) =>
    `<tr><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-weight:600;color:#334155;white-space:nowrap;width:120px;">${label}</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;word-break:break-all;">${value || '-'}</td></tr>`

  const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai', hour12: false })

  return `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;">
  <div style="background:#0c4a6e;color:#fff;padding:20px 24px;border-radius:8px 8px 0 0;">
    <h2 style="margin:0;font-size:18px;">New Inquiry from Website</h2>
  </div>
  <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">
    ${row('Email', email)}
    ${row('Phone', phone)}
    ${row('Country', country)}
    ${row('Product', product)}
    <tr><td colspan="2" style="padding:12px;">
      <div style="font-weight:600;color:#334155;margin-bottom:6px;">Message</div>
      <div style="color:#0f172a;line-height:1.6;white-space:pre-wrap;">${message}</div>
    </td></tr>
  </table>
  <div style="margin-top:12px;padding:12px;background:#f1f5f9;border-radius:8px;font-size:12px;color:#64748b;line-height:1.8;">
    <div><strong style="color:#475569;">Fingerprint:</strong> ${fingerprint || '-'}</div>
    <div><strong style="color:#475569;">IP:</strong> ${ip || '-'}</div>
    <div><strong style="color:#475569;">Submitted at:</strong> ${now}</div>
    <div style="word-break:break-all;"><strong style="color:#475569;">User-Agent:</strong> ${userAgent || '-'}</div>
  </div>
</div>`
}

// —— SMTP 工具函数 ——

function b64encode(str) {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}

async function readResponse(reader, decoder) {
  // 循环读取直到拿到完整 SMTP 响应（最后一行是 "NNN " 而非 "NNN-"）
  let buffer = ''
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\r\n')
    const lastLine = lines[lines.length - 2] || lines[lines.length - 1]
    // 最后一行格式为 "NNN "（数字+空格），不是 "NNN-"（数字+减号，表示还有续行）
    if (/^\d{3} /.test(lastLine)) break
    if (buffer.length > 8192) break
  }
  return buffer
}

async function sendCmd(writer, encoder, cmd) {
  await writer.write(encoder.encode(cmd + '\r\n'))
}

async function sendEmailViaSMTP({ host, port, user, pass, from, fromName, to, subject, html }) {
  const socket = connect({ hostname: host, port: Number(port), secureTransport: 'ssl' })
  const reader = socket.readable.getReader()
  const writer = socket.writable.getWriter()
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  try {
    // 220 欢迎
    let resp = await readResponse(reader, decoder)
    if (!resp.startsWith('220')) throw new Error('SMTP connect failed: ' + resp)

    // EHLO
    await sendCmd(writer, encoder, 'EHLO localhost')
    resp = await readResponse(reader, decoder)
    if (!resp.startsWith('250')) throw new Error('EHLO failed: ' + resp)

    // AUTH LOGIN
    await sendCmd(writer, encoder, 'AUTH LOGIN')
    resp = await readResponse(reader, decoder)
    if (!resp.startsWith('334')) throw new Error('AUTH LOGIN failed: ' + resp)

    // 用户名
    await sendCmd(writer, encoder, b64encode(user))
    resp = await readResponse(reader, decoder)
    if (!resp.startsWith('334')) throw new Error('Username auth failed: ' + resp)

    // 密码（授权码）
    await sendCmd(writer, encoder, b64encode(pass))
    resp = await readResponse(reader, decoder)
    if (!resp.startsWith('235')) throw new Error('Password auth failed: ' + resp)

    // MAIL FROM
    await sendCmd(writer, encoder, `MAIL FROM:<${from}>`)
    resp = await readResponse(reader, decoder)
    if (!resp.startsWith('250')) throw new Error('MAIL FROM failed: ' + resp)

    // RCPT TO
    await sendCmd(writer, encoder, `RCPT TO:<${to}>`)
    resp = await readResponse(reader, decoder)
    if (!resp.startsWith('250')) throw new Error('RCPT TO failed: ' + resp)

    // DATA
    await sendCmd(writer, encoder, 'DATA')
    resp = await readResponse(reader, decoder)
    if (!resp.startsWith('354')) throw new Error('DATA failed: ' + resp)

    // 邮件内容（MIME）
    const subjectEncoded = `=?UTF-8?B?${b64encode(subject)}?=`
    const body = [
      `From: "${fromName}" <${from}>`,
      `To: ${to}`,
      `Subject: ${subjectEncoded}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=UTF-8',
      'Content-Transfer-Encoding: base64',
      '',
      b64encode(html),
      '.',
    ].join('\r\n')
    await writer.write(encoder.encode(body + '\r\n'))

    resp = await readResponse(reader, decoder)
    if (!resp.startsWith('250')) throw new Error('Send body failed: ' + resp)

    // QUIT
    await sendCmd(writer, encoder, 'QUIT')
    await readResponse(reader, decoder)

    return true
  } finally {
    try { await writer.close() } catch {}
    try { await reader.cancel() } catch {}
    try { await socket.close() } catch {}
  }
}

export async function onRequestPost(context) {
  const { request, env } = context

  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const { email, phone = '', country = '', product = '', message = '', website = '', formLoadedAt = '', fingerprint = '' } = body || {}

  const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || request.headers.get('X-Real-IP') || ''
  const userAgent = request.headers.get('User-Agent') || ''

  if (!email || !country || !message) {
    return Response.json({ ok: false, error: 'Missing required fields' }, { status: 400 })
  }

  // 反垃圾：命中则静默返回成功
  if (isSpam({ email, message, website, formLoadedAt })) {
    return Response.json({ ok: true })
  }

  const cfg = {
    host: env.SMTP_HOST || DEFAULTS.smtpHost,
    port: env.SMTP_PORT || DEFAULTS.smtpPort,
    user: env.SMTP_USER || DEFAULTS.smtpUser,
    pass: env.SMTP_PASS || DEFAULTS.smtpPass,
    from: env.SMTP_FROM || DEFAULTS.fromEmail,
    fromName: env.SMTP_FROM_NAME || DEFAULTS.fromName,
    to: env.SMTP_TO || DEFAULTS.toEmail,
  }

  try {
    await sendEmailViaSMTP({
      host: cfg.host,
      port: cfg.port,
      user: cfg.user,
      pass: cfg.pass,
      from: cfg.from,
      fromName: cfg.fromName,
      to: cfg.to,
      subject: `[Inquiry] ${country} - ${email}`,
      html: buildHtml({ email, phone, country, product, message, fingerprint, ip, userAgent }),
    })
    return Response.json({ ok: true })
  } catch (err) {
    console.error('SMTP error:', err.message)
    return Response.json({ ok: false, error: 'Email service error' }, { status: 502 })
  }
}
