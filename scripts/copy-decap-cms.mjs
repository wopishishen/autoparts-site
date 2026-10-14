// 将 decap-cms 打包文件从 node_modules 复制到 public/admin/vendor/
// 这样 git 仓库不需要存储 62MB 的 CMS 文件，Cloudflare Pages 构建时自动复制
import { existsSync, cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const src = join(root, 'node_modules', 'decap-cms', 'dist')
const dst = join(root, 'public', 'admin', 'vendor')
const localesPkg = join(root, 'node_modules', 'decap-cms-locales', 'dist', 'esm', 'zh_Hans', 'index.js')

if (!existsSync(src)) {
  console.warn('[copy-decap-cms] node_modules/decap-cms/dist not found, skip')
  process.exit(0)
}

mkdirSync(dst, { recursive: true })
cpSync(src, dst, { recursive: true })
console.log(`[copy-decap-cms] copied decap-cms dist to public/admin/vendor/`)

// 复制并转换中文语言包（ESM export → 全局变量）
if (existsSync(localesPkg)) {
  let content = readFileSync(localesPkg, 'utf-8')
  content = content.replace('export default zh_Hans;', 'window.zh_Hans = zh_Hans;')
  writeFileSync(join(dst, 'zh_Hans.js'), content, 'utf-8')
  console.log('[copy-decap-cms] copied zh_Hans locale')
}
