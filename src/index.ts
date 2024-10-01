import { actionsRouter } from "./app/actionsRouter";
import { verificationToken } from "./app/auth/verificationToken";

const CONTENT_TYPE_JSON = "application/json";
const CONTENT_TYPE_FORM = "application/x-www-form-urlencoded";
const INVALID_REQUEST_MESSAGE = "invalid request";

function doPost(e: GoogleAppsScript.Events.DoPost) {
  if (!e.postData) return ContentService.createTextOutput(INVALID_REQUEST_MESSAGE);

  const { type } = e.postData;
  const { payload, command } = e.parameters;

  if (type === CONTENT_TYPE_JSON) {
    const payload = JSON.parse(e.postData.contents);
    return handlePayload(payload);
  }

  if (type === CONTENT_TYPE_FORM) {
    if (payload) {
      const payload = JSON.parse(e.parameters.payload[0]);
      return handlePayload(payload);
    }
    if (command) {
      const payload = Object.fromEntries(Object.entries(e.parameters).map(([key, value]) => [key, value[0]]));
      return handlePayload(payload);
    }
  }

  return ContentService.createTextOutput("");
}

function handlePayload(payload: any) {
  verificationToken(payload.token);
  if (typeof payload.challenge !== "undefined") {
    return ContentService.createTextOutput(payload.challenge);
  }
  return actionsRouter(payload.type || payload.event.type, payload);
}
