# 📝TaskClip🖇

## 概要

TaskClipは、Slack上でタスクの依頼を管理し、リマインドを行うためのアプリケーションです。

チームのタスク管理を効率化し、コミュニケーションを円滑にすることを目的としています。

## 機能

- **依頼関連**
  - [x] 依頼登録
  - [x] 依頼完了
  - [x] 依頼へのアクション通知
  - [ ] 依頼編集
  - [x] **チャンネルへの依頼メッセージの送信**
  - [ ] 依頼メッセージへのリアクション機能

- **リマインド機能**
  - [x] DMへの定期リマインド
  - [x] 依頼者からの強制リマインド
  - [ ] リマインド時間のカスタム変更
  - [ ] タスクの優先度による強制リマインド

- **App Home表示**
  - [x] 定期的なHomeの同期機能
  - [x] アサインされているタスク
  - [x] アサインしたタスク
  - [ ] ステータスの表示

## 使用技術

- Google Apps Script
- Google SpreadSheet API
- Slack API
- typescript
- rollup
- clasp

## コマンド

> [!NOTE]
> 全てコンテナ内から行う
>
> ``` sh
> docker exec -it task-clip-app bash
> ```

- GASに反映されているコードをローカルに持ってくる

  ``` sh
  clasp pull
  ```

- ローカルのコードをGASに反映する

  ``` sh
  clasp push --watch
  ```

- ローカルのコードをGASに反映する

  ``` sh
  clasp push
  ```

- GASをブラウザで開く

  ``` sh
  clasp open
  ```

- GASをブラウザで開く

  ``` sh
  npx clasp open
  ```

- GASの同じデプロイIDに別のバージョンをデプロイする

  ``` sh
  clasp deployments
  #出力された中からdeployIdをメモ
  clasp version
  #出力された中からversionをメモ

  clasp deploy -i [deployId] -V [version]
  ```

## 環境起動

### 初回起動 / 再構築

``` sh
docker compose build --no-cache
docker compose up -d
docker compose ps
```

### 以降

``` sh
docker compose up -d
docker exec -it task-clip-app bash
```

## Setup

### envファイルの作成

1. .env.exampleを.envにコピー

  ``` sh
  cp .env.example .env
  ```

### Apps ScriptのPJ作成

1. [script.google.com](https://script.google.com/home)にアクセス
2. New Project
3. プロジェクト名を入力
4. プロジェクトが作成
5. projectの設定からスクリプト IDを取得
6. 取得したスクリプト IDを.envに設定

  > [!NOTE]
  > とりあえずはじめはprodだけでよい。
  > 運用開始してからはdevとprodを作成してそれぞれの環境を運用していく。

### slack appの作成

1. [slack apps](https://api.slack.com/apps)を開く
2. Create New Appを押下
3. Create an appモーダル
   1. Form a manifestを押下
   2. インストール先のワークスペースを選択
   3. Jsonのタブをクリック
   4. [slackAppManifest.json](./slackAppManifest.json)の中身をコピーして貼り付け
   5. Createを押下

### GASのスクリプト プロパティの設定

1. 作製したプロジェクトを選択
2. スクリプトのプロパティを選択
3. スクリプトのプロパティの値を設定
  [src/ScriptProperties.ts](./src/ScriptProperties.ts)の値を設定
  getProperty()の引数に設定したプロパティ名を全て設定

### GASのトリガーの設定

1. 作製したプロジェクトを選択
2. トリガーを選択
3. トリガーの設定
4. トリガーの追加

    | 関数名 | イベントソース | イベントタイプ  | 実行頻度 |
    | :--- | :--- | :--- | :--- |
    | taskAddedNotification | 時間主導型 | タイマー | 1分に1回 |
    | taskRemindInProgressAllUserNotification | 時間主導型 | タイマー | 2時間に1回 |

### GASをWebアプリケーションとしてデプロイ

GASをWebアプリケーションとしてデプロイしたら
URLが生成されるので

<https://script.google.com/macros/s/[deployId]/exec>

### Slack App ManifestのRequest URLを設定

下記のSlack api画面を開きそれぞれRequest URLに生成されたURLを設定する

- [Interactivity & Shortcuts](https://api.slack.com/apps/A07PK4A0A84/interactive-messages)
- [Event Subscriptions](https://api.slack.com/apps/A07PK4A0A84/event-subscriptions)

## FAQ

<details>
<summary>clasp – The Apps Script CLI のリクエストは無効です</summary>

下記の記事を参考にして、解決しました感謝
[clasp login --no-localhost が使えない](https://qiita.com/naoyeah/items/0db5fc82561020f2768e)

</details>

<details>
<summary>Google Apps Script APIが有効になっていないため、clasp pushが失敗</summary>

1. [Google Apps Script API](https://script.google.com/home/usersettings)を有効にします。
2. APIを有効にした後、数分待ってから再度clasp pushを実行します。
3. 再度ターミナルでnpx clasp pushを実行します。

</details>

<details>
<summary>GASでimport exportが使えない</summary>

[[Clasp] Google Apps Script で npm install した package を利用する](https://qiita.com/suzukenz/items/dbe13d5f8884752a37f8)

</details>

<!-- markdownlint-configure-file
{
  "no-inline-html": {
    "allowed_elements": ["details", "summary"]
  }
}
-->
