# Novelogic

少女二人だけの世界を舞台に、小説を試作しながら、面白さや構造を探るためのリポジトリ。

現在は**設計を固定せず、物語の発想から自由に作り直す段階**です。過去の数理的な設計は一時退避しており、今後の作品を拘束しません。

## 試作小説

- [『橋の真ん中』](novels/hashino-mannaka.md) — 二人だけの世界を舞台にした5章の試作短編。今後の方向性が決まるまで参考作として保存。

## 退避した設計書

以下は旧案の記録であり、**現行の執筆ルールではありません**。

- [旧・6人15章の構造設計](archive/DESIGN.md)
- [旧・二人世界の構造メモ](archive/TWO_PERSON_NOVEL.md)

必要になったときに参照・再利用できます。

## 小説をPDFにする

`novels/` 直下のMarkdown原稿を `main` に保存すると、GitHub Actionsが作品ごとの縦書きPDFを自動生成します。

**[Actions → 小説PDF](https://github.com/ffuwa564-gif/novelogic/actions/workflows/pdf.yml) → 成功した実行 → Artifacts → novel-pdfs** からダウンロードできます。

文庫サイズ（A6）、日本語明朝体、章ごとの改ページ、ルビ、ページ番号に対応。手元では `npm ci` → `npm run build` で生成します。

詳しい操作・原稿の書き方・方式の選定根拠は [PDF生成ガイド](docs/PDF.md) を参照してください。
