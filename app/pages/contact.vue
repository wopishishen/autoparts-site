<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const route = useRoute()
const site = siteConfig

// 从商品页跳转过来时预填商品
const prefillProduct = ref(typeof route.query.product === 'string' ? route.query.product : '')

const form = ref({
  email: '',
  phone: '',
  country: '',
  product: prefillProduct.value,
  message: '',
  website: '', // honeypot 反垃圾（隐藏字段，机器人会填）
})

const submitted = ref(false)
const submitting = ref(false)
const submitError = ref('')
const formLoadedAt = ref(0)
const { fingerprint } = useFingerprint()

onMounted(() => {
  formLoadedAt.value = Date.now()
})

useSeoMeta({
  title: 'Contact Us',
  description: 'Contact our sales team for quotes, wholesale prices and customized parts solutions. We reply within 24 hours.',
})

const { telLink, defaultEmailLink, defaultWhatsappLink } = useContactLinks()

async function onSubmit() {
  if (submitting.value) return
  submitting.value = true
  submitError.value = ''

  try {
    const resp = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form.value,
        formLoadedAt: formLoadedAt.value,
        fingerprint: fingerprint.value,
      }),
    })
    const data = await resp.json().catch(() => ({}))
    if (!resp.ok || !data.ok) {
      throw new Error(data.error || 'Submission failed')
    }
    submitted.value = true
  } catch {
    submitError.value = 'Failed to send your inquiry. Please try again later or email us directly.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>
    <!-- 子页面纯图 Banner -->
    <SubBanner image="/images/banners/d_images_sub_banner_contact.jpg" />

    <!-- 面包屑 -->
    <Breadcrumb
      :items="[
        { label: 'Home', to: '/' },
        { label: 'Contact Us' },
      ]"
    />

    <div class="max-w-7xl mx-auto px-4 pt-8 pb-10">
      <PageTitle
        title="Contact Us"
        subtitle="Get a quote or ask about our parts — our team usually replies within 24 hours."
      />
    <Reveal>
    <div class="grid gap-8 lg:grid-cols-[1fr_320px] mt-2">
      <!-- 表单 -->
      <div v-if="!submitted" class="bg-white border border-slate-200 rounded-lg p-6">
        <form id="inquiry-form" @submit.prevent="onSubmit">
          <!-- honeypot：隐藏字段，机器人会自动填 -->
          <input v-model="form.website" type="text" name="_gotcha" class="hidden" tabindex="-1" autocomplete="off">

          <div class="grid gap-4 sm:grid-cols-3">
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
              <label for="country" class="block text-sm font-medium text-slate-700 mb-1">Country *</label>
              <input
                id="country" v-model="form.country" name="country" type="text" required
                class="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-800"
              >
            </div>
          </div>
          <!-- 商品预填（隐藏，从商品页 Quote Now 跳转时自动带上） -->
          <input v-model="form.product" name="product" type="hidden">
          <div class="mt-4">
            <label for="message" class="block text-sm font-medium text-slate-700 mb-1">Your Message *</label>
            <textarea
              id="message" v-model="form.message" name="message" rows="6" required
              placeholder="Product name / model / quantity ..."
              class="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-800"
            ></textarea>
          </div>
          <div v-if="submitError" class="mt-3 text-sm text-red-600">{{ submitError }}</div>
          <div class="mt-5">
            <button
              type="submit"
              :disabled="submitting"
              class="bg-sky-800 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded transition-colors"
            >
              {{ submitting ? 'Sending...' : 'Send Inquiry' }}
            </button>
          </div>
        </form>
      </div>
      <div v-else class="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
        <div class="text-lg font-semibold text-slate-900 mb-2">Thank you!</div>
        <p class="text-slate-600">Your inquiry has been submitted. We will reply to you within 24 hours.</p>
      </div>

      <!-- 联系方式 -->
      <aside class="theme-flow-bg relative overflow-hidden text-white rounded-lg p-6 h-fit">
        <FlowBackground />
        <div class="relative z-10">
          <h2 class="font-semibold text-lg mb-4">Contact Information</h2>
          <ul class="space-y-3 text-sm">
          <li class="flex items-start gap-2.5">
            <svg class="w-4 h-4 mt-0.5 text-sky-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            <div>
              <span class="block text-sky-300 text-xs mb-0.5">Tel</span>
              <a :href="telLink" class="hover:underline">{{ site.contact.tel }}</a>
            </div>
          </li>
          <li class="flex items-start gap-2.5">
            <svg class="w-4 h-4 mt-0.5 text-sky-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            <div>
              <span class="block text-sky-300 text-xs mb-0.5">E-mail</span>
              <a :href="defaultEmailLink" class="hover:underline break-all">{{ site.contact.email }}</a>
            </div>
          </li>
          <li class="flex items-start gap-2.5">
            <svg class="w-4 h-4 mt-0.5 text-[#25D366] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            <div>
              <span class="block text-sky-300 text-xs mb-0.5">WhatsApp</span>
              <a :href="defaultWhatsappLink" target="_blank" rel="noopener" class="hover:underline font-medium">{{ site.contact.whatsapp }}</a>
            </div>
          </li>
          <li class="flex items-start gap-2.5">
            <svg class="w-4 h-4 mt-0.5 text-sky-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <div>
              <span class="block text-sky-300 text-xs mb-0.5">Address</span>
              {{ site.contact.address }}
            </div>
          </li>
        </ul>
        </div>
      </aside>
    </div>
    </Reveal>
  </div>
</div>
</template>
