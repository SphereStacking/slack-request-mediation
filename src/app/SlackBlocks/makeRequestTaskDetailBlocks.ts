import type { TaskDetail } from "./index";
import { logDebug } from "@/Logger";
import { SLACK_EMOJI } from "@/app/AppConfig";
import type { TaskActionValue } from "./index";
import { BLOCK_ACTION_ID } from "@/app/AppConfig";

export function makeRequestTaskDetailBlocks({
  id,
  summary,
  detail,
  assignees,
  due_date,
  priority,
  requester,
  approved_assignees,
}: TaskDetail): any {
  logDebug({
    block: "makeRequestTaskDetailBlocks",
    id,
    summary,
    detail,
    assignees,
    due_date,
    priority,
    requester,
    approved_assignees,
  });
  const assignees_with_strike = assignees.map((user_id) =>
    approved_assignees.includes(user_id)
      ? `<@${user_id}>(${SLACK_EMOJI.APPROVED_DONE})`
      : `<@${user_id}>(${SLACK_EMOJI.APPROVED_PENDING})`,
  );
  return {
    blocks: [
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `依頼が<@${requester}>より届きました。\nご対応お願い致します。`,
        },
        accessory: {
          type: "overflow",
          options: [
            {
              text: {
                type: "plain_text",
                text: `${SLACK_EMOJI.LGTM} LGTM/承認/OK`,
                emoji: true,
              },
              value: JSON.stringify(getTaskActionValue(id, BLOCK_ACTION_ID.TASK_LGTM)),
            },
            {
              text: {
                type: "plain_text",
                text: `${SLACK_EMOJI.ACTIONED} アクション/コメント したよ`,
                emoji: true,
              },
              value: JSON.stringify(getTaskActionValue(id, BLOCK_ACTION_ID.TASK_ACTIONED)),
            },
          ],
          action_id: BLOCK_ACTION_ID.ASSIGN_OVERFLOW_ACTION,
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
            text: `*担当者*　:　${assignees_with_strike.join(", ")}`,
          },
        ],
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*期限*　　:　${Utilities.formatDate(due_date, "JST", "yyyy/MM/dd")}`,
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
function getTaskActionValue(task_id: string, type: string): TaskActionValue {
  return {
    task_id: task_id,
    type: type,
  };
}
