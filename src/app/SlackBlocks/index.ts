export interface TaskDetail {
  summary: string;
  detail: string;
  assignees: string[];
  due_date: string;
  priority: string;
  requester: string;
}

export interface RequestBlock {
  title: string;
  dueDate: string;
  priority: string;
  assigneess: string;
}

export interface Task {
  id: string;
  summary: string;
  detail: string;
  assignees: string[];
  status: string;
  due_date: string;
  priority: string;
  requester: string;
  status_emoji: string;
  time_left: string;
  slack_url: string;
}

export interface TaskDetailBlock {
  id: string;
  summary: string;
  detail: string;
  assignees: string[];
  status: string;
  due_date: string;
  priority: string;
  time_left: string;
  requester: string;
  slack_url: string;
}
export type TaskActionValue = {
  task_id: string;
  type: string;
};
export { makeApprovedToUserBlocks } from "./makeApprovedToUserBlocks";
export { makeApprovedToThreadBlocks } from "./makeApprovedToThreadBlocks";
export { makeNewRequestBlocks } from "./makeNewRequestBlocks";
export { makeNewTaskDetailBlock } from "./makeNewTaskDetailBlock";
export { makeTaskDetailBlock } from "./makeTaskDetailBlock";
export { makeTaskListBlocks } from "./makeTaskListBlocks";
export { makeAppHomeBlocks } from "./makeAppHomeBlocks";
export { makeTaskRegisterBlock } from "./makeTaskRegisterBlock";
export { makeReminderToUserBlocks } from "./makeReminderToUserBlocks";
export { makeReminderToThreadBlocks } from "./makeReminderToThreadBlocks";
export { makeActionedToUserBlocks } from "./makeActionedToUserBlocks";
export { makeActionedToThreadBlocks } from "./makeActionedToThreadBlocks";
export { makeClosedToUserBlocks } from "./makeClosedToUserBlocks";
export { makeClosedToThreadBlocks } from "./makeClosedToThreadBlocks";
