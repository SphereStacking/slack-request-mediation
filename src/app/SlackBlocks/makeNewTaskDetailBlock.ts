import type { TaskDetail } from "./index";

export function makeNewTaskDetailBlock({
  summary,
  detail,
  assignee,
  due_date,
  priority,
  requester,
}: TaskDetail): any[] {
  return [
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
          text: `*担当者*　:　${assignee.map((a) => `<@${a}>`).join(", ")}`,
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
  ];
}
