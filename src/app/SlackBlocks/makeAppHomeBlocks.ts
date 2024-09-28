import { BLOCK_ACTION_ID, SLACK_EMOJI } from "@/config";
import type { Task } from "./index";

export function makeAppHomeBlocks(
  user_id: string,
  assignTasks: Task[],
  requestTasks: Task[],
): any {
  const blocks: any[] = [];
  blocks.push({
    type: "header",
    text: {
      type: "plain_text",
      text: `依頼一覧（${Utilities.formatDate(new Date(), "JST", "yyyy/MM/dd HH:mm:ss")} 現在）`,
      emoji: true,
    },
  });
  blocks.push({
    type: "actions",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Homeを更新",
          emoji: true,
        },
        value: "click_me_123",
        action_id: BLOCK_ACTION_ID.HOME_SYNC,
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "依頼を登録",
          emoji: true,
        },
        style: "primary",
        value: "click_me_123",
        action_id: BLOCK_ACTION_ID.TASK_REGISTER_MODAL_OPEN,
      },
    ],
  });
  blocks.push({
    type: "divider",
  });
  blocks.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `<@${user_id}>宛に依頼が *${assignTasks.length}件* 届いています。`,
    },
  });
  assignTasks.forEach((task, index) => {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${index + 1}* - ${task.due_date} from <@${task.requester}>\n　${task.summary}`,
      },
      accessory: {
        type: "overflow",
        options: [
          {
            text: {
              type: "plain_text",
              text: `${SLACK_EMOJI.DETAIL} 依頼を確認する`,
              emoji: true,
            },
            value: `{"task_id":"${task.id}","type":"detail"}`,
          },
          {
            text: {
              type: "plain_text",
              text: `${SLACK_EMOJI.LGTM} LGTM/承認/OK`,
              emoji: true,
            },
            value: `{"task_id":"${task.id}","type":"${BLOCK_ACTION_ID.TASK_LGTM}"}`,
          },
          {
            text: {
              type: "plain_text",
              text: `${SLACK_EMOJI.ACTIONED} アクション/コメント したよ`,
              emoji: true,
            },
            value: `{"task_id":"${task.id}","type":"${BLOCK_ACTION_ID.TASK_ACTIONED}"}`,
          },
        ],
        action_id: BLOCK_ACTION_ID.ASSIGN_OVERFLOW_ACTION,
      },
    });
  });
  blocks.push({
    type: "divider",
  });
  blocks.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `<@${user_id}>の依頼 *${requestTasks.length}件*`,
    },
  });

  requestTasks.forEach((task, index) => {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${index + 1}* - ${task.due_date} to  ${task.assignee.map((a: string) => `<@${a}>`).join(", ")} \n　${task.summary}`,
      },
      accessory: {
        type: "overflow",
        options: [
          //overflowのアクセサリーは5つまでらしい。
          {
            text: {
              type: "plain_text",
              text: `${SLACK_EMOJI.DETAIL} 依頼を確認する`,
              emoji: true,
            },
            value: `{"task_id":"${task.id}","type":"detail"}`,
          },
          {
            text: {
              type: "plain_text",
              text: `${SLACK_EMOJI.ACTIONED} アクションしたよ`,
              emoji: true,
            },
            value: `{"task_id":"${task.id}","type":"${BLOCK_ACTION_ID.TASK_ACTIONED}"}`,
          },
          {
            text: {
              type: "plain_text",
              text: `${SLACK_EMOJI.CLOSED} 依頼完了`,
              emoji: true,
            },
            value: `{"task_id":"${task.id}","type":"${BLOCK_ACTION_ID.TASK_CLOSED}"}`,
          },
          {
            text: {
              type: "plain_text",
              text: `${SLACK_EMOJI.REMIND} リマインド`,
              emoji: true,
            },
            value: `{"task_id":"${task.id}","type":"${BLOCK_ACTION_ID.TASK_REMIND}"}`,
          },
        ],
        action_id: "request-overflow-action",
      },
    });
  });
  return { blocks: blocks };
}
