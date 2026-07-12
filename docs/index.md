---
layout: book
order: 1
title: "AI時代に差がつく論理的思考と表現力"
description: "AIを使った業務成果物を、タスク定義・情報分類・根拠確認・評価・承認・再利用まで含めて仕上げるための論理的思考と表現力の実践ガイド"
author: "ITDO Inc.（株式会社アイティードゥ）"
version: "1.0.0"
permalink: /
---

# AI時代に差がつく論理的思考と表現力

生成AIを使いこなすための基礎スキルに加え、業務成果物を定義し、根拠を確認し、承認可能な形へ仕上げるための論理的思考・表現・AI協働の実践ガイドです。

## はじめに

本書は、AIへの依頼文をうまく書くことだけを目的にしません。実務では、目的、読み手、意思決定点、機密区分、根拠、受け入れ基準、承認者、再利用条件までをそろえて初めて、AI出力を業務成果物として扱えます。

- [詳しいはじめにを読む](introduction/01-introduction/)
- [AI活用の標準業務フロー（1枚）を読む](introduction/02-standard-workflow/)
- [2026年版リライト契約と分割計画を読む](introduction/03-rewrite-plan-2026/)

## 2026年版への分割リライト中

本書は Issue #126 に基づき、既存URLをできるだけ維持しながら、2026年時点の実務ワークフロー中心の商用レベル実務書へ分割改稿しています。読み手は、現行本文を利用しつつ、次の基準で自分の業務に適用してください。

- 事実、解釈、仮説、推定、推奨、要確認事項を分ける。
- 生成AIへの指示は、task brief、data classification、context design、output schema、受け入れ基準とセットで設計する。
- AI出力は初稿として扱い、根拠確認、リスク確認、編集、承認、ログ化を人間が担う。
- PDF、画像、表、グラフ、スクリーンショット、議事メモ、提案資料など、テキスト以外の業務材料も前提にする。ただし、画像生成や音声生成の専門操作本にはしない。
- テンプレートやケーススタディは、1枚サマリー、提案書、稟議メモ、議事録、意思決定ログ、営業ヒアリング、反論処理、リスクレビュー、evidence matrix などの成果物単位で再利用する。

## 実務適用レビューゲート

本書を更新する PR では、次の観点を必ず確認します。

- 根拠のない時短効果、生産性向上率、AI活用度の断定を入れない。数値を残す場合は、出典、サンプル、適用範囲を明示する。
- モデル名、価格、プラン名、UI手順、規制日付などの陳腐化しやすい情報は本文の中心に置かない。
- 機密情報、個人情報、著作権、知財、prompt injection、監査ログ、human-in-the-loop、社内ポリシー、承認フローを注意書きで終わらせず、実務手順へ接続する。
- `docs/` と `src/` の同期要否を PR body に記録し、GitHub Copilot review の本文、inline comment、suggestion を全件確認する。

## すぐ参照したい補助導線

- 概念の全体像を先に押さえる: [第1章：なぜ今、論理的思考が必要なのか](chapters/chapter01/)
- 実務での使い方を確認する: [AI活用の標準業務フロー（1枚）](introduction/02-standard-workflow/)
- 改稿範囲と今後の章契約を確認する: [2026年版リライト契約と分割計画](introduction/03-rewrite-plan-2026/)
- 実務テンプレートを再利用する: [付録A：実践的なツール・テンプレート集](appendices/appendix-a/)（実務オペレーティングキット）
- 関連書籍の流れをたどる: [ITエンジニア知識アーキテクチャ](https://itdojp.github.io/it-engineer-knowledge-architecture/)
- シリーズ横断で読む: [AI時代のプロフェッショナルITエンジニアの思考法](https://itdojp.github.io/ai-era-engineers-mind-book/)、[エンジニアのための実践コミュニケーション設計](https://itdojp.github.io/IT-engineer-communication-book/)

## 前提知識

- 特別な前提知識は不要です。業務で文章を読み書きし、会議や資料作成に関わる読者を想定します。
- 読むだけであれば生成AIサービスのアカウントは必須ではありません。ケーススタディや演習を実際に試す場合のみ、任意の生成AIサービスを使える環境があると理解しやすくなります。
- 実務に適用する場合は、自組織のAI利用ルール、機密情報の扱い、承認フローを先に確認してください。

## 所要時間

- 通読: 約2〜3時間（本文量ベースの概算。コードブロック除外、400〜600文字/分で換算）
- ケーススタディを自分の業務に当てはめて作成する場合は、題材、情報分類、確認する一次情報、レビュー回数により変動します。

## 目次

### 第1部：思考・論証・判断の土台
- [第1章：なぜ今、論理的思考が必要なのか](chapters/chapter01/)
- [第2章：論理的思考の基本構造](chapters/chapter02/)
- [第3章：情報の整理と分析](chapters/chapter03/)
- [第4章：問題解決の論理プロセス](chapters/chapter04/)

### 第2部：AI協働の実務基盤
- [第5章：AIへの指示（プロンプト）設計](chapters/chapter05/)
- [第6章：AIの出力を評価・改善する](chapters/chapter06/)
- [第7章：批判的思考とメディアリテラシー](chapters/chapter07/)
- [第8章：AI活用の具体的場面](chapters/chapter08/)
- [第9章：AIリスク管理と倫理的配慮](chapters/chapter09/)

### 第3部：成果物を作る
- [第10章：論理的な文書作成](chapters/chapter10/)
- [第11章：説得力のあるプレゼンテーション](chapters/chapter11/)
- [第12章：効果的な会議・議論術](chapters/chapter12/)
- [第13章：論理的な交渉・説得術](chapters/chapter13/)

### 第4部：組織導入と継続運用
- [第14章：日常業務での実践](chapters/chapter14/)
- [第15章：論理的思考を活かしたリーダーシップ](chapters/chapter15/)
- [第16章：プロジェクト管理と問題解決](chapters/chapter16/)
- [第17章：継続的学習と思考力向上](chapters/chapter17/)

### ケーススタディ
- [ケーススタディ（一覧）](additional/)
- [ケーススタディ1：経営向け1枚サマリー](additional/case-study-01-executive-summary/)
- [ケーススタディ2：会議アジェンダ→議事録→意思決定ログ](additional/case-study-02-meeting-to-decision-log/)
- [ケーススタディ3：営業ヒアリング→提案骨子→反論処理](additional/case-study-03-sales-hearing-and-proposal/)

### 付録
- [付録A：実践的なツール・テンプレート集](appendices/appendix-a/)

## 想定読者

- **企画 / 経営企画 / 営業 / マーケティング / 人事 / オペレーション**: 非技術職でも、成果物の品質、根拠、承認に責任を持つ人。
- **PM / EM / チームリーダー / マネージャー**: AI活用をチーム標準へ組み込み、レビューや再利用のルールを設計する人。
- **社内AI導入・運用・ガバナンス担当**: 利用ルール、テンプレート、ログ、承認、リスクレビューを整備する人。

## 学習成果

- 業務課題を、目的、読み手、意思決定点、制約、根拠、承認条件に分解できる。
- 生成AIに対して、目的、前提、制約、情報分類、出力形式、受け入れ基準を明確にした指示を出せる。
- AI出力を CARE に、根拠、リスク、承認条件を加えて評価し、改善指示へ落とし込める。
- 自分や相手の主張を、前提、根拠、反論可能性、要確認事項に分けて整理できる。
- 1枚サマリー、議事録、意思決定ログ、提案骨子、反論処理シートなどの成果物を、AI支援を使い分けながら作成・改善できる。

## 読み方ガイド

- 論理的思考そのものに苦手意識がある読者は、第1部（第1〜4章）を通読してから、第2部以降に進んでください。
- AI協働を業務へ入れたい読者は、第1章で全体像を押さえたうえで、[AI活用の標準業務フロー（1枚）](introduction/02-standard-workflow/) と第5〜9章を先に読んでください。
- 実務での活用イメージを重視したい読者は、第3部、ケーススタディ、付録Aを往復してください。
- マネジメント層やリーダー職の読者は、第4部を読み、チーム運用、テンプレート資産化、承認、継続学習の観点で読み替えてください。
- 短時間で全体像だけ確認したい場合は、「AI活用の標準業務フロー（1枚）」→「2026年版リライト契約」→ケーススタディ1の順で読むと、30〜60分程度で全体の使い方を把握しやすくなります。

## 利用と更新情報

- 公開ページ: [GitHub Pages](https://itdojp.github.io/LogicalThinking-AI-Era-Guide/)
- リポジトリ: [GitHub](https://github.com/itdojp/LogicalThinking-AI-Era-Guide)
- 更新確認先: [コミット履歴](https://github.com/itdojp/LogicalThinking-AI-Era-Guide/commits/main/)、[PR 一覧](https://github.com/itdojp/LogicalThinking-AI-Era-Guide/pulls)
- 生成AIサービスの UI、モデル名、料金、利用規約は変わるため、第5章〜第9章とケーススタディを実務へ適用する前に、利用中サービスの公式ドキュメントと自組織の利用ポリシーを確認してください。
- 社外サービスへ入力する文章には、個人情報、機密情報、契約前提の内部判断を含めないでください。

## 著者について

**ITDO Inc.（株式会社アイティードゥ）**

- Email: [knowledge@itdo.jp](mailto:knowledge@itdo.jp)
- GitHub: [@itdojp](https://github.com/itdojp)

## ライセンス

本書は **Creative Commons BY-NC-SA 4.0** ライセンスで公開しています。  
教育・研究・個人学習での利用は自由ですが、商用利用は別途契約（事前許諾）が必要です。

[詳細なライセンス条件](https://github.com/itdojp/it-engineer-knowledge-architecture/blob/main/LICENSE.md)

**お問い合わせ**  
株式会社アイティードゥ（ITDO Inc.）  
Email: [knowledge@itdo.jp](mailto:knowledge@itdo.jp)

{% include page-navigation.html %}
