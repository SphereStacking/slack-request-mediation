import { logError } from "@/Logger";
import {
  EVENT_ACTION_ID,
  VIEW_SUBMISSION_ACTION_ID,
  BLOCK_ACTION_ID,
  SLACK_PAYLOAD_TYPE,
} from "@/app/AppConfig";
import {
  getHomeTab,
  addTask,
  updateHome,
  openTaskRegisterModal,
  taskDetail,
  taskActioned,
  taskClose,
  taskRemind,
  taskLgtm,
  urlVerification,
} from "@/app/controller";
import { logInfo } from "@/Logger";
/**
 * アクションルーター
 */
const actionRoutes: {
  key: string;
  controller: (payload: any) => GoogleAppsScript.Content.TextOutput;
}[] = [
  {
    key: `${SLACK_PAYLOAD_TYPE.URL_VERIFICATION}/${SLACK_PAYLOAD_TYPE.URL_VERIFICATION}`,
    controller: (payload: any) => urlVerification(payload),
  },
  {
    key: `${SLACK_PAYLOAD_TYPE.EVENT}/${EVENT_ACTION_ID.APP_HOME_OPENED}`,
    controller: (payload: any) => getHomeTab(payload),
  },
  {
    key: `${SLACK_PAYLOAD_TYPE.BLOCK_ACTIONS}/${BLOCK_ACTION_ID.HOME_SYNC}`,
    controller: (payload: any) => updateHome(payload),
  },
  {
    key: `${SLACK_PAYLOAD_TYPE.BLOCK_ACTIONS}/${BLOCK_ACTION_ID.TASK_REGISTER_MODAL_OPEN}`,
    controller: (payload: any) => openTaskRegisterModal(payload),
  },
  {
    key: `${SLACK_PAYLOAD_TYPE.BLOCK_ACTIONS}/${BLOCK_ACTION_ID.ASSIGN_OVERFLOW_ACTION}/${BLOCK_ACTION_ID.TASK_DETAIL}`,
    controller: (payload: any) => taskDetail(payload),
  },
  {
    key: `${SLACK_PAYLOAD_TYPE.BLOCK_ACTIONS}/${BLOCK_ACTION_ID.ASSIGN_OVERFLOW_ACTION}/${BLOCK_ACTION_ID.TASK_ACTIONED}`,
    controller: (payload: any) => taskActioned(payload),
  },
  {
    key: `${SLACK_PAYLOAD_TYPE.BLOCK_ACTIONS}/${BLOCK_ACTION_ID.ASSIGN_OVERFLOW_ACTION}/${BLOCK_ACTION_ID.TASK_CLOSED}`,
    controller: (payload: any) => taskClose(payload),
  },
  {
    key: `${SLACK_PAYLOAD_TYPE.BLOCK_ACTIONS}/${BLOCK_ACTION_ID.ASSIGN_OVERFLOW_ACTION}/${BLOCK_ACTION_ID.TASK_REMIND}`,
    controller: (payload: any) => taskRemind(payload),
  },
  {
    key: `${SLACK_PAYLOAD_TYPE.BLOCK_ACTIONS}/${BLOCK_ACTION_ID.ASSIGN_OVERFLOW_ACTION}/${BLOCK_ACTION_ID.TASK_LGTM}`,
    controller: (payload: any) => taskLgtm(payload),
  },
  {
    key: `${SLACK_PAYLOAD_TYPE.BLOCK_ACTIONS}/${BLOCK_ACTION_ID.REQUEST_OVERFLOW_ACTION}/${BLOCK_ACTION_ID.TASK_DETAIL}`,
    controller: (payload: any) => taskDetail(payload),
  },
  {
    key: `${SLACK_PAYLOAD_TYPE.BLOCK_ACTIONS}/${BLOCK_ACTION_ID.REQUEST_OVERFLOW_ACTION}/${BLOCK_ACTION_ID.TASK_ACTIONED}`,
    controller: (payload: any) => taskActioned(payload),
  },
  {
    key: `${SLACK_PAYLOAD_TYPE.BLOCK_ACTIONS}/${BLOCK_ACTION_ID.REQUEST_OVERFLOW_ACTION}/${BLOCK_ACTION_ID.TASK_CLOSED}`,
    controller: (payload: any) => taskClose(payload),
  },
  {
    key: `${SLACK_PAYLOAD_TYPE.BLOCK_ACTIONS}/${BLOCK_ACTION_ID.REQUEST_OVERFLOW_ACTION}/${BLOCK_ACTION_ID.TASK_REMIND}`,
    controller: (payload: any) => taskRemind(payload),
  },
  {
    key: `${SLACK_PAYLOAD_TYPE.BLOCK_ACTIONS}/${BLOCK_ACTION_ID.REQUEST_OVERFLOW_ACTION}/${BLOCK_ACTION_ID.TASK_LGTM}`,
    controller: (payload: any) => taskLgtm(payload),
  },
  {
    key: `${SLACK_PAYLOAD_TYPE.VIEW_SUBMISSION}/${VIEW_SUBMISSION_ACTION_ID.TASK_ADD}`,
    controller: (payload: any) => addTask(payload),
  },
];

/**
 * スラックのPOSTリクエストを受け取る
 * @param e
 * @returns
 */
export function SlackPostRequest(
  e: GoogleAppsScript.Events.DoPost,
): GoogleAppsScript.Content.TextOutput {
  try {
    logInfo("SlackPostRequest");
    const postData = parsePostData(e.postData.contents);
    logInfo(postData);
    return routePayload(postData.type, postData);
  } catch (error) {
    // errorを握りつぶす。
  }

  try {
    const payload = parsePayload(e.parameter.payload);
    return routePayload(payload.type, payload);
  } catch (error: any) {
    logError(error);
    return ContentService.createTextOutput(error.message);
  }
}

function parsePostData(contents: string): any {
  return JSON.parse(contents);
}

function parsePayload(payload: string): any {
  return JSON.parse(decodeURIComponent(payload));
}

/**
 * アクションをルーティングする
 * @param type
 * @param actionId
 * @param payload
 */
function routeAction(
  type: string,
  actionId: string,
  payload: any,
): GoogleAppsScript.Content.TextOutput {
  logInfo("routeAction");
  logInfo(actionRoutes);
  logInfo({ type, actionId, payload });
  const key = `${type}/${actionId}`;
  const controller = actionRoutes.find((route) => route.key === key);
  logInfo({ controller });

  if (!controller) {
    logError(`No controller found for type: ${type}, actionId: ${actionId}`);
    return ContentService.createTextOutput("No controller found");
  }
  return controller.controller(payload);
}

/**
 * ペイロードをルーティングする
 * @param type
 * @param payload
 */
function routePayload(
  type: string,
  payload: any,
): GoogleAppsScript.Content.TextOutput {
  logInfo("routePayload");
  logInfo(type);
  logInfo(payload);
  let actionId: string;
  switch (type) {
    case SLACK_PAYLOAD_TYPE.URL_VERIFICATION:
      actionId = payload.type;
      break;
    case SLACK_PAYLOAD_TYPE.EVENT:
      actionId = payload.type;
      break;
    case SLACK_PAYLOAD_TYPE.BLOCK_ACTIONS:
      actionId = payload.actions[0].action_id;
      break;
    default:
      actionId = payload.view.callback_id;
  }
  logInfo(actionId);
  return routeAction(type, actionId, payload);
}
