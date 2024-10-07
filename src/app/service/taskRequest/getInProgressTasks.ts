import { scriptProperties } from "@/ScriptProperties";
import { TASK_SPREAD_SHEET_COLUMNS, TASK_STATUS } from "@/app/AppConfig";
import { formatTaskRows } from "./formatTaskRows";
import { getFilteredDataWithQuery } from "@/SpreadSheet";
import type { Task } from "./index";

/**
 * 進行中のタスクを取得する
 * @returns {Array} 進行中のタスク
 */
export function getInProgressTasks(): Task[] {
  return formatTaskRows(
    getFilteredDataWithQuery({
      spreadsheetId: scriptProperties.TASK_SPREADSHEET_ID,
      sheetName: scriptProperties.TASK_SPREADSHEET_NAME,
      filters: [
        {
          column: TASK_SPREAD_SHEET_COLUMNS.STATUS.column,
          operator: "=",
          value: TASK_STATUS.IN_PROGRESS.value,
          connector: "AND",
        },
      ],
      skipRows: 1,
      selectColumns: ["*"],
    }),
  );
}
