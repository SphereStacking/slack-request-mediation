import { logInfo } from "@/Logger";
import type { TaskActionValue } from "@/app/SlackBlocks";
import { taskDetailNotification } from "@/app/service/taskRequest";
/**
 * タスククローズを実行する
 * @param {any} payload - ペイロード
 * @param {string} task_id - タスクID
 */
export function taskClose(taskActionValue: TaskActionValue, payload: any): GoogleAppsScript.Content.TextOutput {
  logInfo("taskClose");
  taskDetailNotification(taskActionValue.task_id, payload.user._id);
  return ContentService.createTextOutput("hoge");
}
