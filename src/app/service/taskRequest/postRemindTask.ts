import { scriptProperties } from "@/ScriptProperties";
import { TASK_SPREAD_SHEET_COLUMNS, TASK_STATUS } from "@/app/AppConfig";
import { postDirectMessage } from "@/Slack";
import { formatTaskRows } from "./formatTaskRows";
import { getFilteredDataWithQuery } from "@/SpreadSheet";
import { makeTaskListBlocks } from "@/app/SlackBlocks";

/**
 * リマインドタスクを取得する
 * @param {string} user_id - ユーザーID
 * @returns {Array} リマインドタスク
 */
export function postRemindTask(): void {
  const tasks = formatTaskRows(
    getFilteredDataWithQuery({
      spreadsheetId: scriptProperties.TASK_SPREADSHEET_ID,
      sheetName: scriptProperties.TASK_SPREADSHEET_NAME,
      filters: [
        {
          column: TASK_SPREAD_SHEET_COLUMNS.ASSIGNEES.column,
          operator: "LIKE",
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
    for (const user of task.assignees) {
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
