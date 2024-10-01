import { scriptProperties } from "@/ScriptProperties";

export function verificationToken(token: string) {
  if (token !== scriptProperties.SLACK_VERIFICATION_TOKEN) {
    console.log(
      `Invalid verification token detected (actual: ${token}, expected: ${scriptProperties.SLACK_VERIFICATION_TOKEN})`,
    );
    return ContentService.createTextOutput("invalid request");
  }
}
