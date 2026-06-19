# 引き継ぎプロンプト：Claude Code研修動画スクリプト・収録画面プロジェクト

以下はこのプロジェクトをゼロから（または途中から）再現・継続するためのプロンプトです。新しいClaude Codeセッションの最初に、このファイルの内容をそのまま貼り付けてください。

---

## プロジェクト概要

`/Users/egikazuhide/claude_code_training/` に、Claude Code研修動画（全40回、Part1〜Part9構成、合計約436分）のスクリプト・収録用モックアップ画面・配信用Webビューアーを構築しています。GitHubリポジトリ `egikazuhide/claude-code-training`（公開）にプッシュ済みで、Vercel上に `https://claudecodetraining-eight.vercel.app` として公開しています。

### カリキュラム全体構成（2024年改訂版）
- **Part1〜5（01〜20回）**：Claude Codeの基礎スキル（指示の出し方・文書生成・スクリプト自動化・Webページ作成）。最終アプリの内容に関わらず一貫して使える土台パート。
- **Part6（21〜24回）「新しい武器を知る」**：2つのアプリ全体像、GitHub連携、Supabase入門（DB・認証）、Vercel公開とNext.js基礎。
- **Part7（25〜30回）「名刺管理アプリを作る」**：設計→テーブル設計・ログイン→登録・一覧→検索・編集・削除→セキュリティ設定（RLS）→Vercel公開・配布。**最終成果物①**。
- **Part8（31〜37回）「現場日報報告アプリを作る」**：設計（写真・Storage含む）→投稿フォーム→写真アップロード→一覧・カレンダー→管理者集計機能→ロールベースRLS→配布。**最終成果物②**。
- **Part9（38〜40回）「仕上げ・配布・運用」**：Web版エラー対処（ブラウザConsole・Vercelログ）、他社への配布・複数社運用、最終回（次のアイデア出し）。

**重要：以前のバージョンでは最終成果物が「動画から画像つきマニュアルを生成するデスクトップアプリ」（ffmpeg・Claude API・tkinter）でしたが、これは廃止されました。** 現在は **Webアプリ2本（名刺管理アプリ・現場日報報告アプリ、Next.js + Supabase + Vercel構成）** が最終成果物です。古い言及（manual_creator、ffmpeg等）が資料に残っていたら、混在を疑い確認してください。

### 全体構成
```
claude_code_training/
├── server.py              # Pythonビューアーサーバー（port 8765、ローカル動作確認用）
├── export_html.py         # server.pyの出力を静的HTMLとして書き出すスクリプト
├── index.csv              # 34回分のメタデータ（回数・Part・タイトル・尺・ゴール・収録スタイル等）
├── scripts/                # 01_script.md 〜 34_script.md（各回のトークスクリプト＋操作フロー）
├── screens/                 # 収録用モックアップHTML（claude-app.html, data.js, 各special page）
├── html/                    # export_html.pyが生成する静的HTML（Vercel配信対象）
├── recording_prep/          # 収録に使うサンプルファイル（CSV・テキスト等）
└── vercel.json              # Vercelビルド設定（public/にhtml+screensをまとめて配信）
```

---

## これまでに行ったタスク（再現する場合の手順）

### 1. カリキュラム設計・スクリプト作成
- 34回構成、Part1（知る）〜Part9（フォローアップ）に分けたClaude Code研修カリキュラムを設計
- 各回について `NN_script.md` ファイルを作成し、以下の構成にする：
  ```
  # 第NN回｜タイトル
  **尺：XX分 / PartY**
  **ゴール：...**
  **収録スタイル：...**
  ## 構成（ブロック・内容・時間の表）
  ## トークスクリプト（オープニング・本編①②③・クロージングを「」で一字一句書く）
  ## 操作・画面の流れ（詳細版）   ← 後述
  ```

### 2. Pythonビューアーサーバー構築（server.py）
- `index.csv` を読み込み、Part別に色分けされた一覧ページ（`render_index()`）と各回の詳細ページ（`render_script()`）を動的生成
- Markdown→HTML簡易変換関数（`md_to_html()`）を自作（見出し・表・箇条書き・コードブロック・強調を変換）
- Part毎の色分け：Part1=`#3B82F6`青、Part2=`#8B5CF6`紫、Part3=`#10B981`緑、Part4=`#F59E0B`黄、Part5=`#06B6D4`シアン、Part6=`#EC4899`ピンク、Part7=`#EF4444`赤、Part8=`#6366F1`インディゴ、Part9=`#64748B`グレー
- ダークテーマのClaude Code風デザイン（背景`#0f172a`、アクセント`#38bdf8`）

### 3. 収録用モックアップ画面の作成（screens/）
- `style.css`：Claude Codeデスクトップアプリ風の共通CSS（ライトテーマ、背景`#FAFAF8`、サイドバー`#F5F4ED`、アクセントのテラコッタ`#C15F3C`）
- `claude-app.html`：URLパラメータ `?ep=NN` でdata.jsからエピソード情報を読み込み、ファイルツリー・チャット欄・承認ダイアログ等を再現する汎用モックアップ
- `data.js`：全34回分の `EPISODES` オブジェクト（title, goal, part, fileTree, messages, specialページの有無など）
- 概念図・比較表など個別ページが必要な回（01・02・21・34）は `special` フィールドで専用HTMLにリダイレクト
  - `compare.html`（第01回：ChatGPT/Copilot/Claude Code比較）
  - `install.html`（第02回：インストール手順の画面）
  - `overview.html`（第21回：アプリ全体像のフロー図）
  - `roadmap.html`（第34回：最終回のロードマップ）
- `index.html`：全エピソードの一覧（Part別グルーピング、「概念図」/「アプリ画面」タグ表示）

### 4. 各スクリプトへの詳細操作フロー追記（最重要タスク）
ユーザーからの指示：「各スクリプトの流れに伴う、画面操作の流れを詳細に明記してください。初心者でも操作画面を録画できるようにしてください。スクリプトも動画の分数分をカバーできる内容にしてください」

これに対応するため、各`NN_script.md`の末尾「## 操作・画面の流れ」セクションを以下の形式に統一・詳細化した：

```markdown
## 操作・画面の流れ（詳細版）

### 📋 収録前準備チェックリスト
- [ ] （起動すべきアプリ・用意すべきファイルを具体的に）

### 🎬 収録手順（XX分完全版）

#### 【オープニング】 0:00〜1:00
| 秒（または経過時間） | 画面操作 | 話す内容 |
|----|------|---------|
| ... | ... | トークスクリプトの実際のセリフを引用しながら、画面で何をクリック・入力するかを明記 |

#### 【本編①：...】 X:XX〜Y:YY
（同様の表）

...（動画の総尺を100%カバーするまで全ブロックを記載）

#### 【クロージング】 ...
（同様の表）

### ⚠️ 収録時の注意点
- 初心者が失敗しやすいポイント、ぼかすべき情報（パスワード等）、ゆっくり見せるべきシーンなどを箇条書き
```

**重要な実装方法**：34ファイル分を1つずつEditツールで編集するのは非効率なため、Pythonの一括パッチスクリプトを `/tmp/` に書き、Bashで一括実行する方式を採用した。各エピソードの詳細フローを辞書（`FLOWS = {"01": "...", "02": "...", ...}`）にまとめ、`## 操作・画面の流れ` というマーカー文字列を探してそれ以降を新しい内容で置換する処理を行った。

### 5. PDFダウンロード機能の追加（server.py修正）
ユーザーから「1クリックでドキュメント形式でダウンロードできるようにしてください」との指示。静的サイトでサーバーサイドPDF生成ができないため、以下で対応：
- 各スクリプトページのmeta-barに「📄 PDFでダウンロード」ボタンを追加（`<button class="dl-btn" onclick="window.print()">`）
- `@media print` CSSブロックを追加：ダークテーマを印刷用に白背景・濃い文字色に変換し、ナビゲーションやボタンを `display:none` にして本文のみ印刷されるようにする
- これにより各ページで「PDFでダウンロード」→ブラウザの印刷ダイアログ→「PDFとして保存」で書き出し可能になる

### 6. GitHub登録
```bash
cd /Users/egikazuhide/claude_code_training
echo -e "__pycache__/\n*.pyc\n.DS_Store" > .gitignore
git init
git add -A
git commit -m "Initial commit: ..."
git branch -m master main
gh repo create claude-code-training --private --source=. --remote=origin --push
gh repo edit --visibility public --accept-visibility-change-consequences  # 公開化
```

### 7. Vercelへの公開
- 課題：プロジェクトルートに `index.csv` があり、`html/index.html` への明示的なルーティングがないとCSVがダウンロードされてしまう
- 解決：`vercel.json` でビルドコマンドを使い、`html/`（export_html.py生成の静的HTML）と `screens/`（モックアップ）を1つの `public/` ディレクトリにまとめてから配信
```json
{
  "version": 2,
  "buildCommand": "mkdir -p public && cp -r html/* public/ && cp -r screens public/",
  "outputDirectory": "public",
  "rewrites": [
    { "source": "/script/:num", "destination": "/script/:num.html" }
  ]
}
```
- デプロイコマンド：
```bash
npm install -g vercel
vercel login   # ブラウザでデバイス認証
cd /Users/egikazuhide/claude_code_training
vercel --yes --prod
```
- `.gitignore` に `.vercel` を追記（ユーザーが意図的に追加、Vercel CLIのローカル設定フォルダを除外）

---

## このプロンプトを使って依頼する際の指示例

新しいセッションで以下のように指示すると、同じ品質・形式で作業を継続できます：

> 「`/Users/egikazuhide/claude_code_training/` の研修動画プロジェクトを引き継ぎます。`HANDOFF_PROMPT.md` を読んで、これまでの構成・命名規則・デザインルール（Part別カラー、ダークテーマ、収録フロー表のフォーマット）を踏襲してください。今回お願いしたいのは：［ここに新しい依頼内容を記載］」

### よくある追加依頼パターンと対応方針
- **「スクリプトを追加・修正したい」** → `scripts/NN_script.md` を同フォーマットで作成・編集 → `screens/data.js` の `EPISODES` にも追記 → `export_html.py` で再生成 → git push → `vercel --yes --prod` で再デプロイ
- **「モックアップ画面を増やしたい」** → `screens/style.css` の既存クラスを再利用し、新規HTMLを `screens/` に追加。`data.js` に `special` フィールドで紐付け
- **「公開ページを直したい」** → ローカルで `python3 export_html.py` → 確認 → `git add -A && git commit && git push` → `vercel --yes --prod`
- **「印刷・PDF出力を改善したい」** → `server.py` の `render_script()` 関数内、`@media print` ブロックを編集 → `export_html.py` で再生成

---

## デプロイ・確認用コマンド集

```bash
# ローカルでビューアー確認
cd /Users/egikazuhide/claude_code_training && python3 server.py
# → http://localhost:8765

# 静的HTML再生成
cd /Users/egikazuhide/claude_code_training && python3 export_html.py

# GitHubへpush
cd /Users/egikazuhide/claude_code_training
git add -A
git commit -m "変更内容"
git push

# Vercel本番デプロイ
cd /Users/egikazuhide/claude_code_training && vercel --yes --prod
```

## 公開URL
- GitHub: https://github.com/egikazuhide/claude-code-training
- Vercel: https://claudecodetraining-eight.vercel.app
