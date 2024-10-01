import { logInfo } from "@/Logger";

/**
 * タスククローズを実行する
 * @param {any} payload - ペイロード
 * @param {string} task_id - タスクID
 */
export function taskClose(payload: any): GoogleAppsScript.Content.TextOutput {
  logInfo("taskClose");
  return ContentService.createTextOutput("hoge");
}
