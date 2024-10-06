interface Filter {
  column: string;
  operator?: string;
  value: string;
  connector?: string;
}

interface QueryParams {
  spreadsheetId: string;
  sheetName: string;
  filters?: Filter[];
  skipRows?: number;
  selectColumns?: string[];
}

/**
 * クエリを使用してフィルタリングされたデータを取得する
 * @param {string} spreadsheetId - スプレッドシートのID
 * @param {string} sheetName - シート名
 * @param {Array} filters - フィルタリング条件
 * @param {number} skipRows - スキップする行数（デフォルトは0）
 * @param {Array} selectColumns - 選択する列（デフォルトは'*'）
 * @returns {Array} フィルタリングされたデータ
 *
 * const data = getFilteredDataWithQuery({
 *   spreadsheetId:'your-spreadsheet-id',
 *   sheetName:'Sheet1',
 *   filters: [
 *    { column: 'E', operator: '=', value: 'in_progress', connector: 'AND' }
 *    { column: 'E', operator: '!=', value: 'in_progress', connector: 'AND' }
 *   ],
 *   skipRows:0,
 *   selectColumns:['A', 'B', 'E']
 * });
 */
export function getFilteredDataWithQuery({
  spreadsheetId,
  sheetName,
  filters = [],
  skipRows = 0,
  selectColumns = ["*"],
}: QueryParams): any[][] {
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  if (!sheet) {
    throw new Error("Sheet is null or undefined");
  }
  // 行の数がスキップする行数以下の場合、空のデータを返す
  const startRow = skipRows + 1;
  if (sheet.getLastRow() < startRow) {
    return [];
  }

  // フィルター条件をQUERY関数の形式に変換
  let query = `SELECT ${selectColumns.join(", ")} WHERE `;
  const conditions = filters.map((filterObj, index) => {
    const operator = filterObj.operator || "=";
    let value = filterObj.value;

    // 部分一致の場合、LIKE演算子を使用
    if (operator.toLowerCase() === "like") {
      value = `'%${value}%'`;
    } else {
      value = `'${value}'`;
    }

    let condition = ` ${filterObj.column} ${operator} ${value} `;
    if (index > 0) {
      condition = ` ${filterObj.connector || "AND"} ${condition}`;
    }
    return condition;
  });
  query += conditions.join("");

  // スキップする行数を考慮してQUERY関数を適用
  const queryRange = sheet.getRange(startRow, 1, sheet.getLastRow() - skipRows, sheet.getLastColumn());
  const queryString = `=QUERY(${sheetName}!${queryRange.getA1Notation()},"${query}",0)`;

  // 一時的なシートにQUERY関数を設定
  const uuid = Utilities.getUuid();
  const tempSheet = SpreadsheetApp.openById(spreadsheetId).insertSheet(uuid);
  try {
    const resultRange = tempSheet.getRange(1, 1);
    resultRange.setFormula(queryString);
    SpreadsheetApp.flush(); // フォーミュラの計算を強制的に実行
    // フィルタリングされたデータを取得
    const filteredData = resultRange.getDataRegion().getValues();

    return filteredData;
  } catch (error) {
    throw new Error(`getFilteredDataWithQuery error:${error}`);
  } finally {
    // 一時的なシートを削除
    SpreadsheetApp.openById(spreadsheetId).deleteSheet(tempSheet);
  }
}

/**
 * スプレッドシートを取得する
 * @param {string} spreadsheetId - スプレッドシートのID
 * @param {string} sheetName - シート名
 * @returns {GoogleAppsScript.Spreadsheet.Sheet} スプレッドシート
 */
export function getSpreadSheet(spreadsheetId: string, sheetName: string): GoogleAppsScript.Spreadsheet.Sheet {
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  if (!sheet) {
    throw new Error("Sheet is null or undefined");
  }
  return sheet;
}

/**
 * 最終行を取得する
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - スプレッドシート
 * @returns {number} 最終行
 */
export function getLastRow(sheet: GoogleAppsScript.Spreadsheet.Sheet): number {
  return sheet.getLastRow();
}

/**
 * 行を追加する
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - スプレッドシート
 * @param {string[]} row - 追加する行
 */
export function addRow(sheet: GoogleAppsScript.Spreadsheet.Sheet, row: string[]): void {
  sheet.appendRow(row);
}

/**
 * スプレッドシートの特定の値を更新する
 * @param {string} spreadsheetId - スプレッドシートのID
 * @param {string} sheetName - シート名
 * @param {string} searchColumn - 検索する列（例: 'A'）
 * @param {string} searchValue - 検索する値（例: task_id）
 * @param {string} updateColumn - 更新する列（例: 'B'）
 * @param {any} newValue - 新しい値
 */
export function updateSpreadsheetValue(
  spreadsheetId: string,
  sheetName: string,
  searchColumn: string,
  searchValue: string,
  updateColumn: string,
  newValue: any,
): void {
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  if (!sheet) {
    throw new Error("Sheet is null or undefined");
  }

  const searchColumnIndex = columnToIndex(searchColumn);
  const updateColumnIndex = columnToIndex(updateColumn);

  const dataRange = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn());
  const values = dataRange.getValues();

  const updates: { row: number; col: number; value: any }[] = [];

  for (let i = 0; i < values.length; i++) {
    if (values[i][searchColumnIndex - 1] === searchValue) {
      updates.push({ row: i + 1, col: updateColumnIndex, value: newValue });
    }
  }

  for (const update of updates) {
    sheet.getRange(update.row, update.col).setValue(update.value);
  }
}

/**
 * 列名をインデックスに変換する（例: 'A' -> 1, 'B' -> 2）
 * @param {string} column - 列名
 * @returns {number} インデックス
 */
function columnToIndex(column: string): number {
  return column.toUpperCase().charCodeAt(0) - 64;
}
