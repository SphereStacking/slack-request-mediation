import { logDebug } from "@/Logger";
import { makeTaskEditBlock } from "@/app/SlackBlocks/makeTaskEditBlock";
import type { TaskActionValue } from "@/app/SlackBlocks";
import { postViewsOpen } from "@/Slack/api";
import { getTask } from "@/app/service/taskRequest";
/**
 * タスクリマインドを実行する
 * @param {any} payload - ペイロード
 * @param {string} task_id - タスクID
 */
export function taskEditModalOpen(taskActionValue: TaskActionValue, payload: any): GoogleAppsScript.Content.TextOutput {
  const task = getTask(taskActionValue.task_id);
  const taskEditBlock = makeTaskEditBlock(task[0]);
  const trigger_id = payload.trigger_id;
  postViewsOpen(trigger_id, taskEditBlock);
  return ContentService.createTextOutput();
}
