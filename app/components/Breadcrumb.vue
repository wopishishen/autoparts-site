<script setup lang="ts">
import type { NuxtLinkProps } from '#app'

defineProps<{
  items: { label: string; to?: string }[]
}>()

type LinkComponent = NuxtLinkProps
</script>

<template>
  <!-- 统一面包屑条（灰底 + 分隔符，全站一致） -->
  <div class="bg-slate-50 border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 py-2.5">
      <nav class="text-sm text-slate-500 flex flex-wrap items-center gap-1">
        <template v-for="(item, i) in items" :key="i">
          <template v-if="i > 0">
            <span class="mx-1 text-slate-300">›</span>
          </template>
          <NuxtLink
            v-if="item.to"
            :to="item.to"
            class="hover:text-sky-800 transition-colors"
          >
            {{ item.label }}
          </NuxtLink>
          <span v-else class="text-slate-800">{{ item.label }}</span>
        </template>
      </nav>
    </div>
  </div>
</template>
