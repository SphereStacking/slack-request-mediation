import { logDebug, logError } from "@/Logger";
import { extractChannelIdAndTimestamp, postMessageToThread, postDirectMessage, updateMessage } from "@/Slack";
import {
  makeApprovedAllToUserBlocks,
  makeApprovedToThreadBlocks,
  makeApprovedToUserBlocks,
  makeRequestTaskDetailBlocks,
} from "@/app/SlackBlocks";
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

  const { approved_assignees, slack_url, summary, detail } = task[0];

  const new_approved_assignees = addUniqueUser(approved_assignees, user_id);

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
    updateMessage(
      channelId,
      threadTimestamp,
      makeRequestTaskDetailBlocks({
        id: task[0].id,
        summary: task[0].summary,
        detail: task[0].detail,
        assignees: task[0].assignees,
        due_date: task[0].due_date,
        priority: task[0].priority,
        requester: task[0].requester,
        approved_assignees: new_approved_assignees,
      }),
    );
  } catch (error) {
    logError({ error: "メッセージを更新できません", task_id });
  }
  try {
    postMessageToThread(channelId, threadTimestamp, makeApprovedToThreadBlocks(user_id));
  } catch (error) {
    logError({ error: "スレッドにメッセージを送信できません", task_id });
  }

  // 依頼者への通知
  try {
    // 全ての承認者が承認したかどうかを確認
    const is_all_approved_assignees = task[0].assignees.length === new_approved_assignees.length;
    if (is_all_approved_assignees) {
      // 全ての承認者が承認した場合
      postDirectMessage(user_id, makeApprovedAllToUserBlocks(task_id, summary, slack_url, detail));
    } else {
      // 未承認の承認者がいる場合
      postDirectMessage(user_id, makeApprovedToUserBlocks(summary, slack_url));
    }
  } catch (error) {
    logError({ message: "ユーザーにメッセージを送信できませんでした", task: task[0], error });
  }
}

// 重複を削除して新しい配列を返す
function addUniqueUser(approved_assignees: string[], user_id: string): string[] {
  if (Array.isArray(approved_assignees)) {
    return approved_assignees.includes(user_id) ? approved_assignees : [...approved_assignees, user_id];
  }
  return [user_id];
}
