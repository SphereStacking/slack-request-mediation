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
  const response = getSlack("https://slack.com/api/chat.getPermalink", {
    channel: channel,
    message_ts: timestamp,
  });
  return response;
}
