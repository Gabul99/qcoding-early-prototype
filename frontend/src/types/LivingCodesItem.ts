// types.ts
export interface CodeFragment {
  code: string;
  raw: string;
}

export interface ComponentData {
  name: string; // group name (빈 문자열이면 singleton)
  codes: CodeFragment[]; // 이 컴포넌트를 구성하는 코드들
}

export interface DialogueItem {
  speaking_code: string;
  conversation_mode: string;
  utterance: string;
}

export type EventPayload =
  | { event: "select_pair"; data: { items: ComponentData[] } }
  | { event: "ai_message"; data: { content: string } }
  | {
      event: "match_result";
      data: {
        mode: "MERGE" | "SPLIT" | "APART";
        group?: ComponentData;
        groups?: ComponentData[];
        items?: ComponentData[];
      };
    }
  | {
      event: "group_update";
      data: {
        processing: ComponentData[];
        groups: ComponentData[];
      };
    }
  | {
      event: "finished";
      data: {
        processing: ComponentData[];
        groups: ComponentData[];
      };
    };

// 화면에 렌더할 단위
export interface Turn {
  selectPair: ComponentData[];
  dialogues: DialogueItem[];
  decision: {
    mode: "MERGE" | "SPLIT" | "APART";
    resultComponents: ComponentData[];
  };
  processing: ComponentData[];
  groups: ComponentData[];
}
