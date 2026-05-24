---
layout: book
title: "2026年版リライト契約と分割計画"
---

# 2026年版リライト契約と分割計画

このページは、本書を2026年版の実務ワークフロー中心の内容へ改稿するための契約です。全章を一度に置き換えるのではなく、既存URLを維持しながら、章・ケーススタディ・付録ごとに小さなPRで改稿します。

## 目的

本書を、企業研修、自習、チーム導入でそのまま使える商用レベルの実務書へ近づけます。単なる加筆ではなく、読者定義、章の役割、ケーススタディ、テンプレート、検証フローをそろえます。

## 残す強み

- 論理的思考の基礎を、非技術職にも読める粒度で説明する。
- AI活用の標準業務フローを、全章の共通参照点として使う。
- CARE による評価を残し、受け入れ基準、根拠、リスク、承認まで拡張する。
- ケーススタディで「初稿 → 問題点 → 改善 → 最終成果物」まで示す。
- 機密情報を外部AIへ入れない前提を維持する。

## 改稿で変えること

- 「プロンプトをうまく書く」から「成果物を安全に完了させる」へ重心を移す。
- task brief、data classification、context design、output schema、tool use / function calling / retrieval / MCP の概念、evaluation、acceptance criteria、regression、human approval、logging、reuse を扱う。
- PDF、画像、表、グラフ、スクリーンショット、議事メモ、提案資料などのマルチモーダル材料を前提にする。
- 根拠の弱い数値、時短効果、生産性向上率、AI活用度の断定を削除するか、出典、サンプル、適用範囲を明示する。
- モデル名、価格、プラン名、UI手順、規制日付などの陳腐化しやすい情報を本文の中心に置かない。

## 各章の標準フォーマット

各章は、可能な範囲で次の型に寄せます。

1. この章で扱う業務課題
2. 重要概念 / フレーム
3. よくある失敗
4. 改善前 → 改善後
5. 実務テンプレート / チェックリスト
6. 人間が最終判断すべき点
7. 章末の要点

## 章別の改稿契約

### 第1部：思考・論証・判断の土台

- 第1章: なぜAI時代に論理的思考が差を生むのかを、成果物、判断、説明責任に接続する。
- 第2章: 前提、論点、根拠、反論、結論の構造を扱う。
- 第3章: 事実、解釈、仮説、推定、推奨を分け、ファクトチェックと evidence matrix へつなぐ。
- 第4章: 問題設定、仮説、意思決定、評価軸を、AI出力の採否判断へ接続する。

### 第2部：AI協働の実務基盤

- 第5章: 指示設計を、task brief、context design、output schema、制約、例示、受け入れ基準として再定義する。
- 第6章: CARE を、根拠、リスク、承認、regression、評価ログまで含む CARE+へ拡張する。
- 第7章: 誤情報、synthetic content、provenance、source hierarchy、メディアリテラシーを扱う。
- 第8章: research、drafting、analysis、meeting、proposal、multimodal を標準フローへ組み込む。
- 第9章: data classification、prompt injection、privacy、IP、policy、human-in-the-loop、監査ログを扱う。

### 第3部：成果物を作る

- 第10章: 1枚サマリー、提案書、報告書、稟議メモを扱う。
- 第11章: プレゼン、経営説明、想定Q&Aを扱う。
- 第12章: 会議設計、議事録、意思決定ログ、合意形成を扱う。
- 第13章: 営業ヒアリング、提案骨子、反論処理、交渉を扱う。

### 第4部：組織導入と継続運用

- 第14章: PDF、画像、表、グラフ、スクリーンショットを含む日常業務のマルチモーダル活用を扱う。
- 第15章: テンプレート、プロンプト資産、レビュー、責任分界をチーム運用として扱う。
- 第16章: KPI、評価、導入計画、変更管理をプロジェクト推進へ接続する。
- 第17章: 継続学習、能力開発、更新確認、テンプレートの廃止ルールを扱う。

## ケーススタディの改稿契約

既存の3本は削除せず、提出可能な成果物レベルまで深くします。

- [ケーススタディ1：経営向け1枚サマリー](../../additional/case-study-01-executive-summary/)
- [ケーススタディ2：会議アジェンダ→議事録→意思決定ログ](../../additional/case-study-02-meeting-to-decision-log/)
- [ケーススタディ3：営業ヒアリング→提案骨子→反論処理](../../additional/case-study-03-sales-hearing-and-proposal/)

各ケーススタディには、目的、読み手、意思決定点、機密区分、初期入力、初回出力、問題点、CARE+評価、改善指示、最終成果物、人間が確認すべき点、再利用のためのテンプレート化ポイントを含めます。

## 付録Aの改稿契約

[付録A：実践的なツール・テンプレート集](../../appendices/appendix-a/) は、実務オペレーティングキットへ改稿します。最低限、次のテンプレートをそろえます。

- task brief テンプレート
- data classification card
- prompt sheet
- output schema template
- evaluation rubric
- fact-check log
- decision memo template
- meeting / decision log template
- proposal skeleton
- governance / approval checklist
- source hierarchy
- prompt / template の資産化ルール

## 非目的

今回の改稿では、次は主目的にしません。

- build system の刷新
- ライセンス変更
- 不要なディレクトリ大移動
- APIリファレンス本のような詳細実装解説
- 画像生成・音声生成の専門書化

## PRごとの受け入れ基準

各PRでは、対象範囲に応じて次を確認します。

- 読者が「次に何を作るか」を判断できる。
- 事実、仮説、推奨、要確認事項が区別されている。
- 根拠のない数値断定がない。
- 機密情報、個人情報、著作権、知財、prompt injection、承認、ログ化が必要な箇所で扱われている。
- 内部リンクが壊れていない。
- `docs/` と `src/` の同期要否がPR本文に記録されている。
- GitHub Copilot review の本文、inline comment、suggestion を全件確認している。
- build / lint / link check が通っている、または既存起因の失敗を根拠付きで説明している。

## 最初に読むページ

- [はじめに](../01-introduction/)
- [AI活用の標準業務フロー（1枚）](../02-standard-workflow/)
- [トップページ](../../)
