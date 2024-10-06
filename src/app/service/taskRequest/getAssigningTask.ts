import { scriptProperties } from "@/ScriptProperties";
import { TASK_SPREAD_SHEET_COLUMNS, TASK_STATUS } from "@/app/AppConfig";
import { formatTaskRows } from "./formatTaskRows";
import { getFilteredDataWithQuery } from "@/SpreadSheet";

/**
 * タスクの割り当てを取得する
 * @param {string} user_id - ユーザーID
 * @returns {Array} タスクの割り当て
 */
export function getAssigningTask(user_id: string): any[] {
  return formatTaskRows(
    getFilteredDataWithQuery({
      spreadsheetId: scriptProperties.TASK_SPREADSHEET_ID,
      sheetName: scriptProperties.TASK_SHEET_NAME,
      filters: [
        {
          column: TASK_SPREAD_SHEET_COLUMNS.STATUS.column,
          operator: "=",
          value: TASK_STATUS.IN_PROGRESS.value,
          connector: "AND",
        },
        {
          column: TASK_SPREAD_SHEET_COLUMNS.ASSIGNEES.column,
          operator: "LIKE",
          value: user_id,
          connector: "AND",
        },
      ],
      skipRows: 1,
      selectColumns: ["*"],
    }),
  );
}
