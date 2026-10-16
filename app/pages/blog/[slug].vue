<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'

const route = useRoute()
const slug = route.params.slug as string
const post = useBlogPost(slug)

if (!post) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found' })
}

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
})

const renderedContent = computed(() => md.render(post!.content))

const relatedPosts = useRelatedBlogPosts(post!, 3)
const allPosts = useBlogPosts()
const currentIndex = allPosts.findIndex((p) => p.slug === post!.slug)
const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null

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
  title: post.seo?.title || `${post.title} | Blog`,
  description: post.seo?.description || post.summary,
  ogImage: post.coverImage,
  ogType: 'article',
  articlePublishedTime: post.date,
})
</script>

<template>
  <article>
    <!-- 文章头部 -->
    <header class="bg-sky-900 text-white py-12">
      <div class="max-w-3xl mx-auto px-4">
        <div class="flex items-center gap-3 text-sm text-sky-300 mb-4">
          <NuxtLink to="/blog" class="hover:text-white transition-colors">&larr; Back to Blog</NuxtLink>
          <span class="bg-sky-800 px-2.5 py-0.5 rounded font-medium text-sky-100">
            {{ categoryNames[post.category] || post.category }}
          </span>
        </div>
        <h1 class="text-3xl md:text-4xl font-bold leading-tight mb-4">{{ post.title }}</h1>
        <div class="flex items-center gap-4 text-sm text-sky-300">
          <span>{{ formatDate(post.date) }}</span>
          <span v-if="post.author">· {{ post.author }}</span>
        </div>
      </div>
    </header>

    <!-- 封面图 -->
    <div v-if="post.coverImage" class="max-w-4xl mx-auto px-4 -mt-6">
      <img
        :src="post.coverImage"
        :alt="post.title"
        class="w-full rounded-lg shadow-lg object-cover max-h-96"
      />
    </div>

    <!-- 正文 -->
    <div class="max-w-3xl mx-auto px-4 py-10">
      <div
        class="prose prose-slate max-w-none
          prose-headings:text-slate-800 prose-headings:font-bold
          prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-3
          prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-2
          prose-p:text-slate-700 prose-p:leading-relaxed
          prose-a:text-sky-800 prose-a:no-underline hover:prose-a:underline
          prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-1.5
          prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-1.5
          prose-li:text-slate-700
          prose-strong:text-slate-900
          prose-blockquote:border-l-4 prose-blockquote:border-sky-800 prose-blockquote:bg-sky-50 prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:rounded-r
          prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:text-sky-900
          prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-lg prose-pre:p-4"
        v-html="renderedContent"
      />

      <!-- 标签 -->
      <div v-if="post.tags && post.tags.length > 0" class="mt-10 pt-6 border-t border-slate-200">
        <div class="flex flex-wrap gap-2">
          <span class="text-sm text-slate-500 font-medium">Tags:</span>
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- 上一篇/下一篇 -->
      <nav v-if="prevPost || nextPost" class="mt-10 pt-6 border-t border-slate-200 grid gap-4 sm:grid-cols-2">
        <NuxtLink
          v-if="prevPost"
          :to="`/blog/${prevPost.slug}`"
          class="group p-4 rounded-lg border border-slate-200 hover:border-sky-800 hover:shadow-sm transition-all"
        >
          <div class="text-xs text-slate-400 mb-1">&larr; Previous Article</div>
          <div class="font-medium text-slate-700 group-hover:text-sky-800 transition-colors line-clamp-2">
            {{ prevPost.title }}
          </div>
        </NuxtLink>
        <NuxtLink
          v-if="nextPost"
          :to="`/blog/${nextPost.slug}`"
          class="group p-4 rounded-lg border border-slate-200 hover:border-sky-800 hover:shadow-sm transition-all text-right"
        >
          <div class="text-xs text-slate-400 mb-1">Next Article &rarr;</div>
          <div class="font-medium text-slate-700 group-hover:text-sky-800 transition-colors line-clamp-2">
            {{ nextPost.title }}
          </div>
        </NuxtLink>
      </nav>
    </div>

    <!-- 相关文章 -->
    <section v-if="relatedPosts.length > 0" class="bg-slate-50 py-12">
      <div class="max-w-5xl mx-auto px-4">
        <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span class="w-1 h-5 bg-sky-800 rounded"></span>
          Related Articles
        </h2>
        <div class="grid gap-6 md:grid-cols-3">
          <NuxtLink
            v-for="related in relatedPosts"
            :key="related.slug"
            :to="`/blog/${related.slug}`"
            class="group bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div class="aspect-[16/9] bg-slate-100 overflow-hidden">
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
        </div>
      </div>
    </section>

    <!-- 询盘 CTA -->
    <section class="bg-sky-800 text-white py-12">
      <div class="max-w-3xl mx-auto px-4 text-center">
        <h2 class="text-2xl font-bold mb-3">Looking for Quality Spare Parts?</h2>
        <p class="text-sky-200 mb-6">
          Contact our team for a quick quote on commercial vehicle spare parts.
        </p>
        <NuxtLink
          to="/contact"
          class="inline-block bg-white text-sky-800 font-semibold px-8 py-3 rounded hover:bg-sky-50 transition-colors"
        >
          Get a Free Quote
        </NuxtLink>
      </div>
    </section>
  </article>
</template>
