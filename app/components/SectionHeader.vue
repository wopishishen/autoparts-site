<script setup lang="ts">
withDefaults(defineProps<{
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'center' | 'left'
}>(), {
  eyebrow: '',
  subtitle: '',
  align: 'left',
})
</script>

<template>
  <div
    class="mb-8"
    :class="align === 'center' ? 'text-center' : 'flex items-end justify-between gap-4'"
  >
    <div :class="align === 'center' ? '' : 'max-w-3xl'">
      <p
        v-if="eyebrow"
        class="text-sky-800 text-xs font-semibold tracking-widest uppercase mb-2"
      >
        {{ eyebrow }}
      </p>
      <h2 class="text-2xl md:text-3xl font-bold text-slate-900 leading-snug">{{ title }}</h2>
      <p
        v-if="subtitle"
        class="text-slate-500 mt-2 text-sm leading-relaxed"
        :class="align === 'center' ? 'max-w-2xl mx-auto' : ''"
      >
        {{ subtitle }}
      </p>
    </div>
    <!-- 右侧动作区（如 View All 链接） -->
    <div v-if="$slots.action" class="flex-shrink-0">
      <slot name="action" />
    </div>
  </div>
</template>
