import { CURRENT_LOG_LEVEL } from "@/app/AppConfig";
import { scriptProperties } from "@/ScriptProperties";

/* ログレベルの定義と階層のまとめ */
export interface LogLevelType {
  name: string;
  value: number;
}

export const LogLevel: Record<string, LogLevelType> = {
  DEBUG: { name: "DEBUG", value: 0 },
  INFO: { name: "INFO", value: 1 },
  WARN: { name: "WARN", value: 2 },
  ERROR: { name: "ERROR", value: 3 },
};

/**
 * 指定されたGoogleスプレッドシートにデータをログとして記録
 *
 * データは文字列、数値、配列、またはオブジェクトで指定できます。
 * 配列やオブジェクトは、ログ記録前に自動的にJSON文字列に変換されます。
 *
 * @param {string | number | any[] | object} logData - ログとして記録するデータ。
 * @param {LogLevel} [logLevel=LogLevel.INFO] - LogLevelの定数から指定されるログのレベルオブジェクト。
 * @param {number} [stackDepth=3] - 呼び出し元スタックの深さ。デフォルトは3。
 * @throws {Error} 指定されたシートが見つからない場合にエラーをスローします。
 */
export function logToSheet(
  logData: string | number | any[] | object,
  logLevel: LogLevelType = LogLevel.INFO,
  stackDepth = 3,
): void {
  try {
    if (!shouldLog(logLevel, CURRENT_LOG_LEVEL)) return;

    const spreadsheet = SpreadsheetSingleton.getInstance();
    const sheetName = getCurrentDateSheetName();
    let sheet = spreadsheet.getSheetByName(sheetName);

    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
      sheet.appendRow([
        "日時",
        "ログレベル",
        "メッセージ",
        "ファイル名",
        "行数",
      ]);
    }

    const stackInfo = getStackInfo(stackDepth);
    const logText = JSON.stringify(logData, null, 2);
    const lastRow = sheet.getLastRow();
    const now = new Date();

    sheet.getRange(lastRow + 1, 1).setValue(now);
    sheet.getRange(lastRow + 1, 2).setValue(logLevel.name);
    sheet.getRange(lastRow + 1, 3).setValue(logText);
    sheet.getRange(lastRow + 1, 4).setValue(stackInfo.fileName);
    sheet.getRange(lastRow + 1, 5).setValue(stackInfo.lineNumber);
  } catch (e) {
    Logger.log(`ログの書き込みに失敗しました: ${(e as Error).message}`);
  }
}

/**
 * 指定されたログレベルが現在のログレベルより高いかどうかをチェックする
 * @param {LogLevel} logLevel - チェックするログレベルオブジェクト
 * @param {LogLevel} currentLogLevel - 現在のログレベルオブジェクト
 * @returns {boolean} - 記録するべき場合はtrue、そうでない場合はfalse
 */
export function shouldLog(
  logLevel: LogLevelType,
  currentLogLevel: LogLevelType,
): boolean {
  return logLevel.value >= currentLogLevel.value;
}

/**
 * 現在の日付をシート名として取得する
 * @returns {string} - 現在の日付を示すシート名
 */
export function getCurrentDateSheetName(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = `0${now.getMonth() + 1}`.slice(-2); // 月は0始まりなので1足す
  const day = `0${now.getDate()}`.slice(-2);
  return `${year}-${month}-${day}`;
}

/**
 * 呼び出し元のファイル名と行数を取得する
 * @param {number} [depth=3] - スタックトレースの深さ。通常は3で、ヘルパー関数を挟んだ場合は4以上を指定。
 * @returns {Object} - ファイル名と行数を含むオブジェクト { fileName: string, lineNumber: string }
 */
function getStackInfo(depth = 3): { fileName: string; lineNumber: string } {
  const err = new Error();
  const stack = err.stack?.split("\n")[depth] || "";
  const match = stack.match(/(.*):(\d+):\d+/);

  if (match) {
    const fileName = match[1].split("/").pop() || "unknown"; // ファイル名のみを取得
    const lineNumber = match[2];
    return { fileName, lineNumber };
  }

  return { fileName: "unknown", lineNumber: "unknown" };
}

/* ヘルパー関数 */
/**
 * ログをINFOレベルで出力するヘルパー関数
 * @param {string | number | any[] | object} logData - ログとして記録するデータ。
 */
export const logInfo = (message: string | number | any[] | object): void => {
  logToSheet(message, LogLevel.INFO, 4); // 深さを4に設定
};

/**
 * ログをDEBUGレベルで出力するヘルパー関数
 * @param {string | number | any[] | object} logData - ログとして記録するデータ。
 */
export const logDebug = (message: string | number | any[] | object): void => {
  logToSheet(message, LogLevel.DEBUG, 4); // 深さを4に設定
};

/**
 * ログをERRORレベルで出力するヘルパー関数
 * @param {string | number | any[] | object} logData - ログとして記録するデータ。
 */
export const logError = (message: string | number | any[] | object): void => {
  logToSheet(message, LogLevel.ERROR, 4); // 深さを4に設定
};

// シングルトンパターンでスプレッドシートオブジェクトを管理
export const SpreadsheetSingleton = (() => {
  let instance: GoogleAppsScript.Spreadsheet.Spreadsheet;

  function createInstance(): GoogleAppsScript.Spreadsheet.Spreadsheet {
    return SpreadsheetApp.openById(scriptProperties.LOGGER_SPREADSHEET_APP_ID);
  }

  return {
    getInstance: (): GoogleAppsScript.Spreadsheet.Spreadsheet => {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();
