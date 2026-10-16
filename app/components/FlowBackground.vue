<template>
  <!-- 主题色块流动光效背景层（父容器需 relative overflow-hidden + 深蓝渐变底，内容需 relative z-10） -->
  <div class="flow-effects pointer-events-none absolute inset-0" aria-hidden="true">
    <div class="flow-glow flow-glow-a" />
    <div class="flow-glow flow-glow-b" />
    <div class="flow-bg-flow" />
  </div>
</template>

<style>
/* —— 通用主题色块背景渐变（与 CTABanner 一致） —— */
.theme-flow-bg {
  background: linear-gradient(135deg, #0c4a6e 0%, #075985 45%, #0369a1 100%);
}

/* —— 光效层容器 —— */
.flow-effects {
  overflow: hidden;
}

/* —— 呼吸漂移光斑 —— */
.flow-glow {
  position: absolute;
  border-radius: 9999px;
  filter: blur(40px);
  will-change: transform, opacity;
}
.flow-glow-a {
  width: 60%;
  aspect-ratio: 1;
  top: -50%;
  right: -15%;
  background: radial-gradient(circle, rgba(34, 211, 238, 0.80), transparent 70%);
  animation: flow-glow-a 2s ease-in-out infinite alternate;
}
.flow-glow-b {
  width: 50%;
  aspect-ratio: 1;
  bottom: -60%;
  left: -10%;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.75), transparent 70%);
  animation: flow-glow-b 2.5s ease-in-out infinite alternate;
}
@keyframes flow-glow-a {
  0%   { transform: translate3d(0, 0, 0) scale(1);    opacity: 0.85; }
  100% { transform: translate3d(-40%, 35%, 0) scale(1.7); opacity: 1; }
}
@keyframes flow-glow-b {
  0%   { transform: translate3d(0, 0, 0) scale(1);    opacity: 0.7; }
  100% { transform: translate3d(45%, -35%, 0) scale(1.6); opacity: 1; }
}

/* —— 背景光整体流动（多色光斑碰撞） —— */
.flow-bg-flow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(40% 48% at 25% 40%, rgba(34, 211, 238, 0.65), transparent 65%),
    radial-gradient(36% 44% at 75% 60%, rgba(139, 92, 246, 0.60), transparent 65%),
    radial-gradient(28% 36% at 50% 28%, rgba(236, 72, 153, 0.45), transparent 65%),
    radial-gradient(30% 40% at 60% 75%, rgba(59, 130, 246, 0.50), transparent 65%);
  background-size: 240% 240%, 220% 220%, 200% 200%, 260% 260%;
  animation: flow-bg-flow 3.5s ease-in-out infinite alternate;
  will-change: background-position;
}
@keyframes flow-bg-flow {
  0%   { background-position: 0% 0%, 100% 100%, 50% 50%, 20% 80%; }
  50%  { background-position: 70% 30%, 20% 80%, 85% 15%, 90% 30%; }
  100% { background-position: 100% 100%, 0% 0%, 15% 85%, 40% 10%; }
}

/* —— compact 场景轻量光效 —— */
.theme-flow-bg.compact .flow-glow {
  filter: blur(24px);
}
.theme-flow-bg.compact .flow-glow-a {
  width: 75%;
  top: -75%;
  right: -25%;
}
.theme-flow-bg.compact .flow-glow-b {
  display: none;
}
.theme-flow-bg.compact .flow-bg-flow {
  animation-duration: 18s;
}
</style>
