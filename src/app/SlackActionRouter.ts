import { logError } from "@/Logger";
import {
  EVENT_ACTION_ID,
  VIEW_SUBMISSION_ACTION_ID,
  BLOCK_ACTION_ID,
  SLACK_PAYLOAD_TYPE,
} from "@/config";
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

const actionRoutes: ActionRouter = {
  [SLACK_PAYLOAD_TYPE.EVENT]: {
    [EVENT_ACTION_ID.APP_HOME_OPENED]: getHomeTab,
  },
  [SLACK_PAYLOAD_TYPE.BLOCK_ACTIONS]: {
    [BLOCK_ACTION_ID.HOME_SYNC]: updateHome,
    [BLOCK_ACTION_ID.TASK_REGISTER_MODAL_OPEN]: openTaskRegisterModal,
    [BLOCK_ACTION_ID.ASSIGN_OVERFLOW_ACTION]: {
      get: (payload: any) => payload.actions[0].selected_option.value,
      routes: {
        [BLOCK_ACTION_ID.TASK_DETAIL]: taskDetail,
        [BLOCK_ACTION_ID.TASK_ACTIONED]: taskActioned,
        [BLOCK_ACTION_ID.TASK_CLOSED]: taskClose,
        [BLOCK_ACTION_ID.TASK_REMIND]: taskRemind,
        [BLOCK_ACTION_ID.TASK_LGTM]: taskLgtm,
      },
    },
    [BLOCK_ACTION_ID.REQUEST_OVERFLOW_ACTION]: {
      get: (payload: any) => payload.actions[0].selected_option.value,
      routes: {
        [BLOCK_ACTION_ID.TASK_DETAIL]: taskDetail,
        [BLOCK_ACTION_ID.TASK_ACTIONED]: taskActioned,
        [BLOCK_ACTION_ID.TASK_CLOSED]: taskClose,
        [BLOCK_ACTION_ID.TASK_REMIND]: taskRemind,
        [BLOCK_ACTION_ID.TASK_LGTM]: taskLgtm,
      },
    },
  },
  [SLACK_PAYLOAD_TYPE.VIEW_SUBMISSION]: {
    [VIEW_SUBMISSION_ACTION_ID.TASK_ADD]: addTask,
  },
  [SLACK_PAYLOAD_TYPE.URL_VERIFICATION]: {
    [SLACK_PAYLOAD_TYPE.URL_VERIFICATION]: urlVerification,
  },
};

/**
 * スラックのPOSTリクエストを受け取る
 * @param e
 * @returns
 */
export function SlackPostRequest(
  e: GoogleAppsScript.Events.DoPost,
): GoogleAppsScript.Content.TextOutput | void {
  try {
    const postData = JSON.parse(e.postData.contents);
    if (postData.type === SLACK_PAYLOAD_TYPE.URL_VERIFICATION) {
      return ContentService.createTextOutput(postData.challenge);
    }
    routePayload(postData.type, postData);
  } catch (error) {
    // errorを握りつぶす。
  }

  try {
    const payload = JSON.parse(decodeURIComponent(e.parameter.payload));
    routePayload(payload.type, payload);
    if (payload.type === SLACK_PAYLOAD_TYPE.VIEW_SUBMISSION) {
      return ContentService.createTextOutput();
    }
  } catch (error: any) {
    logError(error);
  }
}

/**
 * アクションをルーティングする
 * @param type
 * @param actionId
 * @param payload
 */
function routeAction(type: string, actionId: string, payload: any) {
  const controller = actionRoutes[type]?.[actionId];
  if (typeof controller === "function") {
    controller(payload);
  } else if (
    controller &&
    typeof controller.get === "function" &&
    controller.routes
  ) {
    const values = JSON.parse(controller.get(payload));
    const nestedController = controller.routes[values.type];
    if (nestedController) {
      nestedController(payload);
    }
  }
}

/**
 * ペイロードをルーティングする
 * @param type
 * @param payload
 */
function routePayload(type: string, payload: any): void {
  const actionId =
    type === SLACK_PAYLOAD_TYPE.EVENT
      ? payload.type
      : type === SLACK_PAYLOAD_TYPE.BLOCK_ACTIONS
        ? payload.actions[0].action_id
        : payload.view.callback_id;
  routeAction(type, actionId, payload);
}

/**
 * アクションルーター
 */
type ActionRouter = {
  [key: string]: {
    [key: string]: any;
  };
};
