<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  subtitle?: string
  buttonText?: string
  buttonTo?: string
  compact?: boolean
}>(), {
  title: 'Need a Quick Quote?',
  subtitle: 'Send us your parts list or VIN number, get a competitive quote within 24 hours.',
  buttonText: 'Send Inquiry Now',
  buttonTo: '/contact',
  compact: false,
})
</script>

<template>
  <section
    :class="[
      'cta-banner relative overflow-hidden text-white',
      compact ? 'rounded-lg p-5' : 'py-12',
    ]"
  >
    <!-- 流动光效层 -->
    <div class="cta-effects pointer-events-none absolute inset-0" aria-hidden="true">
      <div class="cta-glow cta-glow-a" />
      <div class="cta-glow cta-glow-b" />
      <div class="cta-flow" />
    </div>

    <!-- 内容层 -->
    <div class="relative z-10" :class="compact ? '' : 'max-w-4xl mx-auto px-4 text-center'">
      <h3 :class="compact ? 'font-bold mb-2' : 'text-2xl md:text-3xl font-bold mb-3'">{{ title }}</h3>
      <p :class="compact ? 'text-sm text-sky-100/90 mb-4' : 'text-sky-100/90 mb-6 text-sm'">{{ subtitle }}</p>
      <NuxtLink
        :to="buttonTo"
        :class="[
          'cta-btn bg-white text-sky-800 font-semibold rounded transition-all duration-300',
          compact ? 'block w-full text-center py-2 text-sm' : 'inline-block px-8 py-3 text-sm hover:-translate-y-0.5',
        ]"
      >
        {{ buttonText }}
      </NuxtLink>
    </div>
  </section>
</template>

<style>
.cta-banner {
  background: linear-gradient(135deg, #0c4a6e 0%, #075985 45%, #0369a1 100%);
}

/* —— 光效层容器 —— */
.cta-effects {
  overflow: hidden;
}

/* —— 呼吸漂移光斑 —— */
.cta-glow {
  position: absolute;
  border-radius: 9999px;
  filter: blur(40px);
  will-change: transform, opacity;
}
.cta-glow-a {
  width: 60%;
  aspect-ratio: 1;
  top: -50%;
  right: -15%;
  background: radial-gradient(circle, rgba(34, 211, 238, 0.55), transparent 70%);
  animation: cta-glow-a 7s ease-in-out infinite alternate;
}
.cta-glow-b {
  width: 50%;
  aspect-ratio: 1;
  bottom: -60%;
  left: -10%;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.5), transparent 70%);
  animation: cta-glow-b 9s ease-in-out infinite alternate;
}
@keyframes cta-glow-a {
  0%   { transform: translate3d(0, 0, 0) scale(1);    opacity: 0.75; }
  100% { transform: translate3d(-25%, 22%, 0) scale(1.4); opacity: 1; }
}
@keyframes cta-glow-b {
  0%   { transform: translate3d(0, 0, 0) scale(1);    opacity: 0.6; }
  100% { transform: translate3d(28%, -22%, 0) scale(1.35); opacity: 1; }
}

/* —— 背景光整体流动（多色光斑碰撞，非带状扫过） —— */
.cta-flow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(40% 48% at 25% 40%, rgba(34, 211, 238, 0.40), transparent 65%),
    radial-gradient(36% 44% at 75% 60%, rgba(139, 92, 246, 0.36), transparent 65%),
    radial-gradient(28% 36% at 50% 28%, rgba(236, 72, 153, 0.24), transparent 65%),
    radial-gradient(30% 40% at 60% 75%, rgba(59, 130, 246, 0.32), transparent 65%);
  background-size: 240% 240%, 220% 220%, 200% 200%, 260% 260%;
  animation: cta-flow 14s ease-in-out infinite alternate;
  will-change: background-position;
}
@keyframes cta-flow {
  0%   { background-position: 0% 0%, 100% 100%, 50% 50%, 20% 80%; }
  50%  { background-position: 70% 30%, 20% 80%, 85% 15%, 90% 30%; }
  100% { background-position: 100% 100%, 0% 0%, 15% 85%, 40% 10%; }
}

.cta-btn {
  box-shadow:
    0 0 18px rgba(56, 189, 248, 0.4),
    0 0 44px rgba(56, 189, 248, 0.2);
  animation: cta-btn-pulse 2s ease-in-out infinite;
}
.cta-btn:hover {
  box-shadow:
    0 0 26px rgba(56, 189, 248, 0.6),
    0 0 64px rgba(56, 189, 248, 0.32);
}
@keyframes cta-btn-pulse {
  0%, 100% { box-shadow: 0 0 12px rgba(56, 189, 248, 0.3), 0 0 32px rgba(56, 189, 248, 0.16); }
  50%      { box-shadow: 0 0 24px rgba(56, 189, 248, 0.55), 0 0 60px rgba(56, 189, 248, 0.3); }
}

/* —— compact 侧栏模式：轻量光效 —— */
.cta-banner.compact .cta-glow {
  filter: blur(24px);
}
.cta-banner.compact .cta-glow-a {
  width: 75%;
  top: -75%;
  right: -25%;
}
.cta-banner.compact .cta-glow-b {
  display: none;
}
.cta-banner.compact .cta-flow {
  animation-duration: 18s;
}
</style>
