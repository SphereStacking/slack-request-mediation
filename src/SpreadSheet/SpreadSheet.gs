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
function getFilteredDataWithQuery({ spreadsheetId, sheetName, filters = [], skipRows = 0, selectColumns = ['*'] }) {
  var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  
  // UUIDを生成して一時的なシート名に使用
  var uuid = Utilities.getUuid();
  var tempSheet = SpreadsheetApp.openById(spreadsheetId).insertSheet(uuid);
  
  // フィルター条件をQUERY関数の形式に変換
  var query = `SELECT ${selectColumns.join(', ')} WHERE `;
  var conditions = filters.map(function(filterObj, index) {
    var operator = filterObj.operator || '=';
    var value = filterObj.value;
    
    // 部分一致の場合、LIKE演算子を使用
    if (operator.toLowerCase() === 'like') {
      value = `'%${value}%'`;
    } else {
      value = `'${value}'`;
    }
    
    var condition = ` ${filterObj.column} ${operator} ${value} `;
    if (index > 0) {
      condition = ` ${filterObj.connector || 'AND'} ` + condition;
    }
    return condition;
  });
  query += conditions.join('');

  // スキップする行数を考慮してQUERY関数を適用
  var startRow = skipRows + 1;
  var queryRange = sheet.getRange(startRow, 1, sheet.getLastRow() - skipRows, sheet.getLastColumn());
  var queryString = `=QUERY(${sheetName}!${queryRange.getA1Notation()},"${query}",0)`;
  
  // 一時的なシートにQUERY関数を設定
  var resultRange = tempSheet.getRange(1, 1);
  resultRange.setFormula(queryString);
  SpreadsheetApp.flush();  // フォーミュラの計算を強制的に実行

  // フィルタリングされたデータを取得
  var filteredData = resultRange.getDataRegion().getValues();

  Logger.log(filteredData);  // フィルタリングされたデータをログに出力

  // 一時的なシートを削除
  SpreadsheetApp.openById(spreadsheetId).deleteSheet(tempSheet);

  return filteredData;
}

/**
 * スプレッドシートを取得する
 * @param {string} spreadsheetId - スプレッドシートのID
 * @param {string} sheetName - シート名
 * @returns {Sheet} スプレッドシート
 */
function getSpreadSheet(spreadsheetId, sheetName) {
  return SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
}

/**
 * 最終行を取得する
 * @param {Sheet} sheet - スプレッドシート
 * @returns {number} 最終行
 */
function getLastRow(sheet) {
  return sheet.getLastRow();
}

/**
 * 行を追加する
 * @param {Sheet} sheet - スプレッドシート
 * @param {Array} row - 追加する行
 */
function addRow(sheet, row) {
  sheet.appendRow(row);
}
