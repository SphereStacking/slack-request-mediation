# TaskClip

WIP タスクの依頼を管理しRemindするSlackアプリ

- [x] タスク登録
- [ ] タスク編集変更
- [ ] リマインド
  - [x] DMへの定期リマインド
  - [ ] リマインド時間のカスタム変更
  - [ ] タスクの優先度による強制リマインド
- [ ] チャンネルへのタスク依頼メッセージの転送
- [ ] メッセージへのリアクション機能
  - [ ] 完了
  - [ ] LGTM
  - [ ] 目 (アサインへ追加)
- [x] app homeへの表示
  - [x] 定期的なHomeのsync機能
  - [x] アサインされてるタスク
  - [x] アサインしたタスク
- [ ] / @ による反応の作成
  - [ ] /[app_name]-add-task (タスク登録)
  - [ ] /[app_name]-my-tasks (自分がアサインされたタスク)
  - [ ] /[app_name]-assign-tasks (自分がアサインしたタスク)

## コマンド

> [!NOTE]
> 全てコンテナ内から行う
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

### GASをWebアプリケーションとしてデプロイ

GASをWebアプリケーションとしてデプロイしたら
URLが生成されるので

https://script.google.com/macros/s/[deployId]/exec

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
