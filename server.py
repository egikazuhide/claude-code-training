#!/usr/bin/env python3
"""
Claude Code研修動画 スクリプトビューア
"""
import http.server
import socketserver
import os
import csv
import re

PORT = 8765
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

PART_COLORS = {
    "Part1": "#3B82F6",  # 青：知る
    "Part2": "#8B5CF6",  # 紫：指示
    "Part3": "#10B981",  # 緑：文書
    "Part4": "#F59E0B",  # 黄：スクリプト
    "Part5": "#06B6D4",  # シアン：Web
    "Part6": "#EC4899",  # ピンク：アプリ設計
    "Part7": "#EF4444",  # 赤：アプリ実装
    "Part8": "#6366F1",  # インディゴ：仕上げ
    "Part9": "#64748B",  # グレー：フォローアップ
}

def md_to_html(md_text):
    """簡易Markdown→HTML変換"""
    lines = md_text.split('\n')
    html = []
    in_code = False
    in_table = False

    for line in lines:
        if line.startswith('```'):
            if in_code:
                html.append('</code></pre>')
                in_code = False
            else:
                html.append('<pre><code>')
                in_code = True
            continue
        if in_code:
            html.append(line.replace('<','&lt;').replace('>','&gt;'))
            continue

        # 表
        if line.startswith('|'):
            if not in_table:
                html.append('<table>')
                in_table = True
            if re.match(r'\|[\s\-\|]+\|', line):
                continue
            cells = [c.strip() for c in line.strip('|').split('|')]
            tag = 'th' if not any('<td>' in h for h in html[-3:]) else 'td'
            html.append('<tr>' + ''.join(f'<{tag}>{c}</{tag}>' for c in cells) + '</tr>')
            continue
        else:
            if in_table:
                html.append('</table>')
                in_table = False

        # 見出し
        if line.startswith('### '):
            html.append(f'<h3>{line[4:]}</h3>')
        elif line.startswith('## '):
            html.append(f'<h2>{line[3:]}</h2>')
        elif line.startswith('# '):
            html.append(f'<h1>{line[2:]}</h1>')
        # 水平線
        elif line.strip() in ('---', '***', '___'):
            html.append('<hr>')
        # 箇条書き
        elif line.startswith('- ') or line.startswith('* '):
            html.append(f'<li>{line[2:]}</li>')
        elif re.match(r'^\d+\. ', line):
            item = re.sub(r'^\d+\. ', '', line)
            html.append(f'<li>{item}</li>')
        # 引用
        elif line.startswith('> '):
            html.append(f'<blockquote>{line[2:]}</blockquote>')
        # 空行
        elif line.strip() == '':
            html.append('<br>')
        # 通常テキスト（インライン装飾）
        else:
            t = line
            t = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', t)
            t = re.sub(r'\*(.+?)\*', r'<em>\1</em>', t)
            t = re.sub(r'`(.+?)`', r'<code>\1</code>', t)
            html.append(f'<p>{t}</p>')

    if in_table:
        html.append('</table>')
    return '\n'.join(html)


def load_index():
    rows = []
    with open(os.path.join(BASE_DIR, 'index.csv'), encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
    return rows


def render_index():
    rows = load_index()
    parts = {}
    for row in rows:
        p = row['Part']
        parts.setdefault(p, {'title': row['Partタイトル'], 'rows': []})
        parts[p]['rows'].append(row)

    cards = ''
    for part, data in parts.items():
        color = PART_COLORS.get(part, '#6B7280')
        items = ''
        for r in data['rows']:
            num = r['回数']
            title = r['動画タイトル']
            mins = r['尺（分）']
            goal = r['ゴール']
            items += f'''
            <a href="/script/{num}" class="episode-card">
              <div class="ep-num">第{num}回</div>
              <div class="ep-body">
                <div class="ep-title">{title}</div>
                <div class="ep-goal">🎯 {goal}</div>
              </div>
              <div class="ep-min">{mins}分</div>
            </a>'''

        cards += f'''
        <div class="part-section">
          <div class="part-header" style="background:{color}">
            <span class="part-label">{part}</span>
            <span class="part-title">{data["title"]}</span>
            <span class="part-count">{len(data["rows"])}本</span>
          </div>
          <div class="episode-list">{items}</div>
        </div>'''

    total = len(rows)
    total_min = sum(int(r['尺（分）']) for r in rows)
    return f'''<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Claude Code研修動画 スクリプト一覧</title>
<style>
  *{{box-sizing:border-box;margin:0;padding:0}}
  body{{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#0f172a;color:#e2e8f0;min-height:100vh}}
  .header{{background:linear-gradient(135deg,#1e293b,#0f172a);border-bottom:1px solid #334155;padding:32px 24px;text-align:center}}
  .header h1{{font-size:28px;font-weight:700;color:#f1f5f9;margin-bottom:8px}}
  .header p{{color:#94a3b8;font-size:14px}}
  .stats{{display:flex;gap:24px;justify-content:center;margin-top:16px}}
  .stat{{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 20px;text-align:center}}
  .stat-num{{font-size:24px;font-weight:700;color:#38bdf8}}
  .stat-label{{font-size:12px;color:#64748b;margin-top:2px}}
  .container{{max-width:900px;margin:0 auto;padding:24px}}
  .part-section{{margin-bottom:24px;border-radius:12px;overflow:hidden;border:1px solid #334155}}
  .part-header{{display:flex;align-items:center;gap:12px;padding:14px 20px}}
  .part-label{{font-size:12px;font-weight:700;background:rgba(255,255,255,0.2);border-radius:4px;padding:2px 8px;color:#fff}}
  .part-title{{font-size:16px;font-weight:600;color:#fff;flex:1}}
  .part-count{{font-size:12px;color:rgba(255,255,255,0.7)}}
  .episode-list{{background:#1e293b}}
  .episode-card{{display:flex;align-items:center;gap:16px;padding:14px 20px;text-decoration:none;color:inherit;border-top:1px solid #334155;transition:background 0.15s}}
  .episode-card:hover{{background:#273548}}
  .ep-num{{font-size:12px;font-weight:600;color:#64748b;min-width:50px}}
  .ep-body{{flex:1}}
  .ep-title{{font-size:14px;font-weight:500;color:#e2e8f0;margin-bottom:4px}}
  .ep-goal{{font-size:12px;color:#64748b}}
  .ep-min{{font-size:12px;color:#38bdf8;font-weight:600;white-space:nowrap}}
</style>
</head>
<body>
<div class="header">
  <h1>📹 Claude Code研修動画 スクリプト一覧</h1>
  <p>プログラミング未経験からデスクトップアプリ作成まで</p>
  <p style="margin-top:10px"><a href="/screens/" style="color:#38bdf8;text-decoration:none;font-size:13px">🖥️ 収録用モックアップ画面 一覧を見る →</a></p>
  <div class="stats">
    <div class="stat"><div class="stat-num">{total}</div><div class="stat-label">動画本数</div></div>
    <div class="stat"><div class="stat-num">{total_min}</div><div class="stat-label">合計尺（分）</div></div>
    <div class="stat"><div class="stat-num">9</div><div class="stat-label">Parts</div></div>
  </div>
</div>
<div class="container">{cards}</div>
</body></html>'''


def render_script(num):
    rows = load_index()
    row = next((r for r in rows if r['回数'] == num), None)
    if not row:
        return None, None, None

    script_path = os.path.join(BASE_DIR, row['スクリプトファイル'])
    if not os.path.exists(script_path):
        return None, None, None

    with open(script_path, encoding='utf-8') as f:
        md = f.read()

    part = row['Part']
    color = PART_COLORS.get(part, '#6B7280')
    rows_list = [r for r in rows]
    idx = next((i for i, r in enumerate(rows_list) if r['回数'] == num), None)
    prev_num = rows_list[idx-1]['回数'] if idx and idx > 0 else None
    next_num = rows_list[idx+1]['回数'] if idx is not None and idx < len(rows_list)-1 else None

    nav = ''
    if prev_num:
        nav += f'<a href="/script/{prev_num}" class="nav-btn">← 第{prev_num}回</a>'
    nav += f'<a href="/" class="nav-btn home-btn">📋 一覧</a>'
    if next_num:
        nav += f'<a href="/script/{next_num}" class="nav-btn">第{next_num}回 →</a>'

    body = md_to_html(md)

    html = f'''<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>第{num}回 | {row["動画タイトル"]}</title>
<style>
  *{{box-sizing:border-box;margin:0;padding:0}}
  body{{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#0f172a;color:#e2e8f0;min-height:100vh}}
  .top-bar{{background:{color};padding:16px 24px;display:flex;align-items:center;gap:12px}}
  .top-bar .ep{{font-size:13px;background:rgba(0,0,0,0.2);border-radius:4px;padding:2px 10px;color:#fff;font-weight:600}}
  .top-bar .title{{font-size:17px;font-weight:700;color:#fff;flex:1}}
  .top-bar .min{{font-size:13px;color:rgba(255,255,255,0.8)}}
  .meta-bar{{background:#1e293b;border-bottom:1px solid #334155;padding:12px 24px;display:flex;gap:24px;flex-wrap:wrap}}
  .meta-item{{font-size:12px;color:#64748b}}.meta-item span{{color:#94a3b8;font-weight:500}}
  .nav{{display:flex;gap:8px;padding:16px 24px;background:#0f172a;border-bottom:1px solid #1e293b;justify-content:center}}
  .nav-btn{{text-decoration:none;color:#94a3b8;border:1px solid #334155;border-radius:6px;padding:6px 16px;font-size:13px;transition:all 0.15s}}
  .nav-btn:hover{{background:#1e293b;color:#e2e8f0}}
  .home-btn{{background:#1e293b}}
  .container{{max-width:800px;margin:0 auto;padding:32px 24px}}
  h1{{font-size:22px;font-weight:700;color:#f1f5f9;margin:24px 0 12px;border-bottom:1px solid #334155;padding-bottom:8px}}
  h2{{font-size:18px;font-weight:600;color:#38bdf8;margin:20px 0 10px}}
  h3{{font-size:15px;font-weight:600;color:#7dd3fc;margin:16px 0 8px}}
  p{{font-size:14px;line-height:1.8;color:#cbd5e1;margin:6px 0}}
  li{{font-size:14px;line-height:1.8;color:#cbd5e1;margin:4px 0 4px 20px;list-style:disc}}
  strong{{color:#f1f5f9;font-weight:600}}
  em{{color:#94a3b8;font-style:italic}}
  code{{background:#1e293b;border:1px solid #334155;border-radius:4px;padding:1px 6px;font-size:12px;color:#7dd3fc;font-family:monospace}}
  pre{{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:16px;overflow-x:auto;margin:12px 0}}
  pre code{{background:none;border:none;padding:0;font-size:13px;color:#a5f3fc}}
  table{{width:100%;border-collapse:collapse;margin:12px 0;font-size:13px}}
  th{{background:#1e293b;color:#7dd3fc;padding:8px 12px;text-align:left;border:1px solid #334155;font-weight:600}}
  td{{padding:8px 12px;border:1px solid #1e293b;color:#cbd5e1}}
  tr:nth-child(even) td{{background:#111827}}
  hr{{border:none;border-top:1px solid #334155;margin:20px 0}}
  blockquote{{border-left:3px solid #38bdf8;padding:8px 16px;background:#1e293b;border-radius:0 6px 6px 0;margin:10px 0;font-size:13px;color:#94a3b8}}
  br{{display:block;margin:4px 0;content:""}}
</style>
</head>
<body>
<div class="top-bar">
  <span class="ep">第{num}回 / {part}</span>
  <span class="title">{row["動画タイトル"]}</span>
  <span class="min">⏱ {row["尺（分）"]}分</span>
</div>
<div class="meta-bar">
  <div class="meta-item">🎯 ゴール：<span>{row["ゴール"]}</span></div>
  <div class="meta-item">🎬 収録：<span>{row["収録スタイル"]}</span></div>
</div>
<div class="nav">{nav}</div>
<div class="container">{body}</div>
<div class="nav" style="margin-top:0;border-top:1px solid #1e293b;border-bottom:none">{nav}</div>
</body></html>'''
    return html, row['動画タイトル'], num


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/' or self.path == '':
            content = render_index().encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', len(content))
            self.end_headers()
            self.wfile.write(content)
        elif self.path == '/screens' or self.path.startswith('/screens/'):
            if self.path == '/screens':
                self.send_response(301)
                self.send_header('Location', '/screens/')
                self.end_headers()
                return
            return http.server.SimpleHTTPRequestHandler.do_GET(self)
        elif self.path.startswith('/script/'):
            num = self.path.split('/')[-1].zfill(2)
            html, _, _ = render_script(num)
            if html:
                content = html.encode('utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.send_header('Content-Length', len(content))
                self.end_headers()
                self.wfile.write(content)
            else:
                self.send_response(404)
                self.end_headers()
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        pass  # ログ抑制


if __name__ == '__main__':
    os.chdir(BASE_DIR)
    with socketserver.TCPServer(('', PORT), Handler) as httpd:
        print(f'✅ サーバー起動中: http://localhost:{PORT}')
        httpd.serve_forever()
