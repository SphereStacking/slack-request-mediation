import type { Task } from "@/app/service/taskRequest/index";
/**
 * 依頼登録ブロックを作成する
 * @returns {Object} 依頼登録ブロック
 */
export function makeTaskEditBlock(task: Task): any {
  return {
    view: {
      type: "modal",
      callback_id: "task_edit",
      title: {
        type: "plain_text",
        text: "依頼編集",
        emoji: true,
      },
      submit: {
        type: "plain_text",
        text: "編集",
        emoji: true,
      },
      close: {
        type: "plain_text",
        text: "キャンセル",
        emoji: true,
      },
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: ":warning:通知まで最大1分の遅延があります:warning:",
          },
        },
        {
          type: "input",
          block_id: "summary",
          element: {
            type: "plain_text_input",
            action_id: "plain_text_input-action",
            initial_value: task.summary,
          },
          label: {
            type: "plain_text",
            text: "概要 summary",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: "detail",
          element: {
            type: "rich_text_input",
            action_id: "rich_text_input-action",
            initial_value: {
              type: "rich_text",
              elements: parseTaskDetail(task.detail),
            },
            placeholder: {
              type: "plain_text",
              text: "依頼内容の詳細を記述してください。",
            },
          },
          label: {
            type: "plain_text",
            text: "詳細 detail",
            emoji: true,
          },
        },
        {
          type: "section",
          block_id: "assignees",
          text: {
            type: "mrkdwn",
            text: "*担当者 assignees*",
          },
          accessory: {
            type: "multi_users_select",
            initial_users: task.assignees,
            placeholder: {
              type: "plain_text",
              text: "Select a user",
              emoji: true,
            },
            action_id: "users_select-action",
          },
        },
        {
          type: "input",
          block_id: "priority",
          element: {
            type: "number_input",
            is_decimal_allowed: false,
            action_id: "number_input-action",
            initial_value: task.priority.toString(),
            max_value: "100",
            min_value: "0",
          },
          label: {
            type: "plain_text",
            text: "優先度 priority (暇な時:0 通常:50 急ぎ:75 最優先:100)",
            emoji: true,
          },
        },
        {
          type: "section",
          block_id: "due_date",
          text: {
            type: "mrkdwn",
            text: "*期限 due_date*",
          },
          accessory: {
            type: "datepicker",
            initial_date: Utilities.formatDate(task.due_date, "JST", "yyyy-MM-dd"),
            placeholder: {
              type: "plain_text",
              text: "Select a date",
              emoji: true,
            },
            action_id: "datepicker-action",
          },
        },
      ],
    },
  };
}

// task.detailをパースしてelementsを抽出する関数
function parseTaskDetail(detail: string): any[] {
  try {
    return JSON.parse(detail).elements;
  } catch {
    return [
      {
        type: "rich_text_section",
        elements: [{ type: "text", text: "情報のパースに失敗しました。開発者に連絡してください。" }],
      },
    ];
  }
}
