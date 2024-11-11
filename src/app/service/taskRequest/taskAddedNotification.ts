import { logDebug, logInfo } from "@/Logger";
import { scriptProperties } from "@/ScriptProperties";
import { TASK_SPREAD_SHEET_COLUMNS, TASK_STATUS } from "@/app/AppConfig";
import { formatTaskRows } from "./formatTaskRows";
import { getFilteredDataWithQuery } from "@/SpreadSheet";
import {
  getConversationsMembers,
  postChannelMessage,
  postDirectMessage,
  getPermalink,
  postJoinChannel,
} from "@/Slack/api";
import { makeRequestTaskDetailBlocks } from "@/app/SlackBlocks";
import { updateSpreadsheetValues } from "@/SpreadSheet";
/**
 * 新しく追加された依頼を通知する
 * @param {any} payload - ペイロード
 */
export function taskAddedNotification(): GoogleAppsScript.Content.TextOutput {
  logDebug("taskAddedNotification");

  const tasks = formatTaskRows(
    getFilteredDataWithQuery({
      spreadsheetId: scriptProperties.TASK_SPREADSHEET_ID,
      sheetName: scriptProperties.TASK_SPREADSHEET_NAME,
      filters: [
        {
          column: TASK_SPREAD_SHEET_COLUMNS.NOTIFIED_AT.column,
          operator: "IS NULL",
        },
      ],
      skipRows: 1,
      selectColumns: ["*"],
    }),
  );
  for (const task of tasks) {
    // 投稿先のチャンネルにBotが参加していないとメッセージを投稿できないため必要に応じて追加させる。
    const conversationsMembers = getConversationsMembers(task.post_channel);
    const isMember = conversationsMembers.members.includes(scriptProperties.SLACK_BOT_USER_ID);
    if (!isMember) {
      postJoinChannel(task.post_channel);
    }

    // 投稿先のチャンネル
    const channelMessage = postChannelMessage(
      task.post_channel,
      makeRequestTaskDetailBlocks({
        id: task.id,
        summary: task.summary,
        detail: task.detail,
        assignees: task.assignees,
        due_date: Utilities.formatDate(task.due_date, "JST", "yyyy-MM-dd"),
        priority: task.priority,
        requester: task.requester,
        approved_assignees: [],
      }),
    );

    // 依頼元ユーザーに通知
    const response = getPermalink(channelMessage.channel, channelMessage.ts);
    postDirectMessage(task.requester, {
      text: `依頼通知が完了しました。\n${response.permalink}`,
    });

    // スプレッドシートの通知済みのフラグを立てる
    updateSpreadsheetValues(
      scriptProperties.TASK_SPREADSHEET_ID,
      scriptProperties.TASK_SPREADSHEET_NAME,
      TASK_SPREAD_SHEET_COLUMNS.ID.column,
      task.id,
      [
        { column: TASK_SPREAD_SHEET_COLUMNS.NOTIFIED_AT.column, value: new Date().toISOString() },
        { column: TASK_SPREAD_SHEET_COLUMNS.SLACK_MESSAGE_URL.column, value: response.permalink },
      ],
    );
  }

  return ContentService.createTextOutput();
}
