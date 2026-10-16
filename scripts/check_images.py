# -*- coding: utf-8 -*-
"""列出全部在用文件 + 分类 image + og-default 位置"""
import os, re

root = r'D:\pro\汽车配件独立站\site'
img_root = os.path.join(root, 'public', 'images')

refs = set()
pat = re.compile(r'/images/[A-Za-z0-9_\-./()%20]+')
for dirpath, dirs, files in os.walk(root):
    if any(x in dirpath for x in ('node_modules', '.output', '.nuxt', '.git', 'dist', 'scripts')):
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
        t = open(p, encoding='utf-8').read()
        for m in pat.findall(t):
            refs.add(m.rstrip('\\"'))

used = sorted(r for r in refs if r.startswith('/images/'))
print('=== USED refs:', len(used), '===')
for r in used:
    print(r)
