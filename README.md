# Auto Parts Site — 汽车配件展示型独立站

面向海外客户的汽车配件询盘展示站（非电商），参考 glbtrad.com 结构。客户通过 Email / WhatsApp / 留资表单转化，无加购/下单/支付/登录。

## 技术栈

| 层 | 选型 | 说明 |
|---|---|---|
| 框架 | Nuxt 4 (Vue 3) | SSG 静态生成 |
| 样式 | Tailwind CSS 4 | Vite 插件模式 |
| CMS | Decap CMS 3.17 | Git-based 可视化编辑，零后端 |
| 多语言 | @nuxtjs/i18n | 当前仅英文，架构预留扩展 |
| SEO | @nuxtjs/seo | sitemap / robots / JSON-LD / OG |
| 托管 | Cloudflare Pages | 免费档，全球 CDN |
| 表单 | Formspree | 免费档，询盘转发邮箱 |

## 本地开发

```bash
# 安装依赖（postinstall 会自动复制 Decap CMS 文件到 public/admin/vendor/）
npm install

# 启动网站前台（http://localhost:3000）
npm run dev

# 另开终端，启动 CMS 本地编辑后端（http://localhost:8081）
npx decap-server
```

访问：
- 前台：http://localhost:3000
- CMS 后台：http://localhost:3000/admin（本地模式免登录）

## 构建

```bash
npm run build
# 产物在 .output/public/，纯静态文件
```

## 目录结构

```
site/
├── app/
│   ├── pages/           # 页面：首页 / 商品列表 / 商品详情 / 询盘
│   ├── components/      # SiteHeader / SiteFooter / ProductCard
│   ├── composables/     # useContent（内容数据读取层）
│   ├── layouts/         # default 布局
│   ├── types/           # TypeScript 类型定义
│   └── assets/css/      # Tailwind 入口
├── content/
│   ├── site.json        # 站点配置（品牌/联系方式/SEO）
│   ├── categories/      # 7 个系统分类 JSON
│   └── products/        # 商品 JSON（运营在 CMS 里维护）
├── public/
│   ├── admin/           # Decap CMS 后台（index.html + config.yml）
│   │   └── vendor/      # CMS 打包文件（postinstall 自动生成，不提交 git）
│   └── images/          # 商品/分类图片（CMS 上传到此）
├── scripts/
│   └── copy-decap-cms.mjs  # postinstall 脚本：复制 CMS 文件
├── nuxt.config.ts
├── package.json
└── .gitignore
```

## 运营人员使用 CMS

1. 打开 `/admin/`，用 GitHub 账号登录
2. 左侧选择「商品管理」「分类管理」或「站点设置」
3. 新增/编辑内容后点「发布」，自动提交到 GitHub 并触发 Cloudflare Pages 重新构建（约 1-2 分钟上线）
4. 图片在「媒体」里上传，自动存到 `public/images/`

## 部署前必须替换的占位符

| 文件 | 占位符 | 说明 |
|---|---|---|
| `nuxt.config.ts` | `site.url` | 部署后替换为实际 pages.dev 或正式域名 |
| `public/admin/config.yml` | `repo` | GitHub 用户名/仓库名 |
| `public/admin/config.yml` | `app_id` | GitHub App ID（用于 CMS 登录认证） |
| `app/pages/contact.vue` | `YOUR_FORM_ID` | Formspree 表单 ID |
| `content/site.json` | 品牌/联系方式 | 公司名、电话、邮箱、WhatsApp 等 |

## 成本

- 测试/试运营阶段：**零费用**（Cloudflare Pages 免费 + GitHub 免费 + Formspree 免费）
- 正式上线唯一刚性成本：**域名 ≈ ¥70-100/年**
