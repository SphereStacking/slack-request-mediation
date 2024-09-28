#!/bin/bash -e

latest=$1

# コードをGASにpush
clasp push --force

# デプロイIDのリストを取得
DEPLOYMENT_IDS=$(clasp deployments | grep -oP '(?<=- )AKfycb[^\s]+')

# デプロイIDが見つからない場合
if [ -z "$DEPLOYMENT_IDS" ]; then
  echo "Error: No deployment IDs found."
  exit 1
fi

# デプロイIDを選択形式で表示
select_deployment_id() {
  if [ "$latest" == "latest" ]; then
    echo "$DEPLOYMENT_IDS" | tail -n 1
  else
    echo "Select a deployment ID:"
    select id in $DEPLOYMENT_IDS; do
      if [ -n "$id" ]; then
        echo "$id"
        break
      else
        echo "Invalid selection. Please try again."
      fi
    done
  fi
}

# 最新のバージョン番号を取得
get_latest_version() {
  local versions=$(clasp versions | grep -oP '^\d+')
  if [ -z "$versions" ]; then
    echo "Error: バージョン番号が見つかりません。"
    exit 1
  fi

  if [ "$latest" == "latest" ]; then
    echo "$versions" | tail -n 1
  else
    echo "Select a version number:"
    select version in $versions; do
      if [ -n "$version" ]; then
        echo "$version"
        break
      else
        echo "Invalid selection. Please try again."
      fi
    done
  fi
}

LATEST_DEPLOYMENT_ID=$(select_deployment_id)

# 最新のバージョンを作成
clasp version  

LATEST_VERSION=$(get_latest_version)

echo "LATEST_DEPLOYMENT_ID: $LATEST_DEPLOYMENT_ID"
echo "LATEST_VERSION: $LATEST_VERSION"

echo "clasp deploy -i ${LATEST_DEPLOYMENT_ID} -V ${LATEST_VERSION}"

# 最新のバージョンを最新のデプロイIDにデプロイ
clasp deploy -i "$LATEST_DEPLOYMENT_ID" -V "$LATEST_VERSION"

echo "デプロイ成功🟢: $LATEST_DEPLOYMENT_ID"
