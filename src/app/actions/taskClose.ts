import { logDebug } from "@/Logger";
import { closeTask } from "@/app/service/taskRequest";
/**
 * タスククローズを実行する
 * @param {any} payload - ペイロード
 * @param {string} task_id - タスクID
 */
export function taskClose(payload: any): GoogleAppsScript.Content.TextOutput {
  logDebug("taskClose");
  closeTask(payload.actions[0].value, payload.user.id);
  return ContentService.createTextOutput("hoge");
}
