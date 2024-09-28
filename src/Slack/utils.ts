/**
 * Slackの初回接続リクエスト（url_verification）かどうかを判定し、適切な処理を行う
 * @param {string} type - リクエストのタイプ
 * @returns {boolean} - 初回接続の場合 true
 */
export function isSlackInitConnect(type: string): boolean {
  return type === "url_verification";
}
