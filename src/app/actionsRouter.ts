import { EVENT_ACTION_ID, VIEW_SUBMISSION_ACTION_ID, BLOCK_ACTION_ID, SLACK_PAYLOAD_TYPE } from "@/app/AppConfig";
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
} from "@/app/actions";
import { logInfo } from "@/Logger";

/**
 * アクションルーター
 * @param type
 * @param payload
 * @returns
 */
export function actionsRouter(type: string, payload: any) {
  logInfo({ type, payload });

  const callbackRoute = actionRoutes.find((route) => route.key === type);

  if (!callbackRoute) {
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
  createRoute(BLOCK_ACTION_ID.HOME_SYNC, updateHome),
  createRoute(BLOCK_ACTION_ID.TASK_REGISTER_MODAL_OPEN, openTaskRegisterModal),
  createRoute(`${BLOCK_ACTION_ID.ASSIGN_OVERFLOW_ACTION}/${BLOCK_ACTION_ID.TASK_DETAIL}`, taskDetail),
  createRoute(`${BLOCK_ACTION_ID.ASSIGN_OVERFLOW_ACTION}/${BLOCK_ACTION_ID.TASK_ACTIONED}`, taskActioned),
  createRoute(`${BLOCK_ACTION_ID.ASSIGN_OVERFLOW_ACTION}/${BLOCK_ACTION_ID.TASK_CLOSED}`, taskClose),
  createRoute(`${BLOCK_ACTION_ID.ASSIGN_OVERFLOW_ACTION}/${BLOCK_ACTION_ID.TASK_REMIND}`, taskRemind),
  createRoute(`${BLOCK_ACTION_ID.ASSIGN_OVERFLOW_ACTION}/${BLOCK_ACTION_ID.TASK_LGTM}`, taskLgtm),
  createRoute(`${BLOCK_ACTION_ID.REQUEST_OVERFLOW_ACTION}/${BLOCK_ACTION_ID.TASK_DETAIL}`, taskDetail),
  createRoute(`${BLOCK_ACTION_ID.REQUEST_OVERFLOW_ACTION}/${BLOCK_ACTION_ID.TASK_ACTIONED}`, taskActioned),
  createRoute(`${BLOCK_ACTION_ID.REQUEST_OVERFLOW_ACTION}/${BLOCK_ACTION_ID.TASK_CLOSED}`, taskClose),
  createRoute(`${BLOCK_ACTION_ID.REQUEST_OVERFLOW_ACTION}/${BLOCK_ACTION_ID.TASK_REMIND}`, taskRemind),
  createRoute(`${BLOCK_ACTION_ID.REQUEST_OVERFLOW_ACTION}/${BLOCK_ACTION_ID.TASK_LGTM}`, taskLgtm),
  createRoute(VIEW_SUBMISSION_ACTION_ID.TASK_ADD, addTask),
];
