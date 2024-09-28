//slack app token
const SlackBotUserOAuthToken =
  PropertiesService.getScriptProperties().getProperty("SlackBotUserOAuthToken");

/** スプレッドシートのID */
const LoggerSpreadsheetAppID =
  PropertiesService.getScriptProperties().getProperty("LoggerSpreadsheetAppID");

//SpreadSheet
const TaskSpreadSheetId =
  PropertiesService.getScriptProperties().getProperty("TaskSpreadSheetId");
const TaskSheetName =
  PropertiesService.getScriptProperties().getProperty("TaskSheetName");

//DEBUG User
const DEBUG_USER_ID =
  PropertiesService.getScriptProperties().getProperty("DEBUG_USER_ID");
//DEBUG Channel
const DEBUG_CHANNEL_ID =
  PropertiesService.getScriptProperties().getProperty("DEBUG_CHANNEL_ID");
