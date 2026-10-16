<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
  basePath: string
  extraQuery?: Record<string, string>
}>()

// 页码窗口：1 … 4 5 [6] 7 8 … 20
const pageItems = computed<(number | '...')[]>(() => {
  const total = props.totalPages
  const current = props.currentPage
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const items: (number | '...')[] = [1]
  const start = Math.max(2, current - 2)
  const end = Math.min(total - 1, current + 2)
  if (start > 2) items.push('...')
  for (let i = start; i <= end; i++) items.push(i)
  if (end < total - 1) items.push('...')
  items.push(total)
  return items
})

function pageLink(page: number) {
  return {
    path: props.basePath,
    query: { ...props.extraQuery, page: page > 1 ? page : undefined },
  }
}
</script>

<template>
  <nav v-if="totalPages > 1" class="flex items-center justify-center gap-1.5 mt-10" aria-label="Pagination">
    <!-- 上一页：始终显示，无上一页时禁用 -->
    <NuxtLink
      v-if="currentPage > 1"
      :to="pageLink(currentPage - 1)"
      class="px-3 py-1.5 rounded text-sm border border-slate-300 text-slate-600 hover:border-sky-800 hover:text-sky-800 transition-colors"
      aria-label="Previous page"
    >
      ←
    </NuxtLink>
    <span
      v-else
      class="px-3 py-1.5 rounded text-sm border border-slate-200 text-slate-300 cursor-not-allowed select-none"
      aria-label="Previous page (disabled)"
    >
      ←
    </span>
    <template v-for="(item, i) in pageItems" :key="i">
      <span v-if="item === '...'" class="px-1 text-slate-400 text-sm select-none">…</span>
      <NuxtLink
        v-else
        :to="pageLink(item)"
        class="min-w-9 px-3 py-1.5 rounded text-sm font-medium transition-colors text-center"
        :class="item === currentPage ? 'bg-sky-800 text-white' : 'border border-slate-300 text-slate-600 hover:border-sky-800 hover:text-sky-800'"
        :aria-current="item === currentPage ? 'page' : undefined"
      >
        {{ item }}
      </NuxtLink>
    </template>
    <!-- 下一页：始终显示，无下一页时禁用 -->
    <NuxtLink
      v-if="currentPage < totalPages"
      :to="pageLink(currentPage + 1)"
      class="px-3 py-1.5 rounded text-sm border border-slate-300 text-slate-600 hover:border-sky-800 hover:text-sky-800 transition-colors"
      aria-label="Next page"
    >
      →
    </NuxtLink>
    <span
      v-else
      class="px-3 py-1.5 rounded text-sm border border-slate-200 text-slate-300 cursor-not-allowed select-none"
      aria-label="Next page (disabled)"
    >
      →
    </span>
  </nav>
</template>
