// 将 Sveltia CMS 打包文件从 node_modules 复制到 public/admin/vendor/
// 这样 git 仓库不需要存储 CMS 文件，Cloudflare Pages 构建时自动复制
import { existsSync, cpSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const src = join(root, 'node_modules', '@sveltia', 'cms', 'dist')
const dst = join(root, 'public', 'admin', 'vendor', 'sveltia')

if (!existsSync(src)) {
  console.warn('[copy-sveltia-cms] node_modules/@sveltia/cms/dist not found, skip')
  process.exit(0)
}

mkdirSync(dst, { recursive: true })
cpSync(src, dst, { recursive: true })
console.log('[copy-sveltia-cms] copied Sveltia CMS dist to public/admin/vendor/sveltia/')
