import { actionsRouter } from "./app/actionsRouter";
import { verificationToken } from "./app/auth/verificationToken";
import { logInfo, logError } from "./Logger";
import { taskRemindInProgressAllUserNotification, taskAddedNotification } from "./app/service/taskRequest";
const CONTENT_TYPE_JSON = "application/json";
const CONTENT_TYPE_FORM = "application/x-www-form-urlencoded";
const INVALID_REQUEST_MESSAGE = "invalid request";
import { SLACK_PAYLOAD_TYPE } from "@/app/AppConfig";

function doPost(e: GoogleAppsScript.Events.DoPost) {
  if (!e.postData) return ContentService.createTextOutput(INVALID_REQUEST_MESSAGE);

  const { type } = e.postData;
  const { payload, command } = e.parameters;
  if (type === CONTENT_TYPE_JSON) {
    const payload = JSON.parse(e.postData.contents);
    return handlePayload(payload.event.type, payload);
  }

  if (type === CONTENT_TYPE_FORM) {
    /* block_actionsの際の処理 */
    if (payload) {
      try {
        const parsedPayload = JSON.parse(e.parameters.payload[0]);
        if (typeof parsedPayload.challenge !== "undefined") {
          return handlePayload(SLACK_PAYLOAD_TYPE.URL_VERIFICATION, parsedPayload);
        }
        /**
         * こちらのaction_idは、
         * モーダルのブロックに関する処理はタイムアウトの制約が厳しいためログの出力を極力しない
         */
        const { actions, view, type } = parsedPayload;
        const route = (actions && actions.length > 0 ? actions[0].action_id : undefined) || view?.callback_id;
        return handlePayload(`${type}/${route}`, parsedPayload);
      } catch (error) {
        logError(`block_actionsの際の処理でエラーが発生しました : ${error}`);
      }
    }

    /* slash commandの際の処理 */
    if (command) {
      try {
        const payload = Object.fromEntries(Object.entries(e.parameters).map(([key, value]) => [key, value[0]]));
        return handlePayload(payload.type, payload);
      } catch (error) {
        logError(`slash commandの際の処理でエラーが発生しました : ${error}`);
      }
    }
  }

  // Rollupでbuildしたときに、addTaskNotificationが削除されないようにするためのダミーの使用
  if (false) {
    taskAddedNotification();
    taskRemindInProgressAllUserNotification();
  }
  return ContentService.createTextOutput("");
}

function handlePayload(type: string, payload: any) {
  // verificationToken(payload.token);
  return actionsRouter(type, payload);
}
