# ドメインルール — gakuchika-log

## 1. 目的と基本思想

本ドキュメントでは、gakuchika-logのドメインモデル、データ間の関係、データ操作時に維持すべき不変条件、および未確定の設計事項を定義する。

本ドキュメントは、AIを含む開発者が、既存のドメインルールを理解し、データの不整合や意図しないデータ消失を引き起こさないようにするための参照資料である。

アーキテクチャと各モジュールの責務については `docs/architecture.md`、所有者・認証・認可・情報保護については `docs/security.md` を参照すること。

本アプリの基本思想は、次のとおりである。

**記録する → 整理する → 振り返る → 自分の言葉で文章化する**

AIは、過去の経験の検索、関連する経験の発見、振り返りの支援を目的とする。ユーザー本人の経験を無視してガクチカやESを自動生成することを主目的とはしない。

## 2. 記述の分類

本ドキュメントでは、事項を以下のように区別する。

- **【現行実装】** 現在のコードで実装されている動作。
- **【確定要件】** 今後の実装でも守るべき、合意済みのプロダクト要件。
- **【未確定】** 今後の実装前に、開発者の判断が必要な事項。

現行実装が存在することだけを理由に、その動作を将来も維持すべき仕様として確定したものと扱わないこと。

逆に、確定要件に反する既存実装が確認された場合は、その不一致を明示し、既存実装に合わせるだけで解決しないこと。

未確定事項は、一般的な設計慣行やAIの推測だけを根拠として確定しないこと。

## 3. ドメインモデル

### 3.1 Category（カテゴリ）

大学生活における活動を分類するための大分類である。

例：

- サークル
- アルバイト
- 学業
- 個人開発

Categoryは活動を整理するための分類であり、ProjectやActivityRecordそのものを表すものではない。

**【確定要件】**

- Categoryを削除しても、ProjectやActivityRecordを連鎖的に削除しない。
- Category削除によって、関連するGakuchikaやESデータを連鎖的に削除しない。
- 現在の未分類への移行方針を、承認なしに別の削除動作へ変更しない。

**【現行実装】**

- Category削除時、影響を受けるProjectとActivityを未分類の状態へ移行する。

### 3.2 Project（プロジェクト）

複数の活動記録をまとめる単位である。

プロジェクト名は必須であり、説明、カテゴリ、開始日、終了日は任意である。

**【確定要件】**

- ActivityRecordはProjectに所属する。
- ProjectはActivityRecordをまとめる単位であり、Profileに登録された「主な活動」とは別概念である。
- Profileの「主な活動」を編集しても、Projectを自動生成しない。

**【現行実装】**

- ActivityRecordは`projectId`を保持する。
- Projectのカテゴリを変更すると、関連するActivityRecordの`categoryKey`も同期される。

Project削除時の関連Activityの扱いについては、第7節を参照すること。

### 3.3 ActivityRecord（活動記録）

大学生活で経験した具体的な出来事や活動を記録する単位である。

タイトル、内容、日付、場所、所属Project、タグなどを管理する。苦労、工夫、学びなどのすべての項目を、活動記録の作成時に必須としない。

**【確定要件】**

- ActivityRecordはProjectに所属する。
- ActivityRecordは既存ProjectのIDを参照する。
- 編集時に既存のIDを変更しない。
- ActivityRecordは複数のGakuchikaRecordから再利用できる。
- CategoryまたはTagの削除によって、ActivityRecord本体を意図せず削除しない。

**【現行実装】**

- ActivityRecordは`projectId`を持つ。
- ActivityRecordは`categoryKey`も保持する。
- Activity作成時にはProjectから`categoryKey`を設定する。
- Projectのカテゴリ変更時には関連するActivityRecordの`categoryKey`を同期する。

`projectId`と`categoryKey`の二重保持は現行実装の事実である。将来のデータベースでも同じ形にするかどうかは未確定であり、無関係なリファクタリングの一環として`categoryKey`を削除しないこと。

### 3.4 GakuchikaRecord（ガクチカ）

複数の活動記録を材料として、経験を振り返り、就職活動で活用できる形に整理する単位である。

背景・課題、困難、行動・工夫、役割、結果・変化、学びなどを整理する。

**【確定要件】**

- 1つのProjectに関係する経験から、複数のガクチカを作成できる。
- 1つのActivityRecordを複数のGakuchikaRecordで再利用できる。
- GakuchikaRecordとActivityRecordの関係を、不必要に1対1へ制限しない。
- 他の所有者のActivityRecordを関連付けない。

**【現行実装】**

- `GakuchikaRecord.relatedActivityIds`は複数のActivityRecordを参照する。
- Repositoryでは、GakuchikaRecordと参照先ActivityRecordの所有者の整合性を確認する。

GakuchikaRecordとProjectの直接的な関連を、将来のDB上でも独立した外部キーとして持つかどうかは未確定である。現在確認できているデータモデルを超えて、直接的な関連を推測で追加しないこと。

### 3.5 EsData（ESデータ）

企業名、設問、文字数上限、本文などを管理し、ガクチカに関連付けてESを作成するためのデータである。

**【確定要件】**

- ESはガクチカに関連付けて管理する。
- ESの文章化は本人が行うことを基本とする。
- Category削除などの操作によって、ESデータを連鎖的に削除しない。

**【現行実装】**

- `EsData`は独立したトップレベルのレコードではなく、`GakuchikaRecord.es`に埋め込まれている。
- ESデータの所有者と親GakuchikaRecordの所有者との整合性を確認する処理が存在する。

ESを将来のデータベースで独立テーブルにするかどうかは未確定である。DB設計が確定する前に、保存モデルを独断で変更しないこと。

### 3.6 ProfileSummary（プロフィール）

学年、志望業界、興味のある職種、主な活動など、ユーザーのプロフィール情報を表す。

**【確定要件】**

- 主な活動は最大5件まで登録できる。
- プロフィールとActivityRecordは別概念である。
- 必要以上の個人情報を収集しない。
- Profileの「主な活動」からProjectを自動生成しない。

**【現行実装】**

- `ProfileSummary`には`ownerId`がない。

バックエンド導入時のProfileの所有者との紐付け方は未確定であり、実装前に設計を決定すること。

### 3.7 Tag（タグ）

ActivityRecordを分類するための情報である。

**【確定要件】**

- Tagの削除によってActivityRecord本体を削除しない。
- タグとActivityRecordの関連を解除しても、ActivityRecordの内容を維持する。

**【現行実装】**

- Tag削除時には、関連するActivityRecordの`tagIds`から対象のTag IDを除去する。

将来のDBで中間テーブルをどのように構成するかはDB設計時に決定する。ただし、保存方式にかかわらず、Tagの削除とActivityRecordの削除は区別すること。

## 4. ドメイン間の関係

概念上の関係は次のとおりである。

```text
Category
   |
   v
Project
   |
   v
ActivityRecord
   ^
   | 複数のActivityRecordを参照可能
   |
GakuchikaRecord
   |
   v
EsData
（現行実装では GakuchikaRecord.es に内包）
```

TagはActivityRecordの分類に用いられる。ProfileSummaryはこれらの活動記録とは別の概念として扱う。

上図は概念上の関係を表すものであり、将来のDBテーブル構成、外部キー、削除制約を確定するものではない。

### 4.1 ActivityRecordとProject

- ActivityRecordはProjectに所属する。
- ActivityRecordの`projectId`は、存在する適切なProjectを参照しなければならない。
- ActivityRecordの所有者は、参照先Projectの所有者と一致しなければならない。
- ActivityRecord作成時のカテゴリ情報はProjectに基づいて設定する。
- Projectのカテゴリ変更時には、関連するActivityRecordの`categoryKey`との整合性を維持する。

バックエンドでは、Projectの存在や所有者の整合性をクライアント側の確認だけに依存しないこと。

### 4.2 GakuchikaRecordとActivityRecord

- GakuchikaRecordは複数のActivityRecordを参照できる。
- 同じActivityRecordを複数のGakuchikaRecordから再利用できる。
- 関連付けの作成・更新では、参照先ActivityRecordの存在と所有者を検証する。
- 異なる所有者間の関連付けを許可しない。
- ActivityRecordの削除や関連IDの変更では、GakuchikaRecordの参照整合性を維持する。

ActivityRecordを再利用可能な経験の素材として扱い、1つのガクチカにしか使えない設計へ変更しないこと。

### 4.3 TagとActivityRecord

- 1つのActivityRecordは複数のTagを持つことができる。
- Tag削除時には関連を解除し、ActivityRecord本体を維持する。
- Tagの削除処理がActivityRecord自体の削除処理を呼び出す構造にしない。

具体的な多対多関係のDB表現は、バックエンド設計時に決定する。

### 4.4 ESとGakuchikaRecord

- ESはガクチカに関連付けて管理する。
- 現行実装ではESデータは`GakuchikaRecord.es`に内包されている。
- ESの所有者は、親GakuchikaRecordの所有者と整合しなければならない。
- ESの独立テーブル化は未確定である。

## 5. IDとデータ整合性

### 5.1 IDの維持

**【確定要件】**

既存レコードの編集では、そのレコードのIDを維持すること。

更新処理を、既存レコードの削除と新規レコードの作成に置き換えないこと。参照元のID、関連関係、データの同一性を壊さないようにする。

テストでは、更新前後でIDが同一であることを確認する。

### 5.2 関連IDの整合性

**【確定要件】**

- `ActivityRecord.projectId`は適切なProjectを参照する。
- `GakuchikaRecord.relatedActivityIds`は実在し、参照が許可されるActivityRecordを参照する。
- ActivityRecordの削除時には、関連するGakuchikaRecordの参照も整合した状態にする。
- 所有者が異なるレコード間の関連付けを作成しない。
- 編集や関連変更によって、無関係なレコードのIDを変更しない。

これらはアプリケーション側のテスト対象である。バックエンド導入後は、可能な制約をDBでも保証する。

### 5.3 データの削除と保持

削除処理では、対象レコードそのものの削除と、他レコードからの関連解除を区別すること。

Category、Tag、Projectの削除動作はそれぞれ異なる。1つの削除方式をすべてのモデルに一律適用しないこと。

削除処理を変更する場合は、関連するデータの残存状態、参照ID、GakuchikaRecord、ESへの影響をテストで確認すること。

## 6. 所有者とデータ境界に関するドメインルール

現在のローカル実装では、`LOCAL_OWNER_ID = "local-user"`を利用し、Repositoryなどで所有者の整合性を検証している。

現行実装で保護対象となる主な関係は次のとおりである。

- ActivityRecordとProject
- GakuchikaRecordと参照先ActivityRecord
- ESデータと親GakuchikaRecord
- 通常検索の検索結果
- AI検索の検索元解決
- Hydration時の関連データ

**現在の所有者チェックはクライアント側の論理的なデータ分離であり、サーバー側の認可ではない。**

Supabase Auth、PostgreSQL、RLSは未導入である。実装済みであるかのように扱わないこと。

バックエンド導入後は、認証されたユーザーの所有権をDB側で検証し、関連するレコード間でも所有者の一致を保証する必要がある。詳細は `docs/security.md` を参照すること。

## 7. 削除時の動作

### 7.1 Category削除

**【確定要件】**

Categoryの削除によって、Project、ActivityRecord、GakuchikaRecord、ESデータを連鎖的に削除しないこと。

**【現行実装】**

影響を受けるProjectとActivityを未分類の状態へ移行する。

**【バックエンド設計上の未確定事項】**

DBでCategoryとの関連をどのように表現するか、未分類への移行をどのようなトランザクションや制約で保証するかは未確定である。

### 7.2 Tag削除

**【確定要件】**

Tagの削除によってActivityRecord本体を削除しない。TagとActivityRecordの関連を解除する。

**【現行実装】**

ActivityRecordの`tagIds`から削除対象TagのIDを除去する。

**【バックエンド設計上の未確定事項】**

TagとActivityRecordの関連テーブル、外部キー、削除制約の具体的な設計は未確定である。

### 7.3 Project削除

**【現行実装】**

Project削除時は、関連するActivityを削除し、GakuchikaRecordの関連IDからも該当ActivityのIDを除去する。

この動作を無関係な変更として変更しないこと。

**【バックエンド設計上の未確定事項】**

バックエンドでも関連Activityを削除するかどうか、削除時に確認や警告を設けるかどうか、DBの外部キーやトランザクションでどのように実現するかは未確定である。

### 7.4 ActivityRecord削除

ActivityRecordを削除する場合は、そのActivityを参照するGakuchikaRecordの関連IDを整合した状態にすること。

削除処理によって、関連するGakuchikaRecordそのものや、そこに保存されたESデータまで意図せず削除しないこと。

### 7.5 GakuchikaRecord削除

GakuchikaRecordの削除と、参照しているActivityRecordの削除を区別すること。

GakuchikaRecordを削除しただけで、再利用可能なActivityRecordを削除しないこと。

## 8. ProfileとActivityの分離

ProfileSummaryの「主な活動」は、ユーザーが自分の背景や関心を整理するためのプロフィール情報である。

ActivityRecordは、具体的な経験や出来事を記録するためのデータである。

両者の役割を混同しないこと。

**【確定要件】**

- Profileの主な活動は最大5件とする。
- Profileの変更を理由に、ProjectやActivityRecordを自動生成しない。
- Profileの変更を理由に、既存のActivityRecordを削除しない。
- プロフィールとして登録された活動名を、具体的な出来事の記録と同等に扱わない。

## 9. 検索のドメインルール

### 9.1 キーワード検索

キーワード検索は既存機能である。

検索対象を追加・変更する場合は、関連するデータ種別と結果の整合性を確認すること。検索結果として返すレコードについても、現在の所有者の境界を維持すること。

活動記録、Project、ガクチカ、ESを横断して検索する機能は要件である。各対象が現行実装でどの範囲まで検索されるかは、変更時に実装とテストを確認すること。

### 9.2 AI検索

AI検索の画面、型、状態遷移、検索元の解決ロジックは存在するが、実際のAIサービスは未接続である。

**【確定要件】**

- AI検索の対象は原則として現在のユーザー自身の記録とする。
- AIが返した検索元IDを無条件に信頼しない。
- 検索元の存在と所有者を、解決時に再検証する。
- 他の所有者のデータを検索結果として返さない。
- AI機能を導入する場合は、必要最小限のデータのみを渡す。

Embeddingやベクトル検索は未実装であり、既存機能として扱わないこと。

## 10. データ復元に関する注意事項

`restoreData`はスナップショットを直接Zustandの状態へ設定し、Repositoryを通らないデータ投入経路である。

そのため、Repositoryで実施している検証が、復元されたデータにもすべて適用されるとは限らない。

**【未確定】**

- 復元時にスナップショット全体の構造や型を検証するか。
- 不正な参照や所有者の不整合を検出した場合、復元を拒否するか、修復可能な範囲で正規化するか。
- 復元データをどのように検証・正規化するか。
- バックエンド移行時に、既存のローカルデータをどのように扱うか。

これらを決めるまでは、restoreDataが安全な入力検証を実施していると仮定しないこと。また、今回の設計判断を伴わない作業で、復元仕様を勝手に変更しないこと。

## 11. 自動テストで保証するルール

以下は、重要なドメインルールとしてテスト対象にする。

### 11.1 現在の実装で維持するテスト

- ActivityRecord作成時のProjectの存在および所有者の整合性
- ActivityRecordとProjectのカテゴリ情報の整合性
- GakuchikaRecordと参照ActivityRecordの所有者の整合性
- ActivityRecordを複数のGakuchikaRecordで再利用できること
- 異なる所有者間の関連付けが拒否されること
- Category削除でProjectとActivityRecordが未分類へ移行し、本体が残ること
- Tag削除でActivityRecord本体が残り、関連Tag IDだけが除去されること
- Project削除時に、現行仕様どおり関連ActivityとGakuchikaの関連IDが処理されること
- 既存レコードの編集でIDが維持されること
- ESデータと親GakuchikaRecordの所有者が整合すること
- 通常検索の結果が所有者の境界を越えないこと
- AI検索の検索元を解決する際に、存在と所有者を検証すること
- Hydration時に不整合な関連データを適切に処理すること

既存テストの一覧や実際の検証範囲は、テストコードを確認すること。名称だけで保証できていると判断しないこと。

### 11.2 バックエンド導入時に追加するテスト

- DB制約による参照整合性
- owner_idの整合性
- RLSによるユーザー間の分離
- INSERT、SELECT、UPDATE、DELETEの認可
- cross-owner relationの作成拒否
- Category、Tag、Projectの削除時のDB上の動作
- MigrationからDBを再構築した場合の制約・RLSの適用
- 通信失敗や認証エラー時の動作

### 11.3 AI・Embedding導入時に追加するテスト

- AIへの入力に他ユーザーのデータが含まれないこと
- AIへ送信するデータが必要最小限であること
- 検索元の存在と所有者が検証されること
- Embeddingの検索が所有者の境界を越えないこと
- 元データ削除時にEmbeddingや検索インデックスから情報が意図せず残存・露出しないこと
- AIサービスの失敗や未設定状態が適切に処理されること

テストは単なる実装詳細ではなく、ドメイン上の不変条件を守るための機械的な保証として扱うこと。

## 12. ドメインルールを変更する場合

ドメインルールを変更する場合は、次の手順に従うこと。

1. 変更対象のルールと、変更が必要な理由を明確にする。
2. 関連する既存コードとテストを確認する。
3. 現行実装、確定要件、未確定事項のどれに該当するかを区別する。
4. 判断が必要な仕様については、開発者の承認を得る。
5. 必要最小限の実装変更を行う。
6. 関連するテストを追加・更新する。
7. 本ドキュメントと、影響を受ける他の設計ドキュメントを更新する。
8. `npm run verify`を実行し、実際の結果を確認する。

検証を通すためだけにテストを削除・弱体化しないこと。

ドメインルールを意図的に変更した場合は、変更内容と理由を説明できる状態にすること。

## 13. 未確定の設計事項

以下は、現時点で未確定の事項であり、必要な設計判断を行うまで勝手に確定しないこと。

- `ActivityRecord.categoryKey`をバックエンドでも保持するか、Projectから導出するか
- Project削除時にActivityRecordを削除する方針をバックエンドでも維持するか
- `ProfileSummary`をどのように保存し、ユーザーに紐付けるか
- `restoreData`に対してどの検証・正規化方針を採用するか
- ESを独立テーブルにするか
- Category、Tag、Projectの削除をDB制約やトランザクションでどのように実現するか
- GakuchikaとActivityの多対多関係をDB上でどう表現するか
- AsyncStorageからSupabaseへの移行時に、既存データを移行するかどうか
- 匿名認証のユーザーIDと各レコードの所有権をどう対応させるか

本ドキュメントの目的は、未確定事項を推測で埋めることではなく、既存のルールを明示し、将来の設計判断が必要な箇所を明確にすることである。
