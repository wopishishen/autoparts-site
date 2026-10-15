<script setup lang="ts">
import { ref } from 'vue'

const site = siteConfig
const nav = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Contact', to: '/contact' },
]

const mobileMenuOpen = ref(false)

function closeMobileMenu() {
  mobileMenuOpen.value = false
}
</script>

<template>
  <header>
    <!-- 顶部联系栏 -->
    <div class="bg-slate-900 text-slate-200 text-sm">
      <div class="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center gap-x-5 gap-y-1 justify-between">
        <div class="flex flex-wrap items-center gap-x-5 gap-y-1">
          <a :href="`tel:${site.contact.tel.replace(/\s/g, '')}`" class="hover:text-white transition-colors">
            Tel: {{ site.contact.tel }}
          </a>
          <a :href="`mailto:${site.contact.email}`" class="hover:text-white transition-colors">
            E-mail: {{ site.contact.email }}
          </a>
        </div>
        <div class="flex flex-wrap items-center gap-x-5 gap-y-1">
          <a
            :href="`https://wa.me/${site.contact.whatsapp.replace(/[^0-9]/g, '')}`"
            target="_blank"
            rel="noopener"
            class="hover:text-white transition-colors"
          >
            WhatsApp: {{ site.contact.whatsapp }}
          </a>
        </div>
      </div>
    </div>

    <!-- 主导航 -->
    <div class="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="w-9 h-9 bg-sky-800 rounded flex items-center justify-center text-white font-black text-lg">AP</span>
          <span class="font-bold text-sky-900 text-lg leading-tight">
            {{ site.brandName }}
            <span class="block text-[11px] font-medium text-slate-500 tracking-wide">{{ site.brandLogoText }}</span>
          </span>
        </NuxtLink>

        <nav class="hidden md:flex items-center gap-8">
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="text-slate-700 hover:text-sky-800 font-medium transition-colors"
            active-class="text-sky-800"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="flex items-center gap-3">
          <NuxtLink
            to="/contact"
            class="bg-sky-800 hover:bg-sky-700 text-white text-sm font-semibold px-4 py-2 rounded transition-colors"
          >
            Get a Quote
          </NuxtLink>
          <!-- 移动端汉堡按钮 -->
          <button
            type="button"
            class="md:hidden p-2 text-slate-700 hover:text-sky-800 transition-colors"
            :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 移动端展开菜单 -->
      <nav v-if="mobileMenuOpen" class="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="block px-3 py-2 rounded text-slate-700 hover:bg-slate-100 font-medium transition-colors"
          active-class="bg-sky-50 text-sky-800"
          @click="closeMobileMenu"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
