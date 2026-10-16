<script setup lang="ts">
const site = siteConfig
const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'Content Manager', to: '/admin/' },
]
</script>

<template>
  <footer class="bg-slate-900 text-slate-300">
    <div class="max-w-7xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
      <!-- 公司简介 -->
      <div>
        <div class="font-bold text-white text-lg mb-3">{{ site.brandName }}</div>
        <p class="text-sm leading-relaxed text-slate-400">
          {{ site.companyName }} is a professional commercial vehicle spare parts supplier. {{ site.tagline }}.
        </p>
      </div>

      <!-- 联系方式 -->
      <div>
        <div class="font-semibold text-white mb-3">Contact Us</div>
        <ul class="text-sm space-y-1.5">
          <li>Tel: {{ site.contact.tel }}</li>
          <li>
            E-mail:
            <a :href="`mailto:${site.contact.email}`" class="hover:text-white transition-colors">{{ site.contact.email }}</a>
          </li>
          <li>WhatsApp: {{ site.contact.whatsapp }}</li>
          <li>WeChat: {{ site.contact.wechat }}</li>
          <li>Skype: {{ site.contact.skype }}</li>
          <li>Add: {{ site.contact.address }}</li>
        </ul>
      </div>

      <!-- 快捷链接 -->
      <div>
        <div class="font-semibold text-white mb-3">Quick Links</div>
        <ul class="text-sm space-y-1.5">
          <li v-for="link in quickLinks" :key="link.to">
            <a
              v-if="link.external"
              :href="link.to"
              target="_blank"
              rel="noopener"
              class="hover:text-white transition-colors"
            >{{ link.label }}</a>
            <NuxtLink v-else :to="link.to" class="hover:text-white transition-colors">{{ link.label }}</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
    <div class="border-t border-slate-800">
      <div class="max-w-7xl mx-auto px-4 py-4 text-xs text-slate-500">
        © {{ new Date().getFullYear() }} {{ site.companyName }}. All rights reserved.
      </div>
    </div>
  </footer>
</template>
