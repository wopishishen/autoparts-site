<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()
const categories = useCategories()
const allProducts = useProducts()

const activeCategory = computed(() => (route.query.category as string) || 'all')

const filteredProducts = computed(() => {
  if (activeCategory.value === 'all') return allProducts
  return allProducts.filter((p) => p.category === activeCategory.value)
})

const activeCategoryName = computed(() => {
  if (activeCategory.value === 'all') return 'All Products'
  return categories.find((c) => c.slug === activeCategory.value)?.name || 'Products'
})

useSeoMeta({
  title: `${activeCategoryName.value} - Auto Parts Supplier`,
  description: `Browse our ${activeCategoryName.value.toLowerCase()} — quality commercial vehicle spare parts with global shipping.`,
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- 面包屑 -->
    <nav class="text-sm text-slate-500 mb-6">
      <NuxtLink to="/" class="hover:text-sky-800">Home</NuxtLink>
      <span class="mx-2">›</span>
      <span class="text-slate-800">Products</span>
      <template v-if="activeCategory !== 'all'">
        <span class="mx-2">›</span>
        <span class="text-slate-800">{{ activeCategoryName }}</span>
      </template>
    </nav>

    <h1 class="text-2xl font-bold text-slate-900 mb-6">{{ activeCategoryName }}</h1>

    <div class="grid gap-8 lg:grid-cols-[240px_1fr]">
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
        <p class="text-sm text-slate-500 mb-4">{{ filteredProducts.length }} product(s)</p>
        <div v-if="filteredProducts.length" class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <ProductCard v-for="p in filteredProducts" :key="p.slug" :product="p" />
        </div>
        <div v-else class="bg-slate-50 border border-slate-200 rounded-lg p-10 text-center text-slate-500">
          No products in this category yet. Please contact us for details.
        </div>
      </div>
    </div>
  </div>
</template>
