<script setup lang="ts">
const site = siteConfig
const categories = useCategories()
const featuredProducts = useFeaturedProducts(8)

useSeoMeta({
  title: site.seo.defaultTitle,
  description: site.seo.defaultDescription,
  ogType: 'website',
  ogTitle: site.seo.defaultTitle,
  ogDescription: site.seo.defaultDescription,
})

const advantages = [
  { title: 'Quality Assurance', text: 'Strict quality control on every part to ensure reliability and long service life.' },
  { title: 'Competitive Price', text: 'Direct factory sourcing with optimized costs for better market competitiveness.' },
  { title: 'Customized Service', text: 'OEM / ODM and KD services tailored to your specific requirements.' },
  { title: 'After-sales System', text: 'Professional pre-sale, sale and after-sales support for every customer.' },
  { title: 'Professional Guidance', text: 'Experienced engineers provide cost-effective parts solutions.' },
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="bg-sky-900 text-white">
      <div class="max-w-7xl mx-auto px-4 py-20 text-center">
        <p class="text-sky-300 font-semibold tracking-wide mb-3">{{ site.brandLogoText }}</p>
        <h1 class="text-3xl md:text-5xl font-bold leading-tight mb-5">
          {{ site.tagline }}
        </h1>
        <p class="text-sky-100/90 max-w-2xl mx-auto mb-8 text-lg">
          We export quality bus and truck spare parts worldwide, covering engine, chassis, gearbox, body, brake and electric systems.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <NuxtLink to="/products" class="bg-white text-sky-900 font-semibold px-6 py-3 rounded hover:bg-sky-100 transition-colors">
            View Products
          </NuxtLink>
          <NuxtLink to="/contact" class="border border-white/60 font-semibold px-6 py-3 rounded hover:bg-white/10 transition-colors">
            Contact Us
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 核心优势 -->
    <section class="max-w-7xl mx-auto px-4 py-14">
      <h2 class="text-2xl font-bold text-slate-900 text-center mb-8">Why Choose Us</h2>
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <div v-for="a in advantages" :key="a.title" class="bg-slate-50 border border-slate-200 rounded-lg p-5">
          <div class="w-10 h-10 bg-sky-800 rounded flex items-center justify-center text-white font-bold mb-3">
            {{ a.title.charAt(0) }}
          </div>
          <h3 class="font-semibold text-slate-800 mb-1.5">{{ a.title }}</h3>
          <p class="text-sm text-slate-600 leading-relaxed">{{ a.text }}</p>
        </div>
      </div>
    </section>

    <!-- 产品分类 -->
    <section class="bg-slate-50 py-14">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-2xl font-bold text-slate-900 text-center mb-3">Product Categories</h2>
        <p class="text-slate-600 text-center mb-8 max-w-2xl mx-auto">
          Our products cover the whole commercial vehicle, from engine to electrical system.
        </p>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <NuxtLink
            v-for="cat in categories"
            :key="cat.slug"
            :to="`/products?category=${cat.slug}`"
            class="group bg-white border border-slate-200 rounded-lg p-5 hover:border-sky-800 hover:shadow-md transition-all"
          >
            <div class="aspect-[4/3] bg-slate-100 rounded mb-4 overflow-hidden">
              <img
                v-if="cat.image"
                :src="cat.image"
                :alt="cat.name"
                loading="lazy"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform"
              >
              <div v-else class="w-full h-full flex items-center justify-center text-slate-400 font-medium">{{ cat.name }}</div>
            </div>
            <h3 class="font-semibold text-slate-800 group-hover:text-sky-800 transition-colors">{{ cat.name }}</h3>
            <p class="text-sm text-slate-600 mt-1 line-clamp-2">{{ cat.description }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 精选商品 -->
    <section class="max-w-7xl mx-auto px-4 py-14">
      <div class="flex items-end justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">Hot Products</h2>
          <p class="text-slate-600 mt-1">Featured products picked by our customers</p>
        </div>
        <NuxtLink to="/products" class="text-sky-800 font-semibold hover:underline">View All +</NuxtLink>
      </div>
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <ProductCard v-for="p in featuredProducts" :key="p.slug" :product="p" />
      </div>
    </section>

    <!-- CTA 横幅 -->
    <section class="bg-sky-900 text-white">
      <div class="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 class="text-2xl font-bold mb-1">Need a quote or have questions?</h2>
          <p class="text-sky-100/90">Contact our sales team directly — we reply within 24 hours.</p>
        </div>
        <div class="flex flex-wrap gap-4">
          <a
            :href="`mailto:${site.contact.email}`"
            class="bg-white text-sky-900 font-semibold px-5 py-2.5 rounded hover:bg-sky-100 transition-colors"
          >
            Send Email
          </a>
          <a
            :href="`https://wa.me/${site.contact.whatsapp.replace(/[^0-9]/g, '')}`"
            target="_blank"
            rel="noopener"
            class="border border-white/60 font-semibold px-5 py-2.5 rounded hover:bg-white/10 transition-colors"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
