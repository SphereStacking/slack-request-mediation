import type { Task } from "./index";
import { logDebug } from "@/Logger";
/**
 * @typedef {Object} Task
 * @property {string} id - id
 * @property {string} name - タスク名
 * @property {string} assignees - 担当者
 * @property {string} status - ステータス
 * @property {Date} dueDate - 期限
 * @property {string} priority - 優先度
 * @property {string} requester - 依頼者
 */
export function makeTaskListBlocks(tasks: Task[]): any {
  logDebug({ block: "makeTaskListBlocks", tasks });
  const blocks: any[] = [
    {
      type: "divider",
    },
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "依頼一覧",
        emoji: true,
      },
    },
    {
      type: "divider",
    },
  ];

  // タスクをループしてブロックを追加
  for (const task of tasks) {
    blocks.push(
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*管理ID*　　:　\n${task.id}\n*サマリー*　:　\n${task.summary}`,
          },
        ],
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*詳細*　　:　\n${task.detail}`,
          },
        ],
      },
    );
    blocks.push({
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*依頼者*　:　${task.requester}`,
        },
        {
          type: "mrkdwn",
          text: ` ${task.status_emoji}`,
        },
        {
          type: "mrkdwn",
          text: `*担当者*　:　${task.assignees}`,
        },
        {
          type: "mrkdwn",
          text: `*状態*　　:　${task.status}`,
        },
        {
          type: "mrkdwn",
          text: `*期限*　　:　${Utilities.formatDate(task.due_date, "JST", "yyyy/MM/dd")} (${task.time_left})`,
        },
        {
          type: "mrkdwn",
          text: `*優先度*　:　${task.priority}`,
        },
      ],
    });
    blocks.push({
      type: "divider",
    });
  }

  return { blocks: blocks };
}
