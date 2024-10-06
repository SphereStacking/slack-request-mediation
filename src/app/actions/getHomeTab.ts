import { getAssigningTask } from "@/app/service/taskRequest";
import { getRequestTask } from "@/app/service/taskRequest";
import { makeAppHomeBlocks } from "@/app/SlackBlocks";
import { postAppHome } from "@/Slack/api";
import { logInfo, logError } from "@/Logger";

/**
 * ホーム画面を表示
 * @param {any} payload - ペイロード
 */
export function getHomeTab(payload: any): GoogleAppsScript.Content.TextOutput {
  logInfo("getHomeTab");
  try {
    const user_id = payload.event.user;
    const assignTasks = getAssigningTask(user_id);
    const requestTasks = getRequestTask(user_id);
    const blocks = makeAppHomeBlocks(user_id, assignTasks, requestTasks);
    postAppHome(user_id, blocks);
    return ContentService.createTextOutput();
  } catch (error) {
    logError({ error });
    return ContentService.createTextOutput("getHomeTab error");
  }
}
