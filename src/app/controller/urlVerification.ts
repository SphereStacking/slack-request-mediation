export const urlVerification = (
  payload: any,
): GoogleAppsScript.Content.TextOutput => {
  return ContentService.createTextOutput(payload.challenge);
};
