<script setup lang="ts">
import { computed } from 'vue'
import type { NewsPost } from '~/types/content'

const route = useRoute()
const posts = useNewsPosts()
const categories = useNewsCategories()
const featuredPosts = useFeaturedNewsPosts(2)

const PAGE_SIZE = 9

const activeCategory = computed(() => (route.query.category as string) || '')

const filteredPosts = computed(() => {
  if (!activeCategory.value) return posts
  return posts.filter((p) => p.category === activeCategory.value)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPosts.value.length / PAGE_SIZE)))

const currentPage = computed(() => {
  const raw = Number.parseInt(route.query.page as string, 10)
  const page = Number.isFinite(raw) && raw > 0 ? raw : 1
  return Math.min(page, totalPages.value)
})

const pagedPosts = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredPosts.value.slice(start, start + PAGE_SIZE)
})

// 切页回到顶部
watch(currentPage, () => window.scrollTo({ top: 0, behavior: 'smooth' }))

const categoryNames: Record<string, string> = {
  'industry-news': 'Industry News',
  'company-news': 'Company News',
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

useSeoMeta({
  title: 'News - Commercial Vehicle Spare Parts',
  description: 'Industry news and company updates for commercial vehicle spare parts. Stay informed about bus and truck parts trends.',
})
</script>

<template>
  <div>
    <!-- 子页面纯图 Banner -->
    <SubBanner image="/images/banners/d_images_sub_banner_news.jpg" />

    <!-- 面包屑 -->
    <Breadcrumb :items="[{ label: 'Home', to: '/' }, { label: 'News' }]" />

    <div class="max-w-7xl mx-auto px-4 pt-8 pb-12">
      <PageTitle title="News" />
      <div class="grid gap-8 lg:grid-cols-[1fr_280px]">
        <!-- 主内容区 -->
        <div>
          <!-- 精选文章（仅第一页且未筛选分类时显示） -->
          <div v-if="featuredPosts.length > 0 && !activeCategory && currentPage === 1" class="mb-10">
            <h2 class="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span class="w-1 h-5 bg-sky-800 rounded"></span>
              Featured News
            </h2>
            <div class="grid gap-6 md:grid-cols-2">
              <Reveal v-for="(post, i) in featuredPosts" :key="post.slug" :delay="i * 100">
                <NuxtLink
                  :to="`/news/${post.slug}`"
                  class="group bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div class="aspect-[3/2] bg-slate-100 overflow-hidden">
                    <img
                      v-if="post.coverImage"
                      :src="post.coverImage"
                      :alt="post.title"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div class="p-5">
                    <div class="flex items-center gap-3 text-xs text-slate-500 mb-2">
                      <span class="bg-sky-50 text-sky-800 px-2 py-0.5 rounded font-medium">
                        {{ categoryNames[post.category] || post.category }}
                      </span>
                      <span>{{ formatDate(post.date) }}</span>
                    </div>
                    <h3 class="font-bold text-slate-800 group-hover:text-sky-800 transition-colors line-clamp-2">
                      {{ post.title }}
                    </h3>
                    <p class="text-sm text-slate-600 mt-2 line-clamp-2">{{ post.summary }}</p>
                  </div>
                </NuxtLink>
              </Reveal>
            </div>
          </div>

          <!-- 分类筛选 -->
          <div class="flex flex-wrap gap-2 mb-6">
            <NuxtLink
              to="/news"
              class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
              :class="!activeCategory ? 'bg-sky-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            >
              All
            </NuxtLink>
            <NuxtLink
              v-for="cat in categories"
              :key="cat.slug"
              :to="`/news?category=${cat.slug}`"
              class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
              :class="activeCategory === cat.slug ? 'bg-sky-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            >
              {{ cat.name }} ({{ cat.count }})
            </NuxtLink>
          </div>

          <!-- 文章列表 —— 分隔线列表，无卡片 -->
          <div v-if="pagedPosts.length > 0" class="divide-y divide-slate-200 border-t border-slate-200">
            <Reveal v-for="(post, i) in pagedPosts" :key="post.slug" :delay="(i % 3) * 60">
              <NuxtLink
                :to="`/news/${post.slug}`"
                class="group flex gap-5 py-6"
              >
                <div class="w-32 sm:w-48 h-24 sm:h-32 flex-shrink-0 bg-slate-100 rounded overflow-hidden">
                  <img
                    v-if="post.coverImage"
                    :src="post.coverImage"
                    :alt="post.title"
                    loading="lazy"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3 text-xs text-slate-500 mb-1.5">
                    <span class="bg-sky-50 text-sky-800 px-2 py-0.5 rounded font-medium">
                      {{ categoryNames[post.category] || post.category }}
                    </span>
                    <span>{{ formatDate(post.date) }}</span>
                  </div>
                  <h3 class="font-bold text-slate-800 group-hover:text-sky-800 transition-colors line-clamp-2">
                    {{ post.title }}
                  </h3>
                  <p class="text-sm text-slate-600 mt-1.5 line-clamp-2">{{ post.summary }}</p>
                </div>
              </NuxtLink>
            </Reveal>
          </div>

          <!-- 无文章 -->
          <div v-else class="text-center py-16 text-slate-500">
            <p class="text-lg">No news found in this category.</p>
            <NuxtLink to="/news" class="text-sky-800 hover:underline mt-2 inline-block">View News</NuxtLink>
          </div>

          <Pagination
            :current-page="currentPage"
            :total-pages="totalPages"
            base-path="/news"
            :extra-query="activeCategory ? { category: activeCategory } : undefined"
          />
        </div>

        <!-- 侧边栏 -->
        <aside class="space-y-6">
          <!-- 分类 -->
          <div class="bg-white rounded-lg border border-slate-200 p-5">
            <h3 class="font-bold text-slate-800 mb-4">Categories</h3>
            <ul class="space-y-2">
              <li>
                <NuxtLink
                  to="/news"
                  class="flex justify-between items-center text-sm py-1.5 transition-colors"
                  :class="!activeCategory ? 'text-sky-800 font-medium' : 'text-slate-600 hover:text-sky-800'"
                >
                  <span>All News</span>
                  <span class="text-slate-400">{{ posts.length }}</span>
                </NuxtLink>
              </li>
              <li v-for="cat in categories" :key="cat.slug">
                <NuxtLink
                  :to="`/news?category=${cat.slug}`"
                  class="flex justify-between items-center text-sm py-1.5 transition-colors"
                  :class="activeCategory === cat.slug ? 'text-sky-800 font-medium' : 'text-slate-600 hover:text-sky-800'"
                >
                  <span>{{ cat.name }}</span>
                  <span class="text-slate-400">{{ cat.count }}</span>
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- 订阅 CTA -->
          <CTABanner
            title="Need Parts?"
            subtitle="Get a quick quote for commercial vehicle spare parts from our expert team."
            button-text="Request a Quote"
            button-to="/contact"
            compact
          />
        </aside>
      </div>
    </div>
  </div>
</template>
