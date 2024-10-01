import { SlackPostRequest } from "./app/SlackActionRouter";
import { logInfo } from "@/Logger";
function doPost(
  event: GoogleAppsScript.Events.DoPost,
): GoogleAppsScript.Content.TextOutput {
  logInfo(event);
  return SlackPostRequest(event);
}
