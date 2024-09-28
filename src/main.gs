function doPost(e) {
  // logInfo('-- doPost start ---------------------');
  try{
    try {
      const postData = JSON.parse(e.postData.contents);
      if (postData.type === 'url_verification') {
        return ContentService.createTextOutput(postData.challenge);
      }
      handleEventActions(postData.event)
    } catch(error) {
      //errorを握りつぶす。
      //e.postData.contentsは毎回入ってくるがurl_verificationとそれ以外でデータの形式が違うため
      // event はjson
      // viewのアクションはURIっぽい
    }

    //e.parameter.payloadが存在しないのがきてるっぽいそこで解析エラーで{}が出力されてる。
    const payload = JSON.parse(decodeURIComponent(e.parameter.payload));
    if (payload.type === 'block_actions') {
      handleButtonActions(payload);
    } else if (payload.type === 'view_submission') {
      // view_submissionのレスポンスまでのタイムアウトが早いため
      // ログ出力は極力抑える必要がある。(タイムアウト3秒)
      handleViewSubmission(payload);
      // view_submissionに対する完了レスポンスを返す必要がある。
      return ContentService.createTextOutput();
    }
  } catch(error) {
    logError(error);
  }
  // logInfo('-- doPost end ---------------------');
}
