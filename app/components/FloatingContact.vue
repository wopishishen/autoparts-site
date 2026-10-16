<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const site = siteConfig
const { defaultEmailLink, defaultWhatsappLink } = useContactLinks()
const showTop = ref(false)

function handleScroll() {
  showTop.value = window.scrollY > 400
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const whatsappLink = defaultWhatsappLink
const mailLink = defaultEmailLink
</script>

<template>
  <!-- 右下角悬浮按钮组（以垂直中线为基准，往下偏自身高度 100%） -->
  <div class="fixed right-4 md:right-6 top-[53%] translate-y-1/2 z-50 flex flex-col items-center gap-3">
    <!-- 联系我们（跳转联系页） -->
    <NuxtLink
      to="/contact"
      class="w-12 h-12 rounded-full bg-sky-800 hover:bg-sky-700 text-white shadow-lg flex items-center justify-center transition-all hover:scale-110"
      title="Contact Us"
      aria-label="Contact us"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.327-4.163A7.997 7.997 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
    </NuxtLink>

    <!-- 邮箱 -->
    <a
      :href="mailLink"
      class="w-12 h-12 rounded-full bg-sky-800 hover:bg-sky-700 text-white shadow-lg flex items-center justify-center transition-all hover:scale-110"
      title="Email Us"
      aria-label="Email us"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    </a>

    <!-- WhatsApp -->
    <a
      :href="whatsappLink"
      target="_blank"
      rel="noopener"
      class="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#1DA851] text-white shadow-lg flex items-center justify-center transition-all hover:scale-110"
      title="WhatsApp"
      aria-label="WhatsApp"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </a>

    <!-- 回到顶部（滚动超过 400px 才出现；始终占位，避免按钮组偏移） -->
    <button
      type="button"
      class="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 text-white shadow-lg flex items-center justify-center transition-all hover:scale-110"
      :class="showTop ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
      title="Back to Top"
      aria-label="Back to top"
      @click="scrollToTop"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7" /></svg>
    </button>
  </div>
</template>
