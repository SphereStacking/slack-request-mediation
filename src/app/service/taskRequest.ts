import { TASK_SPREAD_SHEET_COLUMNS, TASK_STATUS } from "@/app/AppConfig";
import { scriptProperties } from "@/ScriptProperties";
import { postDirectMessage } from "@/Slack";
import { makeTaskListBlocks, makeTaskDetailBlock } from "@/app/SlackBlocks";
import { getSpreadSheet, getLastRow, addRow, getFilteredDataWithQuery } from "@/SpreadSheet";
import { updateSpreadsheetValue } from "@/SpreadSheet";
import { extractChannelIdAndTimestamp, postMessageToThread } from "@/Slack";
/**
 * タスクを取得する
 * @param {string} task_id - タスクID
 * @returns {Array} タスク
 */
export function getTask(task_id: string): any[] {
  return formatTaskRows(
    getFilteredDataWithQuery({
      spreadsheetId: scriptProperties.TASK_SPREADSHEET_ID,
      sheetName: scriptProperties.TASK_SHEET_NAME,
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
export function getAssigningTask(user_id: string): any[] {
  return formatTaskRows(
    getFilteredDataWithQuery({
      spreadsheetId: scriptProperties.TASK_SPREADSHEET_ID,
      sheetName: scriptProperties.TASK_SHEET_NAME,
      filters: [
        {
          column: TASK_SPREAD_SHEET_COLUMNS.STATUS.column,
          operator: "=",
          value: TASK_STATUS.IN_PROGRESS.value,
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
export function getRequestTask(user_id: string): any[] {
  return formatTaskRows(
    getFilteredDataWithQuery({
      spreadsheetId: scriptProperties.TASK_SPREADSHEET_ID,
      sheetName: scriptProperties.TASK_SHEET_NAME,
      filters: [
        {
          column: TASK_SPREAD_SHEET_COLUMNS.STATUS.column,
          operator: "=",
          value: TASK_STATUS.IN_PROGRESS.value,
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
export function postRemindTask(): void {
  const tasks = formatTaskRows(
    getFilteredDataWithQuery({
      spreadsheetId: scriptProperties.TASK_SPREADSHEET_ID,
      sheetName: scriptProperties.TASK_SHEET_NAME,
      filters: [
        {
          column: TASK_SPREAD_SHEET_COLUMNS.ASSIGNEE.column,
          operator: "like",
          value: scriptProperties.DEBUG_USER_ID,
          connector: "AND",
        },
        {
          column: TASK_SPREAD_SHEET_COLUMNS.STATUS.column,
          operator: "=",
          value: TASK_STATUS.IN_PROGRESS.value,
          connector: "AND",
        },
      ],
      skipRows: 1,
      selectColumns: ["*"],
    }),
  );
  // ユーザーごとにタスクをグルーピング
  const groupedTasks = tasks.reduce((acc: Record<string, any[]>, task) => {
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
export function formatTaskRows(rows: any[]): any[] {
  return rows.map((row) => {
    return {
      id: row[TASK_SPREAD_SHEET_COLUMNS.ID.index],
      summary: row[TASK_SPREAD_SHEET_COLUMNS.SUMMARY.index],
      detail: row[TASK_SPREAD_SHEET_COLUMNS.DETAIL.index],
      assignee: row[TASK_SPREAD_SHEET_COLUMNS.ASSIGNEE.index].split(",").map((item: string) => item.trim()),
      status: row[TASK_SPREAD_SHEET_COLUMNS.STATUS.index],
      status_emoji: TASK_STATUS[row[TASK_SPREAD_SHEET_COLUMNS.STATUS.index].toUpperCase()].emoji,
      due_date: Utilities.formatDate(row[TASK_SPREAD_SHEET_COLUMNS.DUE_DATE.index], "JST", "yy-MM-dd HH:mm"),
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
export function addRequestTask({
  summary,
  detail,
  assignee,
  due_date,
  priority,
  requester,
  post_channel,
  slack_message_url,
}: {
  summary: string;
  detail: string;
  assignee: string[];
  due_date: string;
  priority: string;
  requester: string;
  post_channel: string;
  slack_message_url: string;
}): void {
  const sheet = getSpreadSheet(scriptProperties.TASK_SPREADSHEET_ID, scriptProperties.TASK_SHEET_NAME);
  const lastRow = getLastRow(sheet);
  addRow(sheet, [
    TASK_SPREAD_SHEET_COLUMNS.ID.setFormatRow(Utilities.getUuid()),
    TASK_SPREAD_SHEET_COLUMNS.SUMMARY.setFormatRow(summary),
    TASK_SPREAD_SHEET_COLUMNS.DETAIL.setFormatRow(detail),
    TASK_SPREAD_SHEET_COLUMNS.ASSIGNEE.setFormatRow(assignee.join(",")),
    TASK_SPREAD_SHEET_COLUMNS.STATUS.setFormatRow(TASK_STATUS.IN_PROGRESS.value),
    TASK_SPREAD_SHEET_COLUMNS.DUE_DATE.setFormatRow(due_date),
    TASK_SPREAD_SHEET_COLUMNS.PRIORITY.setFormatRow(priority),
    TASK_SPREAD_SHEET_COLUMNS.REQUESTER.setFormatRow(requester),
    TASK_SPREAD_SHEET_COLUMNS.TIME_LEFT.setFormatRow((lastRow + 1).toString()),
    TASK_SPREAD_SHEET_COLUMNS.POST_CHANNEL.setFormatRow(post_channel),
    TASK_SPREAD_SHEET_COLUMNS.SLACK_MESSAGE_URL.setFormatRow(slack_message_url),
  ]);
}

/**
 * タスクをクローズする
 * @param {string} task_id - タスクID
 */
export function closeTask(task_id: string, user_id: string): void {
  const task = getTask(task_id);
  const { channelId, threadTimestamp } = extractChannelIdAndTimestamp(task[0].slack_url);
  postMessageToThread(channelId, threadTimestamp, `タスクが<@${user_id}>によってクローズされました。`);
  postDirectMessage(user_id, { text: `タスク${task[0].summary}をクローズしました。` });
  updateSpreadsheetValue(
    scriptProperties.TASK_SPREADSHEET_ID,
    scriptProperties.TASK_SHEET_NAME,
    TASK_SPREAD_SHEET_COLUMNS.ID.column,
    task_id,
    TASK_SPREAD_SHEET_COLUMNS.STATUS.column,
    TASK_STATUS.COMPLETED.value,
  );
}

/**
 * タスクアクションを通知する
 * @param {string} task_id - タスクID
 * @param {string} user_id - ユーザーID
 */
export function taskActionedNotification(task_id: string, user_id: string): void {
  const task = getTask(task_id);
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
  // slack_urlからスレッドのタイムスタンプを取得
  const { channelId, threadTimestamp } = extractChannelIdAndTimestamp(task[0].slack_url);
  postMessageToThread(channelId, threadTimestamp, "アクションがありました。");
  postDirectMessage(user_id, { text: "アクションを通知しました。" });
}

/**
 * タスクの詳細を通知する
 * @param {string} task_id - タスクID
 * @param {string} user_id - ユーザーID
 */
export function taskDetailNotification(task_id: string, user_id: string): void {
  const task = getTask(task_id);
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
  postDirectMessage(user_id, { blocks: blocks });
}

export function taskRemindNotification(task_id: string, user_id: string): void {
  const task = getTask(task_id);
  // slack_urlからスレッドのタイムスタンプを取得
  const { channelId, threadTimestamp } = extractChannelIdAndTimestamp(task[0].slack_url);
  postMessageToThread(channelId, threadTimestamp, "リマインドがありました。");
  postDirectMessage(user_id, { text: "リマインドを通知しました。" });
}
