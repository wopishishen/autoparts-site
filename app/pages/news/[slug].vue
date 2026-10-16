<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'

const route = useRoute()
const slug = route.params.slug as string
const post = useNewsPost(slug)

if (!post) {
  throw createError({ statusCode: 404, statusMessage: 'News not found' })
}

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
})

const renderedContent = computed(() => md.render(post!.content))

const relatedPosts = useRelatedNewsPosts(post!, 3)
const allPosts = useNewsPosts()
const currentIndex = allPosts.findIndex((p) => p.slug === post!.slug)
const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null

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

function formatTag(tag: string): string {
  return tag
    .split('-')
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ''))
    .join(' ')
}

useSeoMeta({
  title: post.seo?.title || `${post.title} | News`,
  description: post.seo?.description || post.summary,
  ogImage: post.coverImage,
  ogType: 'article',
  articlePublishedTime: post.date,
})
</script>

<template>
  <article>
    <!-- 子页面纯图 Banner -->
    <SubBanner image="/images/banners/d_images_sub_banner_news.jpg" />

    <!-- 面包屑 -->
    <Breadcrumb :items="[{ label: 'Home', to: '/' }, { label: 'News', to: '/news' }, { label: post.title }]" />

    <!-- 封面图（自适应：撑满版心宽度，高度随原图比例，不裁切） -->
    <div v-if="post.coverImage" class="max-w-4xl mx-auto px-4 pt-8">
      <img
        :src="post.coverImage"
        :alt="post.title"
        class="w-full h-auto rounded-lg"
      />
    </div>

    <!-- 正文（版心与封面图一致） -->
    <div class="max-w-4xl mx-auto px-4 py-10">
      <!-- 文章元信息 -->
      <div class="flex items-center gap-3 text-sm mb-4">
        <span class="bg-sky-50 text-sky-800 px-2.5 py-0.5 rounded font-medium">
          {{ categoryNames[post.category] || post.category }}
        </span>
        <span class="text-slate-500">{{ formatDate(post.date) }}</span>
        <span v-if="post.author" class="text-slate-400">· {{ post.author }}</span>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-8">{{ post.title }}</h1>

      <div class="prose max-w-none" v-html="renderedContent" />

      <!-- 标签 -->
      <div v-if="post.tags && post.tags.length > 0" class="mt-10 pt-6 border-t border-slate-200">
        <div class="flex flex-wrap gap-2">
          <span class="text-sm text-slate-500 font-medium">Tags:</span>
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full"
          >
            {{ formatTag(tag) }}
          </span>
        </div>
      </div>

      <!-- 上一篇/下一篇 -->
      <nav v-if="prevPost || nextPost" class="mt-10 pt-6 border-t border-slate-200 grid gap-4 sm:grid-cols-2">
        <NuxtLink
          v-if="prevPost"
          :to="`/news/${prevPost.slug}`"
          class="group p-4 rounded-lg border border-slate-200 hover:border-sky-800 hover:shadow-sm transition-all"
        >
          <div class="text-xs text-slate-400 mb-1">&larr; Previous News</div>
          <div class="font-medium text-slate-700 group-hover:text-sky-800 transition-colors line-clamp-2">
            {{ prevPost.title }}
          </div>
        </NuxtLink>
        <NuxtLink
          v-if="nextPost"
          :to="`/news/${nextPost.slug}`"
          class="group p-4 rounded-lg border border-slate-200 hover:border-sky-800 hover:shadow-sm transition-all text-right"
        >
          <div class="text-xs text-slate-400 mb-1">Next News &rarr;</div>
          <div class="font-medium text-slate-700 group-hover:text-sky-800 transition-colors line-clamp-2">
            {{ nextPost.title }}
          </div>
        </NuxtLink>
      </nav>
    </div>

    <!-- 相关文章 -->
    <section v-if="relatedPosts.length > 0" class="bg-slate-50 py-12">
      <div class="max-w-5xl mx-auto px-4">
        <SectionHeader eyebrow="Read More" title="Related News" align="center" />
        <div class="grid gap-6 md:grid-cols-3 mt-8">
          <Reveal v-for="(related, i) in relatedPosts" :key="related.slug" :delay="i * 100">
            <NuxtLink
              :to="`/news/${related.slug}`"
              class="group bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div class="aspect-[3/2] bg-slate-100 overflow-hidden">
                <img
                  v-if="related.coverImage"
                  :src="related.coverImage"
                  :alt="related.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div class="p-4">
                <div class="text-xs text-sky-800 font-medium mb-1.5">
                  {{ categoryNames[related.category] || related.category }}
                </div>
                <h3 class="font-semibold text-slate-800 text-sm group-hover:text-sky-800 transition-colors line-clamp-2">
                  {{ related.title }}
                </h3>
                <div class="text-xs text-slate-400 mt-2">{{ formatDate(related.date) }}</div>
              </div>
            </NuxtLink>
          </Reveal>
        </div>
      </div>
    </section>

    <!-- 询盘 CTA -->
    <CTABanner
      title="Looking for Quality Spare Parts?"
      subtitle="Contact our team for a quick quote on commercial vehicle spare parts."
      button-text="Get a Free Quote"
      button-to="/contact"
    />
  </article>
</template>
