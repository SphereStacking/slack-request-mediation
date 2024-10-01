import { getAssigningTask, getRequestTask } from "@/app/taskRequest";
import { makeAppHomeBlocks } from "@/app/SlackBlocks";
import { postAppHome } from "@/Slack/api";

/**
 * ホーム画面を更新する
 * @param {any} payload - ペイロード
 */
export function updateHome(payload: any): GoogleAppsScript.Content.TextOutput {
  const user_id = payload.user.id;
  const assignTasks = getAssigningTask(user_id);
  const requestTasks = getRequestTask(user_id);
  const blocks = makeAppHomeBlocks(user_id, assignTasks, requestTasks);
  postAppHome(user_id, blocks);
  return ContentService.createTextOutput("hoge");
}
