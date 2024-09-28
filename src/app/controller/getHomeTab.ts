import { getAssigningTask } from "@/app/domain/taskRequest";
import { getRequestTask } from "@/app/domain/taskRequest";
import { makeAppHomeBlocks } from "@/app/SlackBlocks";
import { postAppHome } from "@/Slack/api";

/**
 * ホーム画面を表示
 * @param {any} payload - ペイロード
 */
export function getHomeTab(payload: any): GoogleAppsScript.Content.TextOutput {
  const user_id = payload.user;
  const assignTasks = getAssigningTask(user_id);
  const requestTasks = getRequestTask(user_id);
  const blocks = makeAppHomeBlocks(user_id, assignTasks, requestTasks);
  postAppHome(user_id, blocks);
  return ContentService.createTextOutput();
}
