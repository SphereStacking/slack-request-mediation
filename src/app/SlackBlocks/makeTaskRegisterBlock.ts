/**
 * 依頼登録ブロックを作成する
 * @returns {Object} 依頼登録ブロック
 */
export function makeTaskRegisterBlock(): any {
  return {
    view: {
      type: "modal",
      callback_id: "task_add",
      title: {
        type: "plain_text",
        text: "依頼登録",
        emoji: true,
      },
      submit: {
        type: "plain_text",
        text: "登録",
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
          block_id: "post_channel",
          text: {
            type: "mrkdwn",
            text: "依頼投稿先のチャンネル",
          },
          accessory: {
            type: "channels_select",
            placeholder: {
              type: "plain_text",
              text: "Select a channel",
              emoji: true,
            },
            action_id: "channels_select-action",
          },
        },
        {
          type: "input",
          block_id: "summary",
          element: {
            type: "plain_text_input",
            action_id: "plain_text_input-action",
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
          block_id: "assignee",
          text: {
            type: "mrkdwn",
            text: "*担当者 assignee*",
          },
          accessory: {
            type: "multi_users_select",
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
            initial_value: "50",
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
