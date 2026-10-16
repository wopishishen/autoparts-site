# -*- coding: utf-8 -*-
"""图片素材整理：删除无用 + 按用途分文件夹 + 全局更新引用"""
import os, re, shutil

root = r'D:\pro\汽车配件独立站\site'
img_root = os.path.join(root, 'public', 'images')

# ---- 1. 收集引用 ----
refs = set()
pat = re.compile(r'/images/[A-Za-z0-9_\-./()%20]+')
for dirpath, dirs, files in os.walk(root):
    if any(x in dirpath for x in ('node_modules', '.output', '.nuxt', '.git')):
        continue
    for f in files:
        if not f.endswith(('.vue', '.ts', '.json', '.yml', '.yaml', '.js', '.mjs')):
            continue
        p = os.path.join(dirpath, f)
        try:
            t = open(p, encoding='utf-8', errors='ignore').read()
        except Exception:
            continue
        for m in pat.findall(t):
            refs.add(m.rstrip('\\"'))

for i in range(1, 26):
    ext = 'png' if i == 4 else 'jpg'
    refs.add(f'/images/reference/d_images_partner_{i:02d}.{ext}')

for d in ('body-parts','brake-parts','chassis-parts','electric-parts','engine-parts','gearbox-parts','new-energy-parts'):
    p = os.path.join(root, 'content', 'categories', d + '.json')
    if os.path.exists(p):
        for m in pat.findall(open(p, encoding='utf-8').read()):
            refs.add(m.rstrip('\\"'))

# ---- 2. 磁盘清单 ----
disk = {}
for dirpath, dirs, files in os.walk(img_root):
    for f in files:
        rel = os.path.relpath(os.path.join(dirpath, f), img_root).replace('\\', '/')
        disk[rel] = os.path.join(dirpath, f)

used = set()
for r in refs:
    if r.startswith('/images/') and 'marker-icon' not in r and 'og-default' not in r and not r.endswith('/d_images_partner_'):
        used.add(r.replace('/images/', '', 1))

unused = sorted(set(disk) - used)
print('=== DELETE:', len(unused), '===')
for u in unused:
    print(' ', u)
    os.remove(disk[u])

# ---- 3. 移动在用文件到分类目录 ----
def target_dir(name):
    if name.startswith('d_images_sub_banner_'):
        return 'banners'
    if name in ('d_files_banner1920x780_2.png', 'd_files_banner2.jpg', 'd_images_banner4.jpg'):
        return 'hero'
    if name.startswith('d_images_product-') or name in (
        'd_files_cylinder-head-gasket-detail-1.png', 'd_files_cylinder-head-gasket-detail-2.png',
        'd_files_cylinder-head-gasket-detail-3.png', 'd_files_cylinder-head-gasket-title.png',
        'd_images_Aluminum-gas-storage-tank-detail-1.png', 'd_images_Aluminum-gas-storage-tank-detail-2.png',
        'd_images_auto-parts_airbag-title.jpg', 'd_images_Brake-chamber-detail-1.jpg',
        'd_images_brake-pad-detail-1.jpg', 'd_images_Brake-shoes-detail-1.png',
        'd_images_5b5716a513da46e781fd63e6799db5ee.png',
    ):
        return 'products'
    if name.startswith('d_images_news-'):
        return 'news'
    if name.startswith('d_images_partner_') or name in (
        'd_files_0_1.jpg', 'd_files_about_exhibition.png', 'd_files_about_warehouse.jpg',
        'd_images_about-01.png', 'd_images_about_delivery.jpg', 'd_images_about_office.jpg',
        'd_images_zhenshu-1.jpg', 'd_images_zhenshu-2.jpg', 'd_images_zhenshu-3.jpg', 'd_images_zhenshu-4.jpg',
    ):
        return 'about'
    if name.startswith('d_images_ind_solu_'):
        return 'solutions'
    if name in ('d_images_1.jpg', 'd_images_2.jpg', 'd_images_3.jpg', 'd_images_4.jpg', 'd_images_6.jpg',
                'd_images_brake.jpg', 'd_images_clutch.jpg'):
        return 'categories'
    return None

moves = []
for rel in sorted(used):
    name = os.path.basename(rel)
    d = target_dir(name)
    if d is None:
        print('!! NO TARGET for', rel)
        continue
    if not rel.startswith('reference/'):
        print('!! not in reference/', rel)
        continue
    dst_dir = os.path.join(img_root, d)
    os.makedirs(dst_dir, exist_ok=True)
    dst = os.path.join(dst_dir, name)
    shutil.move(disk[rel], dst)
    moves.append((rel, d + '/' + name))
print('=== MOVED:', len(moves), '===')

# ---- 4. 全局替换引用路径 ----
repl = []
for old_rel, new_rel in moves:
    repl.append((f'/images/reference/{os.path.basename(old_rel)}', f'/images/{new_rel}'))
# partner 模板前缀
repl.append(('/images/reference/d_images_partner_', '/images/about/d_images_partner_'))
# og 默认图修复（引用缺失文件 → 用 hero 首图）
repl.append(('/images/og-default.jpg', '/images/hero/d_files_banner1920x780_2.png'))

changed = 0
for dirpath, dirs, files in os.walk(root):
    if any(x in dirpath for x in ('node_modules', '.output', '.nuxt', '.git', 'scripts')):
        continue
    for f in files:
        if not f.endswith(('.vue', '.ts', '.json', '.yml', '.yaml', '.js', '.mjs')):
            continue
        p = os.path.join(dirpath, f)
        try:
            t = open(p, encoding='utf-8', newline='').read()
        except Exception:
            continue
        nt = t
        for old, new in repl:
            nt = nt.replace(old, new)
        if nt != t:
            open(p, 'w', encoding='utf-8', newline='').write(nt)
            changed += 1
print('=== FILES UPDATED:', changed, '===')
