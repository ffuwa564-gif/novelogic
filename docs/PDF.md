# 小説のPDF化

## GitHubだけで使う

1. `novels/` 直下の `.md` ファイルを編集して `main` に保存する。既存の `hashino-mannaka.md` が作例。
2. リポジトリの **Actions → 小説PDF → 最新の成功した実行**を開く。
3. **Artifacts → novel-pdfs** をダウンロードして展開する（GitHubへのログインが必要）。作品ごとのPDFが入っている。

`main` への更新とプルリクエストで自動実行する。Actions の **Run workflow** から手動実行も可能。成果物の保存期間は30日。期限後は手動実行で再生成できる。PDFはGitの履歴に追加しない。

## 原稿の書き方

ファイル名は例のように `my-novel.md`。`novels/` 直下の `.md` を作品ごとに独立したPDFにする。サブディレクトリは対象外。設計資料は `docs/` に置く。

```markdown
# 作品名

*著者名・副題など（任意）*

## 第一章　出会い

これは最初の段落です。

「こんにちは」

これは次の段落です。{記憶|きおく}のようにルビを指定できます。

## 第二章　帰り道

章の見出しで改ページします。
```

- `#` は作品名、`##` は章見出し。見出しには空白を入れる。
- 空行で段落を区切る。同一段落内の単なる改行は強制改行にしない。
- 本文には一字下げを自動適用するため、段落先頭の全角スペースは不要。
- ルビは VFM の `{親文字|ルビ}`。数字の縦中横は `<span class="tcy">12</span>`。
- 初期版はA6（105 × 148 mm）の縦書き、右から左への読み順、9ptの明朝体、ページ番号付き。章は必ず新しいページから始まる。
- 用紙・余白・字の大きさは `styles/novel.css` を編集。用紙を変えるときは `vivliostyle.config.js` の `size` と `scripts/verify-pdf.mjs` の寸法検証も合わせる。

## 手元で生成する

Node.js 24 と npm を使用する。

```sh
npm ci
npm run build
```

初回ビルド時にCLIが対応ブラウザを自動ダウンロードする。既存のChrome/Chromiumを使う場合は `npm run build -- --executable-browser /path/to/chromium`。Linuxではブラウザ実行に必要なシステムライブラリが必要（CIはUbuntuのホストランナーを利用）。

出力は `dist/原稿のファイル名.pdf`。`npm run preview` で組版プレビューを開ける。

検証は Poppler の `pdfinfo`・`pdffonts`・`pdftotext` を用意して `npm run verify`。Ubuntuなら `sudo apt-get install poppler-utils`、macOSなら `brew install poppler`。CIでは生成後に用紙寸法・ページの存在・全フォントの埋め込みとUnicodeマッピング・作品名のテキスト抽出を検査する。レイアウトの最終確認はPDFを開いて行う。

## 選定理由と調査資料

2026-10-23に公式資料を確認。

| 方式 | 判断 |
| --- | --- |
| Vivliostyle CLI + VFM + CSS | 採用。既存のMarkdown原稿を維持でき、CSSで日本語の縦組みとページ組版を指定できる。Node.jsとGitHub Actionsで運用できる。 |
| LuaLaTeX + jlreq | 日本語の本格組版に適した候補。今回はMarkdown原稿を直接扱う運用と環境構築の小ささを優先した。 |
| 通常のブラウザ印刷 | 単純なPDF化には使えるが、書籍用の改ページやページ領域を扱うため専用のページ組版エンジンを採用した。 |

- [Vivliostyle CLI はじめに](https://docs.vivliostyle.org/ja/cli/getting-started/) — Markdown入力、PDF生成、プレビュー。
- [Vivliostyle 設定リファレンス](https://docs.vivliostyle.org/ja/cli/config/) — 複数ビルド、サイズ、言語、読み順。
- [VFM公式](https://vivliostyle.github.io/vfm/) — Markdownとルビ記法。
- [W3C 日本語組版処理の要件](https://www.w3.org/TR/jlreq/) — 縦組み、ルビ、禁則、版面を考える際の参照。全面的な規格適合を保証するものではない。
- [jlreq公式配布情報](https://ctan.org/pkg/jlreq) — 比較候補の日本語文書クラス。
- [GitHub Actionsの成果物](https://docs.github.com/en/actions/tutorials/store-and-share-data) — PDFの保管とダウンロード。

CLIと日本語フォントをバージョン固定し、`package-lock.json` と `npm ci` で依存関係を固定する。Noto Serif JP は npm に同梱されたローカルのフォントを使うため、組版中にGoogle Fontsへ接続する必要がない。初回の依存関係・ブラウザ導入にはネット接続が必要。

このPDFは閲覧・推敲向け。印刷所に入稿する場合は指定された判型・塗り足し・色・PDF規格を別途確認する。
