export class SlackPayloadParser {
  private parsedValues: Record<string, ActionResult>;

  constructor(state: State) {
    this.parsedValues = this.extractValuesFromState(state);
  }

  private extractValuesFromState(state: State): Record<string, ActionResult> {
    const result: Record<string, ActionResult> = {};

    for (const [blockId, block] of Object.entries(state.values)) {
      for (const [actionId, action] of Object.entries(block)) {
        const value = this.handleAction(action);
        if (value !== null) {
          result[blockId] = value;
        }
      }
    }
    return result;
  }

  private handleAction(action: SlackAction): ActionResult | null {
    switch (action.type) {
      case "plain_text_input":
        return { type: "plain_text_input", value: action.value || "" };
      case "number_input":
        return { type: "number_input", value: action.value || "" };
      case "rich_text_input":
        return { type: "rich_text_input", value: action.rich_text_value || {} };
      case "multi_users_select":
        return { type: "multi_users_select", value: action.selected_users ?? [] };
      case "datepicker":
        return { type: "datepicker", value: action.selected_date || "" };
      case "channels_select":
        return { type: "channels_select", value: action.selected_channel || "" };
      default:
        return null;
    }
  }

  public getPlainTextInput(blockId: string): PlainTextInput {
    return this.getActionResultByType<PlainTextInput>(blockId, "plain_text_input");
  }

  public getNumberInput(blockId: string): NumberInput {
    return this.getActionResultByType<NumberInput>(blockId, "number_input");
  }

  public getRichTextInput(blockId: string): RichTextInput {
    return this.getActionResultByType<RichTextInput>(blockId, "rich_text_input");
  }

  public getMultiUsersSelect(blockId: string): MultiUsersSelect {
    return this.getActionResultByType<MultiUsersSelect>(blockId, "multi_users_select");
  }

  public getDatepicker(blockId: string): Datepicker {
    return this.getActionResultByType<Datepicker>(blockId, "datepicker");
  }

  public getChannelsSelect(blockId: string): ChannelsSelect {
    return this.getActionResultByType<ChannelsSelect>(blockId, "channels_select");
  }

  private getActionResultByType<T extends ActionResult>(blockId: string, type: string): T {
    const result = this.parsedValues[blockId];
    if (result?.type !== type) {
      throw new Error(`${type} not found for blockId: ${blockId}`);
    }
    return result as T;
  }
}

export interface SlackAction {
  type: string;
  value?: string;
  rich_text_value?: { elements: { elements: { text: string }[] }[] };
  selected_users?: string[];
  selected_date?: string;
  selected_channel?: string;
}

export interface Block {
  [actionId: string]: SlackAction;
}

export interface Values {
  [blockId: string]: Block;
}

export interface State {
  values: Values;
}

export type PlainTextInput = {
  type: "plain_text_input";
  value: string;
};

export type NumberInput = {
  type: "number_input";
  value: string;
};

export type RichTextInput = {
  type: "rich_text_input";
  value: Record<string, unknown>;
};

export type MultiUsersSelect = {
  type: "multi_users_select";
  value: string[];
};

export type Datepicker = {
  type: "datepicker";
  value: string;
};

export type ChannelsSelect = {
  type: "channels_select";
  value: string;
};

type ActionResult = PlainTextInput | NumberInput | RichTextInput | MultiUsersSelect | Datepicker | ChannelsSelect;
