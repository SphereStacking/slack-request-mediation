/**
 * state.valuesからデータを抽出する
 * @param {Object} state - stateオブジェクト
 * @returns {Object} 抽出されたデータのオブジェクト
 */
function extractValuesFromState(state) {
  const values = state.values;
  const result = {};

  for (const blockId in values) {
    if (values.hasOwnProperty(blockId)) {
      const block = values[blockId];
      for (const actionId in block) {
        if (block.hasOwnProperty(actionId)) {
          const action = block[actionId];
          if (
            action.type === "plain_text_input" ||
            action.type === "number_input"
          ) {
            result[blockId] = action.value;
          } else if (action.type === "rich_text_input") {
            result[blockId] =
              action.rich_text_value.elements[0].elements[0].text;
          } else if (action.type === "multi_users_select") {
            result[blockId] = action.selected_users;
          } else if (action.type === "datepicker") {
            result[blockId] = action.selected_date || "未設定";
          }
        }
      }
    }
  }

  return result;
}
