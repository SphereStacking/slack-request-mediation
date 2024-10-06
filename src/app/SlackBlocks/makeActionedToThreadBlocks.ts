import { logDebug } from "@/Logger";

export function makeActionedToThreadBlocks(user_id: string): any {
  logDebug({ block: "makeActionedToThreadBlocks", user_id });
  return {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `<@${user_id}> よりアクションがありました。`,
        },
      },
    ],
  };
}
