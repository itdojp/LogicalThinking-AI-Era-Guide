# Quick Start（執筆・開発者向け）

<!-- content-boundary: docs-canonical -->

このリポジトリの内容をローカルでプレビューするための最小手順です。

## 前提

- Node.js 22.12.0 以上（`package.json` の `engines.node` を参照）
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

- 公開正本・編集起点: `docs/`
- 自動生成する互換ミラー: `src/chapters/`、`src/appendices/appendix-a/`
- 手動管理するGitHub Pages対象外の補助資料（公開リポジトリ上では閲覧可能）: `src/exercise-answers/`
- 非正本・非公開・更新対象外: `archive/legacy-src/`

本文を変更したら、次を実行します。

```bash
npm run sync:content-mirrors
npm run check:content-boundaries
```

詳細は `CONTENT-SOURCES.md` を参照してください。

## リント・リンクチェック（任意）

```bash
npm test
```
