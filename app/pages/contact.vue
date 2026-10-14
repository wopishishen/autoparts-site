<script setup lang="ts">
import { ref, computed } from 'vue'

const route = useRoute()
const site = siteConfig

// 从商品页跳转过来时预填商品
const prefillProduct = ref(typeof route.query.product === 'string' ? route.query.product : '')

const form = ref({
  name: '',
  email: '',
  phone: '',
  whatsapp: '',
  country: '',
  product: prefillProduct.value,
  message: '',
  website: '', // honeypot 反垃圾
})

const submitted = ref(false)

useSeoMeta({
  title: 'Contact Us - Auto Parts Supplier',
  description: 'Contact our sales team for quotes, wholesale prices and customized parts solutions. We reply within 24 hours.',
})

// TODO: 部署前替换为真实 Formspree 表单 ID（https://formspree.io 免费注册）
const formAction = 'https://formspree.io/f/YOUR_FORM_ID'

const whatsappLink = computed(() => `https://wa.me/${site.contact.whatsapp.replace(/[^0-9]/g, '')}`)

async function onSubmit() {
  if (form.value.website) return // honeypot 命中，静默丢弃
  // 原生提交到 Formspree（POST 后浏览器跳转感谢页）
  submitted.value = true
  await nextTick()
  const el = document.querySelector<HTMLFormElement>('#inquiry-form')
  el?.submit()
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- 面包屑 -->
    <nav class="text-sm text-slate-500 mb-6">
      <NuxtLink to="/" class="hover:text-sky-800">Home</NuxtLink>
      <span class="mx-2">›</span>
      <span class="text-slate-800">Contact Us</span>
    </nav>

    <h1 class="text-2xl font-bold text-slate-900 mb-2">Contact Us</h1>
    <p class="text-slate-600 mb-8">Leave your inquiry and our sales team will get back to you within 24 hours.</p>

    <div class="grid gap-8 lg:grid-cols-[1fr_320px]">
      <!-- 表单 -->
      <div v-if="!submitted" class="bg-white border border-slate-200 rounded-lg p-6">
        <form id="inquiry-form" :action="formAction" method="POST" @submit.prevent="onSubmit">
          <!-- honeypot -->
          <input v-model="form.website" type="text" name="_gotcha" class="hidden" tabindex="-1" autocomplete="off">

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label for="name" class="block text-sm font-medium text-slate-700 mb-1">Your Name *</label>
              <input
                id="name" v-model="form.name" name="name" type="text" required
                class="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-800"
              >
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-slate-700 mb-1">E-mail *</label>
              <input
                id="email" v-model="form.email" name="email" type="email" required
                class="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-800"
              >
            </div>
            <div>
              <label for="phone" class="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input
                id="phone" v-model="form.phone" name="phone" type="tel"
                class="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-800"
              >
            </div>
            <div>
              <label for="whatsapp" class="block text-sm font-medium text-slate-700 mb-1">WhatsApp</label>
              <input
                id="whatsapp" v-model="form.whatsapp" name="whatsapp" type="text"
                class="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-800"
              >
            </div>
            <div>
              <label for="country" class="block text-sm font-medium text-slate-700 mb-1">Country</label>
              <input
                id="country" v-model="form.country" name="country" type="text"
                class="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-800"
              >
            </div>
            <div>
              <label for="product" class="block text-sm font-medium text-slate-700 mb-1">Product of Interest</label>
              <input
                id="product" v-model="form.product" name="product" type="text"
                class="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-800"
              >
            </div>
          </div>
          <div class="mt-4">
            <label for="message" class="block text-sm font-medium text-slate-700 mb-1">Message *</label>
            <textarea
              id="message" v-model="form.message" name="message" rows="5" required
              class="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-800"
            ></textarea>
          </div>
          <button
            type="submit"
            class="mt-5 bg-sky-800 hover:bg-sky-700 text-white font-semibold px-6 py-3 rounded transition-colors"
          >
            Send Inquiry
          </button>
        </form>
      </div>
      <div v-else class="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
        <div class="text-lg font-semibold text-slate-900 mb-2">Thank you!</div>
        <p class="text-slate-600">Your inquiry has been submitted. We will reply to you within 24 hours.</p>
      </div>

      <!-- 联系方式 -->
      <aside class="bg-sky-900 text-white rounded-lg p-6 h-fit">
        <h2 class="font-semibold text-lg mb-4">Contact Information</h2>
        <ul class="space-y-3 text-sm">
          <li>
            <span class="block text-sky-300 text-xs mb-0.5">Tel</span>
            <a :href="`tel:${site.contact.tel.replace(/\s/g, '')}`" class="hover:underline">{{ site.contact.tel }}</a>
          </li>
          <li>
            <span class="block text-sky-300 text-xs mb-0.5">E-mail</span>
            <a :href="`mailto:${site.contact.email}`" class="hover:underline break-all">{{ site.contact.email }}</a>
          </li>
          <li>
            <span class="block text-sky-300 text-xs mb-0.5">WhatsApp</span>
            <a :href="whatsappLink" target="_blank" rel="noopener" class="hover:underline">{{ site.contact.whatsapp }}</a>
          </li>
          <li>
            <span class="block text-sky-300 text-xs mb-0.5">WeChat</span>{{ site.contact.wechat }}
          </li>
          <li>
            <span class="block text-sky-300 text-xs mb-0.5">Skype</span>{{ site.contact.skype }}
          </li>
          <li>
            <span class="block text-sky-300 text-xs mb-0.5">Address</span>{{ site.contact.address }}
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>
