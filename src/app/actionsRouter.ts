import { EVENT_ACTION_ID, VIEW_SUBMISSION_ACTION_ID, BLOCK_ACTION_ID, SLACK_PAYLOAD_TYPE } from "@/app/AppConfig";
import {
  getHomeTab,
  addTask,
  updateHome,
  openTaskRegisterModal,
  assignOverflowAction,
  requestOverflowAction,
  urlVerification,
} from "@/app/actions";
import { logInfo, logDebug, logError } from "@/Logger";

/**
 * アクションルーター
 * @param type
 * @param payload
 * @returns
 */
export function actionsRouter(type: string, payload: any) {
  const callbackRoute = actionRoutes.find((route) => route.key === type);
  if (!callbackRoute) {
    logError(`callback not found : ${type}`);
    return ContentService.createTextOutput("callback not found");
  }
  return callbackRoute.callback(payload);
}

const createRoute = (key: string, callback: (payload: any) => GoogleAppsScript.Content.TextOutput) => ({
  key,
  callback,
});

const actionRoutes = [
  createRoute(SLACK_PAYLOAD_TYPE.URL_VERIFICATION, urlVerification),
  createRoute(EVENT_ACTION_ID.APP_HOME_OPENED, getHomeTab),
  createRoute(`${SLACK_PAYLOAD_TYPE.BLOCK_ACTIONS}/${BLOCK_ACTION_ID.HOME_SYNC}`, updateHome),
  createRoute(`${SLACK_PAYLOAD_TYPE.BLOCK_ACTIONS}/${BLOCK_ACTION_ID.TASK_REGISTER_MODAL_OPEN}`, openTaskRegisterModal),
  createRoute(`${SLACK_PAYLOAD_TYPE.BLOCK_ACTIONS}/${BLOCK_ACTION_ID.ASSIGN_OVERFLOW_ACTION}`, assignOverflowAction),
  createRoute(`${SLACK_PAYLOAD_TYPE.VIEW_SUBMISSION}/${VIEW_SUBMISSION_ACTION_ID.TASK_ADD}`, addTask),
  createRoute(`${SLACK_PAYLOAD_TYPE.BLOCK_ACTIONS}/${BLOCK_ACTION_ID.REQUEST_OVERFLOW_ACTION}`, requestOverflowAction),
];
