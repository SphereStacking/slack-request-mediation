import { logDebug } from "@/Logger";
import type { TaskActionValue } from "@/app/SlackBlocks";
import { taskActionedNotification } from "@/app/service/taskRequest";
/**
 * タスクアクションを実行する
 * @param {any} payload - ペイロード
 * @param {string} task_id - タスクID
 */
export function taskActioned(taskActionValue: TaskActionValue, payload: any): GoogleAppsScript.Content.TextOutput {
  logDebug("taskActioned");
  taskActionedNotification(taskActionValue.task_id, payload.user.id);
  return ContentService.createTextOutput("hoge");
}
