export interface SiteConfig {
  brandName: string
  brandLogoText: string
  companyName: string
  tagline: string
  contact: {
    tel: string
    email: string
    whatsapp: string
    wechat: string
    skype: string
    address: string
  }
  seo: {
    defaultTitle: string
    defaultDescription: string
    ogImage: string
  }
}

export interface Category {
  slug: string
  name: string
  description?: string
  image?: string
  seo?: {
    title?: string
    description?: string
  }
}

export interface Product {
  slug: string
  name: string
  model?: string
  summary?: string
  description?: string
  images?: string[]
  category?: string
  brands?: string[]
  tags?: string[]
  params?: Record<string, string>
  featured?: boolean
  published?: boolean
  seo?: {
    title?: string
    description?: string
  }
}

export interface BlogPost {
  slug: string
  title: string
  category: string
  coverImage?: string
  summary?: string
  content: string
  author?: string
  date: string
  featured?: boolean
  published?: boolean
  tags?: string[]
  seo?: {
    title?: string
    description?: string
  }
}
