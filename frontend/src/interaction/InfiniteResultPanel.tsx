import { useState } from "react";
import type { SampleData } from "../sample";
import type { InfiniteItem } from "../types/InfiniteItem";
import * as S from "./InfiniteResultPanel.style";

interface Props {
  selectedItem: SampleData | null;
  ideas: InfiniteItem[];
  onStart: () => void;
  onStop: () => void;
  streaming: boolean;
}

const InfiniteResultPanel = ({
  selectedItem,
  ideas,
  onStart,
  onStop,
  streaming,
}: Props) => {
  if (!selectedItem) {
    return (
      <S.Container>
        ⬅️ Please select data item in the left side panel.
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.TopBar>
        {!streaming && <>Selected code: {selectedItem.code}</>}
        {streaming && (
          <>
            <S.Spinner />
            Selected code: {selectedItem.code}
          </>
        )}
        <div className="control-panel">
          <div className="control" onClick={onStart}>
            Start
          </div>
          <div className="control" onClick={onStop}>
            Stop
          </div>
        </div>
      </S.TopBar>
      <S.ItemList>
        {ideas.map((idea) => {
          return <IdeaItem idea={idea} />;
        })}
      </S.ItemList>
    </S.Container>
  );
};

interface ItemProps {
  idea: InfiniteItem;
}

const IdeaItem = ({ idea }: ItemProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  return (
    <S.ItemContainer onClick={() => setExpanded(!expanded)}>
      <div className="head">{idea.response}</div>
      {expanded && <div className="reason">{idea.reason}</div>}
    </S.ItemContainer>
  );
};

export default InfiniteResultPanel;
