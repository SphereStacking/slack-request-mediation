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
          result[blockId] = handleAction(action);
        }
      }
    }
  }

  return result;
}

function handleAction(action: SlackAction): any {
  switch (action.type) {
    case "plain_text_input":
      return handlePlainTextInput(action);
    case "number_input":
      return handleNumberInput(action);
    case "rich_text_input":
      return handleRichTextInput(action);
    case "multi_users_select":
      return handleMultiUsersSelect(action);
    case "datepicker":
      return handleDatepicker(action);
    default:
      return null;
  }
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

function handleMultiUsersSelect(action: SlackAction): MultiUsersSelect {
  return {
    type: "multi_users_select",
    value: action.selected_users ?? [],
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
  [actionId: string]: SlackAction;
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
