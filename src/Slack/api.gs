
/**
 * Slack post api
 * @param {string} url - 送信先URL
 * @param {Object} payload - ペイロード
 * @returns {Object} - レスポンス
 */
function postSlack(url,payload) {
  var token = SlackBotUserOAuthToken;  // Bot User OAuth Tokenを設定
  var options = {
    'method': 'post',
    'contentType': 'application/json; charset=utf-8',  // charsetを追加
    'headers': {
      'Authorization': 'Bearer ' + token
    },
    'payload': JSON.stringify(payload)
  };
  try{
    const response = UrlFetchApp.fetch(url, options);
    logInfo({url:url,options:options,response:response.getContentText()})
  }catch(e){
    logError({error:e})
    throw e
  }
  return JSON.parse(response.getContentText());

}

/**
 * Slack get
 * @param {string} url - 送信先URL
 * @param {Object} payload - ペイロード
 * @returns {Object} - レスポンス
 */
function getSlack(url,payload) {
  var token = SlackBotUserOAuthToken;  // Bot User OAuth Tokenを設定
  var options = {
    'method': 'get',
    'contentType': 'application/x-www-form-urlencoded',
    'payload': {
      token: token,
      ...payload
    }
  };
  try{
    var response = UrlFetchApp.fetch(url, options);
    logInfo({url:url,options:options,response:response.getContentText()})
  }catch(e){
    logError({error:e})
    throw e
  }
  return JSON.parse(response.getContentText());
}

/**
 * ダイレクトメッセージを送信する
 * @param {string} userId - ユーザーID
 * @param {Object} payload - ペイロード
 * @returns {Object} - レスポンス
 */
function postDirectMessage(userId,payload) {
  return postSlack(
    'https://slack.com/api/chat.postMessage',
    {
      //本来はuserIdは非推奨らしいのでいつか帰る。
      'channel': userId,  // ユーザーIDを指定
      ...payload
    }
  )
}
/**
 * ダイレクトメッセージを送信する
 * @param {string} userId - ユーザーID
 * @param {Object} payload - ペイロード
 * @returns {Object} - レスポンス
 */
function postChannelMessage(channelId,payload) {
  return postSlack(
    'https://slack.com/api/chat.postMessage',
    {
      'channel': channelId,  // チャンネルIDを指定
      ...payload
    }
  )
}
/**
 * ホーム画面を更新する
 * @param {string} user_id - ユーザーID
 * @param {Object} payload - ペイロード
 * @returns {Object} - レスポンス
 */
function postAppHome(user_id,payload) {
  return postSlack(
    'https://slack.com/api/views.publish',
    {
    'user_id': user_id,
    'view': {
      'type': 'home',
      ...payload
    }
  });
}

/**
 * モーダルを開く
 * @param {string} trigger_id - トリガーID
 * @param {Object} payload - ペイロード
 * @returns {Object} - レスポンス
 */
function postViewsOpen(trigger_id,payload) {
  return postSlack(
    'https://slack.com/api/views.open',
    {
      "trigger_id": trigger_id,
      ...payload
    }
  )
}

/**
 * メッセージのURLを取得する
 * @param {string} channel - チャンネルID
 * @param {string} timestamp - タイムスタンプ
 * @returns {Object} - レスポンス
 */
function getPermalink(channel,timestamp){
  const response = getSlack(
    'https://slack.com/api/chat.getPermalink',
    {
      "channel": channel, 
      "message_ts" : timestamp
    }
  )
  return response;
}
