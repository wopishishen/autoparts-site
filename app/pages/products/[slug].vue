<script setup lang="ts">
import { ref, computed } from 'vue'
import MarkdownIt from 'markdown-it'

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

// 富文本渲染（Product Feature 区域）
const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
})
const renderedDetails = computed(() => (product!.details ? md.render(product!.details) : ''))

// 画廊
const activeImage = ref(product!.images?.[0] ?? '')
const galleryImages = computed(() => product!.images ?? [])

useSeoMeta({
  title: product!.seo?.title || product!.name,
  description: product!.seo?.description || product!.summary || '',
  ogType: 'product',
  ogTitle: product!.seo?.title || product!.name,
  ogDescription: product!.seo?.description || product!.summary || '',
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
        description: product!.summary || '',
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
const quoteLink = computed(() => `/contact?product=${encodeURIComponent(product!.name)}`)

function formatTag(tag: string): string {
  return tag
    .split('-')
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ''))
    .join(' ')
}
</script>

<template>
  <div v-if="product">
    <!-- 子页面纯图 Banner -->
    <SubBanner image="/images/banners/d_images_sub_banner_pro.jpg" />

    <!-- 面包屑 -->
    <Breadcrumb
      :items="[
        { label: 'Home', to: '/' },
        { label: 'Products', to: '/products' },
        ...(category ? [{ label: category.name, to: `/products?category=${category.slug}` }] : []),
        { label: product.name },
      ]"
    />

    <div class="max-w-7xl mx-auto px-4 pt-8 pb-10">
      <div class="grid gap-10 lg:grid-cols-2">
        <!-- 图片画廊 -->
        <div>
          <div class="aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
            <img
              v-if="activeImage"
              :src="activeImage"
              :alt="product.name"
              class="w-full h-full object-contain"
            >
            <div v-else class="w-full h-full flex items-center justify-center text-slate-400">{{ product.name }}</div>
          </div>
          <div v-if="galleryImages.length > 1" class="flex gap-3 mt-3 overflow-x-auto pb-1">
            <button
              v-for="img in galleryImages"
              :key="img"
              type="button"
              class="w-20 h-20 flex-shrink-0 rounded overflow-hidden border-2 transition-colors bg-slate-100"
              :class="activeImage === img ? 'border-sky-800' : 'border-transparent hover:border-slate-300'"
              @click="activeImage = img"
            >
              <img :src="img" :alt="product.name" class="w-full h-full object-contain">
            </button>
          </div>
        </div>

        <!-- 信息 -->
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{{ product.name }}</h1>
          <p v-if="product.model" class="text-slate-500 mb-4">Model: {{ product.model }}</p>
          <p v-if="product.summary" class="text-slate-600 leading-relaxed mb-6">{{ product.summary }}</p>

          <!-- CTA -->
          <div class="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            <NuxtLink :to="quoteLink" class="col-span-2 sm:col-span-1 text-center bg-sky-800 hover:bg-sky-700 text-white font-semibold px-6 py-3 rounded transition-colors">
              Quote Now
            </NuxtLink>
            <a :href="emailLink" class="text-center border border-slate-300 hover:border-sky-800 hover:text-sky-800 font-semibold px-6 py-3 rounded transition-colors">
              Send Email
            </a>
            <a
              :href="whatsappLink"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold px-6 py-3 rounded transition-colors"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
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
              {{ formatTag(tag) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Product Feature 富文本区（标题由运营在 details 中自由书写） -->
      <Reveal>
      <section v-if="renderedDetails" class="mt-14">
        <div class="prose max-w-none" v-html="renderedDetails"></div>
      </section>
      </Reveal>

      <!-- 相关商品 -->
      <section v-if="relatedProducts.length" class="mt-16">
        <SectionHeader eyebrow="Related" title="Related Products">
          <template #action>
            <NuxtLink to="/products" class="text-sky-800 font-semibold text-sm hover:underline">View Products →</NuxtLink>
          </template>
        </SectionHeader>
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal v-for="(p, i) in relatedProducts" :key="p.slug" :delay="(i % 4) * 80">
            <ProductCard :product="p" />
          </Reveal>
        </div>
      </section>
    </div>

    <!-- CTA -->
    <CTABanner title="Need This Part?" subtitle="Send us your parts list or VIN number, get a competitive quote within 24 hours." />
  </div>
</template>
