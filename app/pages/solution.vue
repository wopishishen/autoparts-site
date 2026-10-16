<script setup lang="ts">
useSeoMeta({
  title: 'Solutions',
  description: 'Full-stack service for global buyers: sales service, technical support, storage logistics, and product customization.',
})

const solutions = [
  {
    title: 'Sales Service',
    text: 'We always believe that efficient and high-quality pre-sale, sale and after-sales service can create greater value for customers.',
    image: '/images/solutions/d_images_ind_solu_01.jpg',
    features: [
      'Online promotion, international exhibitions and constantly updated social platforms to make it easier for customers to find us',
      'Geographical advantage of the central plains of China to optimize the integration of auto parts industry centers',
      'Continuous technical input to develop more competitive market products',
      'Multilingual salespersons skilled in foreign trade, providing professional and efficient service',
    ],
  },
  {
    title: 'Technical Support',
    text: 'Professional R&D and engineering teams provide cost-effective parts solutions and technical guidance.',
    image: '/images/solutions/d_images_ind_solu_02.jpg',
    features: [
      'Two R&D centers with a professional R&D team',
      'Engineers with more than 10 years of industry experience',
      'Cost-effective parts solutions for every customer',
    ],
  },
  {
    title: 'Storage Logistics',
    text: 'Better logistics solutions with a professional team to ensure smooth and timely delivery worldwide.',
    image: '/images/solutions/d_images_ind_solu_03.jpg',
    features: [
      'Cooperated with more than 50 logistics companies, covering express, air, sea and rail transportation',
      'Professional logistics team to ensure smooth customs declaration and clearance',
      '25,000+ sqm warehouse with sufficient stock',
    ],
  },
  {
    title: 'Product Customization',
    text: 'Meet your customized needs with new product development, KD service and OEM service.',
    image: '/images/solutions/d_images_ind_solu_04.jpg',
    features: [
      'New product development',
      'KD (Knock Down) service',
      'OEM service for brand parts',
      'Customized solutions according to customer needs',
    ],
  },
]
</script>

<template>
  <div>
    <!-- 子页面纯图 Banner -->
    <SubBanner image="/images/banners/d_images_sub_banner_solu.jpg" />

    <!-- 面包屑 -->
    <Breadcrumb :items="[{ label: 'Home', to: '/' }, { label: 'Solutions' }]" />

    <!-- 页面主标题 -->
    <div class="max-w-7xl mx-auto px-4 pt-8">
      <PageTitle
        title="Our Solutions"
        subtitle="Full-stack service for global buyers: sales service, technical support, storage logistics, and product customization."
      />
    </div>

    <!-- 解决方案详情 —— 交替左右布局 -->
    <section class="pt-2 pb-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 space-y-16">
        <Reveal v-for="(sol, i) in solutions" :key="sol.title" :delay="(i % 2) * 120">
          <div
            class="grid gap-8 lg:grid-cols-2 items-center"
            :class="i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''"
          >
          <div class="aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden">
            <img :src="sol.image" :alt="sol.title" class="w-full h-full object-cover">
          </div>
          <div>
            <p class="text-sky-800 text-xs font-semibold tracking-widest uppercase mb-2">0{{ i + 1 }}</p>
            <h2 class="text-2xl font-bold text-slate-900 mb-4">{{ sol.title }}</h2>
            <p class="text-slate-600 leading-relaxed text-sm mb-5">{{ sol.text }}</p>
            <ul class="space-y-2">
              <li v-for="f in sol.features" :key="f" class="flex items-start gap-2 text-sm text-slate-700">
                <svg class="w-4 h-4 text-sky-800 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                {{ f }}
              </li>
            </ul>
          </div>
        </div>
        </Reveal>
      </div>
    </section>

    <!-- 服务流程 -->
    <section class="py-14 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4">
        <SectionHeader eyebrow="Process" title="How We Work" align="center" />
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-10">
          <Reveal :delay="0">
            <div class="text-center">
              <div class="w-12 h-12 bg-sky-800 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">1</div>
              <h3 class="font-semibold text-slate-800 text-sm">Inquiry</h3>
              <p class="text-xs text-slate-500 mt-1.5">Send us your parts list or VIN number</p>
            </div>
          </Reveal>
          <Reveal :delay="100">
            <div class="text-center">
              <div class="w-12 h-12 bg-sky-800 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">2</div>
              <h3 class="font-semibold text-slate-800 text-sm">Quotation</h3>
              <p class="text-xs text-slate-500 mt-1.5">Receive competitive quote within 24 hours</p>
            </div>
          </Reveal>
          <Reveal :delay="200">
            <div class="text-center">
              <div class="w-12 h-12 bg-sky-800 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">3</div>
              <h3 class="font-semibold text-slate-800 text-sm">Production</h3>
              <p class="text-xs text-slate-500 mt-1.5">Quality-controlled production and packing</p>
            </div>
          </Reveal>
          <Reveal :delay="300">
            <div class="text-center">
              <div class="w-12 h-12 bg-sky-800 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">4</div>
              <h3 class="font-semibold text-slate-800 text-sm">Delivery</h3>
              <p class="text-xs text-slate-500 mt-1.5">Global shipping with tracking and support</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <CTABanner
      title="Need a Custom Solution?"
      subtitle="Tell us your requirements and we will tailor a solution for you."
      button-text="Get in Touch"
      button-to="/contact"
    />
  </div>
</template>
