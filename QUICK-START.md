# Quick Start（執筆・開発者向け）

このリポジトリの内容をローカルでプレビューするための最小手順です。

## 前提

- Node.js 18 以上（`package.json` の `engines.node` を参照）
- Ruby と Bundler（`docs/Gemfile` を参照）

## セットアップ

```bash
git clone https://github.com/itdojp/LogicalThinking-AI-Era-Guide.git
cd LogicalThinking-AI-Era-Guide

npm ci

cd docs
bundle install
cd ..
```

## ローカルプレビュー（推奨）

```bash
npm start
```

起動後に表示される URL で閲覧できます（`docs/_config.yml` の `baseurl` 設定によりパスが付与される場合があります）。

## ビルドと静的プレビュー

```bash
npm run preview
```

このコマンドは `npm run build`（`docs/_site/` を生成）を実行したうえで、静的ファイルサーバーでプレビューします。

## どこを編集するか

- 公開ページのソース: `docs/`
- 原稿整理用ファイル: `src/`（運用は要確認）

## リント・リンクチェック（任意）

```bash
npm test
```
