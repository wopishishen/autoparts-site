<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  subtitle?: string
}>(), {
  subtitle: '',
})
</script>

<template>
  <div class="mb-6">
    <h1 class="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">{{ title }}</h1>
    <p
      v-if="subtitle"
      class="text-slate-500 mt-2 text-sm leading-relaxed max-w-2xl"
    >
      {{ subtitle }}
    </p>
  </div>
</template>
