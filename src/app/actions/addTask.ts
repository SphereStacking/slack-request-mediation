import { logInfo } from "@/Logger";
import { SlackPayloadParser } from "@/Slack/format";
import {
  postChannelMessage,
  postDirectMessage,
  getPermalink,
  getConversationsMembers,
  postJoinChannel,
} from "@/Slack/api";
import { makeNewTaskDetailBlock } from "@/app/SlackBlocks";
import { addRequestTask } from "@/app/service/taskRequest";
import type {
  PlainTextInput,
  NumberInput,
  RichTextInput,
  MultiUsersSelect,
  Datepicker,
  ChannelsSelect,
} from "@/Slack/format";
import { scriptProperties } from "@/ScriptProperties";

type FormatTask = {
  summary: PlainTextInput;
  detail: RichTextInput;
  assignee: MultiUsersSelect;
  due_date: Datepicker;
  priority: NumberInput;
  post_channel: ChannelsSelect;
};
/**
 * 依頼を登録する
 * @param {any} payload - ペイロード
 */
export function addTask(payload: any): GoogleAppsScript.Content.TextOutput {
  logInfo("addTask");
  const user_id = payload.user.id;
  const slackPayloadParser = new SlackPayloadParser(payload.view.state);

  const task: FormatTask = {
    summary: slackPayloadParser.getPlainTextInput("summary"),
    detail: slackPayloadParser.getRichTextInput("detail"),
    assignee: slackPayloadParser.getMultiUsersSelect("assignee"),
    due_date: slackPayloadParser.getDatepicker("due_date"),
    priority: slackPayloadParser.getNumberInput("priority"),
    post_channel: slackPayloadParser.getChannelsSelect("post_channel"),
  };

  // 投稿先のチャンネルにBotが参加していないとメッセージを投稿できないため必要に応じて追加させる。
  const conversationsMembers = getConversationsMembers(task.post_channel.value);
  const isMember = conversationsMembers.members.includes(scriptProperties.SLACK_BOT_USER_ID);
  if (!isMember) {
    postJoinChannel(task.post_channel.value);
  }

  // 投稿先のチャンネル
  const channelMessage = postChannelMessage(task.post_channel.value, {
    blocks: makeNewTaskDetailBlock({
      summary: task.summary.value,
      detail: task.detail.value,
      assignee: task.assignee.value,
      due_date: task.due_date.value,
      priority: task.priority.value,
      requester: user_id,
    }),
  });

  // 依頼元ユーザーに通知
  const response = getPermalink(channelMessage.channel, channelMessage.ts);
  postDirectMessage(user_id, {
    text: `依頼を完了しました。\n${JSON.stringify(task)} \n${response.permalink}`,
  });
  addRequestTask({
    summary: task.summary.value,
    detail: task.detail.value,
    assignee: task.assignee.value,
    due_date: task.due_date.value,
    priority: task.priority.value,
    requester: user_id,
    post_channel: task.post_channel.value,
    slack_message_url: response.permalink,
  });
  return ContentService.createTextOutput();
}
