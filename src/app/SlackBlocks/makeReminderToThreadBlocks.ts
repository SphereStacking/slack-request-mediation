import { logDebug } from "@/Logger";

export function makeReminderToThreadBlocks(user_id: string): any {
  logDebug({ block: "makeReminderToThreadBlocks", user_id });
  return {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `<@${user_id}> よりリマインドがありました。`,
        },
      },
    ],
  };
}
