// main.tsx (or whatever)
import { useEffect, useState } from "react";
import logData from "../log_data.json";
import * as S from "./LivingCodesResultPanel.style";
import type {
  ComponentData,
  DialogueItem,
  EventPayload,
  Turn,
} from "../types/LivingCodesItem";

function parseTurns(events: EventPayload[]): Turn[] {
  const turns: Turn[] = [];
  let buffer: Partial<Turn> = {};

  for (const evt of events) {
    switch (evt.event) {
      case "select_pair":
        buffer = { selectPair: evt.data.items };
        break;
      case "ai_message": {
        let parsed: { dialogues: DialogueItem[] };
        try {
          parsed = JSON.parse(evt.data.content);
        } catch {
          parsed = { dialogues: [] };
        }
        buffer.dialogues = parsed.dialogues;
        break;
      }

      case "match_result":
        buffer.decision = {
          mode: evt.data.mode,
          resultComponents:
            evt.data.mode === "MERGE" && evt.data.group
              ? [evt.data.group]
              : evt.data.mode === "SPLIT" && evt.data.groups
              ? evt.data.groups
              : evt.data.items ?? [],
        };
        break;
      case "group_update":
        buffer.processing = evt.data.processing;
        buffer.groups = evt.data.groups;
        // 이제 한 턴이 완성됐으니 push
        turns.push(buffer as Turn);
        buffer = {};
        break;
      case "finished":
        // 필요에 따라 마지막 상태를 추가하거나 무시
        break;
    }
  }

  return turns;
}

// 사용 예
const events = (logData as any[]).map((e) => JSON.parse(e) as EventPayload);

const LivingCodesResultPanel = () => {
  const [currentTurnIdx, setCurrentTurnIdx] = useState<number>(0);
  const [turns, setTurns] = useState<Turn[]>([]);

  useEffect(() => {
    const temp = parseTurns(events);
    setTurns(temp);
    console.log(temp);
  }, []);

  const turn = turns[currentTurnIdx];

  if (!turn) return <div>Loading...</div>;

  return (
    <S.Container>
      <S.SelectedGroupBar>
        <div className="label">
          Group:
          <br />
          {turn.selectPair[0].name}
        </div>
        <div className="label right">
          Group:
          <br />
          {turn.selectPair[1].name}
        </div>
      </S.SelectedGroupBar>
      <S.DialogueList>
        {turn.dialogues.map((line, idx) => {
          // assume alternating speakers: left/right
          const isLeft = turn.selectPair[0].codes.some(
            (c) => c.code === line.speaking_code
          );
          const side = isLeft ? "left" : "right";
          return (
            <S.Bubble key={idx} side={side}>
              <S.ModeBadge mode={line.conversation_mode}>
                {line.conversation_mode}
              </S.ModeBadge>
              <strong>{line.speaking_code}</strong>
              <p>{line.utterance}</p>
              {/* hover 시 raw 보기 */}
              <S.Raw
                title={
                  side === "left"
                    ? turn.selectPair[0].codes[0].raw
                    : turn.selectPair[1].codes[0].raw
                }
              >
                ⓘ
              </S.Raw>
            </S.Bubble>
          );
        })}
      </S.DialogueList>

      <S.Decision>
        <div className="title">Decision</div>
        {turn.decision.mode === "MERGE" && (
          <div className="decision">
            MERGE →{" New Group: "}
            <strong>
              {turn.decision.resultComponents[0].name || "(new group)"}
            </strong>{" "}
          </div>
        )}
        {turn.decision.mode === "SPLIT" && (
          <div className="decision">
            SPLIT or Rearrange →{" "}
            <strong>
              {turn.decision.resultComponents
                .map((g) => g.name || "(group)")
                .join(" , ")}
            </strong>
          </div>
        )}
        {turn.decision.mode === "APART" && (
          <div className="decision">APART → No change</div>
        )}
      </S.Decision>

      <S.Groups>
        <h3>Current Groups</h3>
        {(() => {
          // 1) 그룹별로 묶기
          const buckets: Record<string, ComponentData[]> = {};
          turn.processing.forEach((comp) => {
            const key = comp.name || "Ungrouped";
            if (!buckets[key]) buckets[key] = [];
            buckets[key].push(comp);
          });

          const orderedBuckets = Object.entries(buckets).sort(
            ([nameA], [nameB]) => {
              if (nameA === "Ungrouped") return 1;
              if (nameB === "Ungrouped") return -1;
              return 0;
            }
          );

          // 2) 렌더링
          return orderedBuckets.map(([groupName, comps]) => (
            <div key={groupName}>
              <h4>{groupName}</h4>
              <S.ChipList>
                {comps.flatMap((comp) =>
                  comp.codes.map((c) => {
                    // 이번 턴에서 변화가 있었던 코드인지 체크
                    const isChanged = turn.decision.resultComponents
                      ? turn.decision.resultComponents
                          .flatMap((fc) => fc.codes)
                          .some((fc) => fc.code === c.code)
                      : false;

                    return (
                      <S.Chip key={c.code} highlighted={isChanged}>
                        {c.code}
                      </S.Chip>
                    );
                  })
                )}
              </S.ChipList>
            </div>
          ));
        })()}
      </S.Groups>

      <S.Nav>
        <button
          onClick={() => setCurrentTurnIdx((i) => Math.max(0, i - 1))}
          disabled={currentTurnIdx === 0}
        >
          &lt;
        </button>
        <span>
          {currentTurnIdx + 1} / {turns.length}
        </span>
        <button
          onClick={() =>
            setCurrentTurnIdx((i) => Math.min(turns.length - 1, i + 1))
          }
          disabled={currentTurnIdx === turns.length - 1}
        >
          &gt;
        </button>
      </S.Nav>
    </S.Container>
  );
};

export default LivingCodesResultPanel;
