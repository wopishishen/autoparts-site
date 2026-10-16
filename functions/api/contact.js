// 联系表单提交：反垃圾检测 → Resend HTTPS API 发信
// 部署后在 Cloudflare Pages 后台设置环境变量：
//   RESEND_API_KEY（必填） / CONTACT_FROM_EMAIL / CONTACT_FROM_NAME / CONTACT_TO_EMAIL

const DEFAULTS = {
  fromEmail: 'onboarding@resend.dev',
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

  const apiKey = env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY not set')
    return Response.json({ ok: false, error: 'Email service not configured' }, { status: 500 })
  }

  const from = env.CONTACT_FROM_EMAIL || DEFAULTS.fromEmail
  const fromName = env.CONTACT_FROM_NAME || DEFAULTS.fromName
  const to = env.CONTACT_TO_EMAIL || DEFAULTS.toEmail

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${fromName} <${from}>`,
        to: [to],
        subject: `[Inquiry] ${country} - ${email}`,
        html: buildHtml({ email, phone, country, product, message, fingerprint, ip, userAgent }),
      }),
    })
    const data = await resp.json()
    if (resp.ok && data.id) {
      return Response.json({ ok: true })
    }
    console.error('Resend error:', JSON.stringify(data))
    return Response.json({ ok: false, error: 'Email service error' }, { status: 502 })
  } catch (err) {
    console.error('Resend request failed:', err.message)
    return Response.json({ ok: false, error: 'Email service error' }, { status: 502 })
  }
}
