<script setup lang="ts">
import type { Product } from '~/types/content'

defineProps<{
  product: Product
}>()

const quoteUrl = (name: string) => `/contact?product=${encodeURIComponent(name)}`
</script>

<template>
  <div class="group flex flex-col">
    <!-- 图片 —— 1.34:1 比例，匹配参考站产品图 -->
    <NuxtLink :to="`/products/${product.slug}`" :aria-label="`View ${product.name} details`" class="block aspect-[550/410] bg-slate-100 overflow-hidden rounded-lg">
      <img
        v-if="product.images && product.images.length"
        :src="product.images[0]"
        :alt="product.name"
        loading="lazy"
        class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
      >
      <div v-else class="w-full h-full flex items-center justify-center text-slate-400 text-sm font-medium">
        {{ product.name }}
      </div>
    </NuxtLink>

    <!-- 信息 -->
    <div class="pt-3 flex flex-col flex-1">
      <h3 class="font-semibold text-slate-800 leading-snug text-sm">
        <NuxtLink :to="`/products/${product.slug}`" class="hover:text-sky-800 transition-colors">{{ product.name }}</NuxtLink>
      </h3>
      <p v-if="product.model" class="text-xs text-slate-500 mt-1">{{ product.model }}</p>

      <div class="mt-auto pt-3 flex gap-2">
        <NuxtLink
          :to="quoteUrl(product.name)"
          class="flex-1 text-center bg-sky-800 hover:bg-sky-700 text-white text-xs font-semibold px-3 py-2 rounded transition-colors"
        >
          Quote
        </NuxtLink>
        <NuxtLink
          :to="`/products/${product.slug}`"
          :aria-label="`Learn more about ${product.name}`"
          class="flex-1 text-center border border-slate-300 hover:border-sky-800 hover:text-sky-800 text-xs font-medium px-3 py-2 rounded transition-colors"
        >
          Details
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
