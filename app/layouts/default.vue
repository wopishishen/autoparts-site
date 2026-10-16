<template>
  <div class="min-h-screen flex flex-col bg-white text-slate-800">
    <SiteHeader />
    <main class="flex-1 pt-[92px]">
      <slot />
    </main>
    <SiteFooter />
    <FloatingContact />
  </div>
</template>
