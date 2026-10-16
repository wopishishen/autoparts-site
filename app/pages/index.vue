<script setup lang="ts">
import { ref } from 'vue'

const site = siteConfig
const categories = useCategories()
const featuredProducts = useFeaturedProducts(8)
const featuredPosts = useFeaturedNewsPosts(3)

const categoryNames: Record<string, string> = {
  'industry-news': 'Industry News',
  'company-news': 'Company News',
}

// 产品分类 tab 切换
const activeCategory = ref(categories[0]?.slug || '')
// 横向滚动 Tab：选中项滚动到可视区域居中（通用能力）
const { setRef: setCatTabRef } = useTabScrollCenter(activeCategory)

// Hero Banner 轮播图
const heroSlides = [
  '/images/hero/d_files_banner1920x780_2.png',
  '/images/hero/d_files_banner2.jpg',
  '/images/hero/d_images_banner4.jpg',
]

useSeoMeta({
  title: site.tagline,
  description: site.seo.defaultDescription,
  ogType: 'website',
  ogTitle: site.seo.defaultTitle,
  ogDescription: site.seo.defaultDescription,
})

// 参考站解决方案文案
const solutions = [
  {
    title: 'Sales Service',
    text: 'Online promotion, international exhibitions, and active social media presence make it easier for customers to find us worldwide.',
    image: '/images/solutions/d_images_ind_solu_01.jpg',
  },
  {
    title: 'Technical Support',
    text: 'Two R&D centers with engineers having 10+ years of industry experience, providing cost-effective parts solutions.',
    image: '/images/solutions/d_images_ind_solu_02.jpg',
  },
  {
    title: 'Storage Logistics',
    text: 'Cooperated with 50+ logistics companies covering express, air, sea and rail; professional customs declaration and clearance.',
    image: '/images/solutions/d_images_ind_solu_03.jpg',
  },
  {
    title: 'Product Customization',
    text: 'New product development, KD service and OEM service to meet your customized requirements.',
    image: '/images/solutions/d_images_ind_solu_04.jpg',
  },
]

const stats = [
  { value: '90+', label: 'Exporting Countries' },
  { value: '56', label: 'Technicians' },
  { value: '2', label: 'R&D Centers' },
  { value: '1100+', label: 'Satisfied Clients' },
  { value: '50+', label: 'Overseas Sales Networks' },
]
</script>

<template>
  <div>
    <!-- 首页主标题（hero 为纯图，视觉隐藏以保 SEO 语义） -->
    <h1 class="sr-only">{{ site.tagline }}</h1>

    <!-- Hero Banner —— Swiper 轮播，支持手势拖拽 -->
    <ClientOnly>
      <HeroSwiper :slides="heroSlides" />
      <template #fallback>
        <div class="w-full bg-slate-100 aspect-[1920/780]">
          <img :src="heroSlides[0]" alt="Commercial Vehicle Spare Parts" class="w-full h-full object-cover">
        </div>
      </template>
    </ClientOnly>

    <!-- 产品分类 —— 左侧导航 + 右侧大图切换 -->
    <Reveal>
    <section class="py-14 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <SectionHeader
          align="center"
          eyebrow="Hot Products"
          title="Product Categories"
          subtitle="Our products cover the whole complete vehicle, including Engine Parts, Gearbox Parts, Chassis Parts, Body Parts, Brake Parts and Electric Parts."
        />
        <div class="flex flex-col md:flex-row gap-0">
          <!-- 分类导航：mobile 横向滚动 pill，桌面恢复纵向导航 -->
          <div class="md:w-56 flex-shrink-0 min-w-0 md:border md:border-slate-200">
            <!-- mobile：纯文字 Tab，选中项紧贴文字的下划线（无边框/无背景/无滚动条）；桌面：恢复纵向导航 -->
            <div class="flex gap-6 sm:gap-8 overflow-x-auto no-scrollbar md:flex-col md:gap-0 md:overflow-visible">
              <button
                v-for="cat in categories"
                :key="cat.slug"
                :ref="setCatTabRef(cat.slug)"
                type="button"
                class="flex-shrink-0 whitespace-nowrap py-2 text-sm font-medium transition-colors md:w-full md:px-5 md:py-3.5 md:text-left md:hover:bg-slate-50"
                :class="activeCategory === cat.slug ? 'md:bg-sky-800' : ''"
                @click="activeCategory = cat.slug"
              >
                <span
                  class="inline-block pb-1 border-b-2"
                  :class="activeCategory === cat.slug
                    ? 'border-sky-800 text-sky-800 md:border-transparent md:text-white'
                    : 'border-transparent text-slate-600 hover:text-slate-800 md:text-slate-700'"
                >
                  {{ cat.name }}
                </span>
              </button>
            </div>
          </div>
          <!-- 右侧大图 —— 保持原始 1.64:1 比例，整张图可点击 -->
          <div class="flex-1 bg-slate-100">
            <template v-for="cat in categories" :key="cat.slug">
              <NuxtLink
                v-if="activeCategory === cat.slug"
                :to="`/products?category=${cat.slug}`"
                class="group relative block aspect-[1040/634] overflow-hidden"
              >
                <img v-if="cat.image" :src="cat.image" :alt="cat.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </section>
    </Reveal>

    <!-- 热门产品 —— 1.34:1 比例，无卡片边框 -->
    <Reveal>
    <section class="py-14 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4">
        <SectionHeader eyebrow="Hot Products" title="Best-Selling Parts">
          <template #action>
            <NuxtLink to="/products" class="text-sky-800 font-semibold text-sm hover:underline">View Products →</NuxtLink>
          </template>
        </SectionHeader>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ProductCard v-for="p in featuredProducts" :key="p.slug" :product="p" />
        </div>
      </div>
    </section>
    </Reveal>

    <!-- 公司简介 —— 左文右图，无卡片 -->
    <Reveal>
    <section id="about" class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <SectionHeader
              eyebrow="About Us"
              title="Professional Commercial Vehicle Spare Parts Supplier"
            />
            <p class="text-slate-600 leading-relaxed mb-4 text-sm">
              {{ site.companyName }} is a professional commercial vehicle spare parts supplier. We are mainly specialized in exportation of spare parts for Chinese bus and truck, including Higer, Zhongtong, Kinglong, Golden Dragon, Ankai, Faw, Sinotruk and Shacman.
            </p>
            <p class="text-slate-500 leading-relaxed text-sm mb-6">
              With geographical advantage of the central plains of China, we can optimize the integration of many auto parts industry centers around, providing quality parts at competitive prices to customers worldwide.
            </p>
            <NuxtLink to="/about" class="inline-block text-sky-800 font-semibold text-sm hover:underline">Learn More →</NuxtLink>
          </div>
          <div class="aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden">
            <img src="/images/about/d_files_0_1.jpg" alt="Company" class="w-full h-full object-cover">
          </div>
        </div>
        <!-- 数据统计 —— 横向排列，无卡片 -->
        <div class="mt-14 pt-10 border-t border-slate-200">
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
            <div v-for="stat in stats" :key="stat.label">
              <div class="text-3xl md:text-4xl font-bold text-sky-800"><CountUp :text="stat.value" /></div>
              <div class="text-xs text-slate-500 mt-2">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </Reveal>

    <!-- 解决方案 —— 4列全屏大图分栏，文字叠加 -->
    <Reveal>
    <section id="solution" class="py-14 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <SectionHeader
          align="center"
          eyebrow="Our Solution"
          title="SOLUTION"
          subtitle="Serving global public travel is our unremitting pursuit. We always believe that efficient and high-quality pre-sale, sale, after-sales service can create greater value for customers."
        />
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-4">
        <NuxtLink
          v-for="sol in solutions"
          :key="sol.title"
          to="/solution"
          class="group relative aspect-[3/4] lg:aspect-[4/5] overflow-hidden"
        >
          <img :src="sol.image" :alt="sol.title" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <div class="absolute inset-0 bg-slate-900/50 group-hover:bg-slate-900/40 transition-colors"></div>
          <!-- 文字左右安全距离：移动端加大内边距，桌面保持 -->
          <div class="absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-5">
            <h3 class="font-bold text-white text-lg mb-2">{{ sol.title }}</h3>
            <p class="text-xs text-slate-200 leading-relaxed line-clamp-3">{{ sol.text }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>
    </Reveal>

    <!-- 新闻文章 —— 左图右文列表，3:2 比例 -->
    <Reveal>
    <section class="py-14 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <SectionHeader eyebrow="Insights" title="Latest Industry News">
          <template #action>
            <NuxtLink to="/news" class="text-sky-800 font-semibold text-sm hover:underline">View News →</NuxtLink>
          </template>
        </SectionHeader>
        <div class="space-y-5">
          <NuxtLink
            v-for="post in featuredPosts"
            :key="post.slug"
            :to="`/news/${post.slug}`"
            class="group flex gap-5 py-3 md:py-4 bg-slate-50 rounded overflow-hidden hover:bg-slate-100 transition-colors"
          >
            <div class="w-32 sm:w-48 h-24 sm:h-32 flex-shrink-0 bg-slate-200 rounded overflow-hidden">
              <img
                v-if="post.coverImage"
                :src="post.coverImage"
                :alt="post.title"
                loading="lazy"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              >
            </div>
            <div class="flex-1 min-w-0 pr-3 md:pr-5">
              <div class="flex items-center gap-3 text-xs text-slate-500 mb-1.5">
                <span class="bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-medium">{{ categoryNames[post.category] || post.category }}</span>
                <span>{{ new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }}</span>
              </div>
              <h3 class="font-bold text-slate-800 group-hover:text-sky-800 transition-colors text-base">{{ post.title }}</h3>
              <p class="text-xs text-slate-500 mt-1.5 line-clamp-2">{{ post.summary }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
    </Reveal>

    <!-- CTA -->
    <CTABanner />
  </div>
</template>
