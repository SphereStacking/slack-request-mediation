import { logError } from "@/Logger";
import { extractChannelIdAndTimestamp, postMessageToThread, postDirectMessage } from "@/Slack";
import { makeTaskDetailBlock } from "@/app/SlackBlocks";
import { getTask } from "./getTask";
/**
 * タスクの詳細を通知する
 * @param {string} task_id - タスクID
 * @param {string} user_id - ユーザーID
 */
export function taskDetailNotification(task_id: string, user_id: string): void {
  const task = getTask(task_id);
  if (task.length === 0) {
    logError({ error: "タスクが見つかりません", task_id });
    return;
  }
  try {
    postDirectMessage(
      user_id,
      makeTaskDetailBlock({
        id: task[0].id,
        summary: task[0].summary,
        detail: task[0].detail,
        assignees: task[0].assignees,
        status: task[0].status,
        due_date: task[0].due_date,
        priority: task[0].priority,
        time_left: task[0].time_left,
        requester: task[0].requester,
        slack_url: task[0].slack_url,
      }),
    );
  } catch (error) {
    logError({ error: "ユーザーにメッセージを送信できません", task_id });
  }
}
