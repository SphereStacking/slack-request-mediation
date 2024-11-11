export interface TaskDetail {
  id: string;
  summary: string;
  detail: string;
  assignees: string[];
  due_date: Date;
  priority: string;
  requester: string;
  approved_assignees: string[];
}

export interface RequestBlock {
  title: string;
  dueDate: Date;
  priority: string;
  assigneess: string;
}

export interface Task {
  id: string;
  summary: string;
  detail: string;
  assignees: string[];
  status: string;
  due_date: Date;
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
export { makeRequestTaskDetailBlocks } from "./makeRequestTaskDetailBlocks";
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
export { makeApprovedAllToUserBlocks } from "./makeApprovedAllToUserBlocks";
