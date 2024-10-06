import type { TaskDetail } from "./index";
import { logDebug } from "@/Logger";

export function makeRequestTaskDetailBlock({
  id,
  summary,
  detail,
  assignees,
  due_date,
  priority,
  requester,
}: TaskDetail): any {
  logDebug({ block: "makeRequestTaskDetailBlock", summary, detail, assignees, due_date, priority, requester });
  return {
    blocks: [
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `依頼が<@${requester}>より届きました。`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${summary}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${detail}*`,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*担当者*　:　${assignees.map((a) => `<@${a}>`).join(", ")}`,
          },
        ],
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*期限*　　:　${due_date}`,
          },
          {
            type: "mrkdwn",
            text: `*優先度*　:　${priority}`,
          },
        ],
      },
    ],
  };
}
