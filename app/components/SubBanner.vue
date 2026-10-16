<script setup lang="ts">
defineProps<{
  image: string
}>()
</script>

<template>
  <!-- 子页面纯图 Banner（无文字） -->
  <section class="w-full bg-slate-100 overflow-hidden">
    <img :src="image" alt="" class="w-full h-auto" />
  </section>
</template>
