/**
 * 内容数据读取层（SSG 兼容）
 * 通过 import.meta.glob 在构建期自动发现 content/ 下所有 JSON 文件。
 * 运营在 Sveltia CMS 中新增/编辑商品后，重新构建即可生效。
 */
import type { SiteConfig, Category, Product } from '../types/content'

// --- 站点配置 ---
// 注意：import.meta.glob 不支持 ~/ 别名，必须用相对路径
const siteModule = import.meta.glob('../../content/site.json', { eager: true })
const siteRaw = Object.values(siteModule)[0] as { default?: SiteConfig } | SiteConfig | undefined
export const siteConfig: SiteConfig = (siteRaw && 'default' in siteRaw ? siteRaw.default : siteRaw)!

// --- 分类 ---
const categoryModules = import.meta.glob('../../content/categories/*.json', { eager: true })
const categories: Category[] = Object.entries(categoryModules)
  .map(([path, m]) => {
    const cat = ((m as { default?: Category }).default ?? m) as Category
    // slug 以文件名为权威来源
    const fileName = path.split('/').pop()?.replace(/\.json$/, '') ?? cat.slug
    return { ...cat, slug: fileName }
  })
  .sort((a, b) => a.name.localeCompare(b.name))

export function useCategories(): Category[] {
  return categories
}

export function useCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

// --- 商品 ---
const productModules = import.meta.glob('../../content/products/*.json', { eager: true })

/** Sveltia CMS list 字段存为对象数组，归一化为字符串数组供前端使用 */
function normalizeList(arr: unknown[], key: string): string[] {
  if (!Array.isArray(arr)) return []
  return arr.map((item) => (typeof item === 'string' ? item : (item as Record<string, string>)[key]))
}

const allProducts: Product[] = Object.entries(productModules)
  .map(([path, m]) => {
    const product = ((m as { default?: Product }).default ?? m) as Product
    // slug 以文件名（Git 路径）为权威来源，确保与 URL 路由一致
    // 运营在 CMS 中误改 slug 字段不会导致 404
    const fileName = path.split('/').pop()?.replace(/\.json$/, '') ?? product.slug
    return {
      ...product,
      slug: fileName,
      images: normalizeList(product.images as unknown[], 'image'),
      brands: normalizeList(product.brands as unknown[], 'brand'),
      tags: normalizeList(product.tags as unknown[], 'tag'),
    }
  })
  .sort((a, b) => a.name.localeCompare(b.name))

export function useProducts(): Product[] {
  return allProducts.filter((p) => p.published)
}

export function useProduct(slug: string): Product | undefined {
  return allProducts.find((p) => p.slug === slug)
}

export function useFeaturedProducts(limit = 8): Product[] {
  return useProducts().filter((p) => p.featured).slice(0, limit)
}

export function useProductsByCategory(categorySlug: string): Product[] {
  return useProducts().filter((p) => p.category === categorySlug)
}

/** 品牌分类维度（商品 brands 字段） */
export function useBrands(): string[] {
  const set = new Set<string>()
  useProducts().forEach((p) => p.brands?.forEach((b) => set.add(b)))
  return [...set].sort()
}
