/* ===========================================================
   Claude Code 研修動画 - 各回の収録用モックアップデータ
   claude-app.html が ?ep=NN で読み込んで表示する
   =========================================================== */
const EPISODES = {

"01": {
  title: "Claude Codeとは？ChatGPT・Copilotと何が違うか",
  goal: "Claude Codeがどんなツールで何ができるか、人に説明できる",
  part: "Part1",
  special: "compare.html"
},

"02": {
  title: "デスクトップアプリのインストールとログイン",
  goal: "自分のPCでClaude Codeが起動できる状態になる",
  part: "Part1",
  special: "install.html"
},

"03": {
  title: "画面の構成・承認ボタン・指示の送り方を理解する",
  goal: "画面の各エリアの役割を把握し、最初の指示を送れる",
  part: "Part1",
  project: "hello_project",
  branch: "main",
  fileTree: [
    { name: "hello_project", type: "dir" },
    { name: "hello.txt", type: "file", indent: 1, status: "new" },
  ],
  messages: [
    { role: "user", text: "デスクトップに hello.txt というファイルを作成して、中に「Claude Codeを学習中」と書いてください" },
    { role: "tool", icon: "📝", label: "ファイルを作成", text: "hello.txt" },
    { role: "approval", question: "このファイルを作成しますか？", code: "+ hello.txt\n+ Claude Codeを学習中" },
    { role: "assistant", text: "hello.txt を作成し、「Claude Codeを学習中」と書き込みました。デスクトップに新しいファイルができているはずです。確認してみてください。" },
  ],
},

"04": {
  title: "良い指示・悪い指示：伝わる言葉の作り方",
  goal: "曖昧な指示を具体的に書き直せる",
  part: "Part2",
  project: "memo_app",
  branch: "main",
  fileTree: [
    { name: "memo_app", type: "dir" },
    { name: "（まだ何も無い）", type: "file", indent: 1 },
  ],
  messages: [
    { role: "user", text: "アプリを作って" },
    { role: "assistant", text: "ご要望ありがとうございます。ただ、このままだとどんなアプリを作ればよいか判断できません。\n\n・どんな機能が必要ですか？\n・誰が使うアプリですか？\n・画面にはどんな情報を表示しますか？\n\nこういった点を教えていただけますか？" },
    { role: "user", text: "メモを入力して保存できるシンプルなメモ帳アプリを作ってください。\n\n・テキストエリアにメモを入力できる\n・「保存」ボタンを押すと memos.txt に追記される\n・保存したら「保存しました」と表示する" },
    { role: "tool", icon: "🛠️", label: "実装を開始", text: "src/main.py を作成しています…" },
    { role: "assistant", text: "承知しました。条件を満たすシンプルなメモ帳アプリを作成します。" },
  ],
},

"05": {
  title: "ファイルを渡して読み込ませる・複数ファイルの扱い方",
  goal: "ファイルをClaude Codeに渡して内容を元に指示できる",
  part: "Part2",
  project: "memo_app",
  branch: "main",
  fileTree: [
    { name: "memo_app", type: "dir" },
    { name: "main.py", type: "file", indent: 1 },
    { name: "sample.txt", type: "file", indent: 1, status: "new" },
  ],
  messages: [
    { role: "tool", icon: "📎", label: "ファイルが添付されました", text: "sample.txt（デスクトップからドラッグ&ドロップ）" },
    { role: "user", text: "このファイルの内容を3行で要約してください" },
    { role: "assistant", text: "sample.txt の内容を3行で要約しました。\n\n1. 今月の定例会議は来週水曜に変更\n2. 新メンバー2名が来月から参加予定\n3. 次回までに各自タスク表を更新すること" },
  ],
},

"06": {
  title: "会話を続けながら修正する：一発完成を目指さない進め方",
  goal: "複数回のやり取りでアウトプットを改善できる",
  part: "Part2",
  project: "memo_app",
  branch: "main",
  fileTree: [
    { name: "memo_app", type: "dir" },
    { name: "main.py", type: "file", indent: 1, status: "changed" },
  ],
  messages: [
    { role: "user", text: "シンプルなメモアプリの骨格を作ってください。テキストを入力して保存できれば十分です" },
    { role: "tool", icon: "📝", label: "ファイルを作成", text: "main.py" },
    { role: "assistant", text: "骨格となるメモアプリを作成しました。テキスト入力欄と「保存」ボタンがあります。起動して確認してみてください。" },
    { role: "user", text: "保存ボタンの色を青にしてください" },
    { role: "tool", icon: "✏️", label: "ファイルを編集", text: "main.py（保存ボタンのスタイルを変更）" },
    { role: "assistant", text: "保存ボタンの色を青に変更しました。再起動して見た目を確認してください。" },
  ],
},

"07": {
  title: "Gitの役割と基本：セーブデータとして使いこなす",
  goal: "変更を保存・確認・元に戻す操作ができる",
  part: "Part2",
  project: "memo_app",
  branch: "main",
  fileTree: [
    { name: "memo_app", type: "dir" },
    { name: "main.py", type: "file", indent: 1 },
    { name: ".git/", type: "file", indent: 1, status: "new" },
  ],
  messages: [
    { role: "user", text: "今の変更をGitで保存してください。「メモ帳アプリの初期版」というメッセージでコミットしてください" },
    { role: "tool", icon: "🌱", label: "Gitリポジトリを初期化", text: "git init" },
    { role: "tool", icon: "💾", label: "コミット", text: "git commit -m \"メモ帳アプリの初期版\"" },
    { role: "assistant", text: "変更を保存しました。\n\nコミット履歴：\n[main 1a2b3c4] メモ帳アプリの初期版\n 1 file changed, 24 insertions(+)\n\nこれで「ここまでの状態」がセーブされました。今後の変更で問題が起きても、このセーブ地点に戻せます。" },
  ],
},

"08": {
  title: "CLAUDE.mdの作り方：AIにプロジェクトの前提を覚えさせる",
  goal: "CLAUDE.mdを作成してプロジェクト設定をAIに読ませられる",
  part: "Part2",
  project: "memo_app",
  branch: "main",
  fileTree: [
    { name: "memo_app", type: "dir" },
    { name: "main.py", type: "file", indent: 1 },
    { name: "CLAUDE.md", type: "file", indent: 1, status: "new" },
  ],
  messages: [
    { role: "user", text: "このプロジェクトのCLAUDE.mdを作成してください。内容は以下です。\n\n・このアプリはシンプルなメモ帳アプリです\n・Pythonのtkinterで作られています\n・保存先はmemos.txtです\n・コードのコメントは日本語で書いてください" },
    { role: "tool", icon: "📝", label: "ファイルを作成", text: "CLAUDE.md" },
    { role: "approval", question: "このファイルを作成しますか？", code: "+ CLAUDE.md\n\n# プロジェクト概要\nシンプルなメモ帳アプリ（Python / tkinter）\n保存先: memos.txt\nコメントは日本語で記述する" },
    { role: "assistant", text: "CLAUDE.md を作成しました。次回からこのプロジェクトを開くと、Claude Codeは最初にこの内容を読み込んでから作業します。同じ説明を毎回する必要がなくなります。" },
  ],
},

"09": {
  title: "Wordファイル（.docx）を生成する：議事録・報告書・マニュアル",
  goal: "指示だけで書式つきWordファイルを出力できる",
  part: "Part3",
  project: "doc_tools",
  branch: "main",
  fileTree: [
    { name: "doc_tools", type: "dir" },
    { name: "議事録メモ.txt", type: "file", indent: 1 },
    { name: "generate_minutes.py", type: "file", indent: 1, status: "new" },
    { name: "output/", type: "dir", indent: 1, status: "new" },
    { name: "議事録_2026-06-10.docx", type: "file", indent: 2, status: "new" },
  ],
  messages: [
    { role: "tool", icon: "📎", label: "ファイルが添付されました", text: "議事録メモ.txt" },
    { role: "user", text: "このメモをもとに、以下の形式の議事録Wordファイルを作成してください。\n\n・タイトル「定例会議 議事録」\n・日付・参加者・議題・決定事項を見出しごとに整理\n・python-docx を使って output/ フォルダに保存" },
    { role: "approval", question: "ライブラリをインストールしますか？", code: "$ pip install python-docx" },
    { role: "tool", icon: "📄", label: "ファイルを生成", text: "output/議事録_2026-06-10.docx" },
    { role: "assistant", text: "議事録メモをもとに、書式つきのWordファイルを作成しました。\n\noutput/議事録_2026-06-10.docx\n\nタイトル・日付・参加者・議題・決定事項が見出しごとに整理されています。開いて確認してみてください。" },
  ],
},

"10": {
  title: "Excelファイル（.xlsx）を生成する：表・集計・グラフ付き資料",
  goal: "データを渡して整形されたExcelファイルを出力できる",
  part: "Part3",
  project: "doc_tools",
  branch: "main",
  fileTree: [
    { name: "doc_tools", type: "dir" },
    { name: "売上データ.csv", type: "file", indent: 1 },
    { name: "output/", type: "dir", indent: 1, status: "new" },
    { name: "売上レポート.xlsx", type: "file", indent: 2, status: "new" },
  ],
  messages: [
    { role: "tool", icon: "📎", label: "ファイルが添付されました", text: "売上データ.csv" },
    { role: "user", text: "このCSVデータをもとに、以下の仕様のExcelファイルを作成してください。\n\n・シート1：データ一覧（見出し行を太字）\n・シート2：店舗ごとの月別集計表\n・列幅を内容に合わせて自動調整\n・output/売上レポート.xlsx に保存" },
    { role: "tool", icon: "📊", label: "ファイルを生成", text: "output/売上レポート.xlsx" },
    { role: "assistant", text: "CSVデータをもとに売上レポート.xlsxを作成しました。シート1にデータ一覧、シート2に店舗別の月別集計表が入っています。" },
    { role: "user", text: "シート3として、各店舗の年間売上を比較する棒グラフを追加してください" },
    { role: "tool", icon: "📈", label: "ファイルを編集", text: "売上レポート.xlsx（シート3：グラフを追加）" },
    { role: "assistant", text: "シート3に各店舗の年間売上を比較する棒グラフを追加しました。" },
  ],
},

"11": {
  title: "PDFを生成する：見栄えを整えた配布資料を作る",
  goal: "完成度の高いPDFを指示だけで作れる",
  part: "Part3",
  project: "doc_tools",
  branch: "main",
  fileTree: [
    { name: "doc_tools", type: "dir" },
    { name: "output/", type: "dir", indent: 1, status: "new" },
    { name: "社内イベント案内.pdf", type: "file", indent: 2, status: "new" },
  ],
  messages: [
    { role: "user", text: "以下の内容で社内イベント案内のPDFを作成してください。\n\n・タイトル「社内イベント案内」\n・日時・場所・持ち物をリスト形式で記載\n・上部に色付きのヘッダー帯をつける\n・output/社内イベント案内.pdf に保存" },
    { role: "approval", question: "ライブラリをインストールしますか？", code: "$ pip install reportlab" },
    { role: "tool", icon: "📄", label: "ファイルを生成", text: "output/社内イベント案内.pdf" },
    { role: "assistant", text: "色付きヘッダー帯つきの社内イベント案内PDFを作成しました。\n\noutput/社内イベント案内.pdf\n\n日時・場所・持ち物がリスト形式で見やすく整理されています。" },
  ],
},

"12": {
  title: "既存ファイルを読み込んで内容を要約・変換・加工する",
  goal: "手元のファイルをClaude Codeに渡して別形式に変換できる",
  part: "Part3",
  project: "doc_tools",
  branch: "main",
  fileTree: [
    { name: "doc_tools", type: "dir" },
    { name: "製品仕様書.docx", type: "file", indent: 1 },
    { name: "output/", type: "dir", indent: 1, status: "new" },
    { name: "製品仕様書.xlsx", type: "file", indent: 2, status: "new" },
    { name: "要約.txt", type: "file", indent: 2, status: "new" },
  ],
  messages: [
    { role: "tool", icon: "📎", label: "ファイルが添付されました", text: "製品仕様書.docx" },
    { role: "user", text: "このWordファイルの表データをExcelに変換してください。表の内容をそのままシートに転記してください" },
    { role: "tool", icon: "📊", label: "ファイルを生成", text: "output/製品仕様書.xlsx" },
    { role: "assistant", text: "Wordファイル内の表データをExcelに変換しました。output/製品仕様書.xlsx に保存しています。" },
    { role: "user", text: "このファイルの内容を以下の形式で要約してください。\n\n・3つの見出しに分けて整理\n・各見出しにつき箇条書き2〜3点\n・output/要約.txt に保存" },
    { role: "tool", icon: "📝", label: "ファイルを生成", text: "output/要約.txt" },
    { role: "assistant", text: "指定の形式で要約を作成し、output/要約.txt に保存しました。" },
  ],
},

"13": {
  title: "スクリプトとは何か：「命令書」を作って繰り返し作業をなくす",
  goal: "スクリプトの概念を理解し使い道を説明できる",
  part: "Part4",
  project: "scripts_lab",
  branch: "main",
  fileTree: [
    { name: "scripts_lab", type: "dir" },
    { name: "（これから作成）", type: "file", indent: 1 },
  ],
  messages: [
    { role: "user", text: "スクリプトとは何か、毎回手作業でやっている繰り返し作業を自動化するイメージで説明してください" },
    { role: "assistant", text: "スクリプトとは「パソコンへの命令書」です。\n\n例えば「フォルダ内の画像ファイルだけを別フォルダに移動する」という作業を毎回手でやるのは大変ですが、その手順を1つのファイル（スクリプト）に書いておけば、実行するたびに同じ手順を自動で繰り返してくれます。\n\nこの講座では、ファイル整理・データ集計・ダブルクリック実行の3つを題材に、スクリプトの作り方を学びます。" },
  ],
},

"14": {
  title: "ファイルの一括リネーム・整理スクリプトを作る",
  goal: "フォルダ内のファイルをルール通りに自動整理できる",
  part: "Part4",
  project: "file_organizer",
  branch: "main",
  fileTree: [
    { name: "file_organizer", type: "dir" },
    { name: "organize.py", type: "file", indent: 1, status: "new" },
    { name: "test_folder/", type: "dir", indent: 1 },
    { name: "画像/", type: "dir", indent: 2, status: "new" },
    { name: "書類/", type: "dir", indent: 2, status: "new" },
    { name: "その他/", type: "dir", indent: 2, status: "new" },
  ],
  messages: [
    { role: "user", text: "以下の仕様でファイル整理スクリプトを作成してください。\n\n・対象フォルダ内のファイルを拡張子ごとに分類する\n・画像（jpg, png, gif）→「画像」フォルダ\n・文書（docx, xlsx, pdf）→「書類」フォルダ\n・それ以外→「その他」フォルダ\n・分類先フォルダが無ければ自動で作成する" },
    { role: "tool", icon: "📝", label: "ファイルを作成", text: "organize.py" },
    { role: "assistant", text: "ファイル整理スクリプト organize.py を作成しました。" },
    { role: "user", text: "デスクトップの test_folder を整理してください。このスクリプトを使って実行してください" },
    { role: "tool", icon: "▶️", label: "スクリプトを実行", text: "python organize.py ~/Desktop/test_folder" },
    { role: "assistant", text: "test_folder 内のファイルを「画像」「書類」「その他」フォルダに自動で振り分けました。10個のファイルが整理されました。" },
  ],
},

"15": {
  title: "CSVデータの集計・加工スクリプトを作る",
  goal: "データファイルを読み込んで集計結果を出力できる",
  part: "Part4",
  project: "file_organizer",
  branch: "main",
  fileTree: [
    { name: "file_organizer", type: "dir" },
    { name: "aggregate_sales.py", type: "file", indent: 1, status: "new" },
    { name: "月次売上_202506.csv", type: "file", indent: 1 },
    { name: "集計結果.xlsx", type: "file", indent: 1, status: "new" },
  ],
  messages: [
    { role: "user", text: "以下の仕様でCSV集計スクリプトを作成してください。\n\n・CSVファイルを読み込み、店舗別・月別に売上を集計する\n・集計結果をExcelファイルとして出力する\n・実行時にCSVファイルのパスを指定できるようにする" },
    { role: "tool", icon: "📝", label: "ファイルを作成", text: "aggregate_sales.py" },
    { role: "assistant", text: "CSV集計スクリプト aggregate_sales.py を作成しました。" },
    { role: "user", text: "サンプルCSVファイルを使ってこのスクリプトを実行してください" },
    { role: "tool", icon: "▶️", label: "スクリプトを実行", text: "python aggregate_sales.py 月次売上_202506.csv" },
    { role: "assistant", text: "月次売上_202506.csv を集計し、集計結果.xlsx を出力しました。店舗別・月別の売上が一覧表になっています。" },
  ],
},

"16": {
  title: "スクリプトをダブルクリックで実行できるようにする",
  goal: "作ったスクリプトをコマンドなしで手軽に使える",
  part: "Part4",
  project: "file_organizer",
  branch: "main",
  fileTree: [
    { name: "file_organizer", type: "dir" },
    { name: "aggregate_sales.py", type: "file", indent: 1 },
    { name: "run_aggregate.command", type: "file", indent: 1, status: "new" },
    { name: "run_aggregate.bat", type: "file", indent: 1, status: "new" },
  ],
  messages: [
    { role: "user", text: "CSVファイルを選択するダイアログを表示して、選択されたファイルを aggregate_sales.py で処理するスクリプトをMac用に作成してください。\n\n・ダブルクリックで実行できる .command ファイルにする" },
    { role: "tool", icon: "📝", label: "ファイルを作成", text: "run_aggregate.command" },
    { role: "assistant", text: "run_aggregate.command を作成しました。ダブルクリックするとファイル選択ダイアログが開き、選んだCSVを自動で集計します。" },
    { role: "user", text: "CSVファイルを選択して処理するWindowsのバッチファイルを作成してください" },
    { role: "tool", icon: "📝", label: "ファイルを作成", text: "run_aggregate.bat" },
    { role: "assistant", text: "run_aggregate.bat を作成しました。Windowsでもダブルクリックだけでファイル選択→集計が実行できます。" },
  ],
},

"17": {
  title: "HTMLファイルを生成する：ブラウザで開けるページを作る",
  goal: "ブラウザで表示できる簡単なページを出力できる",
  part: "Part5",
  project: "web_pages",
  branch: "main",
  fileTree: [
    { name: "web_pages", type: "dir" },
    { name: "index.html", type: "file", indent: 1, status: "new" },
  ],
  messages: [
    { role: "user", text: "以下の内容のHTMLページを作成してください。\n\n・タイトル「自己紹介ページ」\n・名前・趣味・最近学んでいることを見出しごとに表示\n・シンプルな配色で読みやすく\n・index.html として保存" },
    { role: "tool", icon: "🌐", label: "ファイルを作成", text: "index.html" },
    { role: "assistant", text: "index.html を作成しました。ブラウザで開いて見た目を確認してみましょう。" },
    { role: "tool", icon: "🔍", label: "ブラウザでプレビュー", text: "index.html を開いています…" },
  ],
},

"18": {
  title: "見栄えのするランディングページを作る",
  goal: "デザインの整ったWebページを指示だけで作れる",
  part: "Part5",
  project: "web_pages",
  branch: "main",
  fileTree: [
    { name: "web_pages", type: "dir" },
    { name: "landing.html", type: "file", indent: 1, status: "new" },
  ],
  messages: [
    { role: "user", text: "「マニュアル自動生成アプリ」のランディングページをHTMLで作成してください。\n\n・ヒーローセクション（キャッチコピー＋ボタン）\n・特徴を3つ紹介するセクション\n・利用の流れを3ステップで紹介するセクション\n・フッター\n・landing.html として保存" },
    { role: "tool", icon: "🌐", label: "ファイルを作成", text: "landing.html" },
    { role: "assistant", text: "ランディングページ landing.html を作成しました。ブラウザで確認してみてください。" },
    { role: "user", text: "ヒーローセクションの背景に薄いグラデーション（白→薄い青）を追加してください" },
    { role: "tool", icon: "✏️", label: "ファイルを編集", text: "landing.html（背景グラデーションを追加）" },
    { role: "assistant", text: "ヒーローセクションの背景に白から薄い青へのグラデーションを追加しました。" },
  ],
},

"19": {
  title: "社内向け静的サイトをフォルダごと生成する",
  goal: "複数ページのWebサイトをまとめて生成できる",
  part: "Part5",
  project: "web_pages",
  branch: "main",
  fileTree: [
    { name: "web_pages", type: "dir" },
    { name: "site/", type: "dir", indent: 1, status: "new" },
    { name: "index.html", type: "file", indent: 2, status: "new" },
    { name: "about.html", type: "file", indent: 2, status: "new" },
    { name: "manual.html", type: "file", indent: 2, status: "new" },
    { name: "links.html", type: "file", indent: 2, status: "new" },
  ],
  messages: [
    { role: "user", text: "以下の構成で社内システムのマニュアルサイトをHTMLで作成してください。\n\n・トップページ（index.html）：各ページへのリンク一覧\n・このシステムについて（about.html）\n・使い方マニュアル（manual.html）\n・社内リンク集（links.html）\n・全ページ共通のヘッダー・ナビゲーションをつける\n・site/ フォルダにまとめて保存" },
    { role: "tool", icon: "📁", label: "フォルダを作成", text: "site/" },
    { role: "tool", icon: "🌐", label: "ファイルを作成", text: "site/index.html, site/about.html, site/manual.html, site/links.html" },
    { role: "assistant", text: "4ページ構成の社内サイトを site/ フォルダにまとめて作成しました。すべてのページに共通のヘッダー・ナビゲーションがついています。index.html を開いて、各ページへのリンクを確認してみてください。" },
  ],
},

"20": {
  title: "生成したWebページをローカルで確認・修正する",
  goal: "ブラウザで見ながらデザインを調整できる",
  part: "Part5",
  project: "web_pages",
  branch: "main",
  fileTree: [
    { name: "web_pages", type: "dir" },
    { name: "site/", type: "dir", indent: 1 },
    { name: "index.html", type: "file", indent: 2, status: "changed" },
  ],
  messages: [
    { role: "user", text: "各セクションの上下の余白が狭く感じます。セクション間の余白を現在の2倍にしてください" },
    { role: "tool", icon: "✏️", label: "ファイルを編集", text: "site/index.html（セクション間の余白を調整）" },
    { role: "assistant", text: "セクション間の余白を2倍に広げました。リロードして確認してください。" },
    { role: "user", text: "ヘッダーの背景色を現在の濃紺から少し明るい青（#2563EB）に変更して、白い下線を追加してください" },
    { role: "tool", icon: "✏️", label: "ファイルを編集", text: "site/index.html（ヘッダーの配色を変更）" },
    { role: "assistant", text: "ヘッダーの背景色を #2563EB に変更し、白い下線を追加しました。" },
    { role: "user", text: "Chromeのデベロッパーツールでスマートフォン表示の確認をして、モバイルでの表示に問題があれば修正してください" },
    { role: "tool", icon: "📱", label: "レスポンシブ確認", text: "デベロッパーツール（モバイル表示）で確認中…" },
    { role: "assistant", text: "モバイル表示でナビゲーションメニューがはみ出していたため、スマートフォン幅では縦並びになるよう修正しました。" },
  ],
},

"21": {
  title: "今回作るアプリの全体像：動画→画像つきマニュアル生成の仕組み",
  goal: "アプリの完成形と処理の流れを図で説明できる",
  part: "Part6",
  special: "overview.html"
},

"22": {
  title: "アプリの設計をClaude Codeと一緒に言語化する",
  goal: "「何が必要か」をリストアップした設計メモを作れる",
  part: "Part6",
  project: "manual_creator",
  branch: "main",
  fileTree: [
    { name: "manual_creator", type: "dir" },
    { name: "DESIGN.md", type: "file", indent: 1, status: "new" },
  ],
  messages: [
    { role: "user", text: "動画ファイルを読み込んで、画像つきのステップマニュアルを自動生成するデスクトップアプリを作りたいです。必要な画面・機能・処理の流れを設計メモとしてリストアップしてください" },
    { role: "assistant", text: "設計メモの案を作成しました。\n\n■ 必要な画面\n1. ファイルドロップ画面\n2. 処理中画面（プログレスバー）\n3. プレビュー画面（編集・削除・並び替え）\n\n■ 必要な機能\n・動画から一定間隔で画像を切り出す（ffmpeg）\n・画像をAIに渡して説明文を生成する（Claude API）\n・Word/PDF形式で出力する\n\n■ 処理の流れ\n動画読み込み → 画像切り出し → AI説明文生成 → プレビュー表示 → 編集 → ファイル出力" },
    { role: "user", text: "設定画面に「切り出し間隔を秒単位で指定できる」機能を追加してください" },
    { role: "assistant", text: "設計メモに「切り出し間隔（秒）をユーザーが指定できる設定項目」を追加しました。" },
    { role: "user", text: "この設計メモを DESIGN.md というファイルに保存してください" },
    { role: "tool", icon: "📝", label: "ファイルを作成", text: "DESIGN.md" },
    { role: "assistant", text: "設計メモを DESIGN.md として保存しました。これがこの先の開発の土台になります。" },
  ],
},

"23": {
  title: "動画から画像を切り出す仕組みを理解する（ffmpeg入門）",
  goal: "ffmpegが何者かを理解しClaude Codeに導入させられる",
  part: "Part6",
  project: "manual_creator",
  branch: "main",
  fileTree: [
    { name: "manual_creator", type: "dir" },
    { name: "DESIGN.md", type: "file", indent: 1 },
  ],
  messages: [
    { role: "user", text: "ffmpegをこのパソコンにインストールしてください。Macの場合はHomebrewを使ったインストール方法で進めてください" },
    { role: "approval", question: "以下のコマンドを実行しますか？", code: "$ brew install ffmpeg" },
    { role: "tool", icon: "⚙️", label: "コマンドを実行", text: "brew install ffmpeg（インストール中…）" },
    { role: "user", text: "ffmpegが正しくインストールされているか確認してください" },
    { role: "approval", question: "以下のコマンドを実行しますか？", code: "$ ffmpeg -version" },
    { role: "assistant", text: "ffmpeg version 6.1.1 が正しくインストールされていることを確認しました。これで動画から画像を切り出す準備が整いました。" },
  ],
},

"24": {
  title: "AIに画像を渡して説明文を生成させる仕組みを理解する",
  goal: "画像→テキスト生成の処理フローを説明できる",
  part: "Part6",
  project: "manual_creator",
  branch: "main",
  fileTree: [
    { name: "manual_creator", type: "dir" },
    { name: "temp/", type: "dir", indent: 1, status: "new" },
    { name: "frame_003.png", type: "file", indent: 2, status: "new" },
  ],
  messages: [
    { role: "user", text: "この画面で何をしている操作か、1〜2文で説明してください。操作の主語は「ユーザーが」として書いてください" },
    { role: "tool", icon: "🖼️", label: "画像を解析中", text: "temp/frame_003.png（Claude APIに送信）" },
    { role: "assistant", text: "「ユーザーが画面左上の『ファイル』メニューをクリックして、ドロップダウンメニューを開いています。」\n\nこのように、画像をAPIに渡すと内容を理解して自然な説明文を生成してくれます。動画から切り出した各フレーム画像にこの処理を行うことで、ステップごとの説明文を自動生成できます。" },
  ],
},

"25": {
  title: "プロジェクト作成：フォルダ構成と土台コードを作ってもらう",
  goal: "アプリのフォルダ構成が生成されエディタで確認できる",
  part: "Part7",
  project: "manual_creator",
  branch: "main",
  fileTree: [
    { name: "manual_creator", type: "dir" },
    { name: "src/", type: "dir", indent: 1, status: "new" },
    { name: "main.py", type: "file", indent: 2, status: "new" },
    { name: "extractor.py", type: "file", indent: 2, status: "new" },
    { name: "generator.py", type: "file", indent: 2, status: "new" },
    { name: "exporter.py", type: "file", indent: 2, status: "new" },
    { name: "requirements.txt", type: "file", indent: 1, status: "new" },
    { name: "README.md", type: "file", indent: 1, status: "new" },
    { name: "DESIGN.md", type: "file", indent: 1 },
  ],
  messages: [
    { role: "user", text: "以下の仕様でマニュアル自動生成アプリのプロジェクトを作成してください。\n\n・src/ フォルダにmain.py（起動ファイル）, extractor.py（画像切り出し）, generator.py（説明文生成）, exporter.py（出力）を作成\n・requirements.txt に必要なライブラリを記載\n・README.md にアプリの概要を記載\n・DESIGN.md の内容を踏まえて土台を作成すること" },
    { role: "tool", icon: "📁", label: "フォルダを作成", text: "src/" },
    { role: "tool", icon: "📝", label: "ファイルを作成", text: "src/main.py, src/extractor.py, src/generator.py, src/exporter.py, requirements.txt, README.md" },
    { role: "approval", question: "これらのファイルを作成しますか？", code: "+ src/main.py\n+ src/extractor.py\n+ src/generator.py\n+ src/exporter.py\n+ requirements.txt\n+ README.md" },
    { role: "assistant", text: "プロジェクトの土台を作成しました。左のファイルツリーから src/main.py をクリックすると、起動用の雛形コードが確認できます。次回からこの土台に少しずつ機能を追加していきます。" },
  ],
},

"26": {
  title: "ファイルをドロップして読み込む画面を作る",
  goal: "動画ファイルをアプリにドラッグ&ドロップして読み込める",
  part: "Part7",
  project: "manual_creator",
  branch: "main",
  fileTree: [
    { name: "manual_creator", type: "dir" },
    { name: "src/", type: "dir" },
    { name: "main.py", type: "file", indent: 2, status: "changed" },
    { name: "extractor.py", type: "file", indent: 2 },
    { name: "generator.py", type: "file", indent: 2 },
    { name: "exporter.py", type: "file", indent: 2 },
  ],
  messages: [
    { role: "user", text: "src/main.py に以下の画面を実装してください。\n\n・画面中央に大きなドロップ領域を作る\n・破線の枠で囲み「ここに動画をドロップ」というテキストを表示\n・動画ファイル（mp4）をドラッグ&ドロップすると、ファイル名が画面に表示される" },
    { role: "tool", icon: "✏️", label: "ファイルを編集", text: "src/main.py（ドロップ画面を実装）" },
    { role: "approval", question: "この変更を適用しますか？", code: "src/main.py を編集\n+ ドラッグ&ドロップ領域\n+ ファイル名表示ラベル" },
    { role: "user", text: "アプリを起動して動作確認してください" },
    { role: "tool", icon: "▶️", label: "アプリを起動", text: "python src/main.py" },
    { role: "assistant", text: "アプリが起動し、破線のドロップ領域に「ここに動画をドロップ」と表示されています。test.mp4 をドロップすると、ファイル名が画面に表示されました。動作に問題ありません。" },
    { role: "user", text: "ドロップゾーン内のテキストのフォントサイズを16ptに拡大してください。またドロップゾーンの枠を点線から破線に変更してください" },
    { role: "tool", icon: "✏️", label: "ファイルを編集", text: "src/main.py（スタイルを微調整）" },
    { role: "assistant", text: "テキストのフォントサイズを16ptに拡大し、枠線を破線に変更しました。" },
  ],
},

"27": {
  title: "動画から画像を切り出し・AIで説明文を生成する",
  goal: "動画を入力するとステップごとの画像と説明文が生成される",
  part: "Part7",
  project: "manual_creator",
  branch: "main",
  fileTree: [
    { name: "manual_creator", type: "dir" },
    { name: "src/", type: "dir" },
    { name: "main.py", type: "file", indent: 2 },
    { name: "extractor.py", type: "file", indent: 2, status: "changed" },
    { name: "generator.py", type: "file", indent: 2, status: "changed" },
    { name: ".env", type: "file", indent: 1, status: "new" },
    { name: "temp/", type: "dir", indent: 1, status: "new" },
  ],
  messages: [
    { role: "user", text: "src/extractor.py に以下の処理を実装してください。\n\n・ffmpegを使って動画から一定間隔（デフォルト10秒）で画像を切り出す\n・切り出した画像は temp/ フォルダに連番で保存する\n・extract_frames(video_path, interval) 関数として実装する" },
    { role: "tool", icon: "✏️", label: "ファイルを編集", text: "src/extractor.py（extract_frames関数を実装）" },
    { role: "user", text: "テスト用の短い動画ファイルを使って extract_frames 関数の動作確認をしてください。テスト用の動画はデスクトップの test.mp4 を使ってください" },
    { role: "tool", icon: "▶️", label: "テスト実行", text: "extract_frames('~/Desktop/test.mp4', 10) → temp/ に画像5枚を出力" },
    { role: "assistant", text: "test.mp4 から10秒ごとに画像を切り出し、temp/ フォルダに5枚保存できました。" },
    { role: "user", text: "Claude APIのAPIキーを使えるように設定してください。APIキーは環境変数 CLAUDE_API_KEY に設定する方式にしてください。セキュリティのためハードコードしないでください" },
    { role: "tool", icon: "🔑", label: "ファイルを作成", text: ".env（CLAUDE_API_KEYを設定）" },
    { role: "user", text: "src/generator.py に以下の処理を実装してください。\n\n・temp/ フォルダ内の各画像をClaude APIに送信する\n・AIへの指示文（プロンプト）：「この画面でユーザーが何をしているか、操作の主語を『ユーザーが』として1〜2文で説明してください」\n・画像と説明文のペアをリストとして返す" },
    { role: "tool", icon: "✏️", label: "ファイルを編集", text: "src/generator.py（generate_descriptions関数を実装）" },
    { role: "assistant", text: "画像切り出しとAI説明文生成の処理が実装できました。temp/フォルダの5枚の画像それぞれに対して説明文が生成されています。" },
  ],
},

"28": {
  title: "画像と説明文をステップ形式に並べて表示する",
  goal: "画像と説明文がStep1・Step2・Step3と順番に並んで見える",
  part: "Part7",
  project: "manual_creator",
  branch: "main",
  fileTree: [
    { name: "manual_creator", type: "dir" },
    { name: "src/", type: "dir" },
    { name: "main.py", type: "file", indent: 2, status: "changed" },
    { name: "extractor.py", type: "file", indent: 2 },
    { name: "generator.py", type: "file", indent: 2 },
  ],
  messages: [
    { role: "user", text: "src/main.py にマニュアルプレビュー画面を追加してください。\n\n・左エリア（幅200px）：ステップ一覧パネル。Step1, Step2...と表示し、クリックで右エリアが切り替わる\n・右エリア：選択したステップの画像（最大幅500px）と説明文（編集可能なテキストボックス）を表示\n・データは {image_path, description} のリストとして受け取る\n・右下に「Word出力」「PDF出力」ボタンを配置（クリック時は「準備中」と表示）" },
    { role: "tool", icon: "✏️", label: "ファイルを編集", text: "src/main.py（プレビュー画面を実装）" },
    { role: "user", text: "テスト用のstepsデータを作ってプレビュー画面の動作確認をしてください。画像はtemp/フォルダにある切り出し画像を使ってください" },
    { role: "tool", icon: "▶️", label: "アプリを起動", text: "python src/main.py（テストデータでプレビュー表示）" },
    { role: "assistant", text: "プレビュー画面が表示されました。左側にStep1〜Step5の一覧、右側に選択したステップの画像と説明文が表示されています。Step2をクリックすると右側の表示が切り替わることを確認しました。" },
    { role: "user", text: "今の変更をGitで保存してください。「プレビュー画面の実装完了」というメッセージでコミットしてください" },
    { role: "tool", icon: "💾", label: "コミット", text: "git commit -m \"プレビュー画面の実装完了\"" },
  ],
},

"29": {
  title: "編集・削除・並び替え機能を追加する",
  goal: "生成されたステップを自由に整理・修正できる",
  part: "Part7",
  project: "manual_creator",
  branch: "main",
  fileTree: [
    { name: "manual_creator", type: "dir" },
    { name: "src/", type: "dir" },
    { name: "main.py", type: "file", indent: 2, status: "changed" },
    { name: "extractor.py", type: "file", indent: 2 },
    { name: "generator.py", type: "file", indent: 2 },
  ],
  messages: [
    { role: "user", text: "src/main.py のプレビュー画面に以下の機能を追加してください。\n\n機能1：説明文の編集保存\n・右エリアに「変更を保存」ボタンを追加し、編集内容を一覧にも反映する\n\n機能2：ステップの削除\n・各ステップに「削除」ボタンを追加。確認ダイアログでOKを押すと一覧から削除\n\n機能3：ステップの並び替え\n・各ステップに「↑」「↓」ボタンを追加し、順番を入れ替えられるようにする" },
    { role: "tool", icon: "✏️", label: "ファイルを編集", text: "src/main.py（編集・削除・並び替え機能を実装）" },
    { role: "tool", icon: "▶️", label: "動作確認", text: "編集→保存／Step3を削除／Step2を↑で移動" },
    { role: "assistant", text: "3つの機能をすべて実装し、動作確認できました。\n\n・説明文を編集して「変更を保存」を押すと一覧にも反映されました\n・Step3の「削除」ボタンで確認ダイアログが表示され、OKで削除されました\n・Step2の「↑」でStep1と順番が入れ替わりました" },
    { role: "user", text: "今の変更をGitで保存してください。「編集・削除・並び替え機能の追加完了」というメッセージでコミットしてください" },
    { role: "tool", icon: "💾", label: "コミット", text: "git commit -m \"編集・削除・並び替え機能の追加完了\"" },
  ],
},

"30": {
  title: "Word・PDF出力機能を追加して完成させる",
  goal: "マニュアルをファイルとして保存・配布できる",
  part: "Part7",
  project: "manual_creator",
  branch: "main",
  fileTree: [
    { name: "manual_creator", type: "dir" },
    { name: "src/", type: "dir" },
    { name: "exporter.py", type: "file", indent: 2, status: "changed" },
    { name: "output/", type: "dir", indent: 1, status: "new" },
    { name: "manual_20260610.docx", type: "file", indent: 2, status: "new" },
    { name: "manual_20260610.pdf", type: "file", indent: 2, status: "new" },
  ],
  messages: [
    { role: "user", text: "Word出力機能を実装してください。\n\n・python-docx を使用\n・タイトル「操作マニュアル」を先頭に表示\n・各ステップを「Step 1：」のように番号つきで表示し、画像（幅12cm）と説明文を並べる\n・output/manual_日時.docx として保存し、保存後にメッセージを表示" },
    { role: "tool", icon: "✏️", label: "ファイルを編集", text: "src/exporter.py（export_to_word関数を実装）" },
    { role: "tool", icon: "📄", label: "ファイルを生成", text: "output/manual_20260610.docx" },
    { role: "assistant", text: "Word出力機能を実装しました。「Word出力」ボタンを押すと output/manual_20260610.docx が生成されます。開いて確認すると、タイトル・ステップ番号・画像・説明文が整然と並んでいます。" },
    { role: "user", text: "PDF出力機能を実装してください。Word出力と同じレイアウトで output/manual_日時.pdf として保存してください" },
    { role: "tool", icon: "✏️", label: "ファイルを編集", text: "src/exporter.py（export_to_pdf関数を実装）" },
    { role: "tool", icon: "📄", label: "ファイルを生成", text: "output/manual_20260610.pdf" },
    { role: "assistant", text: "PDF出力機能も実装しました。Wordと同じレイアウトでPDFが出力されています。" },
    { role: "user", text: "今の変更をGitで保存してください。「アプリの全機能実装完了・通しテスト確認済み」というメッセージでコミットしてください" },
    { role: "tool", icon: "💾", label: "コミット", text: "git commit -m \"アプリの全機能実装完了・通しテスト確認済み\"" },
  ],
},

"31": {
  title: "エラーが出たときの対処法：エラー文をそのまま渡して直す",
  goal: "エラーに遭遇しても自力でClaude Codeに修正させられる",
  part: "Part8",
  project: "manual_creator",
  branch: "main",
  fileTree: [
    { name: "manual_creator", type: "dir" },
    { name: "requirements.txt", type: "file", indent: 1, status: "changed" },
    { name: "src/", type: "dir" },
  ],
  messages: [
    { role: "tool", icon: "🔴", label: "エラーが発生しました", text: "python src/main.py を実行" },
    { role: "tool", icon: "🖥️", label: "出力ログ", text: "Traceback (most recent call last):\n  File \"src/main.py\", line 4, in <module>\n    import docx\nModuleNotFoundError: No module named 'docx'" },
    { role: "user", text: "以下のエラーが出ました。原因を教えてそのまま修正してください。\n\nModuleNotFoundError: No module named 'docx'" },
    { role: "assistant", text: "このエラーは「docxというモジュール（ライブラリ）が見つかりません」という意味です。python-docx がインストールされていないことが原因です。インストールして解決します。" },
    { role: "approval", question: "ライブラリをインストールしますか？", code: "$ pip install python-docx" },
    { role: "tool", icon: "▶️", label: "再実行", text: "python src/main.py" },
    { role: "assistant", text: "python-docx をインストールし、再度実行したところエラーは解消されました。アプリが正常に起動しています。" },
  ],
},

"32": {
  title: "実際の動画で通しテストをして動作確認する",
  goal: "手元の動画を使ってマニュアルが生成されることを確認できる",
  part: "Part8",
  project: "manual_creator",
  branch: "main",
  fileTree: [
    { name: "manual_creator", type: "dir" },
    { name: "temp/", type: "dir", indent: 1 },
    { name: "output/", type: "dir", indent: 1 },
    { name: "manual_20260610.docx", type: "file", indent: 2, status: "new" },
  ],
  messages: [
    { role: "tool", icon: "▶️", label: "アプリを起動", text: "python src/main.py" },
    { role: "tool", icon: "📥", label: "Step 1：ファイルをドロップ", text: "操作録画.mp4 をドロップゾーンにドラッグ&ドロップ" },
    { role: "tool", icon: "⚙️", label: "Step 2：処理開始", text: "「処理開始」をクリック → ffmpegで画像切り出し中 → Claude APIで説明文生成中…" },
    { role: "tool", icon: "👀", label: "Step 3：プレビュー確認", text: "Step1〜Step6が表示。一部の説明文を手動で修正、不要なステップを1つ削除" },
    { role: "tool", icon: "📄", label: "Step 4：Word出力", text: "「Word出力」をクリック → output/manual_20260610.docx を生成" },
    { role: "assistant", text: "通しテストが完了しました。\n\n✅ ステップ番号：正しく振られている\n✅ 画像：鮮明に表示されている\n✅ 説明文：おおむね正確（一部手動修正済み）\n✅ レイアウト：画像と説明文が整然と並んでいる\n\n合格点のマニュアルが生成できました。" },
  ],
},

"33": {
  title: "他のPCでも動く形にパッケージ化して配布する",
  goal: "同僚や家族のPCにインストールできる配布ファイルを作れる",
  part: "Part8",
  project: "manual_creator",
  branch: "main",
  fileTree: [
    { name: "manual_creator", type: "dir" },
    { name: "src/", type: "dir" },
    { name: "dist/", type: "dir", indent: 1, status: "new" },
    { name: "ManualCreator.app", type: "file", indent: 2, status: "new" },
    { name: "ManualCreator.exe", type: "file", indent: 2, status: "new" },
  ],
  messages: [
    { role: "user", text: "マニュアル自動生成アプリをMac用のアプリ（.app形式）にパッケージ化してください。\n\n・PyInstallerを使う\n・アプリ名：ManualCreator\n・パッケージ化が完了したらdist/フォルダに出力し、動作確認もしてください" },
    { role: "approval", question: "ライブラリをインストールしますか？", code: "$ pip install pyinstaller" },
    { role: "tool", icon: "📦", label: "パッケージ化を実行", text: "pyinstaller --windowed --name ManualCreator src/main.py" },
    { role: "tool", icon: "▶️", label: "動作確認", text: "dist/ManualCreator.app をダブルクリックして起動確認" },
    { role: "assistant", text: "dist/フォルダに ManualCreator.app が生成されました。ダブルクリックでアプリが起動することを確認しました。" },
    { role: "user", text: "マニュアル自動生成アプリをWindows用のexeファイルにパッケージ化してください。ダブルクリックで起動できる単一のexeファイルとして dist/ フォルダに出力してください" },
    { role: "tool", icon: "📦", label: "パッケージ化を実行（Windows）", text: "pyinstaller --onefile --windowed --name ManualCreator src/main.py" },
    { role: "assistant", text: "dist/フォルダに ManualCreator.exe が生成されました。このファイルをUSBメモリやクラウドストレージで共有すれば、他のWindows PCでも動かせます。" },
  ],
},

"34": {
  title: "次のアプリへ：学んだことを活かしたアイデアの広げ方",
  goal: "次に作りたいものの設計メモをClaude Codeと作れる",
  part: "Part9",
  special: "roadmap.html"
},

};
