<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()
const categories = useCategories()
const allProducts = useProducts()

const PAGE_SIZE = 12

const activeCategory = computed(() => (route.query.category as string) || 'all')

const filteredProducts = computed(() => {
  if (activeCategory.value === 'all') return allProducts
  return allProducts.filter((p) => p.category === activeCategory.value)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredProducts.value.length / PAGE_SIZE)))

const currentPage = computed(() => {
  const raw = Number.parseInt(route.query.page as string, 10)
  const page = Number.isFinite(raw) && raw > 0 ? raw : 1
  return Math.min(page, totalPages.value)
})

const pagedProducts = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredProducts.value.slice(start, start + PAGE_SIZE)
})

const activeCategoryName = computed(() => {
  if (activeCategory.value === 'all') return 'All Products'
  return categories.find((c) => c.slug === activeCategory.value)?.name || 'Products'
})

// 切页回到顶部
watch(currentPage, () => window.scrollTo({ top: 0, behavior: 'smooth' }))

useSeoMeta({
  title: activeCategoryName.value,
  description: `Browse ${activeCategoryName.value} — quality commercial vehicle spare parts with global shipping.`,
})
</script>

<template>
  <div>
    <!-- 子页面纯图 Banner -->
    <SubBanner image="/images/banners/d_images_sub_banner_pro.jpg" />

    <!-- 面包屑 -->
    <Breadcrumb
      :items="[
        { label: 'Home', to: '/' },
        { label: 'Products' },
        ...(activeCategory !== 'all' ? [{ label: activeCategoryName }] : []),
      ]"
    />

    <div class="max-w-7xl mx-auto px-4 pt-8 pb-10">
      <div class="grid gap-8 lg:grid-cols-[240px_1fr] mt-2">
        <!-- 侧栏分类 -->
        <aside class="lg:border-r lg:border-slate-200 lg:pr-6">
          <h2 class="font-semibold text-slate-900 mb-3">Product Category</h2>
          <ul class="space-y-1">
            <li>
              <NuxtLink
                to="/products"
                class="block px-3 py-2 rounded text-sm transition-colors"
                :class="activeCategory === 'all' ? 'bg-sky-800 text-white font-medium' : 'text-slate-700 hover:bg-slate-100'"
              >
                All Products
              </NuxtLink>
            </li>
            <li v-for="cat in categories" :key="cat.slug">
              <NuxtLink
                :to="`/products?category=${cat.slug}`"
                class="block px-3 py-2 rounded text-sm transition-colors"
                :class="activeCategory === cat.slug ? 'bg-sky-800 text-white font-medium' : 'text-slate-700 hover:bg-slate-100'"
              >
                {{ cat.name }}
              </NuxtLink>
            </li>
          </ul>
        </aside>

        <!-- 商品网格 -->
        <div>
          <PageTitle :title="activeCategoryName" />
          <p class="text-sm text-slate-500 mb-4">{{ filteredProducts.length }} Products</p>
          <div v-if="pagedProducts.length" class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <Reveal v-for="(p, i) in pagedProducts" :key="p.slug" :delay="(i % 3) * 80">
              <ProductCard :product="p" />
            </Reveal>
          </div>
          <div v-else class="bg-slate-50 border border-slate-200 rounded-lg p-10 text-center text-slate-500">
            No products in this category yet. Please contact us for details.
          </div>

          <Pagination
            :current-page="currentPage"
            :total-pages="totalPages"
            base-path="/products"
            :extra-query="activeCategory !== 'all' ? { category: activeCategory } : undefined"
          />
        </div>
      </div>
    </div>

    <!-- 询盘 CTA -->
    <CTABanner
      title="Can't Find the Part You Need?"
      subtitle="Send us your parts list or VIN number, get a competitive quote within 24 hours."
      button-text="Send Your Inquiry"
      button-to="/contact"
    />
  </div>
</template>
