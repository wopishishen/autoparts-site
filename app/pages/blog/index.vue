<script setup lang="ts">
import { computed } from 'vue'
import type { BlogPost } from '~/types/content'

const route = useRoute()
const posts = useBlogPosts()
const categories = useBlogCategories()
const featuredPosts = useFeaturedBlogPosts(2)

const activeCategory = computed(() => (route.query.category as string) || '')

const filteredPosts = computed(() => {
  if (!activeCategory.value) return posts
  return posts.filter((p) => p.category === activeCategory.value)
})

const categoryNames: Record<string, string> = {
  'industry-news': 'Industry News',
  'company-news': 'Company News',
  'technical-articles': 'Technical Articles',
  'guides': 'Buying Guides',
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

useSeoMeta({
  title: 'Blog & News - Commercial Vehicle Spare Parts',
  description: 'Industry news, technical articles, and buying guides for commercial vehicle spare parts. Stay informed about bus and truck parts trends.',
})
</script>

<template>
  <div>
    <!-- 页面头部 -->
    <section class="bg-sky-900 text-white py-16">
      <div class="max-w-7xl mx-auto px-4">
        <h1 class="text-4xl font-bold mb-3">Blog &amp; News</h1>
        <p class="text-sky-200 text-lg max-w-2xl">
          Industry insights, technical guides, and company updates for commercial vehicle spare parts professionals.
        </p>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid gap-8 lg:grid-cols-[1fr_280px]">
        <!-- 主内容区 -->
        <div>
          <!-- 精选文章 -->
          <div v-if="featuredPosts.length > 0 && !activeCategory" class="mb-10">
            <h2 class="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span class="w-1 h-5 bg-sky-800 rounded"></span>
              Featured Articles
            </h2>
            <div class="grid gap-6 md:grid-cols-2">
              <NuxtLink
                v-for="post in featuredPosts"
                :key="post.slug"
                :to="`/blog/${post.slug}`"
                class="group bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div class="aspect-[16/9] bg-slate-100 overflow-hidden">
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
            </div>
          </div>

          <!-- 分类筛选 -->
          <div class="flex flex-wrap gap-2 mb-6">
            <NuxtLink
              to="/blog"
              class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
              :class="!activeCategory ? 'bg-sky-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            >
              All
            </NuxtLink>
            <NuxtLink
              v-for="cat in categories"
              :key="cat.slug"
              :to="`/blog?category=${cat.slug}`"
              class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
              :class="activeCategory === cat.slug ? 'bg-sky-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            >
              {{ cat.name }} ({{ cat.count }})
            </NuxtLink>
          </div>

          <!-- 文章列表 -->
          <div v-if="filteredPosts.length > 0" class="space-y-6">
            <NuxtLink
              v-for="post in filteredPosts"
              :key="post.slug"
              :to="`/blog/${post.slug}`"
              class="group flex gap-5 bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-shadow p-4"
            >
              <div class="w-48 h-32 flex-shrink-0 bg-slate-100 rounded overflow-hidden">
                <img
                  v-if="post.coverImage"
                  :src="post.coverImage"
                  :alt="post.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 text-xs text-slate-500 mb-1.5">
                  <span class="bg-sky-50 text-sky-800 px-2 py-0.5 rounded font-medium">
                    {{ categoryNames[post.category] || post.category }}
                  </span>
                  <span>{{ formatDate(post.date) }}</span>
                  <span v-if="post.author" class="text-slate-400">· {{ post.author }}</span>
                </div>
                <h3 class="font-bold text-slate-800 group-hover:text-sky-800 transition-colors line-clamp-2">
                  {{ post.title }}
                </h3>
                <p class="text-sm text-slate-600 mt-1.5 line-clamp-2">{{ post.summary }}</p>
              </div>
            </NuxtLink>
          </div>

          <!-- 无文章 -->
          <div v-else class="text-center py-16 text-slate-500">
            <p class="text-lg">No articles found in this category.</p>
            <NuxtLink to="/blog" class="text-sky-800 hover:underline mt-2 inline-block">View all articles</NuxtLink>
          </div>
        </div>

        <!-- 侧边栏 -->
        <aside class="space-y-6">
          <!-- 分类 -->
          <div class="bg-white rounded-lg border border-slate-200 p-5">
            <h3 class="font-bold text-slate-800 mb-4">Categories</h3>
            <ul class="space-y-2">
              <li>
                <NuxtLink
                  to="/blog"
                  class="flex justify-between items-center text-sm py-1.5 transition-colors"
                  :class="!activeCategory ? 'text-sky-800 font-medium' : 'text-slate-600 hover:text-sky-800'"
                >
                  <span>All Articles</span>
                  <span class="text-slate-400">{{ posts.length }}</span>
                </NuxtLink>
              </li>
              <li v-for="cat in categories" :key="cat.slug">
                <NuxtLink
                  :to="`/blog?category=${cat.slug}`"
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
          <div class="bg-sky-800 rounded-lg p-5 text-white">
            <h3 class="font-bold mb-2">Need Parts?</h3>
            <p class="text-sm text-sky-200 mb-4">
              Get a quick quote for commercial vehicle spare parts from our expert team.
            </p>
            <NuxtLink
              to="/contact"
              class="block text-center bg-white text-sky-800 font-semibold py-2 rounded hover:bg-sky-50 transition-colors text-sm"
            >
              Request a Quote
            </NuxtLink>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
