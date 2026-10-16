// 轻量浏览器指纹：Canvas 指纹 + 设备信息，localStorage 持久化
// 用于无登录站点识别同一用户的多次提交

const STORAGE_KEY = 'ap_fp'

function fnv1a(str: string): string {
  let hash = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(16).padStart(8, '0')
}

function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''
    canvas.width = 220
    canvas.height = 40
    ctx.textBaseline = 'top'
    ctx.font = "14px 'Arial'"
    ctx.fillStyle = '#f60'
    ctx.fillRect(0, 0, 220, 40)
    ctx.fillStyle = '#069'
    ctx.fillText('Autoparts-FP, 🧩', 4, 4)
    ctx.strokeStyle = 'rgba(100,200,0,0.7)'
    ctx.strokeRect(8, 8, 60, 24)
    return canvas.toDataURL()
  } catch {
    return ''
  }
}

function collectSignals(): string {
  const nav = navigator
  const scr = screen
  return [
    nav.userAgent,
    nav.language,
    nav.platform,
    `${scr.width}x${scr.height}x${scr.colorDepth}`,
    `dpr=${window.devicePixelRatio}`,
    `tz=${new Date().getTimezoneOffset()}`,
    `mem=${(nav as any).deviceMemory || '?'}`,
    `cpu=${(nav as any).hardwareConcurrency || '?'}`,
    `touch=${(nav as any).maxTouchPoints || 0}`,
    getCanvasFingerprint(),
  ].join('|')
}

export function useFingerprint() {
  const fingerprint = ref('')

  onMounted(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY)
      if (cached) {
        fingerprint.value = cached
        return
      }
      const fp = fnv1a(collectSignals())
      localStorage.setItem(STORAGE_KEY, fp)
      fingerprint.value = fp
    } catch {
      fingerprint.value = 'unavailable'
    }
  })

  return { fingerprint }
}
