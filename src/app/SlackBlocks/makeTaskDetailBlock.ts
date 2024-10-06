import type { TaskDetailBlock } from "./index";
import { logDebug } from "@/Logger";
/**
 * 依頼詳細ブロックを作成する
 * @param {TaskDetailBlock} task - 依頼情報
 * @returns {Object} 依頼詳細ブロック
 */
export function makeTaskDetailBlock({
  id,
  summary,
  detail,
  assignees,
  status,
  due_date,
  priority,
  time_left,
  requester,
  slack_url,
}: TaskDetailBlock): any {
  logDebug({
    block: "makeTaskDetailBlock",
    id,
    summary,
    detail,
    assignees,
    status,
    due_date,
    priority,
    time_left,
    requester,
    slack_url,
  });
  return {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "依頼詳細",
          emoji: true,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*管理ID*　　:　${id}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*要約*　:\n${summary}`,
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "投稿メッセージへ",
            emoji: true,
          },
          value: "click_me_123",
          url: `${slack_url}`,
          action_id: "button-action",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*詳細*　:\n${detail}`,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*担当者* : ${assignees.map((a) => `<@${a}>`).join(", ")}`,
          },
        ],
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*依頼者*:　<@${requester}>`,
          },
          {
            type: "mrkdwn",
            text: `*状態*　:　${status}`,
          },
          {
            type: "mrkdwn",
            text: `*期限*　:　${due_date}`,
          },
          {
            type: "mrkdwn",
            text: `*優先度*:　${priority}`,
          },
          {
            type: "mrkdwn",
            text: `　　　　${time_left}`,
          },
        ],
      },
    ],
  };
}
