import { logInfo } from "@/Logger";
import { SlackPayloadParser } from "@/Slack/format";
import { addRequestTask } from "@/app/service/taskRequest";

/**
 * 依頼を登録する
 * @param {any} payload - ペイロード
 */
export function addTask(payload: any): GoogleAppsScript.Content.TextOutput {
  const slackPayloadParser = new SlackPayloadParser(payload.view.state);
  addRequestTask({
    summary: slackPayloadParser.getPlainTextInput("summary").value,
    detail: JSON.stringify(slackPayloadParser.getRichTextInput("detail").value),
    assignees: slackPayloadParser.getMultiUsersSelect("assignees").value,
    due_date: slackPayloadParser.getDatepicker("due_date").value,
    priority: slackPayloadParser.getNumberInput("priority").value,
    requester: payload.user.id,
    post_channel: slackPayloadParser.getChannelsSelect("post_channel").value,
  });
  return ContentService.createTextOutput();
}
