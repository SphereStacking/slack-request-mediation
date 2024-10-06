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
  slack_message_url,
  notification_at,
}: {
  summary: string;
  detail: string;
  assignees: string[];
  due_date: string;
  priority: string;
  requester: string;
  post_channel: string;
  slack_message_url: string;
  notification_at: string;
}): void {
  try {
    const sheet = getSpreadSheet(scriptProperties.TASK_SPREADSHEET_ID, scriptProperties.TASK_SHEET_NAME);
    const lastRow = getLastRow(sheet);
    const row = [
      TASK_SPREAD_SHEET_COLUMNS.ID.setFormatRow(Utilities.getUuid()),
      TASK_SPREAD_SHEET_COLUMNS.SUMMARY.setFormatRow(summary),
      TASK_SPREAD_SHEET_COLUMNS.DETAIL.setFormatRow(detail),
      TASK_SPREAD_SHEET_COLUMNS.ASSIGNEES.setFormatRow(assignees.join(",")),
      TASK_SPREAD_SHEET_COLUMNS.STATUS.setFormatRow(TASK_STATUS.IN_PROGRESS.value),
      TASK_SPREAD_SHEET_COLUMNS.DUE_DATE.setFormatRow(due_date),
      TASK_SPREAD_SHEET_COLUMNS.PRIORITY.setFormatRow(priority),
      TASK_SPREAD_SHEET_COLUMNS.REQUESTER.setFormatRow(requester),
      TASK_SPREAD_SHEET_COLUMNS.TIME_LEFT.setFormatRow((lastRow + 1).toString()),
      TASK_SPREAD_SHEET_COLUMNS.POST_CHANNEL.setFormatRow(post_channel),
      TASK_SPREAD_SHEET_COLUMNS.SLACK_MESSAGE_URL.setFormatRow(slack_message_url),
      TASK_SPREAD_SHEET_COLUMNS.NOTIFICATION_AT.setFormatRow(notification_at),
    ];
    addRow(sheet, row);
  } catch (error) {
    logError({
      error: "スプレッドシートにタスクを追加に失敗しました",
      summary,
      detail,
      assignees,
      due_date,
      priority,
      requester,
      post_channel,
      slack_message_url,
    });
  }
}
