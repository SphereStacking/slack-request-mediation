import { logInfo } from "@/Logger";
import { getTask } from "@/app/taskRequest";
import { makeTaskDetailBlock } from "@/app/SlackBlocks";
import { postDirectMessage } from "@/Slack/api";

/**
 * タスクアクションを実行する
 * @param {any} payload - ペイロード
 * @param {string} task_id - タスクID
 */
export function taskActioned(payload: any): GoogleAppsScript.Content.TextOutput {
  logInfo("taskActioned");
  const values = JSON.parse(payload.actions[0].selected_option.value);
  const task_id = values.task_id;
  const task = getTask(task_id);
  const user_id = payload.user.id;
  const blocks = makeTaskDetailBlock({
    id: task[0].id,
    summary: task[0].summary,
    detail: task[0].detail,
    assignee: task[0].assignee,
    status: task[0].status,
    due_date: task[0].due_date,
    priority: task[0].priority,
    time_left: task[0].time_left,
    requester: task[0].requester,
    slack_url: task[0].slack_url,
  });
  for (const assignee of task[0].assignee) {
    postDirectMessage(assignee, { blocks: blocks });
  }
  postDirectMessage(user_id, { text: "アクションを通知しました。" });
  return ContentService.createTextOutput("hoge");
}
