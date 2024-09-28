/**
 * Slackの初回接続リクエスト（url_verification）かどうかを判定し、適切な処理を行う
 * @param {string} type - リクエストのタイプ
 * @returns {bool} - 初回接続の場合 true
 */
function isSlackInitConect(type) {
  return type === "url_verification"
}
