<script setup lang="ts">
import { ref, computed } from 'vue'

const route = useRoute()
const site = siteConfig
const siteConfigSeo = useSiteConfig()
const categories = useCategories()

const product = useProduct(route.params.slug as string)

if (!product) {
  throw createError({ statusCode: 404, statusMessage: 'Product Not Found', fatal: true })
}

const category = computed(() => (product!.category ? useCategory(product!.category as string) : undefined))
const relatedProducts = computed(() => useProducts().filter((p) => p.category === product!.category && p.slug !== product!.slug).slice(0, 4))

// 画廊
const activeImage = ref(product!.images?.[0] ?? '')
const galleryImages = computed(() => product!.images ?? [])

useSeoMeta({
  title: product!.seo?.title || product!.name,
  description: product!.seo?.description || product!.summary || product!.description,
  ogType: 'product',
  ogTitle: product!.seo?.title || product!.name,
  ogDescription: product!.seo?.description || product!.summary || product!.description,
  ogImage: product!.images?.[0],
})

const siteUrl = computed(() => siteConfigSeo.url || 'https://autoparts-site.pages.dev')

// Product 结构化数据（JSON-LD）
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: product!.name,
        description: product!.summary || product!.description || '',
        image: product!.images || [],
        brand: { '@type': 'Brand', name: site.brandName },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `${siteUrl.value}${route.path}`,
        },
      }),
    },
  ],
})

const whatsappLink = computed(() => `https://wa.me/${site.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello, I am interested in: ${product!.name}`)}`)
const emailLink = computed(() => `mailto:${site.contact.email}?subject=${encodeURIComponent(`Inquiry: ${product!.name}`)}`)
const quoteLink = computed(() => `/contact?product=${product!.slug}`)

const paramRows = computed(() => {
  if (!product!.params) return []
  return Object.entries(product!.params).filter(([, v]) => v)
})
</script>

<template>
  <div v-if="product" class="max-w-7xl mx-auto px-4 py-8">
    <!-- 面包屑 -->
    <nav class="text-sm text-slate-500 mb-6 flex flex-wrap items-center gap-1">
      <NuxtLink to="/" class="hover:text-sky-800">Home</NuxtLink>
      <span class="mx-1">›</span>
      <NuxtLink to="/products" class="hover:text-sky-800">Products</NuxtLink>
      <template v-if="category">
        <span class="mx-1">›</span>
        <NuxtLink :to="`/products?category=${category.slug}`" class="hover:text-sky-800">{{ category.name }}</NuxtLink>
      </template>
      <span class="mx-1">›</span>
      <span class="text-slate-800">{{ product.name }}</span>
    </nav>

    <div class="grid gap-10 lg:grid-cols-2">
      <!-- 图片画廊 -->
      <div>
        <div class="aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
          <img
            v-if="activeImage"
            :src="activeImage"
            :alt="product.name"
            class="w-full h-full object-cover"
          >
          <div v-else class="w-full h-full flex items-center justify-center text-slate-400">{{ product.name }}</div>
        </div>
        <div v-if="galleryImages.length > 1" class="flex gap-3 mt-3">
          <button
            v-for="img in galleryImages"
            :key="img"
            type="button"
            class="w-20 h-20 rounded overflow-hidden border-2 transition-colors"
            :class="activeImage === img ? 'border-sky-800' : 'border-transparent hover:border-slate-300'"
            @click="activeImage = img"
          >
            <img :src="img" :alt="product.name" class="w-full h-full object-cover">
          </button>
        </div>
      </div>

      <!-- 信息 -->
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{{ product.name }}</h1>
        <p v-if="product.model" class="text-slate-500 mb-4">Model: {{ product.model }}</p>
        <p v-if="product.summary" class="text-slate-700 leading-relaxed mb-6">{{ product.summary }}</p>
        <p v-if="product.description" class="text-slate-600 leading-relaxed mb-8 whitespace-pre-line">{{ product.description }}</p>

        <!-- 参数表 -->
        <div v-if="paramRows.length" class="mb-8">
          <h2 class="font-semibold text-slate-900 mb-3">Product Feature</h2>
          <table class="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
            <tbody>
              <tr v-for="row in paramRows" :key="row[0]" class="border-b border-slate-200 last:border-b-0">
                <td class="bg-slate-50 px-4 py-2.5 font-medium text-slate-700 w-48">{{ row[0] }}</td>
                <td class="px-4 py-2.5 text-slate-600">{{ row[1] }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- CTA -->
        <div class="flex flex-wrap gap-3">
          <NuxtLink :to="quoteLink" class="bg-sky-800 hover:bg-sky-700 text-white font-semibold px-6 py-3 rounded transition-colors">
            Quote Now
          </NuxtLink>
          <a :href="emailLink" class="border border-slate-300 hover:border-sky-800 hover:text-sky-800 font-semibold px-6 py-3 rounded transition-colors">
            Send Email
          </a>
          <a
            :href="whatsappLink"
            target="_blank"
            rel="noopener"
            class="border border-slate-300 hover:border-sky-800 hover:text-sky-800 font-semibold px-6 py-3 rounded transition-colors"
          >
            WhatsApp
          </a>
        </div>

        <!-- Tags -->
        <div v-if="product.tags?.length" class="mt-6 flex flex-wrap gap-2">
          <span
            v-for="tag in product.tags"
            :key="tag"
            class="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <!-- 相关商品 -->
    <section v-if="relatedProducts.length" class="mt-16">
      <h2 class="text-xl font-bold text-slate-900 mb-6">Related Products</h2>
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <ProductCard v-for="p in relatedProducts" :key="p.slug" :product="p" />
      </div>
    </section>
  </div>
</template>
