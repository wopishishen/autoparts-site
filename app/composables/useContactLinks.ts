// 通用联系方式链接：电话拨号 / 邮箱预填 / WhatsApp 预填消息
// 所有显示联系方式的地方统一使用这个 composable

const site = siteConfig

function cleanPhone(tel: string): string {
  return tel.replace(/[^0-9+]/g, '')
}

function cleanWhatsApp(num: string): string {
  return num.replace(/[^0-9]/g, '')
}

export function useContactLinks() {
  // 电话：拉起拨号盘
  const telLink = computed(() => `tel:${cleanPhone(site.contact.tel)}`)

  // 邮箱：打开邮件客户端，预填主题和正文
  function emailLink(subject?: string, body?: string): string {
    const params = new URLSearchParams()
    if (subject) params.set('subject', subject)
    if (body) params.set('body', body)
    const qs = params.toString()
    return `mailto:${site.contact.email}${qs ? '?' + qs : ''}`
  }

  // 默认邮箱链接（通用询盘）
  const defaultEmailLink = computed(() =>
    emailLink(
      'Inquiry from Website',
      'Hello,\n\nI would like to inquire about your auto parts. Could you please provide more information?\n\nThank you.'
    )
  )

  // WhatsApp：跳转到 APP，预填消息
  function whatsappLink(message?: string): string {
    const base = `https://wa.me/${cleanWhatsApp(site.contact.whatsapp)}`
    if (message) {
      return `${base}?text=${encodeURIComponent(message)}`
    }
    return base
  }

  // 默认 WhatsApp 消息（通用询盘）
  const defaultWhatsappLink = computed(() =>
    whatsappLink('Hello, I would like to inquire about your auto parts. Could you please provide a quote?')
  )

  return {
    telLink,
    emailLink,
    defaultEmailLink,
    whatsappLink,
    defaultWhatsappLink,
  }
}
