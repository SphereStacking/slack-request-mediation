import { scriptProperties } from "@/ScriptProperties";
import { TASK_SPREAD_SHEET_COLUMNS, TASK_STATUS } from "@/app/AppConfig";
import { getSpreadSheet, getLastRow, addRow } from "@/SpreadSheet";
import { logError } from "@/Logger";

/**
 * タスクを追加する
 * @param {Object} task - タスク
 */
export function addRequestTask({
  summary,
  detail,
  assignees,
  due_date,
  priority,
  requester,
  post_channel,
}: {
  summary: string;
  detail: string;
  assignees: string[];
  due_date: string;
  priority: string;
  requester: string;
  post_channel: string;
}): void {
  try {
    const sheet = getSpreadSheet(scriptProperties.TASK_SPREADSHEET_ID, scriptProperties.TASK_SPREADSHEET_NAME);
    const lastRow = getLastRow(sheet);
    const row = generateRow({
      ID: Utilities.getUuid(),
      SUMMARY: summary,
      DETAIL: detail,
      ASSIGNEES: assignees.join(","),
      STATUS: TASK_STATUS.IN_PROGRESS.value,
      DUE_DATE: due_date,
      PRIORITY: priority,
      REQUESTER: requester,
      TIME_LEFT: (lastRow + 1).toString(),
      POST_CHANNEL: post_channel,
      SLACK_MESSAGE_URL: "",
      NOTIFIED_AT: "",
      APPROVED_ASSIGNEES: "",
    });
    addRow(sheet, row);
  } catch (error) {
    logError({
      error,
      message: "スプレッドシートにタスクを追加に失敗しました",
      summary,
      detail,
      assignees,
      due_date,
      priority,
      requester,
      post_channel,
    });
  }
}

// 挿入用に行を生成する
function generateRow(data: { [key: string]: string }): string[] {
  return Object.keys(TASK_SPREAD_SHEET_COLUMNS)
    .sort((a, b) => TASK_SPREAD_SHEET_COLUMNS[a].index - TASK_SPREAD_SHEET_COLUMNS[b].index)
    .map((key) => {
      const column = TASK_SPREAD_SHEET_COLUMNS[key];
      return column.setFormatRow(data[key] || "");
    });
}
