import { logInfo, logError } from "@/Logger";
import { BLOCK_ACTION_ID } from "@/app/AppConfig";
import { taskActioned } from "@/app/actions/assignOverflowAction/taskActioned";
import { taskDetail } from "@/app/actions/assignOverflowAction/taskDetail";
import { taskLgtm } from "@/app/actions/assignOverflowAction/taskLgtm";
import type { TaskActionValue } from "@/app/SlackBlocks";

/**
 * オーバーフローアクションを処理する
 * @param {any} payload - ペイロード
 * @returns {GoogleAppsScript.Content.TextOutput} レスポンス
 */
export function assignOverflowAction(payload: any): GoogleAppsScript.Content.TextOutput {
  logInfo("assignOverflowAction");
  const taskActionValue: TaskActionValue = JSON.parse(payload.actions[0].selected_option.value);
  switch (taskActionValue.type) {
    case BLOCK_ACTION_ID.TASK_DETAIL:
      return taskDetail(taskActionValue, payload);
    case BLOCK_ACTION_ID.TASK_ACTIONED:
      return taskActioned(taskActionValue, payload);
    case BLOCK_ACTION_ID.TASK_LGTM:
      return taskLgtm(taskActionValue, payload);
    default:
      logError(`not found action: ${taskActionValue.type}`);
      return ContentService.createTextOutput("hoge");
  }
}
