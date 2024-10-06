import type { TaskActionValue } from "@/app/SlackBlocks";
import { taskRemindNotification } from "@/app/service/taskRequest";
/**
 * タスクリマインドを実行する
 * @param {any} payload - ペイロード
 * @param {string} task_id - タスクID
 */
export function taskRemind(taskActionValue: TaskActionValue, payload: any): GoogleAppsScript.Content.TextOutput {
  taskRemindNotification(taskActionValue.task_id, payload.user.id);
  return ContentService.createTextOutput("hoge");
}
