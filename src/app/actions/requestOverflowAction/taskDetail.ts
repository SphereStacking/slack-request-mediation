import { logDebug } from "@/Logger";
import type { TaskActionValue } from "@/app/SlackBlocks";
import { taskDetailNotification } from "@/app/service/taskRequest";
/**
 * タスク詳細を表示する
 * @param {any} payload - ペイロード
 * @param {string} task_id - タスクID
 */
export function taskDetail(taskActionValue: TaskActionValue, payload: any): GoogleAppsScript.Content.TextOutput {
  logDebug("taskDetail");
  taskDetailNotification(taskActionValue.task_id, payload.user.id);
  return ContentService.createTextOutput("hoge");
}
