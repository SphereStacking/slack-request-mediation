import { logError } from "@/Logger";
import { postDirectMessage } from "@/Slack";
import { makeTaskListBlocks } from "@/app/SlackBlocks";
import { getInProgressTasks } from "./getInProgressTasks";
import type { Task } from "./index";

/**
 * 進行中のタスクにアサインされているユーザーに通知を送る
 */
export function taskRemindInProgressAllUserNotification(): void {
  const tasks = getInProgressTasks();
  const assigneeTaskMap: Map<string, Task[]> = new Map();

  for (const task of tasks) {
    for (const assignee of task.assignees) {
      // approved_assigneesに含まれている場合はスキップ
      if (task.approved_assignees.includes(assignee)) {
        continue;
      }
      if (!assigneeTaskMap.has(assignee)) {
        assigneeTaskMap.set(assignee, []);
      }
      const taskList = assigneeTaskMap.get(assignee);
      if (taskList) {
        taskList.push(task);
      }
    }
  }

  for (const [assignee, tasks] of assigneeTaskMap) {
    try {
      postDirectMessage(assignee, makeTaskListBlocks(tasks));
    } catch (error) {
      logError({ error: "ユーザーにメッセージを送信できません", assignee });
    }
  }
}
