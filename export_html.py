#!/usr/bin/env python3
"""
Claude Code研修スクリプトを静的HTMLとして書き出す（他者への公開用）

`docs/` 配下に、サーバー不要で動く完全に自己完結した静的サイトを生成する。
GitHub Pages（Deploy from a branch → /docs、または Actions）でそのまま公開できる。

生成物:
  docs/index.html          スクリプト一覧
  docs/script/NN.html      各回スクリプト
  docs/screens/...         収録用モックアップ画面一式
  docs/.nojekyll           GitHub PagesのJekyll処理を無効化
"""
import os, re, sys, shutil

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# server.py の関数を流用
from server import render_index, render_script, load_index

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE_DIR, 'docs')


# --- パス書き換えヘルパー（絶対パス→静的サイト用の相対パス） ---
def fix_links_index(html):
    """一覧ページ: /script/NN → script/NN.html、/screens/ → screens/index.html"""
    html = re.sub(r'href="/script/(\d+)"', r'href="script/\1.html"', html)
    html = re.sub(r'href="/screens/"', 'href="screens/index.html"', html)
    return html


def fix_links_script(html):
    """詳細ページ: / → ../index.html、/script/NN → NN.html"""
    html = re.sub(r'href="/"', 'href="../index.html"', html)
    html = re.sub(r'href="/script/(\d+)"', r'href="\1.html"', html)
    return html


def fix_links_screens_index(html):
    """screens一覧: スクリプト一覧への戻りリンク / → ../index.html"""
    return re.sub(r'href="/"', 'href="../index.html"', html)


def build():
    # 出力先を作り直す
    if os.path.exists(OUT):
        shutil.rmtree(OUT)
    os.makedirs(os.path.join(OUT, 'script'), exist_ok=True)

    # GitHub PagesでJekyllに加工させない
    open(os.path.join(OUT, '.nojekyll'), 'w').close()

    # index.html（スクリプト一覧）
    print("生成中: index.html")
    with open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(fix_links_index(render_index()))

    # 各スクリプトページ
    rows = load_index()
    for row in rows:
        num = row['回数']
        print(f"生成中: script/{num}.html")
        page_html, _, _ = render_script(num)
        if page_html:
            with open(os.path.join(OUT, 'script', f'{num}.html'), 'w', encoding='utf-8') as f:
                f.write(fix_links_script(page_html))

    # 収録用モックアップ画面（screens/ 一式をコピー）
    print("コピー中: screens/")
    src_screens = os.path.join(BASE_DIR, 'screens')
    dst_screens = os.path.join(OUT, 'screens')
    shutil.copytree(src_screens, dst_screens)

    # screens/index.html の絶対リンクだけ静的サイト用に修正
    screens_index = os.path.join(dst_screens, 'index.html')
    with open(screens_index, encoding='utf-8') as f:
        html = f.read()
    with open(screens_index, 'w', encoding='utf-8') as f:
        f.write(fix_links_screens_index(html))

    print(f"\n✅ 完成！ 合計 {len(rows)+1} ページ + 収録画面")
    print(f"📁 保存先: {OUT}")
    print(f"🌐 ローカル確認: {OUT}/index.html をブラウザで開く")
    print(f"🚀 公開: GitHub Pages を有効化（README参照）")


if __name__ == '__main__':
    build()
