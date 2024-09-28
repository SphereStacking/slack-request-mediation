/**
 * ボタンアクションを処理する
 * @param {Object} payload - ペイロード
 */
function handleButtonActions(payload) {
  const actionId = payload.actions[0].action_id;
  logInfo(`handleButtonActions: ${actionId}`);
  switch (actionId) {
    case BLOCK_ACTION_ID.HOME_SYNC:
      logInfo(BLOCK_ACTION_ID.HOME_SYNC);
      updateHome(payload);
      break;
    case BLOCK_ACTION_ID.TASK_REGISTER_MODAL_OPEN:
      logInfo(BLOCK_ACTION_ID.TASK_REGISTER_MODAL_OPEN);
      openTaskRegisterModal(payload);
      break;
    case BLOCK_ACTION_ID.ASSIGN_OVERFLOW_ACTION:
    case BLOCK_ACTION_ID.REQUEST_OVERFLOW_ACTION:
      logInfo(BLOCK_ACTION_ID.ASSIGN_OVERFLOW_ACTION);
      overflowAction(payload);
      break;
  }
}

/**
 * ホーム画面を更新する
 * @param {Object} payload - ペイロード
 */
function updateHome(payload) {
  const user_id = payload.user.id;
  const assignTasks = getAssigningTask(user_id);
  const requestTasks = getRequestTask(user_id);
  const blocks = makeAppHomeBlocks(user_id, assignTasks, requestTasks);
  postAppHome(user_id, blocks);
}

/**
 * 依頼登録モーダルを表示する
 * @param {Object} payload - ペイロード
 */
function openTaskRegisterModal(payload) {
  const trigger_id = payload.trigger_id;
  const blocks = makeTaskRegisterBlock();
  postViewsOpen(trigger_id, blocks);
}

function overflowAction(payload) {
  logInfo("assignOverflowAction");
  logInfo(payload);
  const values = JSON.parse(payload.actions[0].selected_option.value);
  const type = values.type;
  switch (type) {
    case BLOCK_ACTION_ID.TASK_DETAIL:
      taskDetail(payload, values.task_id);
      break;
    case BLOCK_ACTION_ID.TASK_ACTIONED:
      taskActioned(payload, values.task_id);
      break;
    case BLOCK_ACTION_ID.TASK_CLOSED:
      taskClose(payload, values.task_id);
      break;
    case BLOCK_ACTION_ID.TASK_REMIND:
      taskRemind(payload, values.task_id);
      break;
    case BLOCK_ACTION_ID.TASK_LGTM:
      taskLgtm(payload, values.task_id);
      break;
  }
}

/**
 * タスク詳細を表示する
 * @param {Object} payload - ペイロード
 * @param {string} task_id - タスクID
 */
function taskDetail(payload, task_id) {
  const task = getTask(task_id);
  const user_id = payload.user.id;
  const blocks = makeTaskDetailBlock({
    id: task[0].id,
    summary: task[0].summary,
    detail: task[0].detail,
    assignee: task[0].assignee,
    status: task[0].status,
    due_date: task[0].due_date,
    priority: task[0].priority,
    time_left: task[0].time_left,
    requester: task[0].requester,
    slack_url: task[0].slack_url,
  });
  logInfo("hoge");
  postDirectMessage(user_id, { blocks: blocks });
}
/**
 * タスクアクションを実行する
 * @param {Object} payload - ペイロード
 * @param {string} task_id - タスクID
 */
function taskActioned(payload, task_id) {
  logInfo("taskActioned");
  const task = getTask(task_id);
  const user_id = payload.user.id;
  const blocks = makeTaskDetailBlock({
    id: task[0].id,
    summary: task[0].summary,
    detail: task[0].detail,
    assignee: task[0].assignee,
    status: task[0].status,
    due_date: task[0].due_date,
    priority: task[0].priority,
    time_left: task[0].time_left,
    requester: task[0].requester,
    slack_url: task[0].slack_url,
  });
  for (const assignee of task[0].assignee) {
    postDirectMessage(assignee, { blocks: blocks });
  }
  postDirectMessage(user_id, { text: "アクションを通知しました。" });
}

/**
 * タスクリマインドを実行する
 * @param {Object} payload - ペイロード
 * @param {string} task_id - タスクID
 */
function taskRemind(payload, task_id) {
  logInfo("taskRemind");
  const task = getTask(task_id);
  const user_id = payload.user.id;
  const blocks = makeTaskDetailBlock({
    id: task[0].id,
    summary: task[0].summary,
    detail: task[0].detail,
    assignee: task[0].assignee,
    status: task[0].status,
    due_date: task[0].due_date,
    priority: task[0].priority,
    time_left: task[0].time_left,
    requester: task[0].requester,
    slack_url: task[0].slack_url,
  });
  for (const assignee of task[0].assignee) {
    postDirectMessage(assignee, { blocks: blocks });
  }
  postDirectMessage(user_id, { text: "リマインドを通知しました。" });
}

/**
 * タスククローズを実行する
 * @param {Object} payload - ペイロード
 * @param {string} task_id - タスクID
 */
function taskClose(payload, task_id) {
  logInfo("taskClose");
}

/**
 * タスクLGTMを実行する
 * @param {Object} payload - ペイロード
 * @param {string} task_id - タスクID
 */
function taskLgtm(payload, task_id) {
  logInfo("taskLgtm");
}
