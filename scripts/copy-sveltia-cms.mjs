// 将 Sveltia CMS 打包文件从 node_modules 复制到 public/admin/vendor/
// 这样 git 仓库不需要存储 CMS 文件，Cloudflare Pages 构建时自动复制
import { existsSync, cpSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const src = join(root, 'node_modules', '@sveltia', 'cms', 'dist')
const dst = join(root, 'public', 'admin', 'vendor', 'sveltia')
const fontsDst = join(root, 'public', 'admin', 'vendor', 'fonts')

if (!existsSync(src)) {
  console.warn('[copy-sveltia-cms] node_modules/@sveltia/cms/dist not found, skip')
  process.exit(0)
}

mkdirSync(dst, { recursive: true })
// 只复制运行时必需的 .js 文件，跳过 .map source map（占 82% 体积，生产环境不需要）
cpSync(src, dst, {
  recursive: true,
  filter: (srcPath) => !srcPath.endsWith('.map'),
})
console.log('[copy-sveltia-cms] copied Sveltia CMS dist (JS only, no sourcemaps) to public/admin/vendor/sveltia/')

// 本地化 Material Symbols 字体：jsdelivr CDN 在国内不稳定，替换为本地字体
const fontSrc = join(root, 'node_modules', '@fontsource', 'material-symbols-outlined', 'files', 'material-symbols-outlined-latin-400-normal.woff2')
const fontDst = join(fontsDst, 'material-symbols-outlined.woff2')
if (existsSync(fontSrc)) {
  mkdirSync(fontsDst, { recursive: true })
  copyFileSync(fontSrc, fontDst)
  console.log('[copy-sveltia-cms] copied Material Symbols font to public/admin/vendor/fonts/')
} else {
  console.warn('[copy-sveltia-cms] @fontsource/material-symbols-outlined not found, skip font copy')
}

// 替换 sveltia-cms.js 中的字体 CDN URL 为本地路径
const cmsJsPath = join(dst, 'sveltia-cms.js')
if (existsSync(cmsJsPath)) {
  let content = readFileSync(cmsJsPath, 'utf-8')
  const original = 'https://cdn.jsdelivr.net/fontsource/fonts/material-symbols-outlined:vf@5.3.9/latin-wght-normal.woff2'
  const replacement = '/admin/vendor/fonts/material-symbols-outlined.woff2'
  if (content.includes(original)) {
    content = content.replaceAll(original, replacement)
    writeFileSync(cmsJsPath, content, 'utf-8')
    console.log('[copy-sveltia-cms] patched font CDN URL -> local path in sveltia-cms.js')
  } else {
    console.warn('[copy-sveltia-cms] font CDN URL not found in sveltia-cms.js, skip patch')
  }
}
