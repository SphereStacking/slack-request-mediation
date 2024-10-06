import { scriptProperties } from "@/ScriptProperties";

/** 現在のログレベル */
export const CURRENT_LOG_LEVEL = scriptProperties.CURRENT_LOG_LEVEL;

interface TaskStatus {
  value: string;
  emoji: string;
}

/** タスクのステータス */
export const TASK_STATUS: Record<string, TaskStatus> = {
  DRAFT: { value: "draft", emoji: ":memo:" }, // メモ
  IN_PROGRESS: {
    value: "in_progress",
    emoji: ":hourglass_flowing_sand:",
  }, // 砂時計
  ON_HOLD: { value: "on_hold", emoji: ":pause_button:" }, // 一時停止ボタン
  COMPLETED: { value: "completed", emoji: ":white_check_mark:" }, // チェックマーク
  CANCELLED: { value: "cancelled", emoji: ":x:" }, // バツ印
};

/** タスクの初期ステータス */
export const TASK_DEFAULT_STATUS: string = TASK_STATUS.IN_PROGRESS.value;

/** タスクのスプレッドシートの列 */
interface TaskSpreadSheetColumn {
  title: string;
  index: number;
  column: string;
  setFormatRow: (value: string) => string;
}

/** タスクのスプレッドシートの列 */
export const TASK_SPREAD_SHEET_COLUMNS: Record<string, TaskSpreadSheetColumn> = {
  ID: {
    title: "id",
    index: 0,
    column: "A",
    setFormatRow: (value: string): string => value,
  },
  SUMMARY: {
    title: "summary",
    index: 1,
    column: "B",
    setFormatRow: (value: string): string => value,
  },
  DETAIL: {
    title: "detail",
    index: 2,
    column: "C",
    setFormatRow: (value: string): string => value,
  },
  ASSIGNEES: {
    title: "assignees",
    index: 3,
    column: "D",
    setFormatRow: (value: string): string => value,
  },
  STATUS: {
    title: "status",
    index: 4,
    column: "E",
    setFormatRow: (value: string): string => value,
  },
  DUE_DATE: {
    title: "due_date",
    index: 5,
    column: "F",
    setFormatRow: (value: string): string => value,
  },
  PRIORITY: {
    title: "priority",
    index: 6,
    column: "G",
    setFormatRow: (value: string): string => value,
  },
  REQUESTER: {
    title: "requester",
    index: 7,
    column: "H",
    setFormatRow: (value: string): string => value,
  },
  TIME_LEFT: {
    title: "time_left",
    index: 8,
    column: "I",
    setFormatRow: (value: string): string =>
      `=IF(F${value}-TODAY()>1, F${value}-TODAY() & "日", INT((F${value}-NOW())*24) & "時間")`,
  },
  POST_CHANNEL: {
    title: "post_channel",
    index: 9,
    column: "J",
    setFormatRow: (value: string): string => value,
  },
  SLACK_MESSAGE_URL: {
    title: "slack_message_url",
    index: 10,
    column: "K",
    setFormatRow: (value: string): string => value,
  },
  NOTIFIED_AT: {
    title: "notified_at",
    index: 11,
    column: "L",
    setFormatRow: (value: string): string => value,
  },
  APPROVED_ASSIGNEES: {
    title: "approved_assignees",
    index: 12,
    column: "M",
    setFormatRow: (value: string): string => value,
  },
};

/** イベントアクションID (slackのイベント名) */
export const EVENT_ACTION_ID: Record<string, string> = {
  APP_HOME_OPENED: "app_home_opened",
};

/** ビューサブミッションアクションID (slackのビューサブミッション名) */
export const VIEW_SUBMISSION_ACTION_ID: Record<string, string> = {
  TASK_ADD: "task_add",
};

/** ブロックアクションID (slackのブロックアクション名) */
export const BLOCK_ACTION_ID: Record<string, string> = {
  HOME_SYNC: "home_sync",
  TASK_REGISTER_MODAL_OPEN: "task_register_modal_open",
  ASSIGN_OVERFLOW_ACTION: "assign-overflow-action",
  REQUEST_OVERFLOW_ACTION: "request-overflow-action",
  TASK_DETAIL: "detail",
  TASK_ACTIONED: "actioned",
  TASK_REMIND: "remind",
  TASK_LGTM: "lgtm",
  TASK_CLOSED: "closed",
};

/** スラックの絵文字 */
export const SLACK_EMOJI: Record<string, string> = {
  LGTM: ":lgtm:",
  ACTIONED: ":speech_balloon:",
  REMIND: ":alarm_clock:",
  CLOSED: ":irai_kanryou:",
  DETAIL: ":clipboard:",
  UNASSIGNED: ":no_entry_sign:",
};

/** スラックのペイロードタイプ */
export const SLACK_PAYLOAD_TYPE: Record<string, string> = {
  URL_VERIFICATION: "url_verification",
  BLOCK_ACTIONS: "block_actions",
  VIEW_SUBMISSION: "view_submission",
};
