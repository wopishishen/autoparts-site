import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-14',
  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  modules: ['@nuxtjs/i18n', '@nuxtjs/seo'],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  // SSG 静态生成（Cloudflare Pages 部署静态目录 .output/public）
  nitro: {
    preset: 'static',
    prerender: {
      // Sveltia CMS 是纯静态文件（public/admin/index.html），不需 Nuxt 渲染
      ignore: ['/admin', '/admin/'],
    },
  },

  i18n: {
    locales: [{ code: 'en', language: 'en-US', name: 'English' }],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
  },

  site: {
    // 部署到 Cloudflare Pages 后替换为实际地址（pages.dev 或正式域名）
    url: 'https://autoparts-site.pages.dev',
    name: 'Auto Parts Supplier',
    description: 'Professional commercial vehicle spare parts supplier, exporting quality bus and truck parts worldwide.',
  },

  app: {
    head: {
      title: 'Auto Parts Supplier - Commercial Vehicle Spare Parts',
    },
  },

  // 未安装 OG Image renderer（Satori/Takumi），禁用以避免构建警告
  ogImage: false,

  // 链接检查：静态文件路径（/admin/）可能误报，错误仅警告不阻断构建
  linkChecker: {
    failOnError: false,
  },
})
