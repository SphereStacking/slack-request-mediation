import { logError } from "@/Logger";
import { getTask } from "./getTask";
import { updateSpreadsheetValues } from "@/SpreadSheet";
import { extractChannelIdAndTimestamp, postMessageToThread, postDirectMessage } from "@/Slack";
import { makeClosedToThreadBlocks, makeClosedToUserBlocks } from "@/app/SlackBlocks";
import { scriptProperties } from "@/ScriptProperties";
import { TASK_SPREAD_SHEET_COLUMNS, TASK_STATUS } from "@/app/AppConfig";

/**
 * タスクをクローズする
 * @param {string} task_id - タスクID
 */
export function closeTask(task_id: string, user_id: string): void {
  const task = getTask(task_id);
  if (task.length === 0) {
    logError({ error: "タスクが見つかりません", task_id });
    return;
  }
  const { channelId, threadTimestamp } = extractChannelIdAndTimestamp(task[0].slack_url);
  if (!channelId || !threadTimestamp) {
    logError({ error: "スレッドのタイムスタンプが取得できません", task_id });
    return;
  }
  try {
    postMessageToThread(channelId, threadTimestamp, makeClosedToThreadBlocks(user_id));
  } catch (error) {
    logError({ error: "スレッドにメッセージを送信できません", task_id });
  }
  try {
    postDirectMessage(user_id, makeClosedToUserBlocks(task[0].summary, task[0].slack_url));
  } catch (error) {
    logError({ error: "ユーザーにメッセージを送信できません", task_id });
  }
  try {
    updateSpreadsheetValues(
      scriptProperties.TASK_SPREADSHEET_ID,
      scriptProperties.TASK_SHEET_NAME,
      TASK_SPREAD_SHEET_COLUMNS.ID.column,
      task_id,
      [{ column: TASK_SPREAD_SHEET_COLUMNS.STATUS.column, value: TASK_STATUS.COMPLETED.value }],
    );
  } catch (error) {
    logError({ error: "スプレッドシートの値を更新できません", task_id });
  }
}
