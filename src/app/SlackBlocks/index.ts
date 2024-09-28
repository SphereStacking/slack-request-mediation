export interface TaskDetail {
  summary: string;
  detail: string;
  assignee: string[];
  due_date: string;
  priority: string;
  requester: string;
}

export interface RequestBlock {
  title: string;
  dueDate: string;
  priority: string;
  assignees: string;
}

export interface Task {
  id: string;
  summary: string;
  detail: string;
  assignee: string[];
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
  assignee: string[];
  status: string;
  due_date: string;
  priority: string;
  time_left: string;
  requester: string;
  slack_url: string;
}

import { makeNewRequestBlocks } from "./makeNewRequestBlocks";
import { makeNewTaskDetailBlock } from "./makeNewTaskDetailBlock";
import { makeTaskDetailBlock } from "./makeTaskDetailBlock";
import { makeTaskListBlocks } from "./makeTaskListBlocks";
import { makeAppHomeBlocks } from "./makeAppHomeBlocks";
import { makeTaskRegisterBlock } from "./makeTaskRegisterBlock";

export {
  makeNewRequestBlocks,
  makeNewTaskDetailBlock,
  makeTaskDetailBlock,
  makeTaskListBlocks,
  makeAppHomeBlocks,
  makeTaskRegisterBlock,
};
