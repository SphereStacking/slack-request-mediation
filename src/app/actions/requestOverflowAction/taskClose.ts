import { logDebug } from "@/Logger";
import type { TaskActionValue } from "@/app/SlackBlocks";
import { closeTask } from "@/app/service/taskRequest";
/**
 * タスククローズを実行する
 * @param {any} payload - ペイロード
 * @param {string} task_id - タスクID
 */
export function taskClose(taskActionValue: TaskActionValue, payload: any): GoogleAppsScript.Content.TextOutput {
  logDebug("taskClose");
  closeTask(taskActionValue.task_id, payload.user.id);
  return ContentService.createTextOutput("hoge");
}
