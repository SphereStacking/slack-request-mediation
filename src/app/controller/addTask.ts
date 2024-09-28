import { logInfo } from "@/Logger";
import { extractValuesFromState } from "@/Slack/format";
import {
  postChannelMessage,
  postDirectMessage,
  getPermalink,
} from "@/Slack/api";
import { makeNewTaskDetailBlock } from "@/app/SlackBlocks";
import {
  addRequestTask,
  type AddRequestTaskType,
} from "@/app/domain/taskRequest";

/**
 * 依頼を登録する
 * @param {any} payload - ペイロード
 */
export function addTask(payload: any): GoogleAppsScript.Content.TextOutput {
  const user_id = payload.user.id;
  logInfo("addTask");
  const values = extractValuesFromState(payload.view.state);
  const task: AddRequestTaskType = {
    summary:
      typeof values.summary === "string" ? values.summary : values.summary[0],
    detail:
      typeof values.detail === "string" ? values.detail : values.detail[0],
    assignee: Array.isArray(values.assignee) ? values.assignee : [],
    due_date:
      typeof values.due_date === "string"
        ? values.due_date
        : values.due_date[0],
    priority:
      typeof values.priority === "string"
        ? values.priority
        : values.priority[0],
    requester:
      typeof values.requester === "string"
        ? values.requester
        : values.requester[0],
    post_channel:
      typeof values.post_channel === "string"
        ? values.post_channel
        : values.post_channel[0],
  };
  // 投稿先のチャンネル
  const channelMessage = postChannelMessage(task.post_channel, {
    blocks: makeNewTaskDetailBlock({
      summary: task.summary,
      detail: task.detail,
      assignee: task.assignee,
      due_date: task.due_date,
      priority: task.priority,
      requester: task.requester,
    }),
  });
  // 依頼元ユーザーに通知
  const response = getPermalink(channelMessage.channel, channelMessage.ts);
  postDirectMessage(user_id, {
    text: `依頼を完了しました。\n${JSON.stringify(task)} \n${response.permalink}`,
  });
  addRequestTask(task, user_id);
  return ContentService.createTextOutput();
}
