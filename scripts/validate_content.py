# -*- coding: utf-8 -*-
"""全面内容数据校验：商品/新闻/分类 JSON 的 schema、枚举、引用、残留"""
import os, re, json, glob

base = r'D:\pro\汽车配件独立站\site'
errors = []
warns = []

CATEGORY_ENUM = {'engine-parts','chassis-parts','gearbox-parts','body-parts','brake-parts','electric-parts','new-energy-parts'}
BRAND_ENUM = {'higer','zhongtong','golden-dragon','kinglong','ankai','foton','asiastar','byd','sunlong','shacman','sinotruk','dongfeng','jac'}
NEWS_CATEGORY = {'industry-news','company-news'}

def check(path, fn):
    try:
        d = json.load(open(path, encoding='utf-8'))
        fn(d)
    except Exception as e:
        errors.append(f'{os.path.relpath(path, base)}: 解析失败 {e}')

# ---- 商品 ----
for f in sorted(glob.glob(os.path.join(base, 'content', 'products', '*.json'))):
    name = os.path.basename(f)
    slug = name[:-5]
    def fn(d, _slug=slug, _name=name):
        if not d.get('name'): errors.append(f'{_name}: 缺 name')
        if d.get('category') and d['category'] not in CATEGORY_ENUM:
            errors.append(f'{_name}: category 非法 {d["category"]}')
        for b in (d.get('brands') or []):
            bv = b.get('brand') if isinstance(b, dict) else b
            if bv and bv not in BRAND_ENUM:
                errors.append(f'{_name}: brand 非法 {bv}')
        imgs = d.get('images') or []
        for im in imgs:
            v = im.get('image') if isinstance(im, dict) else im
            if v and not os.path.exists(os.path.join(base, 'public', v.lstrip('/'))):
                errors.append(f'{_name}: 图片缺失 {v}')
        if not imgs: warns.append(f'{_name}: 无图片')
        if not d.get('published', True): warns.append(f'{_name}: 未发布')
    check(f, fn)

# ---- 新闻 ----
for f in sorted(glob.glob(os.path.join(base, 'content', 'news', '*.json'))):
    name = os.path.basename(f)
    slug = name[:-5]
    def fn(d, _slug=slug, _name=name):
        if not d.get('title'): errors.append(f'{_name}: 缺 title')
        if d.get('category') not in NEWS_CATEGORY:
            errors.append(f'{_name}: category 非法 {d.get("category")}')
        if not d.get('date'): errors.append(f'{_name}: 缺 date')
        cov = d.get('coverImage')
        if cov and not os.path.exists(os.path.join(base, 'public', cov.lstrip('/'))):
            errors.append(f'{_name}: 封面缺失 {cov}')
        if not cov: warns.append(f'{_name}: 无封面')
        tags = [t.get('tag') if isinstance(t, dict) else t for t in (d.get('tags') or [])]
        if tags and tags[0] == d.get('category'):
            warns.append(f'{_name}: tags 首项为分类 slug（应清理）')
        if not d.get('published', True): warns.append(f'{_name}: 未发布')
    check(f, fn)

# ---- 分类 ----
for f in sorted(glob.glob(os.path.join(base, 'content', 'categories', '*.json'))):
    name = os.path.basename(f)
    def fn(d):
        if not d.get('name'): errors.append(f'categories/{name}: 缺 name')
        if d.get('image') and not os.path.exists(os.path.join(base, 'public', d['image'].lstrip('/'))):
            errors.append(f'categories/{name}: 图片缺失 {d["image"]}')
    check(f, fn)

# ---- 残留检查 ----
for root, dirs, files in os.walk(base):
    dirs[:] = [d for d in dirs if d not in {'node_modules','.output','.nuxt','.git','dist','vendor'}]
    for f in files:
        if not f.endswith(('.vue','.ts','.json','.yml','.yaml','.mjs','.md','.css')): continue
        p = os.path.join(root, f)
        t = open(p, encoding='utf-8', errors='ignore').read()
        rel = os.path.relpath(p, base)
        for kw, label in [('blog', 'blog 残留'), ('WeChat', '微信残留'), ('wechat', '微信残留'), ('微信', '微信残留'), ('Skype', 'Skype残留'), ('skype', 'Skype残留'), ('/images/reference/', '旧引用路径')]:
            if kw in t:
                warns.append(f'{rel}: 含 {label}')

print('=== 错误 ===')
for e in errors: print(' [E]', e)
print('=== 警告 ===')
for w in warns: print(' [W]', w)
print(f'总计: {len(errors)} 错误, {len(warns)} 警告')
