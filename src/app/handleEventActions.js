/**
 * ボタンアクションを処理する
 * @param {Object} payload - ペイロード
 */
function handleEventActions(payload) {
  const actionType = payload.type;
  logInfo("handleOtherActions start:" + actionType);

  switch (actionType) {
    case EVENT_ACTION_ID.APP_HOME_OPENED:
      getHomeTab(payload);
      break;
  }
  logInfo("handleOtherActions end:" + actionType);
}

/**
 * ホーム画面を表示
 * @param {Object} payload - ペイロード
 */
function getHomeTab(payload) {
  const user_id = payload.user;
  const assignTasks = getAssigningTask(user_id);
  const requestTasks = getRequestTask(user_id);
  const blocks = makeAppHomeBlocks(user_id, assignTasks, requestTasks);
  postAppHome(user_id, blocks);
}
