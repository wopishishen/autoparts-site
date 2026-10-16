<script setup lang="ts">
/**
 * Reveal —— 轻量滚动渐入组件（零依赖）
 * 基于 IntersectionObserver：元素进入视口一次后触发，CSS transition 完成渐出。
 * 克制使用：只包裹需要动效的区块/卡片，不整页包裹。
 */
const props = withDefaults(
  defineProps<{
    /** 过渡延迟（ms），用于列表卡片 stagger，如 :delay="index * 80" */
    delay?: number
    /** 进入视口触发比例，默认 0.15 */
    threshold?: number
  }>(),
  { delay: 0, threshold: 0.15 }
)

const el = ref<HTMLElement | null>(null)
const visible = ref(false)

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!el.value || typeof IntersectionObserver === 'undefined') {
    visible.value = true
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          visible.value = true
          observer?.disconnect()
          break
        }
      }
    },
    { threshold: props.threshold, rootMargin: '0px 0px -48px 0px' }
  )
  observer.observe(el.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <div
    ref="el"
    class="reveal"
    :class="{ 'is-visible': visible }"
    :style="delay ? { transitionDelay: `${delay}ms` } : undefined"
  >
    <slot />
  </div>
</template>
