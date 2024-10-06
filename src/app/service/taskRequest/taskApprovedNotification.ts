import { logDebug, logError } from "@/Logger";
import { extractChannelIdAndTimestamp, postMessageToThread, postDirectMessage } from "@/Slack";
import { makeApprovedToThreadBlocks, makeApprovedToUserBlocks } from "@/app/SlackBlocks";
import { getTask } from "./getTask";
import { scriptProperties } from "@/ScriptProperties";
import { TASK_SPREAD_SHEET_COLUMNS } from "@/app/AppConfig";
import { updateSpreadsheetValues } from "@/SpreadSheet";

export function taskApprovedNotification(task_id: string, user_id: string): void {
  logDebug("taskApprovedNotification");
  const task = getTask(task_id);
  if (task.length === 0) {
    logError({ error: "タスクが見つかりません", task_id });
    return;
  }

  const { approved_assignees, slack_url, summary } = task[0];
  // approved_assigneesが配列であることを確認
  const new_approved_assignees = [...(Array.isArray(approved_assignees) ? approved_assignees : []), user_id];

  // 全ての承認者が承認したかどうかを確認
  const is_all_approved_assignees = task[0].approved_assignees.length === new_approved_assignees.length;

  try {
    // スプレッドシートの通知済みのフラグを立てる
    updateSpreadsheetValues(
      scriptProperties.TASK_SPREADSHEET_ID,
      scriptProperties.TASK_SHEET_NAME,
      TASK_SPREAD_SHEET_COLUMNS.ID.column,
      task_id,
      [{ column: TASK_SPREAD_SHEET_COLUMNS.APPROVED_ASSIGNEES.column, value: new_approved_assignees }],
    );
  } catch (error) {
    logError({ error: "スプレッドシートの更新に失敗しました", task_id });
  }

  const { channelId, threadTimestamp } = extractChannelIdAndTimestamp(slack_url);
  if (!channelId || !threadTimestamp) {
    logError({ error: "スレッドのタイムスタンプが取得できません", task_id });
    return;
  }

  try {
    postMessageToThread(channelId, threadTimestamp, makeApprovedToThreadBlocks(user_id));
  } catch (error) {
    logError({ error: "スレッドにメッセージを送信できません", task_id });
  }

  try {
    if (is_all_approved_assignees) {
    } else {
      postDirectMessage(user_id, makeApprovedToUserBlocks(summary, slack_url));
    }
  } catch (error) {
    logError({ error: "ユーザーにメッセージを送信できません", task_id });
  }
}
