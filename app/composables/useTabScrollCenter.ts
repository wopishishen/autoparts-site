import { nextTick, watch, type Ref } from 'vue'

/**
 * 横向滚动 Tab 通用能力：选中项变化时，平滑滚动到可视区域水平居中。
 *
 * 用法：
 *   const activeKey = ref('all')
 *   const { setRef } = useTabScrollCenter(activeKey)
 *   <!-- 模板中给每个 tab 绑定 ref -->
 *   <button :ref="setRef('all')">All</button>
 *   <button :ref="setRef(item.key)">{{ item.label }}</button>
 *
 * 适配任意横向滚动容器（overflow-x-auto）；桌面端纵向布局时
 * scrollIntoView 的 block: 'nearest' 不会引起垂直跳动。
 */
export function useTabScrollCenter(activeKey: Ref<string>) {
  const elMap = new Map<string, HTMLElement>()

  const setRef = (key: string) => (el: unknown) => {
    if (!el) return
    // NuxtLink 等组件拿到的是组件实例，取其根 DOM（$el）；原生元素直接用
    const node = (el as { $el?: unknown }).$el ?? el
    if (node instanceof HTMLElement) elMap.set(key, node)
  }

  watch(
    activeKey,
    () => {
      nextTick(() => {
        const el = elMap.get(activeKey.value)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
        }
      })
    },
    { flush: 'post' }
  )

  return { setRef }
}
