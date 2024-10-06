import { scriptProperties } from "@/ScriptProperties";
import { logInfo, logError } from "@/Logger";

/**
 * Slack post api
 * @param {string} url - 送信先URL
 * @param {Object} payload - ペイロード
 * @returns {GoogleAppsScript.URL_Fetch.HTTPResponse} - レスポンス
 */
export function postSlack(url: string, payload: any) {
  const token = scriptProperties.SLACK_BOT_USER_OAUTH_TOKEN; // Bot User OAuth Tokenを設定
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: "post",
    contentType: "application/json; charset=utf-8", // charsetを追加
    headers: {
      Authorization: `Bearer ${token}`,
    },
    payload: JSON.stringify(payload),
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    logInfo({
      url: url,
      options: options,
      response: response.getContentText(),
    });
    return JSON.parse(response.getContentText());
  } catch (e) {
    logError({ error: e });
    throw e;
  }
}

/**
 * Slack get
 * @param {string} url - 送信先URL
 * @param {Object} payload - ペイロード
 * @returns {GoogleAppsScript.URL_Fetch.HTTPResponse} - レスポンス
 */
export function getSlack(url: string, payload: any) {
  const token = scriptProperties.SLACK_BOT_USER_OAUTH_TOKEN; // Bot User OAuth Tokenを設定
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: "get",
    contentType: "application/x-www-form-urlencoded",
    payload: {
      token: token,
      ...payload,
    },
  };
  try {
    const response = UrlFetchApp.fetch(url, options);
    logInfo({
      url: url,
      options: options,
      response: response.getContentText(),
    });
    return JSON.parse(response.getContentText());
  } catch (e) {
    logError({ error: e });
    throw e;
  }
}

/**
 * ダイレクトメッセージを送信する
 * @param {string} userId - ユーザーID
 * @param {Object} payload - ペイロード
 * @returns {GoogleAppsScript.URL_Fetch.HTTPResponse} - レスポンス
 */
export function postDirectMessage(userId: string, payload: any) {
  return postSlack("https://slack.com/api/chat.postMessage", {
    //本来はuserIdは非推奨らしいのでいつか帰る。
    channel: userId, // ユーザーIDを指定
    ...payload,
  });
}

/**
 * ダイレクトメッセージを送信する
 * @param {string} userId - ユーザーID
 * @param {Object} payload - ペイロード
 * @returns {GoogleAppsScript.URL_Fetch.HTTPResponse} - レスポンス
 */
export function postChannelMessage(channelId: string, payload: any) {
  return postSlack("https://slack.com/api/chat.postMessage", {
    channel: channelId, // チャンネルIDを指定
    ...payload,
  });
}
/**
 * ホーム画面を更新する
 * @param {string} user_id - ユーザーID
 * @param {Object} payload - ペイロード
 * @returns {GoogleAppsScript.URL_Fetch.HTTPResponse} - レスポンス
 */
export function postAppHome(user_id: string, payload: any) {
  return postSlack("https://slack.com/api/views.publish", {
    user_id: user_id,
    view: {
      type: "home",
      ...payload,
    },
  });
}

/**
 * モーダルを開く
 * @param {string} trigger_id - トリガーID
 * @param {Object} payload - ペイロード
 * @returns {GoogleAppsScript.URL_Fetch.HTTPResponse} - レスポンス
 */
export function postViewsOpen(trigger_id: string, payload: any) {
  return postSlack("https://slack.com/api/views.open", {
    trigger_id: trigger_id,
    ...payload,
  });
}

/**
 * メッセージのURLを取得する
 * @param {string} channel - チャンネルID
 * @param {string} timestamp - タイムスタンプ
 * @returns {GoogleAppsScript.URL_Fetch.HTTPResponse} - レスポンス
 */
export function getPermalink(channel: string, timestamp: string) {
  return getSlack("https://slack.com/api/chat.getPermalink", {
    channel: channel,
    message_ts: timestamp,
  });
}

/**
 * チャンネルに参加しているユーザーを取得する
 * @param {string} channelId - チャンネルID
 */
export function getConversationsMembers(channelId: string) {
  return getSlack("https://slack.com/api/conversations.members", {
    channel: channelId,
  });
}

/**
 * チャンネルに参加する
 * @param {string} channelId - チャンネルID
 */
export function postJoinChannel(channelId: string) {
  return postSlack("https://slack.com/api/conversations.join", {
    channel: channelId,
  });
}

/**
 * スレッドにメッセージを投稿する
 * @param {string} thread_ts - スレッドのタイムスタンプ
 * @param {string} message - 投稿するメッセージ
 */
export function postMessageToThread(channelId: string, thread_ts: string, message: { text?: string; blocks?: any[] }) {
  try {
    postSlack("https://slack.com/api/chat.postMessage", {
      channel: channelId,
      thread_ts: thread_ts,
      ...message,
    });
  } catch (error) {
    logError({ error: error });
    throw new Error("Failed to post message to thread");
  }
}

/**
 * 投稿したメッセージを編集する
 * @param {string} channelId - チャンネルID
 * @param {string} timestamp - メッセージのタイムスタンプ
 * @param {Object} message - 編集するメッセージ内容
 * @returns {GoogleAppsScript.URL_Fetch.HTTPResponse} - レスポンス
 */
export function updateMessage(channelId: string, timestamp: string, message: { text?: string; blocks?: any[] }) {
  try {
    return postSlack("https://slack.com/api/chat.update", {
      channel: channelId,
      ts: timestamp,
      ...message,
    });
  } catch (error) {
    logError({ error: error });
    throw new Error("Failed to update message");
  }
}
