#!/usr/bin/env python3
"""
Claude Code研修スクリプトを静的HTMLとして書き出す
生成先: /Users/egikazuhide/claude_code_training/html/
"""
import os, sys, shutil
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# server.py の関数を流用
from server import render_index, render_script, load_index

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, 'html')
os.makedirs(os.path.join(OUT, 'script'), exist_ok=True)

# テレプロンプター関連の静的アセットをルートにコピー
for fname in ('teleprompter.js', 'teleprompter.css', 'teleprompter-data.js'):
    src = os.path.join(BASE, fname)
    if os.path.exists(src):
        shutil.copy(src, os.path.join(OUT, fname))

# --- パス書き換えヘルパー ---
def fix_links_index(html):
    """一覧ページ: /script/NN → script/NN.html、/teleprompter.* はルート相対のままでOK"""
    import re
    return re.sub(r'href="/script/(\d+)"', r'href="script/\1.html"', html)

def fix_links_script(html):
    """詳細ページ: / → ../index.html、/script/NN → NN.html、/teleprompter.* → ../teleprompter.*"""
    import re
    html = re.sub(r'href="/"', 'href="../index.html"', html)
    html = re.sub(r'href="/script/(\d+)"', r'href="\1.html"', html)
    html = re.sub(r'(href|src)="/teleprompter', r'\1="../teleprompter', html)
    return html

# index.html
print("生成中: index.html")
html = fix_links_index(render_index())
with open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8') as f:
    f.write(html)

# 各スクリプトページ
rows = load_index()
for row in rows:
    num = row['回数']
    print(f"生成中: script/{num}.html")
    page_html, _, _ = render_script(num)
    if page_html:
        page_html = fix_links_script(page_html)
        with open(os.path.join(OUT, 'script', f'{num}.html'), 'w', encoding='utf-8') as f:
            f.write(page_html)

print(f"\n✅ 完成！ 合計 {len(rows)+1} ページ")
print(f"📁 保存先: {OUT}")
print(f"🌐 開き方: {OUT}/index.html をダブルクリック")
