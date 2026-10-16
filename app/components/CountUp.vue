<script setup lang="ts">
/**
 * CountUp —— 轻量数字跳动组件（零依赖）
 * 元素进入视口后，数字从 0 递增到目标值（easeOutCubic，默认 1.2s）。
 * 支持 '90+' / '1100+' 这类带后缀的文本。
 */
const props = withDefaults(
  defineProps<{
    /** 原始文本，如 '90+'、'1100' */
    text: string
    /** 动画时长（ms） */
    duration?: number
  }>(),
  { duration: 1200 }
)

const el = ref<HTMLElement | null>(null)
const display = ref('0')

// 解析数字部分与后缀（'90+' → 90 / '+'；'1100' → 1100 / ''）
const match = props.text.match(/^([\d.]+)(.*)$/)
const target = match ? Number.parseFloat(match[1]) : Number.NaN
const suffix = match ? match[2] : props.text

let observer: IntersectionObserver | null = null
let raf = 0

function animate() {
  if (Number.isNaN(target)) {
    display.value = props.text
    return
  }
  const start = performance.now()
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / props.duration)
    const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
    display.value = String(Math.round(target * eased))
    if (t < 1) raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
}

onMounted(() => {
  if (!el.value || typeof IntersectionObserver === 'undefined' || Number.isNaN(target)) {
    display.value = props.text
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          animate()
          observer?.disconnect()
          break
        }
      }
    },
    { threshold: 0.4 }
  )
  observer.observe(el.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
  cancelAnimationFrame(raf)
})
</script>

<template>
  <span ref="el">{{ display }}{{ suffix }}</span>
</template>
