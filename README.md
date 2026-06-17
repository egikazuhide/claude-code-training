# Claude Code 研修動画 スクリプト・収録画面ビューアー

プログラミング未経験からデスクトップアプリ作成までを学ぶ、Claude Code 研修動画（全34回 / 9 Parts）の台本と収録用モックアップ画面を閲覧できるサイトです。

## 構成

| パス | 内容 |
| --- | --- |
| `index.csv` | 全動画のメタデータ（回数・タイトル・尺・ゴール等） |
| `scripts/NN_script.md` | 各回の台本（Markdown） |
| `screens/` | 収録用モックアップ画面（Claude Codeアプリ画面・概念図） |
| `server.py` | ローカル閲覧用サーバー |
| `export_html.py` | 公開用の静的サイトを `docs/` に生成 |
| `docs/` | 公開用にビルド済みの静的サイト（GitHub Pages 配信元） |

## ローカルで見る

```bash
python3 server.py
# → http://localhost:8765 を開く
```

## 他者に公開する（GitHub Pages）

このサイトは静的HTMLとして書き出され、GitHub Pages でそのまま公開できます。
台本（`scripts/`）や `index.csv` を更新したら、まずビルドし直します。

```bash
python3 export_html.py   # docs/ を再生成
git add docs && git commit -m "サイトを更新" && git push
```

公開方法は2通りあります。どちらか一方を有効にすれば、リポジトリにアクセスできない人でもURLだけでページを閲覧できます。

### 方法A: GitHub Actions（推奨・自動）

`.github/workflows/deploy-pages.yml` が用意されています。`main` に push すると自動でビルド・公開されます。

1. リポジトリの **Settings → Pages** を開く
2. **Build and deployment → Source** を **GitHub Actions** に設定
3. `main` に push（または Actions タブから手動実行）すると公開される

### 方法B: ブランチから配信（手動）

ビルド済みの `docs/` をそのまま配信します。

1. リポジトリの **Settings → Pages** を開く
2. **Source** を **Deploy from a branch** にする
3. Branch を **main**、フォルダを **/docs** に設定して保存

公開URLは `https://<ユーザー名>.github.io/<リポジトリ名>/` の形式になります。
