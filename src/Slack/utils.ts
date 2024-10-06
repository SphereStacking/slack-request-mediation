/**
 * Slackの初回接続リクエスト（url_verification）かどうかを判定し、適切な処理を行う
 * @param {string} type - リクエストのタイプ
 * @returns {boolean} - 初回接続の場合 true
 */
export function isSlackInitConnect(type: string): boolean {
  return type === "url_verification";
}

/**
 * SlackのURLからチャンネルIDとスレッドのタイムスタンプを取得する
 * @param {string} slack_url - SlackのURL
 * @returns {{ channelId: string , threadTimestamp: string }} - チャンネルIDとスレッドのタイムスタンプ
 */
export function extractChannelIdAndTimestamp(slack_url: string): {
  channelId: string;
  threadTimestamp: string;
} {
  const channelMatch = slack_url.match(/archives\/(.*?)\//);
  const timestampMatch = slack_url.match(/p(\d{16})/);

  if (!channelMatch || !channelMatch[1]) {
    throw new Error("Invalid Slack URL: Channel ID not found");
  }

  if (!timestampMatch || !timestampMatch[1]) {
    throw new Error("Invalid Slack URL: Thread timestamp not found");
  }

  const channelId = channelMatch[1];
  const threadTimestamp = `${timestampMatch[1].slice(0, 10)}.${timestampMatch[1].slice(10)}`;

  return { channelId, threadTimestamp };
}
