#!/usr/bin/env python3
"""
収録コンパニオン（テレプロンプター）用のデータを各回の台本(scripts/*.md)から抽出し、
teleprompter-data.js（全40回ぶんをまとめたJSデータ）を生成する。

抽出ロジック：
- 「## トークスクリプト」セクション → 実際に読む台詞（セリフ文）の出どころ
- 「## 操作・画面の流れ（詳細版）」セクション → ブロックの開始・終了秒、画面操作の合図、無音区間
の2つを「ブロック単位の出現順」でzipしてマージする。

オープニング・クロージングは固定テンプレートに差し替え、本編ブロックのみ台本から抽出する。
"""
import csv
import json
import os
import re

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TOTAL_EPISODES = 40

READING_DICT = [
    ("GitHub Copilot", "ギットハブ・コパイロット"),
    ("Claude Code", "クロード・コード"),
    ("CLAUDE.md", "クロード・ドット・エム・ディー"),
    ("chatgpt.com", "チャットジーピーティー・ドット・コム"),
    ("claude.ai", "クロード・ドット・エーアイ"),
    ("ChatGPT", "チャット・ジー・ピー・ティー"),
    ("Supabase", "スーパーベース"),
    ("Next.js", "ネクスト・ジェイエス"),
    ("GitHub", "ギットハブ"),
    ("Copilot", "コパイロット"),
    ("Vercel", "ヴァーセル"),
    (".docx", "ドット・ドックス"),
    (".xlsx", "ドット・エックス・エル・エス・エックス"),
    ("ToDo", "トゥー・ドゥー"),
    ("HTML", "エイチ・ティー・エム・エル"),
    ("PDF", "ピー・ディー・エフ"),
    ("CSV", "シー・エス・ブイ"),
    ("RLS", "アール・エル・エス"),
    ("Git", "ギット"),
]

OPENING_TEMPLATE = (
    "どぉも！AI芸人のえぎです！この講座ではクロードコードについて学んでいきます！"
    "そして、第{num}回は「{title}」！！ということで早速進めていきましょう！それではレッツゴー！"
)
CLOSING_TEMPLATE = (
    "はい、今回も楽しんでいただけたでしょうか？早速、新しく学んだこと、発見したことを実践してみてください！"
    "では、次回もお楽しみに！バイバイ！"
)


def load_index():
    rows = []
    with open(os.path.join(BASE_DIR, "index.csv"), encoding="utf-8") as f:
        for row in csv.DictReader(f):
            rows.append(row)
    return rows


def split_sentences(text):
    """。！？で文を分割し、区切り文字は残す。短すぎる断片は前の文に統合する"""
    text = text.strip()
    if not text:
        return []
    parts = [p.strip() for p in re.split(r"(?<=[。！？])", text) if p.strip()]
    merged = []
    for p in parts:
        if merged and len(p) <= 3:
            merged[-1] += p
        else:
            merged.append(p)
    return merged


def strip_outer_quotes(text):
    t = text.strip()
    if t.startswith("「"):
        t = t[1:]
    if t.endswith("」"):
        t = t[:-1]
    return t


def parse_time_token(token, block_start_sec):
    """'1:00' '0:05' '5' のようなトークンを絶対秒に変換する。
    値が block_start_sec より十分小さい場合は「ブロック先頭からの相対秒」とみなす。"""
    token = token.strip()
    if ":" in token:
        m, s = token.split(":")
        val = int(m) * 60 + int(s)
    else:
        val = int(re.sub(r"[^\d]", "", token) or 0)
    # 相対秒（ブロック内の小さい数値）とみなす条件
    if val < block_start_sec and val < 120:
        return block_start_sec + val
    return val


def parse_talkscript_blocks(md):
    """## トークスクリプト セクションをブロックごとに分割して返す
    [{name, raw_lines:[str,...]}]"""
    lines = md.split("\n")
    try:
        start = next(i for i, l in enumerate(lines) if l.strip() == "## トークスクリプト")
    except StopIteration:
        return []
    end = next(
        (i for i, l in enumerate(lines) if i > start and l.strip().startswith("## 操作・画面の流れ")),
        len(lines),
    )
    section = lines[start + 1 : end]

    blocks = []
    current = None
    header_re = re.compile(r"^### 【(.+?)】")
    for line in section:
        m = header_re.match(line.strip())
        if m:
            if current:
                blocks.append(current)
            current = {"name": m.group(1), "raw_lines": []}
            continue
        if current is not None:
            current["raw_lines"].append(line)
    if current:
        blocks.append(current)
    return blocks


def parse_flow_blocks(md):
    """## 操作・画面の流れ セクションをブロックごとに分割して返す
    [{name, start_sec, end_sec, rows:[(time_range_str, col2, col3)]}]"""
    lines = md.split("\n")
    try:
        start = next(
            i for i, l in enumerate(lines) if l.strip().startswith("## 操作・画面の流れ")
        )
    except StopIteration:
        return []
    section = lines[start + 1 :]

    blocks = []
    current = None
    header_re = re.compile(r"^####\s*【(.+?)】\s*([\d:]+)\s*[〜~]\s*([\d:]+)")
    for line in section:
        s = line.strip()
        m = header_re.match(s)
        if m:
            if current:
                blocks.append(current)
            name, t1, t2 = m.groups()
            start_sec = parse_time_token(t1, 0)
            end_sec = parse_time_token(t2, start_sec)
            current = {"name": name, "start_sec": start_sec, "end_sec": end_sec, "rows": []}
            continue
        if current is not None and s.startswith("|"):
            cells = [c.strip() for c in s.strip("|").split("|")]
            if len(cells) >= 3 and not re.match(r"^[-\s]+$", cells[0]):
                if not re.match(r"^(秒|経過時間)$", cells[0]):
                    current["rows"].append(tuple(cells[:3]))
    if current:
        blocks.append(current)
    return blocks


def extract_silences(flow_block):
    """flowブロックの行から無音区間を抽出する -> [[start,end,label], ...]（絶対秒）"""
    silences = []
    bs = flow_block["start_sec"]
    be = flow_block["end_sec"]
    for time_range, _col2, col3 in flow_block["rows"]:
        if "無音" not in col3 and "無言" not in col3:
            continue
        label = "録画停止まで" if ("停止" in col3) else "間（無音）"
        m = re.match(r"([\d:]+)\s*[〜~]\s*([\d:]+)", time_range)
        if m:
            a = parse_time_token(m.group(1), bs)
            b = parse_time_token(m.group(2), bs)
            silences.append([a, b, label])
            continue
        m2 = re.search(r"最後の\s*(\d+)\s*秒", time_range)
        if m2:
            n = int(m2.group(1))
            silences.append([max(be - n, bs), be, label])
            continue
        m3 = re.search(r"(\d+)\s*秒前", time_range)
        if m3:
            n = int(m3.group(1))
            silences.append([max(be - n, bs), be, label])
    return silences


def cue_rows(flow_block):
    """[(abs_time, cue_text)] を時系列で返す（無音行は除く）"""
    bs = flow_block["start_sec"]
    out = []
    for time_range, col2, col3 in flow_block["rows"]:
        if "無音" in col3 or "無言" in col3:
            continue
        m = re.match(r"([\d:]+)", time_range)
        if not m:
            continue
        t = parse_time_token(m.group(1), bs)
        cue_text = col2.strip()
        if cue_text:
            out.append((t, cue_text))
    return out


def build_lines_from_talk_block(talk_block, start_sec, end_sec):
    """トークスクリプト1ブロックの生テキストから (text, cue, char_offset) のリストを作る"""
    stage_re = re.compile(r"^[「]?\*【(?:画面[:：]?)?(.+?)】\*[」]?$")
    pending_cue = None
    sentences = []  # list of dict(text, cue)
    for raw in talk_block["raw_lines"]:
        s = raw.strip()
        if not s or s in ("---", "***", "___"):
            continue
        m = stage_re.match(s)
        if m:
            pending_cue = m.group(1).strip()
            continue
        # CLAUDE.md例などの見出し・箇条書き例示行は読み上げ対象から除外
        if re.match(r"^#{1,6}\s", s) or re.match(r"^[-*]\s", s):
            continue
        text = strip_outer_quotes(s)
        text = re.sub(r"\*\*(.+?)\*\*", r"\1", text)  # 強調記号は読み上げ不要なので除去
        if not text:
            continue
        for sent in split_sentences(text):
            entry = {"text": sent, "cue": pending_cue}
            sentences.append(entry)
            pending_cue = None  # 最初の文にだけ付与
    if not sentences:
        return []

    total_chars = sum(len(s["text"]) for s in sentences) or 1
    duration = max(end_sec - start_sec, 1)
    cum = 0
    lines = []
    for s in sentences:
        cum += len(s["text"])
        t = start_sec + int(duration * (cum / total_chars))
        lines.append({"text": s["text"], "cue": s["cue"], "timeSec": t})
    return lines


def merge_extra_cues(lines, flow_block):
    """flowブロックの操作合図のうち、まだcueが付いていない直近のlineに割り当てる"""
    if not lines:
        return lines
    rows = cue_rows(flow_block)
    for t, cue_text in rows:
        # tに最も近いlineを探す
        best_idx = min(range(len(lines)), key=lambda i: abs(lines[i]["timeSec"] - t))
        if not lines[best_idx]["cue"]:
            lines[best_idx]["cue"] = cue_text
    return lines


def build_template_block(name, template_text, num, title, flow_block):
    sentences = split_sentences(template_text)
    if not flow_block:
        start_sec, end_sec = 0, max(len(template_text) // 8, 5)
    else:
        start_sec, end_sec = flow_block["start_sec"], flow_block["end_sec"]
    total_chars = sum(len(s) for s in sentences) or 1
    duration = max(end_sec - start_sec, 1)
    cum = 0
    lines = []
    for sent in sentences:
        cum += len(sent)
        t = start_sec + int(duration * (cum / total_chars))
        lines.append({"text": sent, "cue": None, "timeSec": t})
    silences = extract_silences(flow_block) if flow_block else []
    return {
        "name": name,
        "startSec": start_sec,
        "endSec": end_sec,
        "silences": silences,
        "lines": lines,
        "isTemplate": True,
    }


def check_warnings(md, row, total_minutes_from_blocks):
    warnings = []
    for m in re.finditer(r"全\s*([0-9０-９]+)\s*回", md):
        num_str = m.group(1)
        num_str = num_str.translate(str.maketrans("０１２３４５６７８９", "0123456789"))
        if int(num_str) != TOTAL_EPISODES:
            warnings.append(f"「全{num_str}回」という表記がありますが、全体は{TOTAL_EPISODES}回です")
    title_line = next((l for l in md.split("\n") if l.startswith("# ")), "")
    if "｜" in title_line:
        md_title = title_line.split("｜", 1)[1].strip()
        if md_title != row["動画タイトル"]:
            warnings.append(
                f"タイトル不一致: 台本見出し「{md_title}」 / index.csv「{row['動画タイトル']}」"
            )
    csv_sec = int(row["尺（分）"]) * 60
    if total_minutes_from_blocks and abs(total_minutes_from_blocks - csv_sec) > 90:
        warnings.append(
            f"尺の食い違い: 操作手順の合計は約{total_minutes_from_blocks}秒、index.csvでは{csv_sec}秒"
        )
    return warnings


def build_episode_data(row):
    num = row["回数"]
    title = row["動画タイトル"]
    total_min = int(row["尺（分）"])
    path = os.path.join(BASE_DIR, row["スクリプトファイル"])
    with open(path, encoding="utf-8") as f:
        md = f.read()

    talk_blocks = parse_talkscript_blocks(md)
    flow_blocks = parse_flow_blocks(md)

    blocks = []
    n = max(len(talk_blocks), len(flow_blocks))
    spoken_num = str(int(num))

    for i in range(n):
        talk_b = talk_blocks[i] if i < len(talk_blocks) else None
        flow_b = flow_blocks[i] if i < len(flow_blocks) else None
        name = (talk_b or flow_b)["name"]
        is_opening = "オープニング" in name
        is_closing = "クロージング" in name

        if is_opening:
            text = OPENING_TEMPLATE.format(num=spoken_num, title=title)
            block = build_template_block(name, text, num, title, flow_b)
        elif is_closing:
            block = build_template_block(name, CLOSING_TEMPLATE, num, title, flow_b)
        else:
            if flow_b:
                start_sec, end_sec = flow_b["start_sec"], flow_b["end_sec"]
            else:
                start_sec, end_sec = 0, total_min * 60
            lines = build_lines_from_talk_block(talk_b, start_sec, end_sec) if talk_b else []
            if flow_b:
                lines = merge_extra_cues(lines, flow_b)
            silences = extract_silences(flow_b) if flow_b else []
            block = {
                "name": name,
                "startSec": start_sec,
                "endSec": end_sec,
                "silences": silences,
                "lines": lines,
                "isTemplate": False,
            }
        blocks.append(block)

    last_end = blocks[-1]["endSec"] if blocks else total_min * 60
    warnings = check_warnings(md, row, last_end)

    return {
        "num": num,
        "title": title,
        "part": row["Part"],
        "totalSeconds": total_min * 60,
        "totalEpisodes": TOTAL_EPISODES,
        "blocks": blocks,
        "warnings": warnings,
    }


def main():
    rows = load_index()
    data = {}
    all_warnings = {}
    for row in rows:
        ep = build_episode_data(row)
        data[ep["num"]] = ep
        if ep["warnings"]:
            all_warnings[ep["num"]] = ep["warnings"]

    out_path = os.path.join(BASE_DIR, "teleprompter-data.js")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("/* 自動生成: gen_teleprompter_data.py で再生成してください */\n")
        f.write("window.TELEPROMPTER_READING_DICT = ")
        f.write(json.dumps(READING_DICT, ensure_ascii=False))
        f.write(";\n")
        f.write("window.TELEPROMPTER_DATA = ")
        f.write(json.dumps(data, ensure_ascii=False, indent=None))
        f.write(";\n")

    print(f"✅ teleprompter-data.js を生成しました（{len(data)}回分）")
    if all_warnings:
        print("\n⚠️ 整合性チェックで見つかった項目:")
        for num, ws in all_warnings.items():
            for w in ws:
                print(f"  第{num}回: {w}")
    else:
        print("整合性チェック: 問題は見つかりませんでした")

    # 各回のブロック数・行数の概況をログ出力（簡易バリデーション）
    empty_blocks = []
    for num, ep in data.items():
        for b in ep["blocks"]:
            if not b["lines"]:
                empty_blocks.append((num, b["name"]))
    if empty_blocks:
        print("\n⚠️ 行が空のブロック（台本抽出に失敗した可能性）:")
        for num, name in empty_blocks:
            print(f"  第{num}回: 【{name}】")
    else:
        print("バリデーション: 全ブロックに台詞行があります")


if __name__ == "__main__":
    main()
