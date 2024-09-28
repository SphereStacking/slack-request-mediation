import type { Task } from "./index";

/**
 * @typedef {Object} Task
 * @property {string} id - id
 * @property {string} name - タスク名
 * @property {string} assignee - 担当者
 * @property {string} status - ステータス
 * @property {string} dueDate - 期限
 * @property {string} priority - 優先度
 * @property {string} requester - 依頼者
 */
export function makeTaskListBlocks(tasks: Task[]): any {
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
            text: `*管理ID*　　:　${task.id}\n*サマリー*　:　${task.summary}`,
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
          text: `*担当者*　:　${task.assignee}`,
        },
        {
          type: "mrkdwn",
          text: `*状態*　　:　${task.status}`,
        },
        {
          type: "mrkdwn",
          text: `*期限*　　:　${task.due_date} (${task.time_left})`,
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
