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
  title: "今回作る2つのアプリの全体像：名刺管理アプリ＆現場日報報告アプリ",
  goal: "2つのアプリの完成形と使う技術構成を説明できる",
  part: "Part6",
  special: "overview.html"
},

"22": {
  title: "GitHubでコードを管理する：チーム開発の土台を作る",
  goal: "GitHubリポジトリを作成しClaude Codeと連携してpushできる",
  part: "Part6",
  project: "business-card-app",
  branch: "main",
  fileTree: [
    { name: "business-card-app", type: "dir" },
    { name: "README.md", type: "file", indent: 1 },
  ],
  messages: [
    { role: "user", text: "GitHubにbusiness-card-appという名前のプライベートリポジトリを作成して、このプロジェクトをpushしてください" },
    { role: "tool", icon: "🐙", label: "GitHub操作", text: "リポジトリ作成 → git push" },
    { role: "approval", question: "GitHubにリポジトリを作成しpushしますか？", code: "gh repo create business-card-app --private\ngit push -u origin main" },
    { role: "assistant", text: "GitHubにプライベートリポジトリを作成し、プロジェクトをpushしました。GitHub上でファイルが反映されているか確認してみてください。" },
  ],
},

"23": {
  title: "Supabase入門：データベースと認証の基礎",
  goal: "Supabaseでプロジェクトを作りテーブルと認証を理解する",
  part: "Part6",
  project: "business-card-app",
  branch: "main",
  fileTree: [
    { name: "business-card-app", type: "dir" },
    { name: "README.md", type: "file", indent: 1 },
  ],
  messages: [
    { role: "user", text: "Supabaseとは何か初心者向けに教えてください" },
    { role: "assistant", text: "Supabaseはデータベース・認証・ファイル保存（ストレージ）をまとめて提供するサービスです。ダッシュボードからテーブルの作成やユーザー管理ができ、Next.jsなどのアプリから簡単に接続できます。" },
  ],
},

"24": {
  title: "Vercelとは：公開の仕組みとNext.jsの基礎",
  goal: "Next.jsプロジェクトを作ってVercelに最初の公開ができる",
  part: "Part6",
  project: "nextjs-demo",
  branch: "main",
  fileTree: [
    { name: "nextjs-demo", type: "dir" },
    { name: "app", type: "dir", indent: 1 },
    { name: "page.tsx", type: "file", indent: 2, status: "new" },
    { name: "package.json", type: "file", indent: 1 },
  ],
  messages: [
    { role: "user", text: "Next.jsの新しいプロジェクトを作ってください。TypeScriptとTailwind CSSを使う設定でお願いします" },
    { role: "tool", icon: "⚙️", label: "プロジェクト生成", text: "create-next-app 実行中..." },
    { role: "approval", question: "Next.jsプロジェクトを作成しますか？", code: "npx create-next-app@latest nextjs-demo --typescript --tailwind" },
    { role: "assistant", text: "Next.jsプロジェクトを作成しました。npm run dev で開発サーバーを起動し、http://localhost:3000 を開いてみてください。" },
  ],
},

"25": {
  title: "設計とプロジェクトの土台作り（名刺管理アプリ）",
  goal: "名刺管理アプリの設計メモとSupabase接続済みの土台ができる",
  part: "Part7",
  project: "business-card-app",
  branch: "main",
  fileTree: [
    { name: "business-card-app", type: "dir" },
    { name: "design.md", type: "file", indent: 1, status: "new" },
    { name: ".env.local", type: "file", indent: 1, status: "new" },
    { name: "lib", type: "dir", indent: 1 },
    { name: "supabase.ts", type: "file", indent: 2, status: "new" },
  ],
  messages: [
    { role: "user", text: "名刺管理Webアプリの設計メモを作ってください。機能はログイン、名刺登録、一覧表示、検索、編集・削除、ユーザーごとのデータ分離です。技術はNext.js・Supabase・Vercelです" },
    { role: "tool", icon: "📐", label: "設計メモ生成", text: "design.md" },
    { role: "approval", question: "design.mdを作成しますか？", code: "+ design.md\n+ ページ構成・テーブル構成" },
    { role: "assistant", text: "design.mdを作成しました。続けてSupabaseクライアントの接続設定も行いましょう。" },
  ],
},

"26": {
  title: "テーブル設計とログイン機能を実装する",
  goal: "名刺テーブルを作りメールとパスワードでログインできる",
  part: "Part7",
  project: "business-card-app",
  branch: "main",
  fileTree: [
    { name: "business-card-app", type: "dir" },
    { name: "app", type: "dir", indent: 1 },
    { name: "login", type: "dir", indent: 2 },
    { name: "page.tsx", type: "file", indent: 3, status: "new" },
    { name: "design.md", type: "file", indent: 1 },
  ],
  messages: [
    { role: "user", text: "メールアドレスとパスワードでログイン・新規登録できる画面を/loginページに作ってください。Supabase Authを使ってください" },
    { role: "tool", icon: "🔐", label: "ログイン画面生成", text: "app/login/page.tsx" },
    { role: "approval", question: "ログイン画面を作成しますか？", code: "+ app/login/page.tsx\n+ Supabase Auth連携処理" },
    { role: "assistant", text: "ログイン画面を作成しました。/loginにアクセスして、新規登録とログインを試してみてください。" },
  ],
},

"27": {
  title: "名刺の登録・一覧表示画面を作る",
  goal: "名刺を登録して一覧で確認できる",
  part: "Part7",
  project: "business-card-app",
  branch: "main",
  fileTree: [
    { name: "business-card-app", type: "dir" },
    { name: "app", type: "dir", indent: 1 },
    { name: "dashboard", type: "dir", indent: 2 },
    { name: "page.tsx", type: "file", indent: 3, status: "new" },
    { name: "new", type: "dir", indent: 2 },
    { name: "page.tsx", type: "file", indent: 3, status: "new" },
  ],
  messages: [
    { role: "user", text: "/dashboard/newというページに名刺の新規登録フォームを作ってください。入力項目は名前・会社名・部署・電話番号・メールアドレス・メモです" },
    { role: "tool", icon: "📋", label: "フォーム生成", text: "app/dashboard/new/page.tsx" },
    { role: "approval", question: "登録フォームを作成しますか？", code: "+ app/dashboard/new/page.tsx" },
    { role: "assistant", text: "登録フォームを作成しました。続けて一覧表示画面も作りましょう。" },
    { role: "user", text: "/dashboardページに、登録した名刺を一覧表示する機能を作ってください" },
    { role: "assistant", text: "一覧表示画面を作成しました。登録した名刺が表形式で表示されます。" },
  ],
},

"28": {
  title: "検索・編集・削除機能を追加する",
  goal: "登録した名刺を検索・編集・削除できる",
  part: "Part7",
  project: "business-card-app",
  branch: "main",
  fileTree: [
    { name: "business-card-app", type: "dir" },
    { name: "app", type: "dir", indent: 1 },
    { name: "dashboard", type: "dir", indent: 2 },
    { name: "edit", type: "dir", indent: 3 },
    { name: "[id]", type: "dir", indent: 4 },
    { name: "page.tsx", type: "file", indent: 5, status: "new" },
  ],
  messages: [
    { role: "user", text: "一覧画面に名前または会社名で検索できる検索ボックスを追加してください" },
    { role: "assistant", text: "検索ボックスを追加しました。" },
    { role: "user", text: "各行に編集リンクと削除ボタンを追加してください" },
    { role: "tool", icon: "✏️", label: "編集・削除機能生成", text: "app/dashboard/edit/[id]/page.tsx" },
    { role: "approval", question: "編集・削除機能を追加しますか？", code: "+ 編集ページ\n+ 削除処理（確認ポップアップ付き）" },
    { role: "assistant", text: "編集・削除機能を追加しました。検索・編集・削除が一通り使えるようになりました。" },
  ],
},

"29": {
  title: "セキュリティ設定（RLS）を理解して設定する",
  goal: "自分のデータだけ見える安全な設定ができる",
  part: "Part7",
  project: "business-card-app",
  branch: "main",
  fileTree: [
    { name: "business-card-app", type: "dir" },
    { name: "supabase", type: "dir", indent: 1 },
    { name: "rls_policy.sql", type: "file", indent: 2, status: "new" },
  ],
  messages: [
    { role: "user", text: "business_cardsテーブルにRow Level Security（RLS）を有効化し、ユーザーが自分のuser_idのデータだけを操作できるポリシーを作るSQLを書いてください" },
    { role: "tool", icon: "🔒", label: "RLSポリシー生成", text: "rls_policy.sql" },
    { role: "approval", question: "RLSポリシーのSQLを生成しますか？", code: "ALTER TABLE business_cards ENABLE ROW LEVEL SECURITY;\nCREATE POLICY \"own data only\" ON business_cards\n  USING (auth.uid() = user_id);" },
    { role: "assistant", text: "RLSポリシーのSQLを生成しました。SupabaseのSQL Editorで実行してください。これで自分のデータだけが見える安全な状態になります。" },
  ],
},

"30": {
  title: "Vercelに公開してGitHub連携で自動デプロイする",
  goal: "名刺管理アプリを公開し他社にも配布できる状態にする",
  part: "Part7",
  project: "business-card-app",
  branch: "main",
  fileTree: [
    { name: "business-card-app", type: "dir" },
    { name: ".env.local", type: "file", indent: 1 },
    { name: "vercel.json", type: "file", indent: 1, status: "new" },
  ],
  messages: [
    { role: "user", text: "現在の変更をコミットしてGitHubにpushしてください" },
    { role: "tool", icon: "🚀", label: "デプロイ準備", text: "git commit && git push" },
    { role: "approval", question: "変更をコミット・pushしますか？", code: "git add -A\ngit commit -m \"feat: 名刺管理アプリ完成\"\ngit push" },
    { role: "assistant", text: "GitHubにpushしました。Vercelで環境変数を設定してDeployすれば、インターネット上に公開されます。" },
  ],
},

"31": {
  title: "設計とテーブル設計：写真アップロードを含む構成を考える",
  goal: "日報アプリの機能を整理しテーブルとStorage構成を理解する",
  part: "Part8",
  project: "daily-report-app",
  branch: "main",
  fileTree: [
    { name: "daily-report-app", type: "dir" },
    { name: "design.md", type: "file", indent: 1, status: "new" },
  ],
  messages: [
    { role: "user", text: "現場日報報告Webアプリの設計メモを作ってください。ユーザーには現場担当者と管理者の2つのロールがあります。日報には日付・現場名・作業内容・所感・写真を含みます" },
    { role: "tool", icon: "📐", label: "設計メモ生成", text: "design.md" },
    { role: "approval", question: "design.mdを作成しますか？", code: "+ design.md\n+ profiles / sites / reports / report_photos テーブル構成" },
    { role: "assistant", text: "design.mdを作成しました。profiles・sites・reports・report_photosの4テーブル構成と、写真保存にはSupabase Storageを使う方針をまとめています。" },
  ],
},

"32": {
  title: "日報投稿フォームを作る",
  goal: "日付・現場名・作業内容を入力して投稿できる",
  part: "Part8",
  project: "daily-report-app",
  branch: "main",
  fileTree: [
    { name: "daily-report-app", type: "dir" },
    { name: "app", type: "dir", indent: 1 },
    { name: "reports", type: "dir", indent: 2 },
    { name: "new", type: "dir", indent: 3 },
    { name: "page.tsx", type: "file", indent: 4, status: "new" },
  ],
  messages: [
    { role: "user", text: "/reports/newというページに日報投稿フォームを作ってください。入力項目は日付・現場（セレクトボックス）・作業内容・所感です" },
    { role: "tool", icon: "📋", label: "投稿フォーム生成", text: "app/reports/new/page.tsx" },
    { role: "approval", question: "投稿フォームを作成しますか？", code: "+ app/reports/new/page.tsx\n+ reportsテーブルへの保存処理" },
    { role: "assistant", text: "投稿フォームを作成しました。日付・現場・作業内容・所感を入力して保存できます。" },
  ],
},

"33": {
  title: "写真アップロード機能を実装する",
  goal: "日報に現場写真を添付して保存できる",
  part: "Part8",
  project: "daily-report-app",
  branch: "main",
  fileTree: [
    { name: "daily-report-app", type: "dir" },
    { name: "app", type: "dir", indent: 1 },
    { name: "reports", type: "dir", indent: 2 },
    { name: "new", type: "dir", indent: 3 },
    { name: "page.tsx", type: "file", indent: 4, status: "changed" },
  ],
  messages: [
    { role: "user", text: "投稿フォームに写真を1〜3枚選択してアップロードできる機能を追加してください。Supabase Storageのreport-photosバケットに保存してください" },
    { role: "tool", icon: "🖼️", label: "アップロード機能生成", text: "Storage連携処理を追加" },
    { role: "approval", question: "写真アップロード機能を追加しますか？", code: "+ Storage.upload処理\n+ report_photosテーブルへのURL保存" },
    { role: "assistant", text: "写真アップロード機能を追加しました。フォームから選択した写真がStorageに保存され、URLがデータベースに記録されます。" },
  ],
},

"34": {
  title: "日報一覧・カレンダー表示を作る",
  goal: "投稿した日報を一覧とカレンダーで確認できる",
  part: "Part8",
  project: "daily-report-app",
  branch: "main",
  fileTree: [
    { name: "daily-report-app", type: "dir" },
    { name: "app", type: "dir", indent: 1 },
    { name: "reports", type: "dir", indent: 2 },
    { name: "calendar", type: "dir", indent: 3 },
    { name: "page.tsx", type: "file", indent: 4, status: "new" },
    { name: "[id]", type: "dir", indent: 3 },
    { name: "page.tsx", type: "file", indent: 4, status: "new" },
  ],
  messages: [
    { role: "user", text: "/reportsページに日報の一覧表示を、/reports/[id]に詳細表示を、/reports/calendarにカレンダー表示を作ってください" },
    { role: "tool", icon: "📅", label: "一覧・詳細・カレンダー生成", text: "3ページを実装中..." },
    { role: "approval", question: "一覧・詳細・カレンダーページを作成しますか？", code: "+ app/reports/page.tsx\n+ app/reports/[id]/page.tsx\n+ app/reports/calendar/page.tsx" },
    { role: "assistant", text: "3つのページを作成しました。投稿した日報を一覧・詳細・カレンダーの3つの見方で確認できます。" },
  ],
},

"35": {
  title: "管理者用の集計・検索機能を作る",
  goal: "管理者が現場別・期間別に日報を集計・検索できる",
  part: "Part8",
  project: "daily-report-app",
  branch: "main",
  fileTree: [
    { name: "daily-report-app", type: "dir" },
    { name: "app", type: "dir", indent: 1 },
    { name: "admin", type: "dir", indent: 2 },
    { name: "reports", type: "dir", indent: 3 },
    { name: "page.tsx", type: "file", indent: 4, status: "new" },
  ],
  messages: [
    { role: "user", text: "/admin/reportsというページを作ってください。roleがadminの場合のみアクセスでき、全ユーザーの日報を現場名・日付範囲で絞り込んで表示してください" },
    { role: "tool", icon: "📊", label: "管理者ページ生成", text: "app/admin/reports/page.tsx" },
    { role: "approval", question: "管理者用ページを作成しますか？", code: "+ app/admin/reports/page.tsx\n+ roleチェック処理\n+ 絞り込み検索・集計" },
    { role: "assistant", text: "管理者用ページを作成しました。adminロールのユーザーのみ、全現場の日報を集計・検索できます。" },
  ],
},

"36": {
  title: "ロールベースのセキュリティ設定をする",
  goal: "管理者と現場担当者で見える範囲を分ける設定ができる",
  part: "Part8",
  project: "daily-report-app",
  branch: "main",
  fileTree: [
    { name: "daily-report-app", type: "dir" },
    { name: "supabase", type: "dir", indent: 1 },
    { name: "role_rls_policy.sql", type: "file", indent: 2, status: "new" },
  ],
  messages: [
    { role: "user", text: "reportsテーブルとreport_photosテーブルにRLSを設定してください。adminロールは全データ、workerロールは自分のデータのみアクセスできるようにしてください" },
    { role: "tool", icon: "🔒", label: "ロール別RLSポリシー生成", text: "role_rls_policy.sql" },
    { role: "approval", question: "ロール対応のRLSポリシーを生成しますか？", code: "CREATE POLICY \"admin sees all\" ON reports\n  USING (\n    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'\n    OR auth.uid() = user_id\n  );" },
    { role: "assistant", text: "ロールに応じたRLSポリシーを生成しました。SQL Editorで実行すれば、データベース側でも権限管理が機能します。" },
  ],
},

"37": {
  title: "配布準備とVercelへの公開（現場日報報告アプリ）",
  goal: "現場日報報告アプリを公開し他社に配布できる状態にする",
  part: "Part8",
  project: "daily-report-app",
  branch: "main",
  fileTree: [
    { name: "daily-report-app", type: "dir" },
    { name: ".env.local", type: "file", indent: 1 },
    { name: "vercel.json", type: "file", indent: 1, status: "new" },
  ],
  messages: [
    { role: "user", text: "現在の変更をコミットして、GitHubにdaily-report-appというリポジトリを作成してpushしてください" },
    { role: "tool", icon: "🚀", label: "デプロイ準備", text: "GitHub作成 → push" },
    { role: "approval", question: "リポジトリを作成しpushしますか？", code: "gh repo create daily-report-app --private\ngit push -u origin main" },
    { role: "assistant", text: "GitHubにpushしました。Vercelで環境変数を設定してDeployすれば、現場日報報告アプリも公開されます。" },
  ],
},

"38": {
  title: "エラーが出たときの対処法（Web版）",
  goal: "ブラウザとVercelのログからエラー原因を見つけて直せる",
  part: "Part9",
  project: "daily-report-app",
  branch: "main",
  fileTree: [
    { name: "daily-report-app", type: "dir" },
    { name: "app", type: "dir", indent: 1 },
  ],
  messages: [
    { role: "user", text: "ブラウザのコンソールに次のエラーが出ています。直してください：TypeError: Cannot read properties of undefined" },
    { role: "tool", icon: "🐛", label: "エラー解析", text: "原因を調査中..." },
    { role: "assistant", text: "原因はSupabaseの環境変数が読み込まれていないことでした。.env.localの設定を確認し、修正しました。再度お試しください。" },
  ],
},

"39": {
  title: "他社への配布方法と複数社運用の考え方",
  goal: "環境変数の引き渡しと複数社展開の基本を理解できる",
  part: "Part9",
  project: "daily-report-app",
  branch: "main",
  fileTree: [
    { name: "daily-report-app", type: "dir" },
    { name: "DEPLOY_CHECKLIST.md", type: "file", indent: 1, status: "new" },
  ],
  messages: [
    { role: "user", text: "B社用にこのアプリを配布する手順をまとめてください" },
    { role: "tool", icon: "📦", label: "配布チェックリスト生成", text: "DEPLOY_CHECKLIST.md" },
    { role: "approval", question: "配布チェックリストを作成しますか？", code: "+ DEPLOY_CHECKLIST.md" },
    { role: "assistant", text: "配布チェックリストを作成しました。リポジトリのコピー、Supabase・Vercelの新規プロジェクト作成、環境変数の設定、管理者アカウントの発行までの手順がまとまっています。" },
  ],
},

"40": {
  title: "次のアプリへ：学んだことを活かしたアイデアの広げ方",
  goal: "次に作りたいものの設計メモをClaude Codeと作れる",
  part: "Part9",
  special: "roadmap.html"
},

};
