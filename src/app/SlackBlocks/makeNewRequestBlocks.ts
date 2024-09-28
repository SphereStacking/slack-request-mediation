import type { RequestBlock } from "./index";

/**
 * 新しい依頼ブロックを作成する
 * @param {RequestBlock} task - 依頼情報
 * @returns {Object} 新しい依頼ブロック
 */
export function makeNewRequestBlocks({
  title,
  dueDate,
  priority,
  assignees,
}: RequestBlock): any {
  return {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "New request",
          emoji: true,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: title,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*依頼先:*\n${assignees}`,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*期限:*\n${dueDate}`,
          },
          {
            type: "mrkdwn",
            text: `*優先度:*\n${priority}`,
          },
        ],
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "LGTM",
              emoji: true,
            },
            style: "primary",
            value: "click_me_123",
            action_id: "actionId-0",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Remind",
              emoji: true,
            },
            style: "danger",
            value: "click_me_123",
            action_id: "actionId-2",
          },
        ],
      },
    ],
  };
}
