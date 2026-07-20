# コンテンツ正本・ミラー・アーカイブ運用

<!-- content-boundary: docs-canonical -->

この文書は、Issue #160 で確定した公開正本と補助原稿の境界を定義します。機械判定の対象パスは `content-boundaries.json` を正とします。

## 役割

| 区分 | パス | Pages公開 | 編集方法 |
|---|---|---:|---|
| 公開正本 | `docs/` | GitHub Pagesへ公開 | **本文変更はここから開始する** |
| 互換ミラー | `src/chapters/*.md`、`src/appendices/appendix-a/index.md` | 対象外 | 手編集せず、公開正本から生成する |
| 補助資料 | `src/exercise-answers/` | 対象外 | 手動管理。公開本文と矛盾しないことを確認する |
| 旧原稿 | `archive/legacy-src/` | 対象外 | 更新しない。現行本文の根拠にしない |

`docs/` は公開内容、レビュー、引用、誤り報告の唯一の正本です。`src/` と `archive/` はGitHub Pagesへ公開しませんが、公開リポジトリ上では閲覧できます。機密情報や権利上公開できない内容は置きません。互換ミラーは、Jekyll front matter を持たない可搬な Markdown を必要とする既存利用者のために当面維持します。ミラーは正本ではなく、独自の変更を加えません。

`src/exercise-answers/` は生成対象ではない非公開の補助資料です。GitHub Pagesのナビゲーションとビルドには含めません。本文との不整合を直す場合も、先に `docs/` の正本を確定してから補助資料を更新します。

`archive/legacy-src/` は、2024年版など旧世代の原稿を履歴参照用に保持する場所です。内容を再利用する場合は、現行の用語、根拠、情報分類、承認境界に照らして `docs/` へ新たに採用します。archiveファイルを公開導線へリンクしたり、正本へ戻したりしません。

## 本文更新の手順

1. `docs/` の対象ページを編集する。
2. `npm run sync:content-mirrors` を実行する。
3. `npm run check:content-boundaries` を実行する。
4. `npm test` と `npm run build` を実行する。
5. PR本文へ、正本、更新されたミラー、参照した旧原稿を記録する。

例:

```text
Canonical files edited:
- docs/chapters/chapter06/index.md

Mirror files updated:
- src/chapters/chapter06.md

Legacy/archive files consulted:
- none
```

ケーススタディや付録Cなど、`content-boundaries.json` にミラーが定義されていない公開ページは `docs/` だけを編集します。archiveを同期する必要はありません。

## 下流Issueへの適用

- Issue #167: `docs/additional/case-study-01-executive-summary/index.md` のみが正本。ミラーなし。
- Issue #168: `docs/chapters/chapter06/index.md` と `docs/appendices/appendix-c/index.md` を編集し、第6章のミラーを生成する。
- Issue #169: `docs/chapters/chapter02/index.md` を編集し、第2章のミラーを生成する。

## 機械検証する契約

`npm run check:content-boundaries` は次を検証します。

- 正本、ミラー、補助資料、旧原稿のパスが安全かつ重複なく分類されている。
- 18個の互換ミラーが、front matter除去と内部リンク変換後の正本に一致する。
- `src/` に分類されていない Markdown がない。
- 旧4パスが `src/` に復活していない。
- archiveファイルに非正本・非公開・更新対象外の表示があり、現行の置換先が存在する。
- 主要な保守文書とBook QAがこの契約を参照している。

長期的に互換ミラーの利用者がいないと確認できた場合は、別Issueで `src/chapters/` と `src/appendices/` の廃止を検討します。#160では既存のリポジトリ参照を一度に破壊しないため、限定ミラーとして残します。
