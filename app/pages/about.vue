<script setup lang="ts">
const site = siteConfig

useSeoMeta({
  title: 'About Us',
  description: 'Learn about our company profile, R&D capabilities, certificates and partners. Professional commercial vehicle spare parts supplier.',
})

const stats = [
  { value: '90+', label: 'Exporting Countries' },
  { value: '56', label: 'Technicians' },
  { value: '2', label: 'R&D Centers' },
  { value: '1100+', label: 'Satisfied Clients' },
  { value: '50+', label: 'Overseas Sales Networks' },
]

const milestones = [
  { year: '2010', title: 'Company Founded', text: 'Founded in Zhengzhou, China as a professional commercial vehicle spare parts supplier.' },
  { year: '2013', title: 'First Overseas Network', text: 'Launched our first overseas sales networks, expanding into the Middle East, Africa and Southeast Asia markets.' },
  { year: '2016', title: 'R&D & Quality Center', text: 'Established dedicated R&D centers and built a professional technical team to support OEM and ODM development.' },
  { year: '2020', title: 'Service Milestone', text: 'Serving 1100+ customers from over 90 countries every year, with 50+ overseas sales networks worldwide.' },
  { year: '2024', title: 'Full-Line Coverage', text: 'Developed into a full-line supplier covering engine, gearbox, chassis, body and electrical parts for Chinese bus and truck brands.' },
]

const factory = [
  { label: 'Exhibition', image: '/images/about/d_files_about_exhibition.png' },
  { label: 'Office Area', image: '/images/about/d_images_about_office.jpg' },
  { label: 'Warehouse', image: '/images/about/d_files_about_warehouse.jpg' },
  { label: 'Delivery', image: '/images/about/d_images_about_delivery.jpg' },
]

const partnerLogos = Array.from({ length: 25 }, (_, i) => ({
  name: `Partner ${i + 1}`,
  image: `/images/about/d_images_partner_${String(i + 1).padStart(2, '0')}.${i === 3 ? 'png' : 'jpg'}`,
}))

const certificates = [
  '/images/about/d_images_zhenshu-1.jpg',
  '/images/about/d_images_zhenshu-2.jpg',
  '/images/about/d_images_zhenshu-3.jpg',
  '/images/about/d_images_zhenshu-4.jpg',
]
</script>

<template>
  <div>
    <!-- 子页面纯图 Banner -->
    <SubBanner image="/images/banners/d_images_sub_banner_about.jpg" />

    <!-- 面包屑 -->
    <Breadcrumb :items="[{ label: 'Home', to: '/' }, { label: 'About Us' }]" />

    <!-- 公司简介 -->
    <Reveal>
    <section class="pt-10 pb-16 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <p class="text-sky-800 text-xs font-semibold tracking-widest uppercase mb-3">Company Profile</p>
            <h1 class="text-2xl md:text-3xl font-bold text-slate-900 mb-5 leading-tight">
              Your Reliable Partner for Commercial Vehicle Spare Parts
            </h1>
            <p class="text-slate-600 leading-relaxed mb-4 text-sm">
              {{ site.companyName }}, founded in May 2010, is a professional commercial vehicle spare parts supplier, located in Zhengzhou, China. We are committed to the wholesale export of auto parts, OEM products and ODM products for commercial vehicles, including Chinese bus and truck brands: Higer, Zhongtong, Golden Dragon, Kinglong, Asiastar, Sunlong, Ankai, Foton, Sinotruk, Shacman, DongFeng and JAC.
            </p>
            <p class="text-slate-500 leading-relaxed mb-4 text-sm">
              Our products cover all the parts of the vehicle, including Engine Parts, Gearbox Parts, Chassis Parts, Body Parts, Air-conditioner Parts, Retarder Parts and Electric Parts. We satisfy different requirements with Original, OEM and Alternative parts at excellent quality and reasonable pricing levels. We can also develop customized products according to customers' needs to bring more value to our partners.
            </p>
            <p class="text-slate-500 leading-relaxed text-sm">
              With over 15 years of experience in the commercial vehicle industry, our team provides professional services to more than 1100 customers from over 90 countries every year, and we have established 50+ overseas sales networks for better and faster service.
            </p>
          </div>
          <div class="aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden">
            <img src="/images/about/d_images_about-01.png" alt="Company" class="w-full h-full object-cover">
          </div>
        </div>
      </div>
    </section>
    </Reveal>

    <!-- 数据统计 -->
    <section class="py-12 bg-slate-50 border-y border-slate-200">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
          <div v-for="s in stats" :key="s.label">
            <div class="text-3xl md:text-4xl font-bold text-sky-800"><CountUp :text="s.value" /></div>
            <div class="text-xs text-slate-500 mt-2">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 证书资质 -->
    <Reveal>
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <SectionHeader eyebrow="Quality Assurance" title="Certificates & Qualifications" align="center" />
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
          <div
            v-for="(cert, i) in certificates"
            :key="cert"
            class="bg-slate-50 border border-slate-200 rounded p-3 flex items-center justify-center"
          >
            <img :src="cert" :alt="`Certificate ${i + 1}`" class="max-h-40 object-contain">
          </div>
        </div>
      </div>
    </section>
    </Reveal>

    <!-- 发展历程 -->
    <Reveal>
    <section class="py-16 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4">
        <SectionHeader eyebrow="Our Journey" title="Development History" align="center" />
        <div class="relative mt-12">
          <div class="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 transform md:-translate-x-1/2"></div>
          <div class="space-y-8">
            <div
              v-for="(m, i) in milestones"
              :key="m.year"
              class="relative"
            >
              <div class="absolute left-4 md:left-1/2 top-2 w-3 h-3 bg-sky-800 rounded-full transform -translate-x-1/2 z-10 ring-4 ring-slate-50"></div>
              <div
                class="pl-12 md:pl-0"
                :class="i % 2 === 0 ? 'md:w-1/2 md:pr-6 md:mr-auto' : 'md:w-1/2 md:pl-6 md:ml-auto'"
              >
                <div
                  class="bg-white rounded p-5 border border-slate-200 max-w-md"
                  :class="i % 2 === 0 ? 'md:ml-auto' : ''"
                >
                  <div :class="i % 2 === 0 ? 'md:text-right' : ''">
                    <div class="text-sky-800 font-bold text-lg">{{ m.year }}</div>
                    <h3 class="font-semibold text-slate-800 mt-1">{{ m.title }}</h3>
                    <p class="text-xs text-slate-500 mt-1.5 leading-relaxed">{{ m.text }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </Reveal>

    <!-- 公司愿景 -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <SectionHeader eyebrow="Company Vision" title="Quality Parts, Trusted Partnership" align="center" />
        <div class="max-w-3xl mx-auto mt-8 text-center">
          <p class="text-slate-600 leading-relaxed text-sm">
            Our vision is to be the most trusted commercial vehicle spare parts partner for buyers worldwide. We achieve this through strict quality control, reliable supply chains and responsive service, helping our customers grow their businesses with confidence. Honesty, innovation and continuous improvement guide everything we do.
          </p>
        </div>
      </div>
    </section>

    <!-- 合作伙伴 -->
    <Reveal>
    <section class="py-14 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <SectionHeader eyebrow="Partners" title="Cooperative Partners" align="center" />
        <div class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-4 mt-10">
          <div
            v-for="p in partnerLogos"
            :key="p.image"
            class="flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
          >
            <img :src="p.image" :alt="p.name" loading="lazy" class="max-h-24 max-w-full object-contain mix-blend-multiply">
          </div>
        </div>
      </div>
    </section>
    </Reveal>

    <!-- 工厂展示 -->
    <Reveal>
    <section class="py-16 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4">
        <SectionHeader eyebrow="Factory Display" title="Our Facility & Team" align="center" />
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          <div
            v-for="f in factory"
            :key="f.label"
            class="group overflow-hidden rounded-lg border border-slate-200 bg-white"
          >
            <div class="aspect-[4/3] bg-slate-100 overflow-hidden">
              <img
                :src="f.image"
                :alt="f.label"
                loading="lazy"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              >
            </div>
            <div class="py-3 text-center text-sm font-semibold text-slate-700">{{ f.label }}</div>
          </div>
        </div>
      </div>
    </section>
    </Reveal>

    <!-- CTA -->
    <CTABanner
      title="Want to Work With Us?"
      subtitle="Contact our team to discuss your parts sourcing needs."
      button-text="Contact Us"
      button-to="/contact"
    />
  </div>
</template>
