<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const is404 = computed(() => props.error.statusCode === 404)

useSeoMeta({
  title: is404.value ? 'Page Not Found' : 'Error',
  robots: is404.value ? 'noindex' : undefined,
})
</script>

<template>
  <div class="bg-white min-h-screen flex flex-col">
    <!-- 公共组件：头部 / 底部 / 悬浮联系 -->
    <SiteHeader />

    <main class="pt-40 md:pt-48 pb-20 px-4">
      <div class="text-center max-w-xl mx-auto">
        <!-- 超大 404 主视觉（纯色大字号，简洁） -->
        <p class="text-[6rem] md:text-[9rem] lg:text-[11rem] font-black leading-none text-sky-800 select-none">
          404
        </p>

        <h1 class="mt-4 text-2xl md:text-3xl font-bold text-slate-900">
          {{ is404 ? 'Page Not Found' : 'Something Went Wrong' }}
        </h1>
        <p class="mt-3 text-slate-500 text-sm md:text-base leading-relaxed">
          {{
            is404
              ? 'The page you are looking for does not exist or has been moved. Please check the URL and try again.'
              : 'An unexpected error occurred. Please try again later or contact our team for assistance.'
          }}
        </p>

        <NuxtLink
          to="/"
          class="mt-8 inline-block bg-sky-800 hover:bg-sky-700 text-white font-semibold px-8 py-3 rounded transition-colors"
        >
          Back to Home
        </NuxtLink>
      </div>
    </main>

    <SiteFooter class="mt-auto" />
    <FloatingContact />
  </div>
</template>
