/**
 * 内容数据读取层（SSG 兼容）
 * 通过 import.meta.glob 在构建期自动发现 content/ 下所有 JSON 文件。
 * 运营在 Decap CMS 中新增/编辑商品后，重新构建即可生效。
 */
import type { SiteConfig, Category, Product } from '../types/content'

// --- 站点配置 ---
// 注意：import.meta.glob 不支持 ~/ 别名，必须用相对路径
const siteModule = import.meta.glob('../../content/site.json', { eager: true })
const siteRaw = Object.values(siteModule)[0] as { default?: SiteConfig } | SiteConfig | undefined
export const siteConfig: SiteConfig = (siteRaw && 'default' in siteRaw ? siteRaw.default : siteRaw)!

// --- 分类 ---
const categoryModules = import.meta.glob('../../content/categories/*.json', { eager: true })
const categories: Category[] = Object.values(categoryModules)
  .map((m) => ((m as { default?: Category }).default ?? m) as Category)
  .sort((a, b) => a.name.localeCompare(b.name))

export function useCategories(): Category[] {
  return categories
}

export function useCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

// --- 商品 ---
const productModules = import.meta.glob('../../content/products/*.json', { eager: true })
const allProducts: Product[] = Object.values(productModules)
  .map((m) => ((m as { default?: Product }).default ?? m) as Product)
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
