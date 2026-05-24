# 第17章 演習問題 解答・解説

この解答例は、唯一の正解ではありません。実務では、自社の情報分類、AI利用ルール、承認フロー、利用可能なツール、顧客契約、法務・セキュリティ・人事・情報システムの所管部門判断に合わせて調整してください。

## 演習17-1：capability portfolio map と learning operating brief を作る

### capability portfolio map例

```text
対象者 / チーム: 法人営業提案チームのチームリーダー
主な役割: 提案資料の品質管理、レビュー、メンバー育成、テンプレート保守
担う成果物:
- 提案骨子
- customer FAQ draft
- evidence matrix
- review workflow board
- prompt / template asset register
成果物の読み手:
- 営業担当、営業責任者、法務、情報システム、顧客責任者
意思決定点:
- 顧客共有してよいか
- 追加確認が必要か
- テンプレートを標準化するか
必要な思考スキル:
- 論点設定、根拠確認、反論整理、評価軸設計、意思決定
必要なAI協働スキル:
- task brief、context design、output schema、evaluation、fact-check、reuse
必要なレビュー観点:
- 正確性、適切性、関連性、効果、根拠、リスク、承認
必要な人間判断:
- 顧客共有、価格・契約・セキュリティ表現、情報分類、最終承認
現在の強み:
- 提案資料の構成と顧客課題の整理
次に伸ばす能力:
- 根拠確認、レビュー指摘のテンプレート反映、古い資産の廃止判断
証拠として残す成果物:
- evidence matrix、review workflow board、template lifecycle register、retirement decision memo
```

### learning operating brief例

```text
学習テーマ: 提案資料レビューにおける根拠確認とテンプレート保守
対象者: 法人営業提案チームリーダー
伸ばしたい能力: 根拠確認、レビュー観点設計、テンプレート廃止判断
対象成果物: customer FAQ draft、evidence matrix、template lifecycle register
現在の課題:
- レビュー指摘が個別対応で終わり、テンプレート改善に戻っていない
学習目的:
- レビュー指摘から、更新すべきテンプレートと廃止すべき前提を判断できるようにする
制約:
- 顧客名、価格、契約条件は学習素材に含めない
- 社内AIのみ利用する
練習する成果物:
- review workflow board、retirement decision memo
評価方法:
- 営業責任者レビューで、根拠、未確認事項、承認者が明確かを確認する
レビュー担当:
- 営業責任者、必要に応じて法務・情報システム
相談先:
- 法務、情報システム、営業企画
ログ化先:
- skill evidence log、team learning review board
再利用するテンプレート:
- customer FAQ draft、evidence matrix、output quality gate rubric
見直し日:
- 月次レビュー会
```

### 解説

能力を抽象的に評価するのではなく、成果物、レビュー観点、人間判断に接続しています。学習計画にも情報分類とレビュー担当を含めています。

## 演習17-2：skill evidence log と practice / feedback loop plan を作る

### skill evidence log例

```text
日時: 2026-05-25
学習テーマ: 顧客向けFAQの根拠確認
対象成果物: customer FAQ draft
使ったテンプレート / 資産: customer FAQ draft with evidence check、evidence matrix
AI利用環境: 社内AI
入力した情報分類: 顧客名を伏せた質問要旨、公開情報、社内標準説明
作成した成果物:
- FAQドラフト
- 根拠表
- 未確認事項一覧
レビュー担当: 営業責任者、情報システム担当
レビュー指摘:
- セキュリティ標準文の最新版確認が必要
- 価格条件に見える表現を削除する必要がある
改善内容:
- FAQテンプレートに「根拠資料」と「承認者」欄を必須化した
- 価格条件に関する表現を「要確認」に移した
確認した根拠:
- 公開資料、社内標準説明、情報システム確認メモ
残った未確認事項:
- 契約条件への抵触有無
次に練習すること:
- change request decision log を使った変更判断
再利用できる部分:
- FAQカテゴリ、根拠欄、未確認事項欄
廃止 / 更新が必要な資産:
- 古いセキュリティ標準文を含むFAQテンプレート
```

### practice / feedback loop plan例

```text
練習テーマ: FAQドラフトの根拠確認と承認者明示
対象成果物: customer FAQ draft
今回試すこと:
- FAQごとに根拠、未確認事項、承認者を記載する
使うテンプレート:
- customer FAQ draft with evidence check
- evidence matrix
事前の受け入れ基準:
- 顧客へ送れる文と、社内確認中の文が分かれている
- 根拠資料と更新日が分かる
レビュー担当: 営業責任者
レビューの観点:
- 根拠、未確認事項、情報分類、承認者、次アクション
実施日: 次回提案レビュー前
結果:
- レビューで根拠不足2件、承認者不明1件を検出
指摘されたこと:
- セキュリティ表現は情報システム確認が必要
改善したこと:
- AI use boundary card にセキュリティ表現の相談条件を追加
次回変えること:
- FAQ作成前に情報システム確認が必要な項目を分ける
ログ化先:
- skill evidence log、team learning review board
```

### 解説

学習した内容を、成果物、レビュー指摘、改善したテンプレートに結びつけています。次回何を変えるかまで明示している点が重要です。

## 演習17-3：AI update watchlist を作る

### AI update watchlist例

| 項目ID | 対象 | 確認する理由 | 一次情報 / 所管部門 | 確認頻度 | 影響する成果物 | 担当者 |
| --- | --- | --- | --- | --- | --- | --- |
| UW-01 | 社内AI利用ルール | 入力可能な情報分類が変わる可能性がある | 情報システム、社内規程 | 月次 | AI use boundary card、FAQ | 営業企画 |
| UW-02 | 顧客契約の守秘条件 | 顧客ごとに共有範囲が異なる | 法務、契約書 | 案件開始時 | customer FAQ draft、提案資料 | 営業責任者 |
| UW-03 | セキュリティ標準文 | 顧客向け説明の前提が変わる | 情報システム | 月次 | FAQ、提案資料 | 情報システム |
| UW-04 | テンプレート利用条件 | 古い前提のテンプレート誤用を避ける | template lifecycle register | 月次 | prompt / template asset register | 保守担当 |
| UW-05 | 教材・研修資料 | 古い説明を教育に使わない | 社内研修担当 | 四半期ごと | learning operating brief | 研修担当 |

### 解説

変わりやすい情報を本文やテンプレートに固定せず、確認先、確認頻度、影響範囲を分けています。規制やツール仕様など最新性が必要な情報は、一次情報と所管部門で確認します。

## 演習17-4：template lifecycle register と retirement decision memo を作る

### template lifecycle register例

```text
資産ID: SALES-FAQ-001
名称: customer FAQ draft with evidence check
種別: プロンプト + 出力テンプレート
対象業務: 顧客向けFAQドラフト作成
利用条件:
- 顧客名、価格、契約条件を入力しない
- 社内AIのみ利用する
- 顧客共有前に営業責任者がレビューする
入力禁止情報:
- 顧客名、個人情報、契約金額、未公開ロードマップ、認証情報、内部URL
承認条件:
- 価格、契約、セキュリティに触れる場合は専門部門確認が必要
保守担当: 営業企画マネージャー
初版作成日: 2026-05-25
最終更新日: 2026-05-25
更新理由:
- 根拠資料欄と承認者欄を必須化した
利用状況:
- 限定チームで試行中
主なレビュー指摘:
- セキュリティ標準文の最新版確認が必要
廃止条件:
- 社内AI利用ルール、顧客向け標準文、承認フローが変更された場合
後継資産:
- 未定
状態: 試行中
```

### retirement decision memo例

```text
対象資産ID: SALES-FAQ-OLD-001
対象名: 旧FAQドラフトプロンプト
廃止 / 置換の理由:
- 根拠資料欄、未確認事項欄、承認者欄がなく、レビューで同じ指摘が繰り返された
問題になった前提:
- 顧客向けFAQを営業担当だけで完成できる前提になっていた
影響する業務:
- 顧客向けFAQ、提案後フォロー、営業レビュー
影響する利用者:
- 営業担当、営業責任者
リスク:
- 未承認の価格・契約・セキュリティ表現が顧客向け回答に混ざる
後継資産:
- SALES-FAQ-001 customer FAQ draft with evidence check
移行方法:
- 旧プロンプトを廃止済みに変更し、FAQからリンクを削除する
周知先:
- 営業担当、営業責任者、営業企画
廃止日: 次回レビュー会後
承認者: 営業企画マネージャー
ログ化先: template lifecycle register
```

### 解説

テンプレートの状態、保守担当、廃止条件を管理しています。廃止メモでは、後継資産と移行方法まで記録しているため、古いプロンプトの再利用を防ぎやすくなります。

## 演習17-5：team learning review board と sustained improvement report を作る

### team learning review board例

```text
項目ID: TLR-20260525-01
発見者: 営業担当
学習元: レビュー差し戻し
対象成果物: customer FAQ draft
提案内容:
- FAQテンプレートに「根拠資料」「未確認事項」「承認者」欄を必須化する
期待効果:
- 顧客共有前の根拠確認と承認確認を標準化できる
リスク:
- 入力項目が増え、初回作成の負荷が上がる
関係するテンプレート:
- SALES-FAQ-001、evidence matrix、review workflow board
レビュー担当:
- 営業責任者、営業企画
判断結果:
- 条件付き採用
反映先:
- prompt / template asset register、FAQ、learning operating brief
周知方法:
- 営業レビュー会で説明し、FAQに掲載する
次回確認日:
- 月末レビュー会
```

### sustained improvement report例

```text
対象期間: 2026年5月
対象チーム / 対象者: 法人営業提案チーム
使ったテンプレート:
- project outcome brief
- customer FAQ draft with evidence check
- evidence matrix
- review workflow board
改善された成果物:
- 初回提案資料、顧客向けFAQドラフト
役に立った章 / 付録:
- 第10章、 第13章、 第15章、 第16章
レビュー指摘の傾向:
- 根拠不足、承認者不明、セキュリティ標準文の確認漏れ
情報分類や承認で迷った点:
- 顧客質問の要旨をどこまで匿名化すればよいか
更新が必要なテンプレート:
- FAQドラフト、AI use boundary card
廃止すべきテンプレート:
- 根拠欄がない旧FAQプロンプト
追加すべきFAQ:
- セキュリティ表現の相談条件
- 価格条件に触れる回答の扱い
次に確認する一次情報 / 所管部門:
- 情報システムのセキュリティ標準文
- 法務の顧客契約確認観点
次の改善アクション:
- FAQテンプレートを更新する
- 旧FAQプロンプトを廃止済みにする
- 次回レビュー会で入力禁止情報の例を共有する
担当者: 営業企画マネージャー
次回確認日: 月末レビュー会
```

### 解説

個人の学びを、チームのテンプレート、FAQ、レビュー基準へ戻しています。継続改善では、更新だけでなく、廃止すべき前提を明確にすることが重要です。
