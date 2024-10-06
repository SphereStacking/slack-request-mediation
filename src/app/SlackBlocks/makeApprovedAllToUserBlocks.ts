import { logDebug } from "@/Logger";
import { BLOCK_ACTION_ID } from "@/app/AppConfig";

export function makeApprovedAllToUserBlocks(task_id: string, summary: string, slack_url: string, detail: string): any {
  logDebug({ block: "makeApprovedAllToUserBlocks", task_id, summary, slack_url, detail });
  return {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "ALL Approved！",
          emoji: true,
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `問題なければCloseしてください。\n\n*要約*　:\n${summary}\n*詳細*　:\n${detail}`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "依頼を確認",
              emoji: true,
            },
            url: slack_url,
            value: "click_me_123",
            action_id: "actionId-0",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Close",
              emoji: true,
            },
            style: "danger",
            value: task_id,
            action_id: BLOCK_ACTION_ID.TASK_CLOSED,
          },
        ],
      },
    ],
  };
}
