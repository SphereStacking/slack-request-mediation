import { logDebug } from "@/Logger";
import type { TaskActionValue } from "@/app/SlackBlocks";
import { taskApprovedNotification } from "@/app/service/taskRequest";
/**
 * タスクLGTMを実行する
 * @param {any} payload - ペイロード
 * @param {string} task_id - タスクID
 */
export function taskLgtm(taskActionValue: TaskActionValue, payload: any): GoogleAppsScript.Content.TextOutput {
  logDebug("taskLgtm");
  taskApprovedNotification(taskActionValue.task_id, payload.user.id);
  return ContentService.createTextOutput("hoge");
}
