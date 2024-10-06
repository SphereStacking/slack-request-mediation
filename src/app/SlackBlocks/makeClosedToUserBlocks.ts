import { logDebug } from "@/Logger";

export function makeClosedToUserBlocks(summary: string, slack_url: string): any {
  logDebug({ block: "makeClosedToUserBlocks", summary, slack_url });
  return {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `依頼「 *${summary}* 」をクローズしました。`,
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "依頼を確認",
            emoji: true,
          },
          value: "click_me_123",
          url: slack_url,
          action_id: "button-action",
        },
      },
    ],
  };
}
