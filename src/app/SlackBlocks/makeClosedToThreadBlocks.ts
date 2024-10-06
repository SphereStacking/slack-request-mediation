import { logDebug } from "@/Logger";

export function makeClosedToThreadBlocks(user_id: string): any {
  logDebug({ block: "makeClosedToThreadBlocks", user_id });
  return {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `<@${user_id}> が依頼をクローズしました。`,
        },
      },
    ],
  };
}
