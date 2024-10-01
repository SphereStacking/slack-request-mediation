import { makeTaskRegisterBlock } from "@/app/SlackBlocks";
import { postViewsOpen } from "@/Slack/api";

/**
 * 依頼登録モーダルを表示する
 * @param {any} payload - ペイロード
 */
export function openTaskRegisterModal(
  payload: any,
): GoogleAppsScript.Content.TextOutput {
  const trigger_id = payload.trigger_id;
  const blocks = makeTaskRegisterBlock();
  postViewsOpen(trigger_id, blocks);
  return ContentService.createTextOutput();
}
