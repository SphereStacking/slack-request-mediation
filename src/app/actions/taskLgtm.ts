import { logInfo } from "@/Logger";

/**
 * タスクLGTMを実行する
 * @param {any} payload - ペイロード
 * @param {string} task_id - タスクID
 */
export function taskLgtm(payload: any): GoogleAppsScript.Content.TextOutput {
  logInfo("taskLgtm");
  return ContentService.createTextOutput("hoge");
}
