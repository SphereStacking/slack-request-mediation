function makeNewTaskDetailBlock({
  summary,
  detail,
  assignee,
  due_date,
  priority,
  requester,
}) {
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

/**
 * 新しい依頼ブロックを作成する
 * @param {Object} task - 依頼情報
 * @returns {Object} 新しい依頼ブロック
 */
function makeNewRequestBlocks({ title, dueDate, priority, assignees }) {
  return {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "New request",
          emoji: true,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: title,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*依頼先:*\n" + assignees,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: "*期限:*\n" + dueDate,
          },
          {
            type: "mrkdwn",
            text: "*優先度:*\n" + priority,
          },
        ],
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "LGTM",
              emoji: true,
            },
            style: "primary",
            value: "click_me_123",
            action_id: "actionId-0",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Remind",
              emoji: true,
            },
            style: "danger",
            value: "click_me_123",
            action_id: "actionId-2",
          },
        ],
      },
    ],
  };
}

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
function makeTaskListBlocks(tasks) {
  const blocks = [
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
  tasks.forEach(
    /** @param {Task} task */ (task) => {
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
            text: "  " + task.status_emoji,
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
    },
  );

  return { blocks: blocks };
}

function makeAppHomeBlocks(user_id, assignTasks, requestTasks) {
  const blocks = [];
  blocks.push({
    type: "header",
    text: {
      type: "plain_text",
      text: `依頼一覧（${Utilities.formatDate(new Date(), "JST", "yyyy/MM/dd HH:mm:ss")} 現在）`,
      emoji: true,
    },
  });
  blocks.push({
    type: "actions",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: `Homeを更新`,
          emoji: true,
        },
        value: "click_me_123",
        action_id: BLOCK_ACTION_ID.HOME_SYNC,
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "依頼を登録",
          emoji: true,
        },
        style: "primary",
        value: "click_me_123",
        action_id: BLOCK_ACTION_ID.TASK_REGISTER_MODAL_OPEN,
      },
    ],
  });
  blocks.push({
    type: "divider",
  });
  blocks.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `<@${user_id}>宛に依頼が *${assignTasks.length}件* 届いています。`,
    },
  });
  assignTasks.forEach((task, index) => {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${index + 1}* - ${task.due_date} from <@${task.requester}>\n　${task.summary}`,
      },
      accessory: {
        type: "overflow",
        options: [
          {
            text: {
              type: "plain_text",
              text: `${SLACK_EMOJI.DETAIL} 依頼を確認する`,
              emoji: true,
            },
            value: `{"task_id":"${task.id}","type":"detail"}`,
          },
          {
            text: {
              type: "plain_text",
              text: `${SLACK_EMOJI.LGTM} LGTM/承認/OK`,
              emoji: true,
            },
            value: `{"task_id":"${task.id}","type":"${BLOCK_ACTION_ID.TASK_LGTM}"}`,
          },
          {
            text: {
              type: "plain_text",
              text: `${SLACK_EMOJI.ACTIONED} アクション/コメント したよ`,
              emoji: true,
            },
            value: `{"task_id":"${task.id}","type":"${BLOCK_ACTION_ID.TASK_ACTIONED}"}`,
          },
        ],
        action_id: BLOCK_ACTION_ID.ASSIGN_OVERFLOW_ACTION,
      },
    });
  });
  blocks.push({
    type: "divider",
  });
  blocks.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `<@${user_id}>の依頼 *${requestTasks.length}件*`,
    },
  });

  requestTasks.forEach((task, index) => {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${index + 1}* - ${task.due_date} to  ${task.assignee.map((a) => `<@${a}>`).join(", ")} \n　${task.summary}`,
      },
      accessory: {
        type: "overflow",
        options: [
          //overflowのアクセサリーは5つまでらしい。
          {
            text: {
              type: "plain_text",
              text: `${SLACK_EMOJI.DETAIL} 依頼を確認する`,
              emoji: true,
            },
            value: `{"task_id":"${task.id}","type":"detail"}`,
          },
          {
            text: {
              type: "plain_text",
              text: `${SLACK_EMOJI.ACTIONED} アクションしたよ`,
              emoji: true,
            },
            value: `{"task_id":"${task.id}","type":"${BLOCK_ACTION_ID.TASK_ACTIONED}"}`,
          },
          {
            text: {
              type: "plain_text",
              text: `${SLACK_EMOJI.CLOSED} 依頼完了`,
              emoji: true,
            },
            value: `{"task_id":"${task.id}","type":"${BLOCK_ACTION_ID.TASK_CLOSED}"}`,
          },
          {
            text: {
              type: "plain_text",
              text: `${SLACK_EMOJI.REMIND} リマインド`,
              emoji: true,
            },
            value: `{"task_id":"${task.id}","type":"${BLOCK_ACTION_ID.TASK_REMIND}"}`,
          },
        ],
        action_id: "request-overflow-action",
      },
    });
  });
  return { blocks: blocks };
}
/**
 * 依頼詳細ブロックを作成する
 * @param {Object} task - 依頼情報
 * @returns {Object} 依頼詳細ブロック
 */
function makeTaskDetailBlock({
  id,
  summary,
  detail,
  assignee,
  status,
  due_date,
  priority,
  time_left,
  requester,
  slack_url,
}) {
  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `依頼詳細`,
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*管理ID*　　:　${id}`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*要約*　:\n${summary}`,
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          text: "投稿メッセージへ",
          emoji: true,
        },
        value: "click_me_123",
        url: `${slack_url}`,
        action_id: "button-action",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*詳細*　:\n${detail}`,
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*担当者* : ${assignee.map((a) => `<@${a}>`).join(", ")}`,
        },
      ],
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*依頼者*:　<@${requester}>`,
        },
        {
          type: "mrkdwn",
          text: `*状態*　:　${status}`,
        },
        {
          type: "mrkdwn",
          text: `*期限*　:　${due_date}`,
        },
        {
          type: "mrkdwn",
          text: `*優先度*:　${priority}`,
        },
        {
          type: "mrkdwn",
          text: `　　　　${time_left}`,
        },
      ],
    },
  ];
}

/**
 * 依頼登録ブロックを作成する
 * @returns {Object} 依頼登録ブロック
 */
function makeTaskRegisterBlock() {
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
