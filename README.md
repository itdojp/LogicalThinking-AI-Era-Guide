# AI時代に差がつく論理的思考と表現力

生成AIを「よい文章を出す道具」として扱うだけでなく、業務成果物を定義し、根拠を確認し、承認可能な形へ仕上げるための論理的思考・表現・AI協働の実践ガイドです。

- 公開ページ（GitHub Pages）: [LogicalThinking-AI-Era-Guide](https://itdojp.github.io/LogicalThinking-AI-Era-Guide/)
- 目次（リポジトリ内）: `docs/index.md`
- シリーズ: [it-engineer-knowledge-architecture](https://github.com/itdojp/it-engineer-knowledge-architecture)

## 2026年版リライト方針

本書は Issue #126 に基づき、「2024年のプロンプト中心入門」から「2026年時点の実務ワークフロー中心の商用レベル実務書」へ、分割PRで改稿しています。

今回の改稿では、既存URLをできるだけ維持しつつ、次の方針を全章・ケーススタディ・付録へ順次反映します。

- 論理的思考の基礎、AI活用の標準業務フロー、CARE評価、ケーススタディの改善プロセスは継承する。
- AIへの依頼文だけでなく、task brief、data classification、context design、output schema、tool use / retrieval / MCP の概念、evaluation、acceptance criteria、human approval、logging、reuse まで扱う。
- 事実、解釈、仮説、推定、推奨、要確認事項を分け、根拠のない時短効果や生産性向上率を断定しない。
- ベンダー固有のモデル名、価格、UI手順に依存せず、一次情報を確認する読み方と、陳腐化しにくい判断基準を優先する。
- 1枚サマリー、提案書、稟議メモ、議事録、意思決定ログ、営業ヒアリングメモ、反論処理シート、リスクレビュー、evidence matrix など、成果物単位で再利用できる構成にする。

## この本でできるようになること

- 業務課題を、目的、読み手、意思決定点、制約、根拠、承認条件に分解できる。
- 生成AIに対して、文脈、利用してよい情報、出力形式、受け入れ基準を明示し、初稿を安全に作れる。
- AI出力を CARE（Correctness / Appropriateness / Relevance / Effectiveness）に、根拠、リスク、承認条件を加えて評価できる。
- 会議、提案、報告、営業、プロジェクト推進などの場面で、論理構造と成果物テンプレートを組み合わせて使える。
- チームでAI活用を運用する際の情報分類、ログ化、レビュー、再利用、廃止ルールを説明できる。

## 対象読者

- 企画、経営企画、営業、マーケティング、人事、オペレーションなど、非技術職を含むビジネス職
- PM、EM、チームリーダー、マネージャーなど、成果物の品質と説明責任を持つ人
- 社内AI導入、利用ルール、テンプレート整備、ガバナンス運用に関わる人
- 生成AIを使い始めたが、出力の評価、根拠確認、承認へのつなぎ方に課題を感じている人

## 読み方の目安

- 短時間で全体像を把握する: [AI活用の標準業務フロー（1枚）](docs/introduction/02-standard-workflow/index.md) → [2026年版リライト契約](docs/introduction/03-rewrite-plan-2026/index.md) → [ケーススタディ一覧](docs/additional/index.md)
- 論理的思考から学ぶ: 第1部（第1〜4章）で、前提、論点、根拠、反論、結論、評価軸を確認する。
- AI協働を実務へ入れる: 第2部（第5〜9章）で、指示設計、出力評価、情報検証、ワークフロー化、リスク・ガバナンスを確認する。
- 成果物を作る: 第3部（第10〜13章）とケーススタディで、1枚サマリー、提案、会議、営業、交渉の成果物へ落とし込む。
- チーム運用へ広げる: 第4部（第14〜17章）で、日常業務、テンプレート運用、プロジェクト導入、継続学習へ接続する。

## Phase 6 / 2026 実務適用レビューゲート

本書を更新する PR では、AI時代の論理的思考・表現力を実務へ戻せるかを次の基準で確認します。

- 「AI時代」という表現を、モデル名や流行語ではなく、業務成果物、判断基準、検証手順に接続する。
- 事実、仮説、推奨、要確認事項を区別し、根拠のない時短効果・生産性向上率を断定しない。
- AI出力を人間が検証・承認する責任境界、機密情報の扱い、ログ化・再利用の条件を明示する。
- テンプレート、ケーススタディ、チェックリストが本文と矛盾せず、読者が次に作る成果物を判断できる粒度にする。
- `docs/` と `src/` の同期要否を PR body に記録し、GitHub Copilot review の本文、inline comment、suggestion を全件確認する。

## フィードバック（誤り指摘・改善提案）

誤字脱字、技術的な誤り、改善提案は Issues / PR で受け付けます。手順は `CONTRIBUTING.md` を参照してください。

## ローカルプレビュー（貢献者向け）

ローカルでのプレビュー手順は `QUICK-START.md` を参照してください。

## 品質チェック（貢献者向け）

本文（`docs/` 配下）の編集後は、最低限次を実行して、表記・リンクの破綻を確認してください。

```bash
npm install
npm run check:metadata
npm run lint:light
npm run check-links
npm run build
```

`npm run check:metadata` は `book-config.json`、`docs/_config.yml`、`docs/index.md`、`docs/_data/navigation.yml`、`package.json`、`package-lock.json` の公開情報を照合し、章・付録の経路と必須アセットの欠落を検出します。

`npm run check-links` は `.markdown-link-check.json` により外部 URL（`https://` など）を対象外とし、リポジトリ内リンクの破綻検出を主目的としています。

## ライセンス

本書は Creative Commons BY-NC-SA 4.0 で提供されています。詳細は `LICENSE.md` を参照してください。
