import { logDebug, logError } from "@/Logger";
import { BLOCK_ACTION_ID } from "@/app/AppConfig";
import { taskActioned } from "@/app/actions/requestOverflowAction/taskActioned";
import { taskClose } from "@/app/actions/requestOverflowAction/taskClose";
import { taskDetail } from "@/app/actions/requestOverflowAction/taskDetail";
import { taskRemind } from "@/app/actions/requestOverflowAction/taskRemind";
import { taskEditModalOpen } from "@/app/actions/requestOverflowAction/taskEditModalOpen";
import type { TaskActionValue } from "@/app/SlackBlocks";

/**
 * オーバーフローアクションを処理する
 * @param {any} payload - ペイロード
 * @returns {GoogleAppsScript.Content.TextOutput} レスポンス
 */
export function requestOverflowAction(payload: any): GoogleAppsScript.Content.TextOutput {
  // logDebug("requestOverflowAction");
  const taskActionValue: TaskActionValue = JSON.parse(payload.actions[0].selected_option.value);
  switch (taskActionValue.type) {
    case BLOCK_ACTION_ID.TASK_DETAIL:
      return taskDetail(taskActionValue, payload);
    case BLOCK_ACTION_ID.TASK_ACTIONED:
      return taskActioned(taskActionValue, payload);
    case BLOCK_ACTION_ID.TASK_CLOSED:
      return taskClose(taskActionValue, payload);
    case BLOCK_ACTION_ID.TASK_REMIND:
      return taskRemind(taskActionValue, payload);
    case BLOCK_ACTION_ID.TASK_EDIT:
      return taskEditModalOpen(taskActionValue, payload);
    default:
      logError(`not found action: ${taskActionValue.type}`);
      return ContentService.createTextOutput("hoge");
  }
}
