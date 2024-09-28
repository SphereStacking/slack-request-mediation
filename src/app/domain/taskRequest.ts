import { TASK_SPREAD_SHEET_COLUMNS, TASK_STATUS } from "@/app/AppConfig";
import { scriptProperties } from "@/ScriptProperties";
import { postDirectMessage } from "@/Slack";
import { makeTaskListBlocks } from "@/app/SlackBlocks";
import {
  getSpreadSheet,
  getLastRow,
  addRow,
  getFilteredDataWithQuery,
} from "@/SpreadSheet";

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
export function getRequestTask(user_id: string): any[] {
  return formatTaskRows(
    getFilteredDataWithQuery({
      spreadsheetId: scriptProperties.TASK_SPREADSHEET_ID,
      sheetName: scriptProperties.TASK_SHEET_NAME,
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
          value: TASK_STATUS.IN_PROGRESS.header_name,
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
      assignee: row[TASK_SPREAD_SHEET_COLUMNS.ASSIGNEE.index]
        .split(",")
        .map((item: string) => item.trim()),
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
export function addRequestTask(
  task: AddRequestTaskType,
  requester_id: string,
): void {
  const sheet = getSpreadSheet(
    scriptProperties.TASK_SPREADSHEET_ID,
    scriptProperties.TASK_SHEET_NAME,
  );
  const lastRow = getLastRow(sheet);
  addRow(sheet, [
    TASK_SPREAD_SHEET_COLUMNS.ID.setFormatRow(Utilities.getUuid()),
    TASK_SPREAD_SHEET_COLUMNS.SUMMARY.setFormatRow(task.summary),
    TASK_SPREAD_SHEET_COLUMNS.DETAIL.setFormatRow(task.detail),
    TASK_SPREAD_SHEET_COLUMNS.ASSIGNEE.setFormatRow(task.assignee.join(",")),
    TASK_SPREAD_SHEET_COLUMNS.STATUS.setFormatRow(
      TASK_STATUS.IN_PROGRESS.header_name,
    ),
    TASK_SPREAD_SHEET_COLUMNS.DUE_DATE.setFormatRow(task.due_date),
    TASK_SPREAD_SHEET_COLUMNS.PRIORITY.setFormatRow(task.priority),
    TASK_SPREAD_SHEET_COLUMNS.REQUESTER.setFormatRow(requester_id),
    TASK_SPREAD_SHEET_COLUMNS.TIME_LEFT.setFormatRow((lastRow + 1).toString()),
  ]);
}

export type AddRequestTaskType = {
  summary: string;
  detail: string;
  assignee: string[];
  due_date: string;
  priority: string;
  requester: string;
  post_channel: string;
};
