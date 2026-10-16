# -*- coding: utf-8 -*-
"""检查所有商品/新闻 JSON 的图片引用是否存在于磁盘"""
import os, re, json

base = r'D:\pro\汽车配件独立站\site'
refs = set()
for d in ('products', 'news'):
    for f in os.listdir(os.path.join(base, 'content', d)):
        if not f.endswith('.json'):
            continue
        t = open(os.path.join(base, 'content', d, f), encoding='utf-8').read()
        for m in re.findall(r'/images/[A-Za-z0-9_\-./()%20]+', t):
            refs.add(m.rstrip('\\"'))

bad = [r for r in sorted(refs) if not os.path.exists(os.path.join(base, 'public', r.lstrip('/')))]
print('total unique refs:', len(refs))
print('MISSING on disk:', len(bad))
for b in bad:
    print(' ', b)
