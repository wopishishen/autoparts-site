<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  subtitle?: string
  compact?: boolean
}>(), {
  subtitle: '',
  compact: false,
})
</script>

<template>
  <section class="theme-flow-bg relative overflow-hidden text-white" :class="compact ? 'py-12' : 'py-16'">
    <FlowBackground />
    <div :class="compact ? 'max-w-3xl mx-auto px-4' : 'max-w-7xl mx-auto px-4'" class="relative z-10">
      <!-- 可选返回链接/分类标签（由调用方 slot 提供） -->
      <div v-if="$slots.meta" class="mb-4">
        <slot name="meta" />
      </div>
      <h1 class="text-3xl md:text-4xl font-bold leading-tight mb-3">{{ title }}</h1>
      <p v-if="subtitle" class="text-sky-200 text-lg max-w-2xl">{{ subtitle }}</p>
    </div>
  </section>
</template>
