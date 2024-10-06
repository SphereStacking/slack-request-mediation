import { logDebug } from "@/Logger";

export function makeApprovedToThreadBlocks(user_id: string): any {
  logDebug({ block: "makeApprovedToThreadBlocks", user_id });
  return {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `<@${user_id}> が承認しました。`,
        },
      },
    ],
  };
}
