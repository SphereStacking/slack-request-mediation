import { logInfo } from "@/Logger";
import { taskActionedNotification } from "@/app/service/taskRequest";
import type { TaskActionValue } from "@/app/SlackBlocks";
/**
 * タスクアクションを実行する
 * @param {any} payload - ペイロード
 * @param {string} task_id - タスクID
 */
export function taskActioned(taskActionValue: TaskActionValue, payload: any): GoogleAppsScript.Content.TextOutput {
  logInfo("taskActioned");
  taskActionedNotification(taskActionValue.task_id, payload.user.id);
  return ContentService.createTextOutput("hoge");
}
