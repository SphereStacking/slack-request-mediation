#!/bin/bash -e

description=$1

# コードをGASにpush
clasp push --force

# 最新のデプロイIDを取得
LATEST_DEPLOYMENT_ID=$(clasp deployments | grep -oP '(?<=- )AKfycb[^\s]+' | head -n 1)

# デプロイIDが見つからない場合
if [ -z "$LATEST_DEPLOYMENT_ID" ]; then
  echo "Error: No deployment ID found."
  exit 1
fi

# 新しいバージョンを作成
clasp version $description

# 最新のバージョン番号を取得
LATEST_VERSION=$(clasp versions | grep -oP '^\d+' | head -n 1)

# バージョン番号が見つからない場合
if [ -z "$LATEST_VERSION" ]; then
  echo "Error: バージョン番号が見つかりません。"
  exit 1
fi

# 最新のバージョンを最新のデプロイIDにデプロイ
clasp deploy -i "$LATEST_DEPLOYMENT_ID" -V "$LATEST_VERSION"

echo "デプロイ成功🟢: $NEW_DEPLOYMENT_ID"
