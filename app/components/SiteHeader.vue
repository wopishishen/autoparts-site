<script setup lang="ts">
import { ref } from 'vue'

const site = siteConfig
const nav = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Solution', to: '/solution' },
  { label: 'News', to: '/news' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const mobileMenuOpen = ref(false)

function closeMobileMenu() {
  mobileMenuOpen.value = false
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50">
    <!-- 顶部联系栏 -->
    <div class="bg-slate-900 text-slate-300 text-xs">
      <div class="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <div class="flex items-center gap-4 md:gap-6">
          <a :href="`tel:${site.contact.tel.replace(/[^0-9+]/g, '')}`" class="hover:text-white transition-colors flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            {{ site.contact.tel }}
          </a>
          <a :href="`mailto:${site.contact.email}`" class="hover:text-white transition-colors flex items-center gap-1.5 hidden md:flex">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            {{ site.contact.email }}
          </a>
        </div>
        <a
          :href="`https://wa.me/${site.contact.whatsapp.replace(/[^0-9]/g, '')}`"
          target="_blank"
          rel="noopener"
          class="hover:text-white transition-colors flex items-center gap-1.5"
        >
          <svg class="w-3.5 h-3.5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          {{ site.contact.whatsapp }}
        </a>
      </div>
    </div>

    <!-- 主导航 -->
    <div class="bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2.5">
          <span class="w-10 h-10 bg-sky-800 rounded flex items-center justify-center text-white font-black text-lg">AP</span>
          <span class="font-bold text-sky-900 text-lg leading-tight">
            {{ site.brandName }}
            <span class="block text-[10px] font-medium text-slate-500 tracking-widest uppercase">{{ site.brandLogoText }}</span>
          </span>
        </NuxtLink>

        <nav class="hidden lg:flex items-center gap-7">
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="text-slate-700 hover:text-sky-800 font-medium text-sm transition-colors"
            active-class="text-sky-800"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="flex items-center gap-3">
          <NuxtLink
            to="/contact"
            class="relative overflow-hidden theme-flow-bg compact text-white text-sm font-semibold px-5 py-2 rounded transition-all hover:brightness-110"
          >
            <FlowBackground />
            <span class="relative z-10">Get a Quote</span>
          </NuxtLink>
          <button
            type="button"
            class="lg:hidden p-2 text-slate-700 hover:text-sky-800 transition-colors"
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
      <nav v-if="mobileMenuOpen" class="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="block px-3 py-2.5 rounded text-slate-700 hover:bg-slate-100 font-medium text-sm transition-colors"
          active-class="bg-sky-50 text-sky-800"
          @click="closeMobileMenu"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
