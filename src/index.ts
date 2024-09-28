import { SlackPostRequest } from "./app/SlackActionRouter";

function doPost(
  event: GoogleAppsScript.Events.DoPost,
): GoogleAppsScript.Content.TextOutput | void {
  SlackPostRequest(event);
}
