export function extractValuesFromState(
  state: State,
): Record<string, string | string[]> {
  const values = state.values;
  const result: any = {};

  for (const blockId in values) {
    if (Object.prototype.hasOwnProperty.call(values, blockId)) {
      const block = values[blockId];
      for (const actionId in block) {
        if (Object.prototype.hasOwnProperty.call(block, actionId)) {
          const action = block[actionId];
          if (action.type === "plain_text_input") {
            result[blockId] = handlePlainTextInput(action);
          } else if (action.type === "number_input") {
            result[blockId] = handleNumberInput(action);
          } else if (action.type === "rich_text_input") {
            result[blockId] = handleRichTextInput(action);
          } else if (action.type === "multi_users_select") {
            result[blockId] = handleMultiUsersSelect(action);
          } else if (action.type === "datepicker") {
            result[blockId] = handleDatepicker(action);
          }
        }
      }
    }
  }

  return result;
}

function handlePlainTextInput(action: SlackAction): PlainTextInput {
  return {
    type: "plain_text_input",
    value: action.value || "",
  };
}

function handleNumberInput(action: SlackAction): NumberInput {
  return {
    type: "number_input",
    value: action.value || "",
  };
}

function handleRichTextInput(action: SlackAction): RichTextInput {
  return {
    type: "rich_text_input",
    value: action.rich_text_value?.elements[0].elements[0].text || "",
  };
}

function handleMultiUsersSelect(action: SlackAction): SlackAction {
  return {
    type: "multi_users_select",
    value: action.selected_users?.join(",") || "",
  };
}

function handleDatepicker(action: SlackAction): Datepicker {
  return {
    type: "datepicker",
    value: action.selected_date || "未設定",
  };
}

interface SlackAction {
  type: string;
  value?: string;
  rich_text_value?: { elements: { elements: { text: string }[] }[] };
  selected_users?: string[];
  selected_date?: string;
}

interface Block {
  [actionId: string]: Action;
}

interface Values {
  [blockId: string]: Block;
}

interface State {
  values: Values;
}
type PlainTextInput = {
  type: "plain_text_input";
  value: string;
};

type NumberInput = {
  type: "number_input";
  value: string;
};

type RichTextInput = {
  type: "rich_text_input";
  value: string;
};

type MultiUsersSelect = {
  type: "multi_users_select";
  value: string[];
};

type Datepicker = {
  type: "datepicker";
  value: string | undefined;
};

type Action =
  | PlainTextInput
  | NumberInput
  | RichTextInput
  | MultiUsersSelect
  | Datepicker;
