<template>
  <div class="relative w-full bg-slate-100 aspect-[1920/780]">
    <Swiper
      :modules="modules"
      :slides-per-view="1"
      :loop="true"
      :autoplay="{ delay: 5000, disableOnInteraction: false }"
      :pagination="{ clickable: true }"
      @swiper="onSwiper"
      class="hero-swiper h-full"
    >
      <SwiperSlide v-for="(slide, i) in slides" :key="i">
        <img :src="slide" :alt="`Banner ${i + 1}`" class="w-full h-full object-cover">
      </SwiperSlide>
    </Swiper>

    <!-- 自定义小箭头 -->
    <button
      type="button"
      class="hero-nav hero-nav-prev"
      aria-label="Previous slide"
      @click="swiper?.slidePrev()"
    >
      <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
    </button>
    <button
      type="button"
      class="hero-nav hero-nav-next"
      aria-label="Next slide"
      @click="swiper?.slideNext()"
    >
      <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6" /></svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

defineProps<{
  slides: string[]
}>()

const modules = [Autoplay, Pagination]
const swiper = ref<any>(null)
const onSwiper = (s: any) => { swiper.value = s }
</script>

<style>
.hero-swiper .swiper-pagination-bullet {
  width: 8px;
  height: 8px;
  background: #fff;
  opacity: 0.4;
}
.hero-swiper .swiper-pagination-bullet-active {
  opacity: 1;
}

.hero-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: rgba(255,255,255,0.25);
  border-radius: 50%;
  transition: background 0.2s;
}
.hero-nav:hover {
  background: rgba(255,255,255,0.45);
}
.hero-nav-prev {
  left: 24px;
}
.hero-nav-next {
  right: 24px;
}
@media (max-width: 767px) {
  .hero-nav {
    display: none;
  }
}
</style>
