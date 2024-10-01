import { logInfo } from "@/Logger";

export const urlVerification = (
  payload: any,
): GoogleAppsScript.Content.TextOutput => {
  logInfo(`urlVerification controller: ${payload.challenge}`);
  return ContentService.createTextOutput(payload.challenge);
};
