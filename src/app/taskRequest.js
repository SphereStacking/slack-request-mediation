function getTask(task_id) {
  return formatTaskRows(
    getFilteredDataWithQuery({
      spreadsheetId: TaskSpreadSheetId,
      sheetName: TaskSheetName,
      filters: [
        {
          column: TASK_SPREAD_SHEET_COLUMNS.ID.column,
          operator: "=",
          value: task_id,
          connector: "AND",
        },
      ],
      skipRows: 1,
      selectColumns: ["*"],
    }),
  );
}

/**
 * タスクの割り当てを取得する
 * @param {string} user_id - ユーザーID
 * @returns {Array} タスクの割り当て
 */
function getAssigningTask(user_id) {
  return formatTaskRows(
    getFilteredDataWithQuery({
      spreadsheetId: TaskSpreadSheetId,
      sheetName: TaskSheetName,
      filters: [
        {
          column: TASK_SPREAD_SHEET_COLUMNS.STATUS.column,
          operator: "=",
          value: TASK_STATUS.IN_PROGRESS.header_name,
          connector: "AND",
        },
        {
          column: TASK_SPREAD_SHEET_COLUMNS.ASSIGNEE.column,
          operator: "LIKE",
          value: user_id,
          connector: "AND",
        },
      ],
      skipRows: 1,
      selectColumns: ["*"],
    }),
  );
}

/**
 * 依頼されたタスクを取得する
 * @param {string} user_id - ユーザーID
 * @returns {Array} 依頼されたタスク
 */
function getRequestTask(user_id) {
  return formatTaskRows(
    getFilteredDataWithQuery({
      spreadsheetId: TaskSpreadSheetId,
      sheetName: TaskSheetName,
      filters: [
        {
          column: TASK_SPREAD_SHEET_COLUMNS.STATUS.column,
          operator: "=",
          value: TASK_STATUS.IN_PROGRESS.header_name,
          connector: "AND",
        },
        {
          column: TASK_SPREAD_SHEET_COLUMNS.REQUESTER.column,
          operator: "LIKE",
          value: user_id,
          connector: "AND",
        },
      ],
      skipRows: 1,
      selectColumns: ["*"],
    }),
  );
}

/**
 * リマインドタスクを取得する
 * @param {string} user_id - ユーザーID
 * @returns {Array} リマインドタスク
 */
function postRemindTask() {
  const tasks = formatTaskRows(
    getFilteredDataWithQuery({
      spreadsheetId: TaskSpreadSheetId,
      sheetName: TaskSheetName,
      filters: [
        {
          column: TASK_SPREAD_SHEET_COLUMNS.ASSIGNEE.column,
          operator: "like",
          value: DEBUG_USER_ID,
          connector: "AND",
        },
        {
          column: TASK_SPREAD_SHEET_COLUMNS.STATUS.column,
          operator: "=",
          value: TASK_STATUS.IN_PROGRESS.header_name,
          connector: "AND",
        },
      ],
      skipRows: 1,
      selectColumns: ["*"],
    }),
  );
  // ユーザーごとにタスクをグルーピング
  const groupedTasks = tasks.reduce((acc, task) => {
    for (const user of task.assignee) {
      if (!acc[user]) {
        acc[user] = [];
      }
      acc[user].push(task);
    }
    return acc;
  }, {});
  // アサインされているタスクをUserに通知
  for (const user of Object.keys(groupedTasks)) {
    postDirectMessage(user, makeTaskListBlocks(groupedTasks[user]));
  }
}

/**
 * タスクの行をフォーマットする
 * @param {Array} rows - タスクの行
 * @returns {Array} フォーマットされたタスクの行
 */
function formatTaskRows(rows) {
  return rows.map((row) => {
    return {
      id: row[TASK_SPREAD_SHEET_COLUMNS.ID.index],
      summary: row[TASK_SPREAD_SHEET_COLUMNS.SUMMARY.index],
      detail: row[TASK_SPREAD_SHEET_COLUMNS.DETAIL.index],
      assignee: row[TASK_SPREAD_SHEET_COLUMNS.ASSIGNEE.index]
        .split(",")
        .map((item) => item.trim()),
      status: row[TASK_SPREAD_SHEET_COLUMNS.STATUS.index],
      status_emoji:
        TASK_STATUS[row[TASK_SPREAD_SHEET_COLUMNS.STATUS.index].toUpperCase()]
          .emoji,
      due_date: Utilities.formatDate(
        row[TASK_SPREAD_SHEET_COLUMNS.DUE_DATE.index],
        "JST",
        "yy-MM-dd HH:mm",
      ),
      priority: row[TASK_SPREAD_SHEET_COLUMNS.PRIORITY.index],
      requester: row[TASK_SPREAD_SHEET_COLUMNS.REQUESTER.index],
      time_left: row[TASK_SPREAD_SHEET_COLUMNS.TIME_LEFT.index],
      post_channel: row[TASK_SPREAD_SHEET_COLUMNS.POST_CHANNEL.index],
      slack_url: row[TASK_SPREAD_SHEET_COLUMNS.SLACK_MESSAGE_URL.index],
    };
  });
}

/**
 * タスクを追加する
 * @param {Object} task - タスク
 */
function addRowRequestTask(task, requester_id) {
  const sheet = getSpreadSheet(TaskSpreadSheetId, TaskSheetName);
  const lastRow = getLastRow(sheet);
  addRow(sheet, [
    Utilities.getUuid(),
    task.summary,
    task.detail,
    task.assignee.join(","),
    TASK_STATUS.IN_PROGRESS.header_name,
    task.due_date,
    task.priority,
    requester_id,
    TASK_SPREAD_SHEET_COLUMNS.TIME_LEFT.setRow(lastRow + 1),
  ]);
}
