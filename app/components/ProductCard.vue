<script setup lang="ts">
import type { Product } from '~/types/content'

defineProps<{
  product: Product
}>()

const quoteUrl = (slug: string) => `/contact?product=${slug}`
</script>

<template>
  <div class="group bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
    <!-- 图片（无图时显示占位） -->
    <NuxtLink :to="`/products/${product.slug}`" :aria-label="`View ${product.name} details`" class="block aspect-[4/3] bg-slate-100 overflow-hidden">
      <img
        v-if="product.images && product.images.length"
        :src="product.images[0]"
        :alt="product.name"
        loading="lazy"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform"
      >
      <div v-else class="w-full h-full flex items-center justify-center text-slate-400 text-sm font-medium">
        {{ product.name }}
      </div>
    </NuxtLink>

    <!-- 信息 -->
    <div class="p-4 flex flex-col flex-1">
      <h3 class="font-semibold text-slate-800 leading-snug mb-1 line-clamp-2">
        <NuxtLink :to="`/products/${product.slug}`" class="hover:text-sky-800 transition-colors">{{ product.name }}</NuxtLink>
      </h3>
      <p v-if="product.model" class="text-xs text-slate-500 mb-2">Model: {{ product.model }}</p>
      <p v-if="product.summary" class="text-sm text-slate-600 mb-4 line-clamp-2">{{ product.summary }}</p>

      <div class="mt-auto flex gap-2 pt-2">
        <NuxtLink
          :to="quoteUrl(product.slug)"
          class="flex-1 text-center bg-sky-800 hover:bg-sky-700 text-white text-sm font-semibold px-3 py-2 rounded transition-colors"
        >
          Quote Now
        </NuxtLink>
        <NuxtLink
          :to="`/products/${product.slug}`"
          :aria-label="`Learn more about ${product.name}`"
          class="flex-1 text-center border border-slate-300 hover:border-sky-800 hover:text-sky-800 text-sm font-medium px-3 py-2 rounded transition-colors"
        >
          Learn More
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
