import { logInfo } from "@/Logger";
import type { TaskActionValue } from "@/app/SlackBlocks";

/**
 * タスクLGTMを実行する
 * @param {any} payload - ペイロード
 * @param {string} task_id - タスクID
 */
export function taskLgtm(taskActionValue: TaskActionValue, payload: any): GoogleAppsScript.Content.TextOutput {
  logInfo("taskLgtm");
  return ContentService.createTextOutput("hoge");
}
